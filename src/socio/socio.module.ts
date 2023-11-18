import { Module } from '@nestjs/common';
import { SocioService } from './socio.service';
import { SocioEntity } from './socio.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SocioController } from './socio.controller';

@Module({
  providers: [SocioService],
  imports: [TypeOrmModule.forFeature([SocioEntity])],
  controllers: [SocioController]
})
export class SocioModule {}
