export class Environment {
  static application: Application;
  static production = false;
}

interface Application {
  webDomain: string;
  defaultRegion: string;
  websocketServer: string;
  marketUrl: string;
  productDocument: string;
  filingBook: string;

  redirect_uri: string;
  serviceAPI: string;
  authUrl: string;
  authRealm: string;
  authClientId: string;

  bssFront: string;
  bssAPI: string;
}
