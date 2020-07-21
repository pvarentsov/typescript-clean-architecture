import { NestExpressApplication } from '@nestjs/platform-express';
import { NestFactory } from '@nestjs/core';
import { RootModule } from './di/.RootModule';
import { Logger } from '@nestjs/common';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { initializeTransactionalContext, patchTypeORMRepositoryWithBaseRepository } from 'typeorm-transactional-cls-hooked';
import { ApiServerConfig } from '../infrastructure/config/ApiServerConfig';

export class ServerApplication {
  
  private readonly host: string = ApiServerConfig.HOST;
  
  private readonly port: number = ApiServerConfig.PORT;
  
  public async run(): Promise<void> {
    const app: NestExpressApplication = await NestFactory.create<NestExpressApplication>(RootModule);
    
    this.buildAPIDocumentation(app);
    this.setupTypeOrmTransactionalContext();
    this.log();
  
    await app.listen(this.port, this.host);
  }
  
  private buildAPIDocumentation(app: NestExpressApplication): void {
    const title: string = 'IPoster';
    const description: string = 'IPoster API documentation';
    const version: string = '1.0.0';
    
    const options: Omit<OpenAPIObject, 'paths'> = new DocumentBuilder()
      .setTitle(title)
      .setDescription(description)
      .setVersion(version)
      .addBearerAuth({ type: 'apiKey', in: 'header', name: 'x-api-token' })
      .build();
    
    const document: OpenAPIObject = SwaggerModule.createDocument(app, options);
    
    SwaggerModule.setup('documentation', app, document);
  }
  
  private setupTypeOrmTransactionalContext(): void {
    initializeTransactionalContext();
    patchTypeORMRepositoryWithBaseRepository();
  }
  
  private log(): void {
    Logger.log(`Server started on host: ${this.host}; port: ${this.port};`, ServerApplication.name);
  }
  
  public static new(): ServerApplication {
    return new ServerApplication();
  }
  
}
