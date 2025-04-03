import { Test, TestingModule } from '@nestjs/testing';
import { CariersController } from './cariers.controller';
import { CariersService } from './cariers.service';

describe('CariersController', () => {
  let controller: CariersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CariersController],
      providers: [CariersService],
    }).compile();

    controller = module.get<CariersController>(CariersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
