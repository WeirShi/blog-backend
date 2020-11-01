import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleEntity } from './article.entity';
import { TokenMiddleware } from 'src/middleware/token.middleware';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([ArticleEntity])
    ],
    providers: [ArticleService],
    controllers: [ArticleController],
    exports: [ArticleService]
})
export class ArticleModule implements NestModule{
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(TokenMiddleware)
            .exclude({ path: 'blog/article/*', method: RequestMethod.ALL })
            .forRoutes(ArticleController)
    }
}


