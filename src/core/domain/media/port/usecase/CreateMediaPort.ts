import { MediaType } from '../../../../common/enums/MediaEnums';
import { Readable } from 'stream';

export interface CreateMediaPort {
  executorId: string;
  name: string;
  type: MediaType;
  file: Buffer|Readable;
}
