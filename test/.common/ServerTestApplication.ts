import { RootModule } from '@application/di/.RootModule';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Test, TestingModule } from '@nestjs/testing';
import { Connection } from 'typeorm';

export class ServerTestApplication {
  
  constructor(
    public readonly serverApplication: NestExpressApplication,
    public readonly dbConnection: Connection,
    public readonly testingModule: TestingModule,
  ) {}
  
  public static async new(): Promise<ServerTestApplication> {
    const testingModule: TestingModule = await Test
      .createTestingModule({imports: [RootModule]})
      .compile();
  
    const dbConnection: Connection = testingModule.get(Connection);
    const serverApplication: NestExpressApplication = testingModule.createNestApplication();
    
    return new ServerTestApplication(serverApplication, dbConnection, testingModule);
  }
  
}
