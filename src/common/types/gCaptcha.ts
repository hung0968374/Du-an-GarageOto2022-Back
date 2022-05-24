export interface GoogleCaptchaResponse {
  data: {
    success?: unknown;
    ['error-codes']?: string[];
  };
}
