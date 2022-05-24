import express from 'express';
import wrapper from '../../../common/helpers/wrapperController';
import customAuthorizer from '../../../middlewares/customAuthorizer';
import validateExpiryToken from '../../../middlewares/validateExpiryToken';
import ClientController from '../controller/ClientController';
import authentication from '../../../middlewares/authentication';
import multer from 'multer';

const upload = multer({
  limits: { fileSize: 8000000 /** Max size file upload is 8MB */ },
});

const router = express.Router();
router.get('/brand/get-all', wrapper(ClientController.getAllBrand));
router.get('/brand/:brand', wrapper(ClientController.getBrandInfo));

router.post(
  '/cars/rating',
  [validateExpiryToken, authentication, customAuthorizer],
  wrapper(ClientController.ratingCars)
);
router.post(
  '/car/rating',
  [validateExpiryToken, authentication, customAuthorizer],
  wrapper(ClientController.ratingCar)
);
router.get('/car/rating', wrapper(ClientController.getCarRating));

router.get('/car/get-all', wrapper(ClientController.getAllCars));
router.get('/car/get-one/:brand/:name/:id', wrapper(ClientController.getCar));
router.get('/car/:carId', wrapper(ClientController.getCarById));
router.get('/car/brand/:brand', wrapper(ClientController.getCarsByBrand));

router.get('/car/comment/:carId', wrapper(ClientController.getCarComments));
router.get('/car/comment', wrapper(ClientController.getCarComments));
router.delete(
  '/car/comment/:id',
  [validateExpiryToken, authentication, customAuthorizer],
  wrapper(ClientController.deleteComment)
);
router.patch(
  '/car/comment',
  [validateExpiryToken, authentication, customAuthorizer],
  wrapper(ClientController.updateComment)
);
router.post(
  '/car/comment',
  [validateExpiryToken, authentication, customAuthorizer],
  wrapper(ClientController.createComment)
);

router.post(
  '/car/comment/reaction',
  [validateExpiryToken, authentication, customAuthorizer],
  wrapper(ClientController.createNewReaction)
);
router.patch(
  '/car/comment/reaction/update',
  [validateExpiryToken, authentication, customAuthorizer],
  wrapper(ClientController.updateReaction)
);

router.get(
  '/filter-car/get-attributes/:brand',
  wrapper(ClientController.getAllFilterAttribute)
);
router.post('/filter-car', wrapper(ClientController.filterCar));

router.get('/blog', wrapper(ClientController.getAllBlogs));
router.get('/blog/:id', wrapper(ClientController.getBlogById));
router.get('/blog/offset/:offset', wrapper(ClientController.getBlogByOffset));

router.get('/timezones', wrapper(ClientController.getTimeZone));

router.patch(
  '/update-client-info',
  [validateExpiryToken, authentication, customAuthorizer],
  wrapper(ClientController.updateClientInfo)
);

router.get(
  '/client-data',
  [validateExpiryToken, authentication, customAuthorizer],
  wrapper(ClientController.getClientData)
);

router.post(
  '/process-payment',
  [validateExpiryToken, authentication, customAuthorizer],
  wrapper(ClientController.processPayment)
);

router.get(
  '/payment-receipt',
  [validateExpiryToken, authentication, customAuthorizer],
  wrapper(ClientController.getPayment)
);

router.patch(
  '/wish-list',
  [validateExpiryToken, authentication, customAuthorizer],
  wrapper(ClientController.updateWishList)
);

const uploader = upload.fields([{ name: 'avatar', maxCount: 1 }]);

router.put(
  '/update-client-avatar',
  uploader,
  [validateExpiryToken, authentication, customAuthorizer],
  wrapper(ClientController.changeAvatar)
);

export default router;
