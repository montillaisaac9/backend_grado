import { Test, TestingModule } from '@nestjs/testing';
import { CariersService } from './cariers.service';

describe('CariersService', () => {
  let service: CariersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CariersService],
    }).compile();

    service = module.get<CariersService>(CariersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
