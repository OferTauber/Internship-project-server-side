import { Controller, Get } from '@nestjs/common';
import { TestJwtService } from './test-jwt.service';

@Controller('test')
export class TestJwtController {
  constructor(private testJwtService: TestJwtService) {}

  @Get()
  getHellowWIthAuth() {
    return this.testJwtService.getHellow();
  }
}
