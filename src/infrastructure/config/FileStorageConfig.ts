import { Optional } from '@core/common/type/CommonTypes';
import { get } from 'env-var';

export class FileStorageConfig {

  public static readonly ENDPOINT: Optional<string> = get('FILE_STORAGE_ENDPOINT').asString();
  
  public static readonly PORT: Optional<number> = get('FILE_STORAGE_PORT').asPortNumber();
  
  public static readonly ACCESS_KEY: string = get('FILE_STORAGE_ACCESS_KEY').required().asString();
  
  public static readonly SECRET_KEY: string = get('FILE_STORAGE_SECRET_KEY').required().asString();
  
  public static readonly USE_SSL: boolean = get('FILE_STORAGE_USE_SSL').asBool() || false;
  
  public static readonly BASE_PATH: string = get('FILE_STORAGE_BASE_PATH').required().asString();
  
  public static readonly IMAGE_BUCKET: string = get('FILE_STORAGE_IMAGE_BUCKET').required().asString();
  
  public static readonly IMAGE_EXT: string = get('FILE_STORAGE_IMAGE_EXT').required().asString();
  
  public static readonly IMAGE_MIMETYPE: string = get('FILE_STORAGE_IMAGE_MIMETYPE').required().asString();

}
