import { Test, TestingModule } from '@nestjs/testing';
import { DishRattingService } from './dish-ratting.service';

describe('DishRattingService', () => {
  let service: DishRattingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DishRattingService],
    }).compile();

    service = module.get<DishRattingService>(DishRattingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
