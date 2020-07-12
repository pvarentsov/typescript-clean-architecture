import { Nullable } from '../../../.shared/type/CommonTypes';

export type CreatePostEntityPayload = {
  authorId: string,
  title: string,
  imageId?: Nullable<string>,
  content?: Nullable<string>,
}
