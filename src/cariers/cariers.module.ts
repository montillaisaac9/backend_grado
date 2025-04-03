import { Module } from '@nestjs/common';
import { CariersService } from './cariers.service';
import { CariersController } from './cariers.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CariersController],
  providers: [CariersService],
})
export class CariersModule {}
