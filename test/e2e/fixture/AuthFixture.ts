import { ApiServerConfig } from '@infrastructure/config/ApiServerConfig';
import { sign } from 'jsonwebtoken';

export class AuthFixture {
  
  public static async loginUser(user: {id: string}): Promise<{accessToken: string}> {
    const accessToken: string = sign({id: user.id}, ApiServerConfig.ACCESS_TOKEN_SECRET);
    return {accessToken};
  }
  
}