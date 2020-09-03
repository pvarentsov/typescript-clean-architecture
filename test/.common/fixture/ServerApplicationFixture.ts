import { RootModule } from '@application/di/.RootModule';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Test, TestingModule } from '@nestjs/testing';
import { Connection } from 'typeorm/index';

export type ServerApplicationFixtures = {
  serverApplication: NestExpressApplication,
  dbConnection: Connection
}

export class ServerApplicationFixture {
  
  public static async new(): Promise<ServerApplicationFixtures> {
    const testingModule: TestingModule = await Test
      .createTestingModule({imports: [RootModule]})
      .compile();
  
    const dbConnection: Connection = testingModule.get(Connection);
    const serverApplication: NestExpressApplication = testingModule.createNestApplication();
    
    return { serverApplication, dbConnection };
  }
  
}
