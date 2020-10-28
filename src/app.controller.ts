import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {

  @Get()
  root(): string {
    return 'this is the blog apis.....';
  }
}
