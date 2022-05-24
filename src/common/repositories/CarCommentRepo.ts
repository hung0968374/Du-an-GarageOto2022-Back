import CarComment from '../models/CarComment';
import CarCommentModel from '../models/CarCommentModel';
import ClientModel from '../models/ClientModel';
import UserModel from '../models/UserModel';
import {
  CarCommentAttributes,
  CarCommentCreation,
  CarCommentDeletingAttributes,
} from '../types/common';

class CarCommentRepo {
  createComment(datas: CarCommentCreation) {
    return CarComment.create(datas);
  }
  deleteComment(datas: CarCommentDeletingAttributes) {
    const newCreatedComment = CarCommentModel.destroy({
      where: {
        id: datas.id,
        userId: datas.userId,
      },
    });
    return newCreatedComment;
  }
  updateComment(datas: CarCommentAttributes) {
    if (!datas.comment || datas.comment.length === 0) return;
    const newUpdatedComment = CarCommentModel.update(datas, {
      where: {
        id: datas.id,
        carId: datas.carId,
        userId: datas.userId,
      },
    });
    return newUpdatedComment;
  }
  getAllCommentInCar(id: number) {
    return CarCommentModel.findAll({
      include: [
        {
          model: UserModel,
          as: 'userInfo',
          attributes: ['roles', 'status', 'email'],
          include: {
            model: ClientModel,
            as: 'info',
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } as any,
        },
      ],
      where: {
        carId: id,
      },
    });
  }
  getComment(id: number) {
    return CarCommentModel.findOne({
      include: [
        {
          model: UserModel,
          as: 'userInfo',
          attributes: ['roles', 'status', 'email'],
          include: {
            model: ClientModel,
            as: 'info',
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } as any,
        },
      ],
      where: {
        id: id,
      },
    });
  }
}

export default new CarCommentRepo();
