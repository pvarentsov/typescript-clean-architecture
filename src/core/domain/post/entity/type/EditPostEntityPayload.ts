import { Nullable } from '../../../../shared/type/CommonTypes';

export type EditPostEntityPayload = {
  title?: string,
  imageId?: Nullable<string>,
  content?: Nullable<string>,
}
