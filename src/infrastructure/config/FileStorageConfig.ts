import { get } from 'env-var';

const prefix: string = 'MINIO';

export class FileStorageConfig {

  public static readonly ENDPOINT: string = get(`${prefix}_ENDPOINT`).default('localhost').asString();
  
  public static readonly PORT: number = get(`${prefix}_PORT`).default(0).asPortNumber();
  
  public static readonly ACCESS_KEY: string = get(`${prefix}_ACCESS_KEY`).required().asString();
  
  public static readonly SECRET_KEY: string = get(`${prefix}_SECRET_KEY`).required().asString();
  
  public static readonly USE_SSL: boolean = get(`${prefix}_USE_SSL`).asBool() || false;
  
  public static readonly BASE_PATH: string = get(`${prefix}_BASE_PATH`).required().asString();
  
  public static readonly IMAGE_BUCKET: string = get(`${prefix}_IMAGE_BUCKET`).required().asString();
  
  public static readonly IMAGE_EXT: string = get(`${prefix}_IMAGE_EXT`).required().asString();
  
  public static readonly IMAGE_MIMETYPE: string = get(`${prefix}_IMAGE_MIMETYPE`).required().asString();

}
