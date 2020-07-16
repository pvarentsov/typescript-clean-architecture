import { Controller, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { CoreApiResponse } from '../../../../core/common/api/CoreApiResponse';
import { HttpAuthService } from '../auth/HttpAuthService';
import { HttpLoggedInUser, HttpRequestWithUser } from '../auth/type/HttpAuthTypes';
import { HttpLocalAuthGuard } from '../auth/guard/HttpLocalAuthGuard';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HttpRestApiModelLogInBody } from './documentation/auth/HttpRestApiModelLogInBody';
import { HttpRestApiResponseLoggedInUser } from './documentation/auth/HttpRestApiResponseLoggedInUser';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  
  constructor(private readonly authService: HttpAuthService) {}
  
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(HttpLocalAuthGuard)
  @ApiBody({type: HttpRestApiModelLogInBody})
  @ApiResponse({status: HttpStatus.OK, type: HttpRestApiResponseLoggedInUser})
  public async login(@Req() request: HttpRequestWithUser): Promise<CoreApiResponse<HttpLoggedInUser>> {
    return CoreApiResponse.success(this.authService.login(request.user));
  }
  
}
