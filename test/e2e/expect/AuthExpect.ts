import { Code } from '@core/common/code/Code';
import { HttpStatus } from '@nestjs/common';
import { TestServer } from '@test/.common/TestServer';
import { ResponseExpect } from '@test/e2e/expect/ResponseExpect';
import * as supertest from 'supertest';

export class AuthExpect {
  
  public static async unauthorizedError(
    endpoint: {path: string, method: 'post'|'get'|'put'|'delete'},
    testServer: TestServer,
    accessToken?: string,

  ): Promise<void> {
  
    const agent: supertest.SuperTest<supertest.Test> = supertest(testServer.serverApplication.getHttpServer());
    let response: supertest.Response;
  
    if (accessToken) {
      response = await agent[endpoint.method](endpoint.path)
        .set('x-api-token', accessToken)
        .expect(HttpStatus.OK);
    } else {
      response = await agent[endpoint.method](endpoint.path)
        .expect(HttpStatus.OK);
    }
  
    ResponseExpect.codeAndMessage(response.body, {code: Code.UNAUTHORIZED_ERROR.code, message: Code.UNAUTHORIZED_ERROR.message});
    ResponseExpect.data({response: response.body}, null);
  }
  
}