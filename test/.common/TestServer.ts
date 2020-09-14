import { RootModule } from '@application/di/.RootModule';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Test, TestingModule } from '@nestjs/testing';
import { Connection } from 'typeorm';
import { initializeTransactionalContext, patchTypeORMRepositoryWithBaseRepository } from 'typeorm-transactional-cls-hooked';

export class TestServer {
  
  constructor(
    public readonly serverApplication: NestExpressApplication,
    public readonly dbConnection: Connection,
    public readonly testingModule: TestingModule,
  ) {}
  
  public static async new(): Promise<TestServer> {
    const testingModule: TestingModule = await Test
      .createTestingModule({imports: [RootModule]})
      .compile();
  
    initializeTransactionalContext();
    patchTypeORMRepositoryWithBaseRepository();
    
    const dbConnection: Connection = testingModule.get(Connection);
    const serverApplication: NestExpressApplication = testingModule.createNestApplication();
    
    return new TestServer(serverApplication, dbConnection, testingModule);
  }
  
}
