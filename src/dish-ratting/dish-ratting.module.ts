import { Module } from '@nestjs/common';
import { DishRattingService } from './dish-ratting.service';
import { DishRattingController } from './dish-ratting.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [DishRattingController],
  providers: [DishRattingService],
})
export class DishRattingModule {}
