import BrandModel from '../models/BrandModel';
import CarAppearanceModel from '../models/CarAppearanceModel';
import CarModel from '../models/CarModel';
import ClientPaymentModel from '../models/ClientPaymentModel';

class ClientPaymentRepo {
  async getByClientId(clientId: number) {
    return ClientPaymentModel.findAll({
      attributes: ['uuid', 'quantity', 'createdAt'],
      where: {
        clientId,
      },
      include: [
        {
          model: CarModel,
          attributes: ['name', 'price'],
          as: 'car',
          include: [
            {
              model: CarAppearanceModel,
              as: 'carAppearance',
              attributes: ['imgs'],
            },
            { model: BrandModel, as: 'brand', attributes: ['name'] },
          ],
        },
      ],
    });
  }
}

export default new ClientPaymentRepo();
