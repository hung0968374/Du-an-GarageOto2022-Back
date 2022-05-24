import express from 'express';
import wrapper from '../../../common/helpers/wrapperController';
import CommonController from '../controller/CommonController';

const router = express.Router();

router.get('/car/:id', wrapper(CommonController.getCarById));

export default router;
