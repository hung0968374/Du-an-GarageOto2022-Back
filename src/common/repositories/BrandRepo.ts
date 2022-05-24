import BrandModel from '../models/BrandModel';
import { BrandModifying } from '../types/common';

class BrandRepository {
  updateBrandInfo(datas: BrandModifying, brandName: string) {
    return BrandModel.update(datas, {
      where: {
        name: brandName,
      },
    });
  }
  getBrandByName(brand: string) {
    return BrandModel.findOne({
      where: {
        name: brand,
      },
    });
  }
  getAllBrandRepo() {
    return BrandModel.findAll({});
  }
}

export default new BrandRepository();
