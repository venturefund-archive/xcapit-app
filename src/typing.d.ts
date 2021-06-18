declare var $ENV: Env;

interface Env {
  ENVIRONMENT: string;
  API_URL: string;
  PRODUCTION: boolean;
}

declare module '*.json' {
  const value: any;
  export default value;
}
