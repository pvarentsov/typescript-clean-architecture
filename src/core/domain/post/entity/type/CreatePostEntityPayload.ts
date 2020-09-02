import { PostStatus } from '@core/common/enums/PostEnums';
import { Nullable } from '@core/common/type/CommonTypes';
import { PostImage } from '@core/domain/post/entity/PostImage';
import { PostOwner } from '@core/domain/post/entity/PostOwner';

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
