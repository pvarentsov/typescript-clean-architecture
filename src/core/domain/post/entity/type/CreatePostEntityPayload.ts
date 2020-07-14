import { Nullable } from '../../../../common/type/CommonTypes';
import { PostStatus } from '../../../../common/enums/PostEnums';

export type CreatePostEntityPayload = {
  ownerId: string,
  title: string,
  imageId?: Nullable<string>,
  content?: Nullable<string>,
  id?:string,
  status?: PostStatus,
  createdAt?: Date,
  editedAt?: Date,
  publishedAt?: Date,
  removedAt?: Date,
};
