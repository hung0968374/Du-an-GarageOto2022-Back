import admin from 'firebase-admin';
import uuid from 'uuid-v4';
import InternalServerError from '../errors/types/InternalServerError';
import { logger } from '../helpers/logger';
import { stringifyArray } from '../helpers/string';

import firebaseServiceKeys from '../../firebaseServiceKeys';

/// get node-fetch
/* eslint-disable  @typescript-eslint/no-explicit-any */
const importDynamic = new Function('modulePath', 'return import(modulePath)');
const fetch = async (...args: unknown[]) => {
  const module = await importDynamic('node-fetch');
  return module.default(...args);
};

class UploadImgsFromUrlsService {
  private bucket: any;
  constructor() {
    this.initValue();
  }

  private initValue() {
    try {
      admin.initializeApp({
        credential: admin.credential.cert(
          firebaseServiceKeys as admin.ServiceAccount
        ),
        storageBucket: 'garage-a6-dev.appspot.com',
      });
      this.bucket = admin.storage().bucket();
    } catch (error) {
      logger.error(error, { reason: 'EXCEPTION when init firebase' });
      throw new InternalServerError();
    }
  }

  private async fetchFile(link: string) {
    try {
      return await fetch(link);
    } catch (error) {
      logger.error(error, { reason: 'EXCEPTION at fetchFile()' });
      throw new InternalServerError();
    }
  }

  async uploadImgsToFirebase(urls: Array<string> | string, weblink?: string) {
    if (typeof urls === 'object') {
      urls = urls.map((url) => {
        return url
          .replaceAll('thumb/250//', 'webp/')
          .replaceAll('thumb/150', 'webp')
          .replaceAll('thumb/250', 'webp')
          .replaceAll('thumb/350', 'webp')
          .replaceAll('thumb/650', 'webp');
      });
      const fetchFilePromises = urls.map((url) => this.fetchFile(url));
      const responsesFromFetchFiles = await Promise.all(fetchFilePromises);
      try {
        const newUrls = await Promise.all(
          responsesFromFetchFiles.map((response: any) => {
            const newUrl = response.url
              .replace('https://img.tinbanxe.vn/', '')
              .replace('https://tinbanxe.vn/', '')
              .replace('https://img1.banxehoi.com/', '')
              .replace(weblink, '');

            // const file = bucket.file('path/to/image.jpg');
            const file = this.bucket.file(newUrl);

            const contentType = response.headers.get('content-type');
            const writeStream = file.createWriteStream({
              metadata: {
                contentType,
                metadata: {
                  myValue: uuid(),
                },
              },
            });
            response.body.pipe(writeStream);
            return newUrl;
          })
        );
        return stringifyArray(newUrls);
      } catch (error) {
        logger.error(error, { reason: 'EXCEPTION at uploadImgToFirebase()' });
        throw new InternalServerError();
      }
    }
  }
}

export default UploadImgsFromUrlsService;
