import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthenticationModule } from './authentication/authentication.module';
import { PrismaModule } from './prisma/prisma.module';
import { FilesModule } from './files/files.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { DishModule } from './dish/dish.module';
import { MenuModule } from './menu/menu.module';
import { AttendanceModule } from './attendance/attendance.module';
import { CommentModule } from './comment/comment.module';
import { DishRattingModule } from './dish-ratting/dish-ratting.module';
import { CariersModule } from './cariers/cariers.module';
import { StatsModule } from './stats/stats.module';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [
    AuthenticationModule,
    PrismaModule,
    FilesModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'), // Sirve archivos desde /uploads
      serveRoot: '/uploads', // Ruta desde donde se acceden los archivos
    }),
    DishModule,
    MenuModule,
    AttendanceModule,
    CommentModule,
    DishRattingModule,
    CariersModule,
    StatsModule,
  ],
})
export class AppModule {}
