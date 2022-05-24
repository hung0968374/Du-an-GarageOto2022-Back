import { v2 } from 'cloudinary';
import { logger } from '../helpers/logger';

class Cloudinary {
  private bucket = v2;

  constructor() {
    this.initBucket();
  }

  private initBucket() {
    this.bucket.config({
      cloud_name: 'dsykf3mo9',
      api_key: '274161838196584',
      api_secret: 'mRT3ltkNCdtS-B5wffPGvcAjfL4',
    });
  }

  async uploadAvatar(image: string, fileName: string) {
    try {
      const newAvatar = await this.bucket.uploader.upload(image, {
        folder: 'garaAutoAvatar',
        public_id: fileName,
      });
      return newAvatar.url;
    } catch (error) {
      logger.error('EXCEPTION at uploadAvatar()');
    }
  }

  async renameAvatar(name: string, publicId: string) {
    try {
      await this.bucket.uploader.rename(publicId, name);
    } catch (error) {
      console.log('error: ', error);
    }
  }
}

export default new Cloudinary();
