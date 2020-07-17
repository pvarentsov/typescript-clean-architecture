import { Nullable } from '../../../../common/type/CommonTypes';
import { PostImage } from '../PostImage';

export type EditPostEntityPayload = {
  title?: string,
  image?: Nullable<PostImage>,
  content?: Nullable<string>,
};
