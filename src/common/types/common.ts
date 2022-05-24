import { JwtPayload } from 'jsonwebtoken';
import { UserRoles, UserStatus } from '../../modules/auth/types/auth';

export interface UsersAttributes {
  id: number;
  password: string;
  roles: UserRoles | string;
  status: UserStatus | string;
  email: string;
  created_at: Date;
  recent_login_time: Date;
}

export type UsersCreation = Omit<UsersAttributes, 'id'>;

export interface LoginTokenAttributes {
  id: number;
  token: string;
  user_id: number;
  created_at: Date;
}

export type LoginTokenCreation = Omit<LoginTokenAttributes, 'id'>;

export interface LoginAttemptsAttributes {
  id: number;
  user_id: number;
  attempts: number;
  start_time: Date;
  end_time: Date;
}

export type LoginAttemptsCreation = Omit<LoginAttemptsAttributes, 'id'>;

export enum TimeZone {
  ASIA_HCM = 'Asia/Ho_Chi_Minh',
  ASIA_SG = 'Asia/Saigon',
}

export enum EmailStatus {
  SENT = 'SENT',
  VERIFY = 'VERIFY',
  UNKNOWN = 'UNKNOWN',
}
export interface EmailReminderAttributes {
  id: number;
  user_id: number;
  email_status: EmailStatus;
  last_send_time: Date;
}

export type EmailReminderCreation = Omit<EmailReminderAttributes, 'id'>;

export interface ErrorRecorderAttributes {
  id: number;
  destination: string;
  reason: string;
  created_at: Date;
}

export type ErrorRecorderCreation = Omit<ErrorRecorderAttributes, 'id'>;
export interface BlogAttributes {
  id: number;
  title: string;
  descriptions: string;
  descriptionImgs: string;
}
export type BlogCreation = Omit<BlogAttributes, 'id'>;
export interface BrandAttributes {
  id: number;
  name: string;
  descriptions: string;
  shortDescriptions: string;
  brandImg: string;
  descriptionImgs: string;
}

export type BrandCreation = Omit<BrandAttributes, 'id'>;
export type BrandModifying = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};
export interface UserCarRatingAttributes {
  id: number;
  carId: number;
  userId: number;
  ratingPoint: string;
}

export type UserCarRatingCreation = Omit<UserCarRatingAttributes, 'id'>;

export interface CarAppearanceAttributes {
  id: number;
  car_id: number;
  imgs: string;
  introImgs: string;
  exteriorReviewImgs: string;
  interiorReviewImgs: string;
  newImgs: string;
  newIntroImgs: string;
  newExteriorReviewImgs: string;
  newInteriorReviewImgs: string;
}

/* eslint-disable  @typescript-eslint/no-explicit-any */
export type CarAppearanceCreation = Omit<CarAppearanceAttributes, 'id'>;
export type CarAppearanceModifying = {
  [key: string]: any;
};

export interface CarAttributes {
  id: number;
  brandId: number;
  name: string;
  price: string;
  discountPercent: number;
  design: string;
  engine: string;
  gear: string;
  seats: number;
  capacity: string;
  yearOfManufacture: number;
  introReview: string;
  exteriorReview: string;
  interiorReview: string;
  amenityReview: string;
  safetyReview: string;
}

export type CarCreation = Omit<CarAttributes, 'id'>;

export interface CarCommentAttributes {
  id: number;
  carId: number;
  comment: string;
  mom: string;
  userId: number;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface CarCommentDeletingAttributes {
  id: number;
  userId: number;
}
export type CarCommentCreation = Omit<CarCommentAttributes, 'id'>;
export interface UserCommentReactionAttributes {
  id: number;
  userId: number;
  carId: number;
  commentId: number;
  like: number;
  dislike: number;
}
export type UserCommentReactionCreation = Omit<
  UserCommentReactionAttributes,
  'id'
>;
export type UserCommentReactionModification = {
  userId: number;
  commentId: number;
  carId: number;
  like?: number;
  dislike?: number;
};

export interface ClientCouponAttributes {
  id: number;
  clientId: number;
  couponId: number;
  carId: number;
  usedAt: Date;
}

export interface CouponAttributes {
  id: number;
  code: string;
  description: string;
  amount: number;
}

export type CouponCreation = Omit<CouponAttributes, 'id'>;
export interface PaymentMethodAttributes {
  id: number;
  method: string;
}

export type PaymentMethodCreation = Omit<PaymentMethodAttributes, 'id'>;
export interface PaymentProviderAttributes {
  id: number;
  provider: string;
}

export type PaymentProviderCreation = Omit<PaymentProviderAttributes, 'id'>;
export interface WishListAttributes {
  id: number;
  clientId: number;
  carId: number;
}

export interface ClientAttributes {
  id: number;
  userId: number;
  firstName: string;
  lastName: string;
  gender: string;
  phoneNumber: string;
  dob: Date;
  addressCountry: string;
  addressProvince: string;
  addressDistrict: string;
  addressWard: string;
  addressDetail: string;
  timezone: string;
  stripeCustomerId: string;
  avatar: string;
}

export type ExitedField<E> = {
  [Property in keyof E]: E[Property];
};

export type AdditionalField<A> = {
  [Property in keyof A]: A[Property];
};
export type JoinedQueryType<E, A> = ExitedField<Partial<E>> &
  AdditionalField<A>;

export interface AttemptsAttributes {
  attempts: LoginAttemptsAttributes;
}
export interface UserInfoAttributes {
  info: unknown;
}
export type AttemptsUserInfoAttributes = JoinedQueryType<
  AttemptsAttributes,
  UserInfoAttributes
>;

export type UserIncludeLoginAttempts = JoinedQueryType<
  UsersAttributes,
  AttemptsUserInfoAttributes
>;

export interface TokenDecode extends JwtPayload {
  type?: string;
  user?: string;
}

export interface UpdateClientInfoAttributes {
  firstName: string;
  lastName: string;
  gender: string;
  phoneNumber: string;
  dob: string;
  country: string;
  province: string;
  district: string;
  ward: string;
  detail: string;
  timezone: string;
}

export interface ProcessPaymentBodyRequest {
  carId: number;
  quantity: number;
}

export interface ClientPaymentAttributes {
  id: number;
  clientId: number;
  carId: number;
  uuid: string;
  quantity: number;
  createdAt: string | Date;
}

export interface PaymentReceipt {
  uuid: string;
  quantity: number;
  createdAt: string;
  car: {
    name: string;
    price: string;
    carAppearance: {
      imgs: string;
    };
    brand: {
      name: string;
    };
  };
}

export interface UpdateWishlistRequest {
  listCarId: number[];
  takeAction: boolean;
}

export interface GetOneCarReturn {
  id: number;
  brandId: number;
  name: string;
  price: string;
  discountPercent: number;
  design: string;
  engine: string;
  gear: string;
  seats: string;
  capacity: string;
  yearOfManufacture: string;
  imgs: string;
  brand: string | null;
}
