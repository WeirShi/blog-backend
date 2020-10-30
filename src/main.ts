import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
// import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';


async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log'],
  });
  app.useGlobalPipes( new ValidationPipe() );

  // 跨域设置
  app.enableCors();

  // const options = new DocumentBuilder()
  //   .setTitle('Blog API')
  //   .setDescription('The Blog API description')
  //   .setVersion('1.0')
  //   .addTag('Blog')
  //   .build();
  // const document = SwaggerModule.createDocument(app, options);
  // SwaggerModule.setup('api', app, document);


  await app.listen(9000);
}
bootstrap();
