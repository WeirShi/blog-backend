import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagEntity } from './tag.entity';
import { TagService } from './tag.service';
import { TagController } from './tag.controller';
import { TokenMiddleware } from 'src/middleware/token.middleware';


@Module({
    imports: [TypeOrmModule.forFeature([TagEntity])],
    providers: [TagService],
    controllers: [TagController],
    exports: [TagService]
})
export class TagModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
          .apply(TokenMiddleware)
          .exclude(
              'blog/tag/(.*)'
          )
          .forRoutes(TagController)
      }
}
