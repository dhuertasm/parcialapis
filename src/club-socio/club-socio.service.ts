import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClubEntity } from '../../src/club/club.entity';
import { BusinessError, BusinessLogicException } from '../../src/shared/errors/business-errors';
import { SocioEntity } from '../../src/socio/socio.entity';
import { Repository} from 'typeorm';

@Injectable()
export class ClubSocioService {

    constructor(
        @InjectRepository(SocioEntity)
        private readonly socioRepository: Repository<SocioEntity>,


        @InjectRepository(ClubEntity)
        private readonly clubRepository: Repository<ClubEntity>

    ) {
        
    }

    async addMemberToclub(clubId: string, socioId: string): Promise<ClubEntity> {
        
        const socio: SocioEntity = await this.socioRepository.findOne({where:{id: socioId}, relations:['clubs']});
        
        if (!socio) {
            throw new BusinessLogicException("The socio with the given id was not found", BusinessError.NOT_FOUND)
        }

        const club : ClubEntity = await this.clubRepository.findOne({where: {id: clubId}, relations:['socios']});
        if (!club) {
            throw new BusinessLogicException("The club with the given id was not found", BusinessError.NOT_FOUND)
        }

        club.socios = [...club.socios, socio];

        return await this.clubRepository.save(club);

    }

    async findMembersFromClub(clubId: string): Promise<SocioEntity[]> {
       
        const club : ClubEntity = await this.clubRepository.findOne({where: {id: clubId}, relations:['socios']});
        if (!club) {
            throw new BusinessLogicException("The club with the given id was not found", BusinessError.NOT_FOUND)
        }

        return club.socios;

    }

    async findMemberFromClub(clubId: string, socioId: string): Promise<SocioEntity> {
        const socio: SocioEntity = await this.socioRepository.findOne({where:{id: socioId}, relations:['clubs']});
        
        if (!socio) {
            throw new BusinessLogicException("The socio with the given id was not found", BusinessError.NOT_FOUND)
        }

        const club : ClubEntity = await this.clubRepository.findOne({where: {id: clubId}, relations:['socios']});
        if (!club) {
            throw new BusinessLogicException("The club with the given id was not found", BusinessError.NOT_FOUND)
        }

        const socioClub: SocioEntity = club.socios.find(e => e.id === socio.id);
        if (!socioClub) {
            throw new BusinessLogicException("The socio with the given id is not associated to the club", BusinessError.PRECONDITION_FAILED)
        }

        return socioClub;

    }

    async updateMembersFromClub(clubId:string,socios: SocioEntity[]): Promise<ClubEntity> {

        const club : ClubEntity = await this.clubRepository.findOne({where: {id: clubId}, relations:['socios']});
        if (!club) {
            throw new BusinessLogicException("The club with the given id was not found", BusinessError.NOT_FOUND)
        }

       
        socios.map((socio) => {
            for (let i=0; i < club.socios.length; i++) {
                if (club.socios[i].id === socio.id) {
                    club.socios[i] = socios[i];
                }
            }
        });
       
        return this.clubRepository.save(club);
        
    }

    async deleteMemberFromClub(clubdId: string, socioId: string) {
        const socio: SocioEntity = await this.socioRepository.findOne({where: {id: socioId}});
        if (!socio) {
            throw new BusinessLogicException("The socio with the given id was not found", BusinessError.NOT_FOUND);
        }

        const club: ClubEntity = await this.clubRepository.findOne({where: {id: clubdId}, relations:['socios']});
        if (!club) {
            throw new BusinessLogicException("The club with the given id was not found", BusinessError.NOT_FOUND);
        }

        const socioClub: SocioEntity = club.socios.find(e => e.id === socio.id);
        if (!socioClub) {
            throw new BusinessLogicException("The socio with the given id is not associated to the club", BusinessError.PRECONDITION_FAILED);

        }

        club.socios = club.socios.filter(e => e.id !== socioId);

        await this.clubRepository.save(club);

    }


}
