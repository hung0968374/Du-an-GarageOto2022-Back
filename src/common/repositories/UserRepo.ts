import { CurrentUserDetail, UserStatus } from './../../modules/auth/types/auth';
import LoginAttemptsModel from '../models/LoginAttemptsModel';
import UserModel from '../models/UserModel';
import { UserIncludeLoginAttempts, UsersAttributes } from '../types/common';
import ClientModel from '../models/ClientModel';
import WishListModel from '../models/WishListModel';
import ClientCouponModel from '../models/ClientCouponModel';
import CarModel from '../models/CarModel';
import CarAppearanceModel from '../models/CarAppearanceModel';
import BrandModel from '../models/BrandModel';

class UserRepository {
  async findAllUser(): Promise<UsersAttributes[]> {
    return UserModel.findAll({
      raw: true,
    });
  }

  async findUserByEmail(email: string): Promise<UsersAttributes> {
    return UserModel.findOne({
      where: {
        email,
      },
      raw: true,
    });
  }

  async findUserDetailsByEmail(
    email: string
  ): Promise<UserIncludeLoginAttempts> {
    const temp = (await UserModel.findOne({
      where: {
        email,
      },
      include: [
        {
          model: LoginAttemptsModel,
          as: 'attempts',
        },
        {
          model: ClientModel,
          as: 'info',
        },
      ],
    })) as unknown;

    return temp as UserIncludeLoginAttempts;
  }

  async getAllUser() {
    return UserModel.findAll({});
  }

  async getUserWithStatus(status: UserStatus, attributes?: string[]) {
    return UserModel.findAll({
      attributes: attributes || ['id', 'roles', 'status', 'email'],
      where: {
        status,
      },
    });
  }

  async findUserById(id: number) {
    return UserModel.findOne({
      where: {
        id,
      },
      raw: true,
    });
  }

  async findUserInfosById(id: number) {
    return UserModel.findOne({
      attributes: ['roles', 'status', 'email'],
      include: {
        model: ClientModel,
        as: 'info',
      },
      where: {
        id,
      },
    });
  }

  async getCurrentDetailUserById(id: number) {
    const userAsModel = await UserModel.findOne({
      attributes: [
        'roles',
        'status',
        'email',
        ['created_at', 'createdAt'],
        ['recent_login_time', 'lastLoginTime'],
      ],
      where: {
        id,
      },
      include: [
        {
          model: ClientModel,
          as: 'info',
          attributes: {
            exclude: ['id', 'stripeCustomerId', 'userId', 'user_id'],
          },
          include: [
            {
              attributes: ['id', 'couponId', 'usedAt', 'carId'],
              model: ClientCouponModel,
              as: 'coupons',
            },
            {
              attributes: ['carId'],
              model: WishListModel,
              as: 'wishlist',
              include: [
                {
                  attributes: ['name', 'price'],
                  model: CarModel,
                  as: 'cars',
                  include: [
                    {
                      model: CarAppearanceModel,
                      as: 'carAppearance',
                      attributes: ['imgs'],
                    },
                    { model: BrandModel, as: 'brand', attributes: ['name'] },
                  ],
                },
              ],
            },
          ],
        },
      ],
    });

    return userAsModel.toJSON() as unknown as CurrentUserDetail;
  }
}

export default new UserRepository();
