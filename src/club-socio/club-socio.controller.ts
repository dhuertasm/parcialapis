import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { ClubSocioService } from './club-socio.service';
import { SocioDto } from '../socio/socio.dto';
import { SocioEntity } from '../socio/socio.entity';
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

    @Get(':clubId/members')
    async findMembersFromClub(@Param('clubId') clubId: string) {
        return await this.clubSocioService.findMembersFromClub(clubId);
    }

    @Get(':clubId/members/:socioId')
    async findMemberFromClub(@Param('clubId')clubId: string, @Param('socioId') socioId: string) {
        return await this.clubSocioService.findMemberFromClub(clubId, socioId);

    }

    @Put(':clubId/members')
    async updateMembersFromClub(@Param('clubId') clubId: string, @Body() sociossDto: SocioDto[]) {
        const socios: SocioEntity[] = plainToInstance(SocioEntity, sociossDto);
        return await this.clubSocioService.updateMembersFromClub(clubId, socios);
    }

    @Delete(':clubId/members/:socioId')
    @HttpCode(204)
    async deleteMemberFromClub(@Param('clubId') clubId: string, @Param('socioId') socioId: string) {
        return await this.clubSocioService.deleteMemberFromClub(clubId, socioId);
    }




}
