import { PostStatus } from '../../../.shared/enum/PostEnums';
import { Nullable } from '../../../.shared/type/CommonTypes';

export interface PostUseCaseCommonOutPort {
  id: string;
  authorId: string,
  imageId: Nullable<string>;
  content: Nullable<string>;
  status: PostStatus;
  createdAt: Date;
  editedAt: Nullable<Date>;
  publishedAt: Nullable<Date>;
}
