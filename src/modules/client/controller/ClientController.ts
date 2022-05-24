import { Request, Response } from 'express';
import { TIMEZONES } from '../../../common/constants';
import InternalServerError from '../../../common/errors/types/InternalServerError';
import { logger } from '../../../common/helpers/logger';
import BlogRepo from '../../../common/repositories/BlogRepo';
import BrandRepo from '../../../common/repositories/BrandRepo';
import CarCommentRepo from '../../../common/repositories/CarCommentRepo';
import ProductRepo from '../../../common/repositories/ProductRepo';
import UserRepo from '../../../common/repositories/UserRepo';
import UserCommentReactionRepo from '../../../common/repositories/UserCommentReactionRepo';
import {
  CarCommentAttributes,
  CarCommentCreation,
  ProcessPaymentBodyRequest,
  UpdateClientInfoAttributes,
  UpdateWishlistRequest,
} from '../../../common/types/common';
import ClientService from '../services/ClientService';
import UserCarRatingRepo from '../../../common/repositories/UserCarRatingRepo';

class ClientController extends ClientService {
  ratingCars = async (req: Request, res: Response) => {
    const msg = await this.rateManyCars([]);
    res.json({ status: 'success', msg });
  };

  ratingCar = async (req: Request, res: Response) => {
    const userId = req.user.id;
    const { carId, ratingPoint } = req.body;
    const result = await this.rateCar({ carId, userId, ratingPoint });
    res.json({ status: 'success', result });
  };

  getCarRating = async (req: Request, res: Response) => {
    const carId = 3;
    const result = await UserCarRatingRepo.getRatingPoints(carId);
    res.json({ status: 'success', result });
  };

  getAllCars = async (_req: Request, res: Response) => {
    try {
      const result = await ProductRepo.getAllCars();
      res.json({ status: 'success', result });
    } catch (error) {
      logger.error(error, { reason: 'EXCEPTION at getAllCars()' });
      throw new InternalServerError();
    }
  };

  getCar = async (_req: Request, res: Response) => {
    let brand: string = _req.params.brand;
    const name: string = _req.params.name;
    const id: number = +_req.params.id;
    if (brand === 'mercedes-benz') brand = 'mercedes';
    if (brand === 'rolls') brand = 'rolls royce';
    try {
      const brandInfo = await BrandRepo.getBrandByName(brand);
      const [
        carInfo,
        numOfCarsInSameBrand,
        comments,
        commentReactions,
        ratingPoints,
      ] = await Promise.all([
        ProductRepo.getCarByName(name),
        ProductRepo.getAmountOfCars(brandInfo.id),
        CarCommentRepo.getAllCommentInCar(id),
        UserCommentReactionRepo.getAllReactionsInCar(id),
        UserCarRatingRepo.getRatingPoints(id),
      ]);
      const relatedCarIds = [-7, -5, 13, 22].map((el: number) => {
        return Math.abs(carInfo.id - el + 10) % numOfCarsInSameBrand;
      });
      const relatedBlogIds = [-5, -3, 7, 12].map((el: number) => {
        return Math.abs(carInfo.id - el + 10) % 107;
      });

      const relatedCars = await Promise.all(
        relatedCarIds.map((carId: number) => {
          return ProductRepo.getCarById(carId);
        })
      );
      const relatedBlogs = await Promise.all(
        relatedBlogIds.map((blogId: number) => {
          return BlogRepo.getBlogByOffset(blogId);
        })
      );
      res.json({
        status: 'success',
        carInfo,
        comments,
        commentReactions,
        relatedCars,
        relatedBlogs,
        ratingPoints,
      });
    } catch (error) {
      logger.error(error, { reason: 'EXCEPTION at getCar()' });
      throw new InternalServerError();
    }
  };

  getCarById = async (_req: Request, res: Response) => {
    const id: string = _req.params.carId;
    try {
      const [carInfo, comments] = await Promise.all([
        ProductRepo.getCarById(+id),
        CarCommentRepo.getAllCommentInCar(+id),
      ]);
      res.json({ status: 'success', carInfo, comments });
    } catch (error) {
      logger.error(error, { reason: 'EXCEPTION at getCarById()' });
      throw new InternalServerError();
    }
  };

  getTimeZone = async (_req: Request, res: Response) => {
    try {
      res.json(TIMEZONES);
    } catch (error) {
      logger.error(error, { reason: 'EXCEPTION at getTimeZone()' });
      throw new InternalServerError();
    }
  };

  updateClientInfo = async (req: Request, res: Response) => {
    const body: UpdateClientInfoAttributes = req.body;
    const { id } = req.user;
    try {
      const message = await this.updateClientInfoService(body, id);
      const status = message.includes('Success') ? 200 : 400;
      res.status(status).send(message);
    } catch (error) {
      logger.error(error, { reason: 'EXCEPTION at updateClientInfo()' });
      throw new InternalServerError();
    }
  };

  getCarsByBrand = async (req: Request, res: Response) => {
    let brand: string = req.params.brand;
    if (brand === 'rolls-royce') brand = 'rolls royce';
    try {
      const { id } = await BrandRepo.getBrandByName(brand);
      if (id) {
        const cars = await ProductRepo.getCarsByBrandId(id);
        res.json({ status: 'success', cars });
      } else {
        res.json({ status: 'success', msg: 'Brand name is invalid' });
      }
    } catch (error) {
      logger.error(error, { reason: 'EXCEPTION at getCarsByBrand()' });
      throw new InternalServerError();
    }
  };
  getBrandInfo = async (req: Request, res: Response) => {
    const brand: string = req.params.brand;
    try {
      const brandInfo = await this.getBrandInfoService(brand);
      res.json({ status: 'success', brandInfo });
    } catch (error) {
      logger.error(error, { reason: 'EXCEPTION at getBrandInfo()' });
      throw new InternalServerError();
    }
  };

  getAllBrand = async (_req: Request, res: Response) => {
    try {
      const allBrand = await BrandRepo.getAllBrandRepo();
      res.json({ status: 'success', allBrand });
    } catch (error) {
      logger.error(error, { reason: 'EXCEPTION at getBrandInfo()' });
      throw new InternalServerError();
    }
  };

  filterCar = async (req: Request, res: Response) => {
    let { brandName } = req.body;
    const { designType, price, seat, radio } = req.body;
    if (brandName.includes('-')) brandName = brandName.replace('-', ' ');

    try {
      const { id } = await BrandRepo.getBrandByName(brandName);
      if (id) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const tempFilterCar: any = await this.filterCarByDesignTypeService(
          id,
          designType,
          price,
          seat,
          radio
        );
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let filterCar = JSON.parse(JSON.stringify(tempFilterCar));

        filterCar = await Promise.all(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          filterCar.map(async (el: any) => {
            const ratingPoints = await UserCarRatingRepo.getRatingPoints(el.id);
            el.ratingPoints = ratingPoints;
            return el;
          })
        );
        res.json({ success: true, filterCar });
      }
    } catch (error) {
      logger.error(error, { reason: 'EXCEPTION at filterCarByDesignType()' });
      throw new InternalServerError();
    }
  };

  getAllFilterAttribute = async (req: Request, res: Response) => {
    const { brand } = req.params;
    try {
      const { id } = await BrandRepo.getBrandByName(brand);
      if (id) {
        const result = await this.getAllFilterAttributeService(id);
        res.json({ success: true, result });
      }
    } catch (error) {
      logger.error(error, { reason: 'EXCEPTION at getAllFilterAttribute()' });
      throw new InternalServerError();
    }
  };

  getClientData = async (req: Request, res: Response) => {
    const { id } = req.user;
    try {
      const result = await this.getClientDataService(id);
      res.json(result);
    } catch (error) {
      logger.error(error, { reason: 'EXCEPTION at getClientData()' });
      throw new InternalServerError('Get client data failed');
    }
  };

  getAllBlogs = async (req: Request, res: Response) => {
    const { page, limit } = req.query;
    const tempPage = parseInt(page as string);
    const tempLimit = parseInt(limit as string);
    try {
      const result = await BlogRepo.getAllBlogs(tempPage, tempLimit);
      res.json(result);
    } catch (error) {
      logger.error(error, { reason: 'EXCEPTION at getAllBlogs()' });
      throw new InternalServerError('Get client data failed');
    }
  };

  getBlogById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const result = await BlogRepo.getBlogById(+id);
      res.json({ status: 'success', result });
    } catch (error) {
      logger.error(error, { reason: 'EXCEPTION at getBlogByName()' });
      throw new InternalServerError(`Get blog by name failed with title ${id}`);
    }
  };

  getBlogByOffset = async (req: Request, res: Response) => {
    const { offset } = req.params;
    try {
      const result = await BlogRepo.getBlogByOffset(+offset);
      res.json({ status: 'success', result });
    } catch (error) {
      logger.error(error, { reason: 'EXCEPTION at getBlogByName()' });
      throw new InternalServerError(
        `Get blog offset failed with title ${offset}`
      );
    }
  };

  createComment = async (req: Request, res: Response) => {
    const comment: CarCommentCreation = req.body;
    comment.userId = req.user.id;
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const temp: any = await CarCommentRepo.createComment(comment);
      const userIdCreatedComment = comment.userId;
      const userInfo = await UserRepo.findUserInfosById(userIdCreatedComment);
      const newCreatedComment = { ...temp.dataValues };
      newCreatedComment.userInfo = userInfo;
      res.json({ status: 'success', newCreatedComment });
    } catch (error) {
      logger.error(error, { reason: 'EXCEPTION at createComment()' });
      throw new InternalServerError(
        `creating comment failed at createComment()`
      );
    }
  };

  getCarComments = async (req: Request, res: Response) => {
    const { carId } = req.params;
    try {
      const [result, carComments] = await Promise.all([
        CarCommentRepo.getAllCommentInCar(+carId),
        UserCommentReactionRepo.getAllReactionsInCar(+carId),
      ]);
      res.json({ status: 'success', result, carComments });
    } catch (error) {
      logger.error(error, { reason: 'EXCEPTION at getCarComments()' });
      throw new InternalServerError(
        `creating comment failed at getCarComments()`
      );
    }
  };

  deleteComment = async (req: Request, res: Response) => {
    const userId = req.user.id;
    const { id } = req.params;
    const result = await this.deleteCommentService({
      userId,
      id: +id,
    });
    try {
      res.json({ status: 'success', result });
    } catch (error) {
      logger.error(error, { reason: 'EXCEPTION at getCarComments()' });
      throw new InternalServerError(
        `creating comment failed at getCarComments()`
      );
    }
  };
  updateComment = async (req: Request, res: Response) => {
    const userId = req.user.id;
    const comment: CarCommentAttributes = req.body;
    comment.userId = userId;
    const result = await this.updateCommentService(comment);
    try {
      res.json({ status: 'success', result });
    } catch (error) {
      logger.error(error, { reason: 'EXCEPTION at getCarComments()' });
      throw new InternalServerError(
        `creating comment failed at getCarComments()`
      );
    }
  };

  createNewReaction = async (req: Request, res: Response) => {
    const { commentId, carId, like = 0, dislike = 0 } = req.body;
    const userId = req.user.id;
    try {
      const result = await UserCommentReactionRepo.createReaction({
        userId,
        commentId,
        carId,
        like,
        dislike,
      });
      res.json({ status: 'success', result });
    } catch (error) {
      logger.error(error, { reason: 'EXCEPTION at createNewReaction()' });
      throw new InternalServerError(
        `creating comment failed at createNewReaction()`
      );
    }
  };

  updateReaction = async (req: Request, res: Response) => {
    const { commentId, carId, like = 0, dislike = 0 } = req.body;
    const userId = req.user.id;
    try {
      const result = await UserCommentReactionRepo.updateReaction(
        {
          userId,
          commentId,
          carId,
          like,
          dislike,
        },
        userId,
        commentId
      );
      res.json({ status: 'success', result });
    } catch (error) {
      logger.error(error, { reason: 'EXCEPTION at updateReaction()' });
      throw new InternalServerError(
        `creating comment failed at updateReaction()`
      );
    }
  };

  processPayment = async (
    req: Request<unknown, unknown, ProcessPaymentBodyRequest>,
    res: Response
  ) => {
    const data = req.body;
    const { id, email } = req.user;
    try {
      const result = await this.processPaymentService(data, id, email);
      const statusNum = result.includes('Success') ? 200 : 400;
      res.status(statusNum).json(result);
    } catch (error) {
      logger.error(error, { reason: 'EXCEPTION at processPayment()' });
      throw new InternalServerError('Process payment fail');
    }
  };

  getPayment = async (req: Request, res: Response) => {
    const { id } = req.user;
    try {
      const result = await this.getPaymentService(id);
      res.json(result);
    } catch (error) {
      logger.error(error, { reason: 'EXCEPTION at getPayment()' });
      throw new InternalServerError('Get payment fail');
    }
  };

  updateWishList = async (
    req: Request<unknown, unknown, UpdateWishlistRequest>,
    res: Response
  ) => {
    const { listCarId, takeAction } = req.body;
    const { id } = req.user;
    try {
      const message = await this.updateWishListService(
        listCarId,
        takeAction,
        id
      );
      const currentStatus = message.toLowerCase().includes('success')
        ? 200
        : 400;
      res.status(currentStatus).send(message);
    } catch (error) {
      logger.error(error, { reason: 'EXCEPTION at updateWishList()' });
      throw new InternalServerError('Update updateWishList fail');
    }
  };

  changeAvatar = async (req: Request, res: Response) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const image: any = req.files;
    const { id } = req.user;
    const currentImg = image.avatar[0];
    try {
      if (!currentImg) {
        return res.status(400).send('Image is required to use this function');
      }
      await this.changeAvatarService(currentImg, id);
      res.send('Avatar changed successfully');
    } catch (error) {
      logger.error(error, { reason: 'EXCEPTION at updateWishList()' });
      throw new InternalServerError('Change client avatar fail');
    }
  };
}

export default new ClientController();
