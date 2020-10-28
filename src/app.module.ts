import { Module } from '@nestjs/common';
import { AppController } from './app.controller';

import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

import { UserModule } from './modules/user/user.module';
import { CategoryModule } from './modules/category/category.module';


@Module({
  imports: [
    TypeOrmModule.forRoot(),
    UserModule,
    CategoryModule
  ],
  controllers: [AppController]
})
export class AppModule {
  constructor(private readonly connection: Connection) {}
}
