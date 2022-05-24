import { Request, Response } from 'express';
import InternalServerError from '../../../common/errors/types/InternalServerError';
import { logger } from '../../../common/helpers/logger';
import ProductRepo from '../../../common/repositories/ProductRepo';

class CommonController {
  getCarById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const car = await ProductRepo.getCurrentCarById(parseInt(id, 10));
      res.json(car);
    } catch (error) {
      logger.error(error, { reason: 'EXCEPTION at getCarById()' });
      throw new InternalServerError();
    }
  };
}

export default new CommonController();
