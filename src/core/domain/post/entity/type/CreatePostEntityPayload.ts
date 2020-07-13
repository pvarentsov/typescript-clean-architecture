import { Nullable } from '../../../../common/type/CommonTypes';

export type CreatePostEntityPayload = {
  authorId: string,
  title: string,
  imageId?: Nullable<string>,
  content?: Nullable<string>,
};
