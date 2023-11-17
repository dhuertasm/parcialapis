import { Module } from '@nestjs/common';
import { SocioService } from './socio.service';
import { SocioEntity } from './socio.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  providers: [SocioService],
  imports: [TypeOrmModule.forFeature([SocioEntity])]
})
export class SocioModule {}
