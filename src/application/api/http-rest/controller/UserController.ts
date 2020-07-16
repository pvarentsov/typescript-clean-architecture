import { CreateUserUseCase } from '../../../../core/domain/user/usecase/CreateUserUseCase';
import { GetUserUseCase } from '../../../../core/domain/user/usecase/GetUserUseCase';
import { Body, Controller, Get, HttpCode, HttpStatus, Inject, Post } from '@nestjs/common';
import { UserDITokens } from '../../../../core/domain/user/di/UserDITokens';
import { UserUseCaseDto } from '../../../../core/domain/user/usecase/dto/UserUseCaseDto';
import { CreateUserAdapter } from '../../../../infrastructure/adapter/usecase/user/CreateUserAdapter';
import { GetUserAdapter } from '../../../../infrastructure/adapter/usecase/user/GetUserAdapter';
import { CoreApiResponse } from '../../../../core/common/api/CoreApiResponse';
import { UserRole } from '../../../../core/common/enums/UserEnums';
import { HttpUserPayload } from '../auth/type/HttpAuthTypes';
import { HttpUser } from '../auth/decorator/HttpUser';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HttpRestApiModelCreateUserBody } from './documentation/user/HttpRestApiModelCreateUserBody';
import { HttpRestApiResponseUser } from './documentation/user/HttpRestApiResponseUser';
import { HttpAuth } from '../auth/decorator/HttpAuth';

@Controller('users')
@ApiTags('users')
export class UserController {
  
  constructor(
    @Inject(UserDITokens.CreateUserUseCase)
    private readonly createUserUseCase: CreateUserUseCase,
    
    @Inject(UserDITokens.GetUserUseCase)
    private readonly getUserUseCase: GetUserUseCase,
  ) {}
  
  @Post('account')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiBody({type: HttpRestApiModelCreateUserBody})
  @ApiResponse({status: HttpStatus.OK, type: HttpRestApiResponseUser})
  public async createAccount(@Body() body: HttpRestApiModelCreateUserBody): Promise<CoreApiResponse<UserUseCaseDto>> {
    const adapter: CreateUserAdapter = await CreateUserAdapter.new({
      firstName  : body.firstName,
      lastName   : body.lastName,
      email      : body.email,
      role       : body.role,
      password   : body.password
    });
    
    const createdUser: UserUseCaseDto = await this.createUserUseCase.execute(adapter);
    
    return CoreApiResponse.success(createdUser);
  }
  
  @Get('me')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @HttpAuth(UserRole.AUTHOR, UserRole.ADMIN, UserRole.GUEST)
  @ApiResponse({status: HttpStatus.OK, type: HttpRestApiResponseUser})
  public async getMe(@HttpUser() httpUser: HttpUserPayload): Promise<CoreApiResponse<UserUseCaseDto>> {
    const adapter: GetUserAdapter = await GetUserAdapter.new({userId: httpUser.id});
    const user: UserUseCaseDto = await this.getUserUseCase.execute(adapter);
    
    return CoreApiResponse.success(user);
  }
  
}
