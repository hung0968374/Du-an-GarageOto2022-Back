import Stripe from 'stripe';
import env from '../../config/env';
import { logger } from '../helpers/logger';

export enum CodeEnvironment {
  Local = 'local',
  Development = 'development',
  Production = 'production',
}

const stripeConfig: Stripe.StripeConfig = {
  apiVersion: '2020-08-27',
  typescript: true,
  maxNetworkRetries: 3,
  timeout: 15000,
};

class StripeService {
  private stripeAPIkey: string;
  private environment: CodeEnvironment;
  private stripeWorker: Stripe;

  constructor() {
    this.environment = CodeEnvironment.Local;
    this.stripeAPIkey =
      this.environment === CodeEnvironment.Local
        ? env.stripeTestKey
        : env.stripeProductionKey;
    this.stripeWorker = new Stripe(this.stripeAPIkey, stripeConfig);
  }

  public setEnvironment(environment: CodeEnvironment) {
    switch (environment) {
      case CodeEnvironment.Development:
        this.environment = CodeEnvironment.Development;
        break;
      case CodeEnvironment.Local:
        this.environment = CodeEnvironment.Local;
        break;
      case CodeEnvironment.Production:
        this.environment = CodeEnvironment.Production;
        break;
      default:
        break;
    }
  }

  public async createNewStripeCustomer(
    params: Stripe.CustomerCreateParams
  ): Promise<Stripe.Customer | null> {
    let newUser: Stripe.Customer = null;
    await Promise.resolve(this.stripeWorker.customers.create(params))
      .then((result) => {
        logger.info(
          `Create new Stripe user success at ${new Date()} with params ${JSON.stringify(
            params
          )}`
        );
        newUser = { ...result };
      })
      .catch((exception) => {
        logger.error(exception, {
          reason: 'Exception at createNewStripeCustomer() ',
        });
      });

    return newUser;
  }

  public async retrieveAllProductInfo(): Promise<Stripe.Product[]> {
    const products: Stripe.Product[] = [];
    await Promise.resolve(this.stripeWorker.products.list())
      .then(({ data }) => {
        logger.info(`Get Stripe's products success at ${new Date()}`);
        for (const product of data) {
          products.push(product);
        }
      })
      .catch((exception) => {
        logger.error(exception, {
          reason: 'Exception at retrieveAllProductInfo() ',
        });
      });

    return products;
  }
}

export default new StripeService();
