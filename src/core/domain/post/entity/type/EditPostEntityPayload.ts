import { Nullable } from '../../../../common/type/CommonTypes';

export type EditPostEntityPayload = {
  title?: string,
  imageId?: Nullable<string>,
  content?: Nullable<string>,
};
