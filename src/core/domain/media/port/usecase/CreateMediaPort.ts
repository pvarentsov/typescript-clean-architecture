import { MediaType } from '../../entity/enum/PostEnums';
import { Readable } from 'stream';

export interface CreateMediaPort {
  executorId: string;
  name: string;
  type: MediaType;
  file: Buffer|Readable;
}
