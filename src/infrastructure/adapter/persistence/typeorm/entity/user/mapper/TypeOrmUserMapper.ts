import { User } from '@core/domain/user/entity/User';
import { TypeOrmUser } from '@infrastructure/adapter/persistence/typeorm/entity/user/TypeOrmUser';

export class TypeOrmUserMapper {
  
  public static toOrmEntity(domainUser: User): TypeOrmUser {
    const ormUser: TypeOrmUser = new TypeOrmUser();
    
    ormUser.id        = domainUser.getId();
    ormUser.firstName = domainUser.getFirstName();
    ormUser.lastName  = domainUser.getLastName();
    ormUser.email     = domainUser.getEmail();
    ormUser.role      = domainUser.getRole();
    ormUser.password  = domainUser.getPassword();
    
    ormUser.createdAt = domainUser.getCreatedAt();
    ormUser.editedAt  = domainUser.getEditedAt() as Date;
    ormUser.removedAt = domainUser.getRemovedAt() as Date;
    
    return ormUser;
  }
  
  public static toOrmEntities(domainUsers: User[]): TypeOrmUser[] {
    return domainUsers.map(domainUser => this.toOrmEntity(domainUser));
  }
  
  public static toDomainEntity(ormUser: TypeOrmUser): User {
    const domainUser: User = new User({
      firstName : ormUser.firstName,
      lastName  : ormUser.lastName,
      email     : ormUser.email,
      role      : ormUser.role,
      password  : ormUser.password,
      id        : ormUser.id,
      createdAt : ormUser.createdAt,
      editedAt  : ormUser.editedAt,
      removedAt : ormUser.removedAt,
    });
    
    return domainUser;
  }
  
  public static toDomainEntities(ormUsers: TypeOrmUser[]): User[] {
    return ormUsers.map(ormUser => this.toDomainEntity(ormUser));
  }
  
}
