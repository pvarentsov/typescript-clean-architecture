import { Entity } from '@core/common/entity/Entity';
import { UserRole } from '@core/common/enums/UserEnums';
import { IsEnum, IsString } from 'class-validator';

export class PostOwner extends Entity<string> {
  
  @IsString()
  private readonly name: string;
  
  @IsEnum(UserRole)
  private readonly role: UserRole;
  
  constructor(id: string, name: string, role: UserRole) {
    super();
    
    this.id = id;
    this.name = name;
    this.role = role;
  }
  
  public getName(): string {
    return this.name;
  }
  
  public getRole(): UserRole {
    return this.role;
  }
  
  public static async new(id: string, name: string, role: UserRole): Promise<PostOwner> {
    const postOwner: PostOwner = new PostOwner(id, name, role);
    await postOwner.validate();
    
    return postOwner;
  }
  
}
