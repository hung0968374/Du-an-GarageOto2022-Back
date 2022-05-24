interface Description {
  introReview: Array<string> | string;
  exteriorReview: Array<string> | string;
  interiorReview: Array<string> | string;
  amenityReview: Array<string> | string;
  safetyReview: Array<string> | string;
}

interface BaseInfo {
  name: string;
  brand: string;
  brandId: number;
  price: string;
  design: string;
  engine: string;
  gear: string;
  seats: number;
  capacity: string;
  yearOfManufacture: number;
  discountPercent: number;
  description: Description;
}

type ProductImgs = {
  imgs: Array<string> | string;
  introImgs: Array<string> | string;
  exteriorReviewImgs: Array<string> | string;
  interiorReviewImgs: Array<string> | string;
};

export interface CreateNewOtoBody {
  baseInfo: BaseInfo;
  productImgs: ProductImgs;
}
