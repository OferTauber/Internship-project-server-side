import { Injectable } from '@nestjs/common';

@Injectable()
export class TestJwtService {
  getHellow = (): string => {
    return 'Hellow World';
  };
}
