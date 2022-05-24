import UserCommentReactionModel from '../models/UserCommentReactionModel';
import { UserCommentReactionCreation } from '../types/common';

class CommentReactionRepository {
  createReaction(datas: UserCommentReactionCreation) {
    return UserCommentReactionModel.create(datas);
  }
  updateReaction(
    datas: UserCommentReactionCreation,
    userId: number,
    commentId: number
  ) {
    return UserCommentReactionModel.update(datas, {
      where: {
        userId,
        commentId,
      },
    });
  }
  getAllReactionsInCar(carId: number) {
    return UserCommentReactionModel.findAll({
      where: {
        carId,
      },
    });
  }
}

export default new CommentReactionRepository();
