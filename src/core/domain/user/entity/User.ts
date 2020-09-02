import { Entity } from '@core/common/entity/Entity';
import { RemovableEntity } from '@core/common/entity/RemovableEntity';
import { UserRole } from '@core/common/enums/UserEnums';
import { Nullable } from '@core/common/type/CommonTypes';
import { CreateUserEntityPayload } from '@core/domain/user/entity/type/CreateUserEntityPayload';
import { EditUserEntityPayload } from '@core/domain/user/entity/type/EditUserEntityPayload';
import { compare, genSalt, hash } from 'bcryptjs';
import { IsDate, IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { v4 } from 'uuid';

export class User extends Entity<string> implements RemovableEntity {
  
  @IsString()
  private firstName: string;
  
  @IsString()
  private lastName: string;
  
  @IsEmail()
  private readonly email: string;
  
  @IsEnum(UserRole)
  private readonly role: UserRole;
  
  @IsString()
  private password: string;
  
  @IsDate()
  private readonly createdAt: Date;
  
  @IsOptional()
  @IsDate()
  private editedAt: Nullable<Date>;
  
  @IsOptional()
  @IsDate()
  private removedAt: Nullable<Date>;
  
  constructor(payload: CreateUserEntityPayload) {
    super();
  
    this.firstName = payload.firstName;
    this.lastName  = payload.lastName;
    this.email     = payload.email;
    this.role      = payload.role;
    this.password  = payload.password;
  
    this.id        = payload.id || v4();
    this.createdAt = payload.createdAt || new Date();
    this.editedAt  = payload.editedAt || null;
    this.removedAt = payload.removedAt || null;
  }
  
  public getFirstName(): string {
    return this.firstName;
  }
  
  public getLastName(): string {
    return this.lastName;
  }
  
  public getName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
  
  public getEmail(): string {
    return this.email;
  }
  
  public getRole(): UserRole {
    return this.role;
  }
  
  public getPassword(): string {
    return this.password;
  }
  
  public getCreatedAt(): Date {
    return this.createdAt;
  }
  
  public getEditedAt(): Nullable<Date> {
    return this.editedAt;
  }
  
  public getRemovedAt(): Nullable<Date> {
    return this.removedAt;
  }
  
  public async hashPassword(): Promise<void> {
    const salt: string = await genSalt();
    this.password = await hash(this.password, salt);
    
    await this.validate();
  }
  
  public async comparePassword(password: string): Promise<boolean> {
    return compare(password, this.password);
  }
  
  public async edit(payload: EditUserEntityPayload): Promise<void> {
    const currentDate: Date = new Date();
    
    if (payload.firstName) {
      this.firstName = payload.firstName;
      this.editedAt = currentDate;
    }
    if (payload.lastName) {
      this.lastName = payload.lastName;
      this.editedAt = currentDate;
    }
    
    await this.validate();
  }
  
  public async remove(): Promise<void> {
    this.removedAt = new Date();
    await this.validate();
  }
  
  public static async new(payload: CreateUserEntityPayload): Promise<User> {
    const user: User = new User(payload);
    await user.hashPassword();
    await user.validate();
    
    return user;
  }
  
}
