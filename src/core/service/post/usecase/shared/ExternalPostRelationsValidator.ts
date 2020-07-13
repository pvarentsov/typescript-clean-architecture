import { QueryBusPort } from '../../../../shared/port/cqers/QueryBusPort';
import { DoesMediaExistQuery } from '../../../../shared/cqers/query/media/DoesMediaExistQuery';
import { DoesMediaExistQueryResult } from '../../../../shared/cqers/query/media/result/DoesMediaExistQueryResult';
import { Exception } from '../../../../shared/exception/Exception';
import { Code } from '../../../../shared/code/Code';

export type PostValidationRelations = {
  image?: PostImageValidationInfo,
};

export type PostImageValidationInfo = {
  id: string,
  userId: string
};

export class ExternalPostRelationsValidator {
  
  public static async validate(relations: PostValidationRelations, queryBus: QueryBusPort): Promise<void> {
    if (relations.image) {
      await this.validateImage(relations.image, queryBus);
    }
  }
  
  private static async validateImage(image: PostImageValidationInfo, queryBus: QueryBusPort): Promise<void> {
    const doesImageExistQuery: DoesMediaExistQuery = DoesMediaExistQuery.new({id: image.id, userId: image.userId});
    const doesImageExistQueryResult: DoesMediaExistQueryResult = await queryBus.sendQuery(doesImageExistQuery);
  
    if (!doesImageExistQueryResult.doesExist) {
      throw Exception.new({code: Code.ENTITY_NOT_FOUND_ERROR, overrideMessage: 'Post image not found.'});
    }
  }
  
}
