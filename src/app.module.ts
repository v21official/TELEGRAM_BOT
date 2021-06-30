import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { LinkModule } from './link/link.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { HistoryModule } from './history/history.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      "mongodb://localhost:27017/so_ghi_no?readPreference=primary&appname=MongoDB%20Compass&ssl=false"
    ),
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          uri: configService.get<string>('DATABASE_CONNECTION'),
          useCreateIndex: true,
          useFindAndModify: false,
        };
      },
      inject: [ConfigService],
    }),
    AuthModule,
    LinkModule,
    UserModule,
    HistoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
