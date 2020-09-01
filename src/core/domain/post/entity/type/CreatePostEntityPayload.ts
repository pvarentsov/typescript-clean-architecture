import { PostOwner } from '@core/domain/post/entity/PostOwner';
import { PostImage } from '@core/domain/post/entity/PostImage';
import { Nullable } from '@core/common/type/CommonTypes';
import { PostStatus } from '@core/common/enums/PostEnums';

export type CreatePostEntityPayload = {
  owner: PostOwner,
  title: string,
  image?: Nullable<PostImage>,
  content?: Nullable<string>,
  id?:string,
  status?: PostStatus,
  createdAt?: Date,
  editedAt?: Date,
  publishedAt?: Date,
  removedAt?: Date,
};
