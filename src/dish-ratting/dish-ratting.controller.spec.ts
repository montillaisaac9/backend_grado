import { Test, TestingModule } from '@nestjs/testing';
import { DishRattingController } from './dish-ratting.controller';
import { DishRattingService } from './dish-ratting.service';

describe('DishRattingController', () => {
  let controller: DishRattingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DishRattingController],
      providers: [DishRattingService],
    }).compile();

    controller = module.get<DishRattingController>(DishRattingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
