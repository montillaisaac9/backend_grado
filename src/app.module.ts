import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthenticationModule } from './authentication/authentication.module';
import { PrismaModule } from './prisma/prisma.module';
import { FilesModule } from './files/files.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { MenuModule } from './menu/menu.module';
import { DishModule } from './dish/dish.module';
import { PerfilModule } from './perfil/perfil.module';
import { AdminModule } from './admin/admin.module';
import { StudentModule } from './student/student.module';

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
    MenuModule,
    DishModule,
    PerfilModule,
    AdminModule,
    StudentModule,
  ],
})
export class AppModule {}
