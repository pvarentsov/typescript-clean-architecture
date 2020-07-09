import { Nullable } from '../../../.shared/type/CommonTypes';

export interface CreatePostEntityPayload {
  authorId: string,
  imageId: Nullable<string>,
  content: Nullable<string>,
}
