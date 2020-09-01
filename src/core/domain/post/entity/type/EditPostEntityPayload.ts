import { Nullable } from '@core/common/type/CommonTypes';
import { PostImage } from '@core/domain/post/entity/PostImage';

export type EditPostEntityPayload = {
  title?: string,
  image?: Nullable<PostImage>,
  content?: Nullable<string>,
};
