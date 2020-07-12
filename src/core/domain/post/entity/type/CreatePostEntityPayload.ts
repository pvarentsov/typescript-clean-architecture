import { Nullable } from '../../../.shared/type/CommonTypes';

export type CreatePostEntityPayload = {
  authorId: string,
  imageId: Nullable<string>,
  content: Nullable<string>,
}
