import express from 'express';
import wrapper from '../../../common/helpers/wrapperController';
import validateAdmin from '../../../middlewares/validateAdmin';
import validateExpiryToken from '../../../middlewares/validateExpiryToken';
import AdminController from '../controller/AdminController';

const router = express.Router();

router.put(
  '/brand/update-brand',
  [validateExpiryToken, validateAdmin],
  wrapper(AdminController.updateBrand)
);

router.post(
  '/brand/update-brand-imgs',
  [validateExpiryToken, validateAdmin],
  wrapper(AdminController.updateBrandImgs)
);

router.post(
  '/car/create-car',
  [validateExpiryToken, validateAdmin],
  wrapper(AdminController.createNewOto)
);

router.post(
  '/car/update-car-newImgs',
  [validateExpiryToken, validateAdmin],
  wrapper(AdminController.updateCarsAppearance)
);

router.post(
  '/blog/create-blogs',
  [validateExpiryToken, validateAdmin],
  wrapper(AdminController.createBlogs)
);

export default router;
