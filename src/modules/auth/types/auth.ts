import { JwtPayload } from 'jsonwebtoken';

export enum UserStatus {
  INITIAL = 'INITIAL',
  ACTIVE = 'ACTIVE',
  ON_HOLD = 'ON-HOLD',
  SUSPEND = 'SUSPEND',
  INACTIVE = 'IN-ACTIVE',
}

export enum UserRoles {
  CLIENT = 'CLIENT',
  ADMIN = 'ADMIN',
  EXPERT = 'EXPERT',
  SALE = 'SALE',
}

export interface SignUpBody {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  gCaptcha: string;
  roles?: string;
}

export type SignInBody = Omit<SignUpBody, 'roles'>;

export enum TokenType {
  ACCESS = 'Access',
  REFRESH = 'Refresh',
}
export interface JWTPayloadType extends JwtPayload {
  email?: string;
}

export interface WishListReturn {
  cars: {
    name: string;
    price: string;
    carAppearance: { imgs: string };
    brand: { name: string };
  };
}
export interface CurrentUserDetail {
  roles: string;
  status: UserStatus;
  email: string;
  createdAt: string | Date;
  lastLoginTime: string | Date;
  info: {
    firstName: string;
    lastName: string;
    gender: string;
    phoneNumber: string;
    dob: Date;
    addressCountry: string;
    addressProvince: number;
    addressDistrict: number;
    addressWard: number;
    addressDetail: string;
    timezone: string;
    stripeCustomerId: string;
    avatar: string;
    coupons: { id: string; couponId: string; usedAt: string | Date }[];
    wishlist: WishListReturn[];
  };
}
