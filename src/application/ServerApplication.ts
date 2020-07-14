import { NestExpressApplication } from '@nestjs/platform-express';
import { NestFactory } from '@nestjs/core';
import { RootModule } from './di/RootModule';
import { Logger } from '@nestjs/common';

export class ServerApplication {
  
  private readonly port: number = 3005;
  
  private readonly host: string = 'localhost';
  
  public async run(): Promise<void> {
    const app: NestExpressApplication = await NestFactory.create<NestExpressApplication>(RootModule);
    await app.listen(this.port, this.host);
    
    this.log();
  }
  
  public log(): void {
    Logger.log(`Server started on host: ${this.host}; port: ${this.port};`, ServerApplication.name);
  }
  
  public static new(): ServerApplication {
    return new ServerApplication();
  }
  
}
