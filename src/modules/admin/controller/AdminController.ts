import { Request, Response } from 'express';

import { logger } from '../../../common/helpers/logger';
import InternalServerError from '../../../common/errors/types/InternalServerError';
import { CreateNewOtoBody } from '../../../common/types/product';
import { stringifyArray } from '../../../common/helpers/string';
import AdminServices from '../services/AdminService';
import {
  BlogCreation,
  CarAppearanceModifying,
} from '../../../common/types/common';
import ProductRepo from '../../../common/repositories/ProductRepo';

class ProductController extends AdminServices {
  createNewOto = async (
    req: Request<unknown, unknown, Array<CreateNewOtoBody>>,
    res: Response
  ) => {
    const newCars = req.body;
    try {
      await this.createCars(newCars);
      res.json({ status: 'success' });
    } catch (error) {
      logger.error(error, { reason: 'EXCEPTION at createNewOto()' });
      throw new InternalServerError();
    }
  };

  updateCarsAppearance = async (req: Request, res: Response) => {
    const cars = req.body;
    try {
      const updateCarPromises = cars.map(
        async (car: CarAppearanceModifying) => {
          const result = await ProductRepo.getCarByName(car.baseInfo.name);
          const { imgs, introImgs, exteriorReviewImgs, interiorReviewImgs } =
            car.productImgs;

          if (result) {
            return this.updateCarAppearance(
              { imgs, introImgs, exteriorReviewImgs, interiorReviewImgs },
              result.id
            );
          }
        }
      );
      const result = await Promise.all(updateCarPromises);
      res.json({ status: 'success', result: result });
    } catch (error) {
      logger.error(error, { reason: 'EXCEPTION at updateCarsAppearance()' });
      throw new InternalServerError();
    }
  };

  updateBrand = async (req: Request, res: Response) => {
    const brand = req.body;
    await this.updateSingleBrand(
      { descriptions: stringifyArray(brand.descriptions) },
      brand.name,
      brand.imgs
    );
    res.json({ status: 'success' });
  };
  updateBrandImgs = async (req: Request, res: Response) => {
    const { imgs } = req.body;
    const newImgs = imgs.map((img: string) => {
      return 'https://tinbanxe.vn' + img;
    });
    await this.uploadImgsToFirebase(newImgs);
    res.json({ status: 'success' });
  };

  createBlogs = async (req: Request, res: Response) => {
    const blogs = req.body;
    try {
      await Promise.all(
        blogs.map((blog: BlogCreation) => {
          return this.createBlogService(blog);
        })
      );
      res.json({ status: 'success' });
    } catch (error) {
      logger.error(error, { reason: 'EXCEPTION at createBlogs()' });
      throw new InternalServerError();
    }
  };
}

export default new ProductController();
