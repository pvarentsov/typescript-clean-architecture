import { GetUserPreviewQueryResult } from '../../../../../../../../../src/core/common/cqers/query/queries/user/result/GetUserPreviewQueryResult';
import { v4 } from 'uuid';
import { UserRole } from '../../../../../../../../../src/core/common/enums/UserEnums';

describe('GetUserPreviewQueryResult', () => {

  describe('new', () => {
  
    test('Expect it creates GetUserPreviewQueryResult instance with required parameters', () => {
      const userId: string = v4();
      const userName: string = 'Jaskier';
      const userRole: UserRole = UserRole.AUTHOR;
      
      const getUserPreviewQueryResult: GetUserPreviewQueryResult = GetUserPreviewQueryResult.new(userId, userName, userRole);
      
      expect(getUserPreviewQueryResult.id).toBe(userId);
      expect(getUserPreviewQueryResult.name).toBe(userName);
      expect(getUserPreviewQueryResult.role).toBe(userRole);
    });
    
  });
  
});
