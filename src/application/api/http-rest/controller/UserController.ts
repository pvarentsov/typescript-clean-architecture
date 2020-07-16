import { CreateUserUseCase } from '../../../../core/domain/user/usecase/CreateUserUseCase';
import { GetUserUseCase } from '../../../../core/domain/user/usecase/GetUserUseCase';
import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { UserDITokens } from '../../../../core/domain/user/di/UserDITokens';
import { UserUseCaseDto } from '../../../../core/domain/user/usecase/dto/UserUseCaseDto';
import { CreateUserAdapter } from '../../../../infrastructure/adapter/usecase/user/CreateUserAdapter';
import { GetUserAdapter } from '../../../../infrastructure/adapter/usecase/user/GetUserAdapter';
import { ApiResponse } from '../../../../core/common/api/ApiResponse';
import { UserRole } from '../../../../core/common/enums/UserEnums';

@Controller('users')
export class UserController {
  
  constructor(
    @Inject(UserDITokens.CreateUserUseCase)
    private readonly createUserUseCase: CreateUserUseCase,
    
    @Inject(UserDITokens.GetUserUseCase)
    private readonly getUserUseCase: GetUserUseCase,
  ) {}
  
  @Post()
  public async createUser(@Body() body: Record<string, string>): Promise<ApiResponse<UserUseCaseDto>> {
    const adapter: CreateUserAdapter = await CreateUserAdapter.new({
      firstName  : body.firstName,
      lastName   : body.lastName,
      email      : body.email,
      role       : <UserRole>body.role,
      password   : body.password
    });
    
    const createdUser: UserUseCaseDto = await this.createUserUseCase.execute(adapter);
    
    return ApiResponse.success(createdUser);
  }
  
  @Get(':userId')
  public async getUser(@Param('userId') userId: string): Promise<ApiResponse<UserUseCaseDto>> {
    const adapter: GetUserAdapter = await GetUserAdapter.new({
      userId    : userId,
    });
    
    const user: UserUseCaseDto = await this.getUserUseCase.execute(adapter);
    
    return ApiResponse.success(user);
  }
  
}
