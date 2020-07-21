import { get } from 'env-var';

export class ApiServerConfig {
  
  public static readonly HOST: string = get('API_HOST').required().asString();
  
  public static readonly PORT: number = get('API_PORT').required().asPortNumber();
  
  public static readonly ACCESS_TOKEN_SECRET: string = get('API_ACCESS_TOKEN_SECRET').required().asString();
  
  public static readonly ACCESS_TOKEN_TTL_IN_MINUTES: number = get('API_ACCESS_TOKEN_TTL_IN_MINUTES').required().asInt();
  
}
