import { Module } from '@nestjs/common';
import { ClubSocioService } from './club-socio.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SocioEntity } from 'src/socio/socio.entity';
import { ClubEntity } from 'src/club/club.entity';
import { ClubSocioController } from './club-socio.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SocioEntity, ClubEntity])],
  providers: [ClubSocioService],
  controllers: [ClubSocioController]
})
export class ClubSocioModule {}
