import { Module } from '@nestjs/common';
import { InfrastructureModule } from './InfrastructureModule';
import { MediaModule } from './MediaModule';
import { PostModule } from './PostModule';
import { UserModule } from './UserModule';
import { AuthModule } from './AuthModule';

@Module({
  imports: [
    AuthModule,
    InfrastructureModule,
    MediaModule,
    PostModule,
    UserModule,
  ]
})
export class RootModule {}
