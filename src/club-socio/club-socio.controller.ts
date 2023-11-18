import { Body, Controller, Delete, Get, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors.interceptor';
import { ClubSocioService } from './club-socio.service';
import { SocioDto } from 'src/socio/socio.dto';
import { SocioEntity } from 'src/socio/socio.entity';
import { plainToInstance } from 'class-transformer';

@Controller('clubs')
@UseInterceptors(BusinessErrorsInterceptor)
export class ClubSocioController {

    constructor(private readonly clubSocioService: ClubSocioService) {

    }

    @Post(':clubId/members/:socioId')
    async addMemberToClub(@Param('clubId')clubId: string, @Param('socioId') socioId: string) {
        return await this.clubSocioService.addMemberToclub(clubId, socioId);
    }

    @Get(':clubId')
    async findMembersFromClub(@Param('clubId') clubId: string) {
        return await this.clubSocioService.findMembersFromClub(clubId);
    }

    @Get(':clubId/members/:socioId')
    async findMemberFromClub(@Param('clubId')clubId: string, @Param('socioId') socioId: string) {
        return await this.clubSocioService.findMemberFromClub(clubId, socioId);

    }

    @Put(':clubId')
    async updateMembersFromClub(@Param('clubId') clubId: string, @Body() sociossDto: SocioDto[]) {
        const socios: SocioEntity[] = plainToInstance(SocioEntity, sociossDto);
        return await this.clubSocioService.updateMembersFromClub(clubId, socios);
    }

    @Delete(':clubId/members/:socioId')
    async deleteMemberFromClub(@Param('clubId') clubId: string, @Param('socioId') socioId: string) {
        return this.deleteMemberFromClub(clubId, socioId);
    }




}
