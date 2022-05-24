import dayjs from 'dayjs';
import { TIMEZONES } from '../../../common/constants';
import {
  convertIntToFloat,
  convertMoneyStringToNumber,
  convertPriceStringToFilterType,
  convertToUSD,
  getRandomBetween,
} from '../../../common/helpers';
import CarModel from '../../../common/models/CarModel';
import ClientModel from '../../../common/models/ClientModel';
import ClientPaymentModel from '../../../common/models/ClientPaymentModel';
import BrandRepo from '../../../common/repositories/BrandRepo';
import UserCarRatingRepo from '../../../common/repositories/UserCarRatingRepo';
import UserRepo from '../../../common/repositories/UserRepo';
import {
  CarCommentAttributes,
  CarCommentDeletingAttributes,
  PaymentReceipt,
  ProcessPaymentBodyRequest,
  UpdateClientInfoAttributes,
  UserCarRatingCreation,
} from '../../../common/types/common';
import uuid from 'uuid-v4';
import sendGridMail from '../../../common/axios/sendGridMail';
import ClientPaymentRepo from '../../../common/repositories/ClientPaymentRepo';
import messages from '../../../common/messages';
import WishListModel from '../../../common/models/WishListModel';
import CarRepo from '../../../common/repositories/CarRepo';
import Cloudinary from '../../../common/services/Cloudinary';
import fs from 'fs';
import CarCommentRepo from '../../../common/repositories/CarCommentRepo';

class ClientService {
  async rateManyCars(ratingInfos: Array<UserCarRatingCreation>) {
    let carRatings = ratingInfos;

    if (carRatings.length === 0) {
      for (let i = 0; i < 200; i++) {
        const customCarRating = {} as UserCarRatingCreation;
        customCarRating.carId = getRandomBetween(1, 110);
        customCarRating.userId = getRandomBetween(30, 61);
        /* eslint-disable  @typescript-eslint/no-explicit-any */
        customCarRating.ratingPoint = convertIntToFloat(
          getRandomBetween(2, 6),
          1
        ) as any;
        carRatings = [...carRatings, customCarRating];
      }
    }
    await Promise.all(
      carRatings.map((carRating) => {
        return this.rateCar(carRating);
      })
    );
    return 'query has been executed';
  }
  async rateCar(carRating: UserCarRatingCreation) {
    const findExistedRating = await UserCarRatingRepo.getExistedRating(
      carRating.carId,
      carRating.userId
    );
    if (findExistedRating) {
      await UserCarRatingRepo.carUpdateRating(carRating);
      return await UserCarRatingRepo.findUpdatedRating(
        carRating.carId,
        carRating.userId
      );
    } else {
      return UserCarRatingRepo.createCarRating(carRating);
    }
  }

  updateRatingCar(carRating: UserCarRatingCreation) {
    return UserCarRatingRepo.carUpdateRating(carRating);
  }

  deleteCommentService(datas: CarCommentDeletingAttributes) {
    return CarCommentRepo.deleteComment(datas);
  }
  updateCommentService(datas: CarCommentAttributes) {
    return CarCommentRepo.updateComment(datas);
  }

  protected async updateClientInfoService(
    data: UpdateClientInfoAttributes,
    userId: number
  ) {
    const user = await UserRepo.findUserById(userId);

    if (user === null) {
      return 'Update user info fail due to invalid user Id';
    }
    const timezone = [];

    for (const [key] of Object.entries(TIMEZONES)) {
      timezone.push(key);
    }

    if (!timezone.includes(data.timezone)) {
      return 'Update user info fail due to invalid timezone';
    }

    await ClientModel.update(
      {
        firstName: data.firstName,
        lastName: data.lastName,
        gender: data.gender,
        phoneNumber: data.phoneNumber,
        dob: new Date(data.dob),
        addressCountry: data.country,
        addressProvince: data.province,
        addressDistrict: data.district,
        addressWard: data.ward,
        addressDetail: data.detail,
        timezone: data.timezone,
      },
      {
        where: {
          userId: user.id,
        },
      }
    );

    return 'Success';
  }

  protected async getBrandInfoService(brand: string) {
    const numberOfCharacter = brand.split('-');
    if (numberOfCharacter.length >= 2) {
      const brandName = numberOfCharacter.join(' ');
      return BrandRepo.getBrandByName(brandName);
    }
    return BrandRepo.getBrandByName(brand);
  }

  protected async filterCarByDesignTypeService(
    brandId: number,
    designType: string,
    price: string,
    seat: string,
    radio: string
  ) {
    //filter bodyType, seat
    const conditions = { brandId, design: designType, seats: seat };
    for (const [key, value] of Object.entries(conditions)) {
      if (!value) delete conditions[`${key}`];
    }
    const filterWithoutMoney = await CarRepo.filterBodyTypeAndSeat(conditions);
    const finalFilterWithoutMoney = filterWithoutMoney.sort((a, b) => {
      if (radio === 'asc')
        return (
          convertMoneyStringToNumber(a.price) -
          convertMoneyStringToNumber(b.price)
        );
      return (
        convertMoneyStringToNumber(b.price) -
        convertMoneyStringToNumber(a.price)
      );
    });

    if (price === '') return finalFilterWithoutMoney;

    //filter price
    const priceFromInputNumberType = convertPriceStringToFilterType(price).map(
      (item) => convertMoneyStringToNumber(item)
    );
    const result = filterWithoutMoney.filter(
      (item) =>
        convertMoneyStringToNumber(item.price) > priceFromInputNumberType[0] &&
        convertMoneyStringToNumber(item.price) <= priceFromInputNumberType[1]
    );
    const finalResult = result.sort((a, b) => {
      if (radio === 'asc')
        return (
          convertMoneyStringToNumber(a.price) -
          convertMoneyStringToNumber(b.price)
        );
      return (
        convertMoneyStringToNumber(b.price) -
        convertMoneyStringToNumber(a.price)
      );
    });
    return finalResult;

    //filter ASC AND DESC
  }

  protected async getAllFilterAttributeService(brandId: number) {
    const designAttributesInDB = await CarRepo.getDistinctDesignAttribute(
      brandId
    );

    const seatAttributesInDB = await CarRepo.getDistinctSeatAttribute(brandId);

    return {
      designAttribute: designAttributesInDB,
      seatAttribute: seatAttributesInDB,
    };
  }

  protected async getClientDataService(userId: number) {
    const user = await UserRepo.getCurrentDetailUserById(userId);
    user.createdAt = dayjs(user.createdAt).format('DD-MM-YYYY HH:mm:ss');
    if (user.lastLoginTime !== null) {
      user.lastLoginTime = dayjs(user.lastLoginTime).format(
        'DD-MM-YYYY HH:mm:ss'
      );
    }

    const wishlist = user.info.wishlist;

    if (wishlist.length !== 0) {
      user.info.wishlist = wishlist.map((item) => {
        const currentPrice = item.cars.price;
        const imgArray = JSON.parse(item.cars.carAppearance.imgs);
        item.cars.price = convertToUSD(currentPrice);
        item.cars.carAppearance.imgs = imgArray[0];
        return item;
      });
    }
    return user;
  }

  protected async processPaymentService(
    body: ProcessPaymentBodyRequest,
    userId: number,
    email: string
  ) {
    const { carId, quantity } = body;
    const [info, car] = await Promise.all([
      ClientModel.findOne({
        where: {
          userId,
        },
      }),
      CarModel.findOne({
        where: {
          id: carId,
        },
      }),
    ]);

    if (info === null) {
      return 'You need to update your information to proceed';
    }

    if (car === null) {
      return "This car doesn't exist in our database";
    }

    if (quantity === 0) {
      return 'You need to provide quantity';
    }

    const payment = await ClientPaymentModel.create({
      carId,
      clientId: info.id,
      quantity,
      uuid: uuid(),
      createdAt: new Date(),
    });

    await sendGridMail.paymentTemplate(email, car.name, payment.uuid);

    return 'Success';
  }

  protected async getPaymentService(userId: number) {
    const info = await ClientModel.findOne({
      where: {
        userId,
      },
    });

    if (info === null) {
      return 'You need to update your information to proceed';
    }

    const payments = await ClientPaymentRepo.getByClientId(info.id);
    const result = payments.map((each) => {
      const payment = each.toJSON() as unknown as PaymentReceipt;
      let img = payment.car.carAppearance.imgs;
      if (payment.createdAt !== null) {
        payment.createdAt = dayjs(payment.createdAt).format(
          'DD-MM-YYYY HH:mm:ss'
        );
      }

      try {
        const temp = JSON.parse(payment.car.carAppearance.imgs);
        img = temp[0];
        payment.car.carAppearance.imgs = img;
      } catch (error) {
        console.log(error);
      }

      return payment;
    });

    return result;
  }

  protected async updateWishListService(
    carIds: number[],
    takeAction: boolean,
    userId: number
  ) {
    let message = messages.userMessage.UpdateWishListSuccess;
    const info = await ClientModel.findOne({
      where: {
        userId,
      },
    });

    if (info === null) {
      message = messages.userMessage.NotHavingProfile;
      return message;
    }

    if (!takeAction) {
      return message;
    }

    const currentWishlist = await WishListModel.findAll({
      where: {
        clientId: info.id,
      },
      raw: true,
    });

    if (currentWishlist.length !== 0) {
      await WishListModel.destroy({
        where: {
          clientId: info.id,
        },
      });
    }

    if (carIds.length !== 0) {
      await WishListModel.bulkCreate(
        carIds.map((id) => ({
          clientId: info.id,
          carId: id,
        }))
      );
    }

    return message;
  }

  protected async changeAvatarService(image, userId: number) {
    const fileLocation = __dirname + image.originalname;
    const client = await ClientModel.findOne({
      where: {
        userId,
      },
    });
    fs.writeFileSync(fileLocation, image.buffer);
    const imageUrl = await Cloudinary.uploadAvatar(
      fileLocation,
      client.id + '-' + uuid()
    );
    fs.unlinkSync(fileLocation);
    client.avatar = imageUrl;
    client.save();
  }
}

export default ClientService;
