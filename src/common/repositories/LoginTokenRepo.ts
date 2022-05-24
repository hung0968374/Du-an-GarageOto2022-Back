import LoginTokenModel from '../models/LoginTokenModel';

class LoginTokenRepository {
  async generateRefreshToken(
    token: string,
    user_id: number
  ): Promise<LoginTokenModel> {
    return LoginTokenModel.create({
      token,
      user_id,
      created_at: new Date(),
    });
  }

  async getRefreshTokenById(id: number) {
    return LoginTokenModel.findOne({
      where: {
        id,
      },
      raw: true,
    });
  }

  async getRefreshTokenByUserId(user_id: number) {
    return LoginTokenModel.findOne({
      where: {
        user_id,
      },
      raw: true,
    });
  }

  async deleteRefreshToken(id: number) {
    await LoginTokenModel.destroy({
      where: {
        id,
      },
    });
  }

  async updateTokenAndDateById(token: string, created_at: Date, id: number) {
    await LoginTokenModel.update(
      {
        token,
        created_at,
      },
      {
        where: {
          id,
        },
      }
    );
  }
}

export default new LoginTokenRepository();
