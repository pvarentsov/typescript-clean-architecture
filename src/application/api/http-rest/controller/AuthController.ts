import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiResponse } from '../../../../core/common/api/ApiResponse';
import { HttpAuthService } from '../auth/HttpAuthService';
import { HttpLoggedInUser, HttpRequestWithUser } from '../auth/type/HttpAuthTypes';
import { HttpLocalAuthGuard } from '../auth/guard/HttpLocalAuthGuard';

@Controller('auth')
export class AuthController {
  
  constructor(private readonly authService: HttpAuthService) {}
  
  @Post('login')
  @UseGuards(HttpLocalAuthGuard)
  public async login(@Req() request: HttpRequestWithUser): Promise<ApiResponse<HttpLoggedInUser>> {
    return ApiResponse.success(this.authService.login(request.user));
  }
  
}
