import { Controller, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CoreApiResponse } from '@core/common/api/CoreApiResponse';
import { HttpAuthService } from '@application/api/http-rest/auth/HttpAuthService';
import { HttpLocalAuthGuard } from '@application/api/http-rest/auth/guard/HttpLocalAuthGuard';
import { HttpRestApiModelLogInBody } from '@application/api/http-rest/controller/documentation/auth/HttpRestApiModelLogInBody';
import { HttpRestApiResponseLoggedInUser } from '@application/api/http-rest/controller/documentation/auth/HttpRestApiResponseLoggedInUser';
import { HttpLoggedInUser, HttpRequestWithUser } from '@application/api/http-rest/auth/type/HttpAuthTypes';

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
