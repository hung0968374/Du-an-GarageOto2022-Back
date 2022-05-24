import CarCommentRepo from '../repositories/CarCommentRepo';
import UserRepo from '../repositories/UserRepo';
import { CarCommentAttributes } from '../types/common';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const socketService = (io: any) => {
  io.on('connection', function (socket) {
    console.log('a user connected');
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    socket.on('comment message', async (comment: any) => {
      if (comment.id) return;
      if (!(comment.comment?.length > 0)) return;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const temp: any = await CarCommentRepo.createComment(comment);
      const userIdCreatedComment = temp.userId;
      const userInfo = await UserRepo.findUserInfosById(userIdCreatedComment);
      const newCreatedComment = { ...temp.dataValues };
      newCreatedComment.userInfo = userInfo;
      io.emit(`comment message ${comment.carId}`, newCreatedComment);
    });

    socket.on('edit comment', async (comment: CarCommentAttributes) => {
      if (!comment.id) return;
      if (comment?.comment?.trim().length === 0) return;
      await CarCommentRepo.updateComment(comment);
      const commentUpdated = await CarCommentRepo.getComment(comment.id);
      io.emit(`edit comment ${comment.carId}`, commentUpdated);
    });

    socket.on('delete comment', async (commentNeedDeleting: any) => {
      const { carId, commentIds, userId, momDeletedCommentId } =
        commentNeedDeleting;
      if (!commentIds?.length || !(commentIds?.length > 0)) return;
      await Promise.all(
        commentIds.map((commentId: number) => {
          return CarCommentRepo.deleteComment({
            id: commentId,
            userId,
          });
        })
      );
      io.emit(`delete comment ${carId}`, momDeletedCommentId);
    });
  });
};
