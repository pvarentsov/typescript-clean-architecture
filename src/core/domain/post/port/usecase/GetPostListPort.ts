import { PostStatus } from '../../../../common/enums/PostEnums';

export interface GetPostListPort {
  executorId: string;
  ownerId?: string;
  status?: PostStatus;
}
