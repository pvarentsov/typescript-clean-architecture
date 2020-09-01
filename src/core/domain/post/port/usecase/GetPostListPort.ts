import { PostStatus } from '@core/common/enums/PostEnums';

export interface GetPostListPort {
  executorId: string;
  ownerId?: string;
  status?: PostStatus;
}
