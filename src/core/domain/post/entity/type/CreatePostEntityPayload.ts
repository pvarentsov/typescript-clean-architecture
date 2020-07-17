import { Nullable } from '../../../../common/type/CommonTypes';
import { PostStatus } from '../../../../common/enums/PostEnums';
import { PostOwner } from '../PostOwner';
import { PostImage } from '../PostImage';

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
