import { MediaType } from '../../../../common/enums/MediaEnums';

export interface CreateMediaPort {
  executorId: string;
  name: string;
  type: MediaType;
  file: Buffer|NodeJS.ReadableStream;
}
