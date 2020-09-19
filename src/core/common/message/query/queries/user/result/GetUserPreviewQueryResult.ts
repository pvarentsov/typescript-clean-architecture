import { UserRole } from '@core/common/enums/UserEnums';

export class GetUserPreviewQueryResult {
  
  public readonly id: string;
  
  public readonly name: string;
  
  public readonly role: UserRole;
  
  constructor(id: string, name: string, role: UserRole) {
    this.id = id;
    this.name = name;
    this.role = role;
  }
  
  public static new(id: string, name: string, role: UserRole): GetUserPreviewQueryResult {
    return new GetUserPreviewQueryResult(id, name, role);
  }
  
}
