import env from './config/env';

const firebaseConfig = env.firebase;

export default {
  type: 'service_account',
  project_id: firebaseConfig.projectId,
  private_key_id: firebaseConfig.privateKeyId,
  private_key: firebaseConfig.privateKey.replace(/\\n/gm, '\n'),
  client_email: firebaseConfig.clientEmail,
  client_id: firebaseConfig.clientId,
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
  auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
  client_x509_cert_url: firebaseConfig.clientX509CertUrl,
};
