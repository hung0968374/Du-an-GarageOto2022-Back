import axios from 'axios';
import uuid from 'uuid-v4';
import { logger } from '../helpers/logger';

class DiceBearService {
  async getRandomAvatarByName(name: string | null, clientID: number) {
    let fileName: string = String(clientID) + '_' + uuid();

    if (name !== null) {
      fileName = String(clientID) + '_' + name;
    }

    const imageLink = `https://avatars.dicebear.com/api/micah/${fileName}.svg?backgroundColor=white`;

    try {
      //Sample for fetching image
      await axios.get(imageLink);
      return imageLink;
    } catch (error) {
      logger.error('EXCEPTION at getRandomAvatarByName()');
      throw new Error();
    }
  }
}

export default new DiceBearService();
