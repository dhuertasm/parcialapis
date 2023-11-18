import { Test, TestingModule } from '@nestjs/testing';
import { ClubSocioService } from './club-socio.service';
import { TyperOrmTestingConfig } from '../../src/shared/testing-utils/testing-config';
import { Repository } from 'typeorm';
import { SocioEntity } from '../../src/socio/socio.entity';
import { ClubEntity } from '../../src/club/club.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import {faker} from '@faker-js/faker';

describe('ClubSocioService', () => {
  let service: ClubSocioService;
  let socioRepository: Repository<SocioEntity>;
  let clubRepository: Repository<ClubEntity>;
  let club: ClubEntity;
  let socioList: SocioEntity[];
  let idSocios: string[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClubSocioService],
      imports: [...TyperOrmTestingConfig()],
    }).compile();

    service = module.get<ClubSocioService>(ClubSocioService);
    socioRepository = module.get<Repository<SocioEntity>>(getRepositoryToken(SocioEntity));
    clubRepository = module.get<Repository<ClubEntity>>(getRepositoryToken(ClubEntity));

    await seedData();
  });

  const seedData = async () => {
      clubRepository.clear();
      socioRepository.clear();

      socioList = [];
      idSocios = [];

      for (let i = 0; i < 5; i++) {
        const socio: SocioEntity = await socioRepository.save({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        birthDate: faker.date.birthdate().toString()
        });
        socioList.push(socio);
        idSocios.push(socio.id);
      }

      club = await clubRepository.save({
        image: faker.image.url(),
        description: faker.lorem.sentence(10),
        foundationDate: faker.date.anytime().toString(),
        socios: socioList,
      });
  };



  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  
  it('addMemberToclub should add a socio to club', async ()=>{
    
    const newSocio: SocioEntity = await socioRepository.save({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      birthDate: faker.date.birthdate().toString()
    });

    const newclub: ClubEntity = await clubRepository.save({
      image: faker.image.url(),
      description: faker.lorem.sentence(10),
      foundationDate: faker.date.anytime().toString(),
    });

    const result: ClubEntity = await service.addMemberToclub(newclub.id, newSocio.id);

    expect(result.socios.length).toBe(1);
    expect(result.socios[0]).not.toBeNull();
    expect(result.socios[0].email).toBe(newSocio.email);
    expect(result.socios[0].birthDate).toBe(newSocio.birthDate);


  });

  it("addMemberToclub should return a exeption socio invalid", async ()=> {

    const newclub: ClubEntity = await clubRepository.save({
      image: faker.image.url(),
      description: faker.lorem.sentence(10),
      foundationDate: faker.date.anytime().toString(),
    });

    await expect(()=> service.addMemberToclub(newclub.id, '0')).rejects.toHaveProperty("message", "The socio with the given id was not found");

  });

  it("findMemberFromClub should return a socio", async ()=>{

    const newSocio: SocioEntity = await socioRepository.save({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      birthDate: faker.date.birthdate().toString()
    });

    const newclub: ClubEntity = await clubRepository.save({
      image: faker.image.url(),
      description: faker.lorem.sentence(10),
      foundationDate: faker.date.anytime().toString(),
      socios: [newSocio]
    });

    const result: SocioEntity = await service.findMemberFromClub(newclub.id, newSocio.id);

    expect(result).not.toBeNull();
    expect(result.birthDate).toBe(newSocio.birthDate);


  });

  it('findMemberFromClub should return a exception socio invalid', async ()=>{
    expect(()=> service.findMemberFromClub(club.id, "0")).rejects.toHaveProperty("message", "The socio with the given id was not found");
  });

  it('findMemberFromClub should return a exception club invalid', async ()=>{

    const newSocio: SocioEntity = socioList[0];
   await  expect(()=> service.findMemberFromClub("0", newSocio.id)).rejects.toHaveProperty("message", "The club with the given id was not found");
  });


  it('findMemberFromClub should return a exception socio not associate to club', async ()=>{

    const newSocio: SocioEntity = await socioRepository.save({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      birthDate: faker.date.birthdate().toString()
    });

    await expect(()=> service.findMemberFromClub(club.id, newSocio.id)).rejects.toHaveProperty("message", "The socio with the given id is not associated to the club");
  });


  it('findMembersFromClub should return a list of socios', async ()=>{

    const listSocios: SocioEntity[] = await service.findMembersFromClub(club.id);

    expect(listSocios.length).toBe(5);
  });


  it('findMembersFromClub should return a exception, invalid club', async ()=>{


    await expect(()=> service.findMembersFromClub('0')).rejects.toHaveProperty("message", "The club with the given id was not found");
  });


  it("updateMembersFromClub should update socios of a club", async ()=> {


    let updateSocios: SocioEntity[] = [];
    for (let i=0; i < 5; i++) {
      const updateSocio: SocioEntity = {
        id: `${i}`,
        name: faker.person.fullName(),
        email: faker.internet.email(),
        birthDate: faker.date.birthdate().toString(),
        clubs: []
      };
      updateSocios.push(updateSocio);
    }

     const result : ClubEntity = await service.updateMembersFromClub(club.id, idSocios, updateSocios);
     expect(result).not.toBeNull();
     expect(result.socios[0].email).toBe(updateSocios[0].email);

  });


  it("updateMembersFromClub should return exception socios of invalid club", async ()=> {


    let updateSocios: SocioEntity[] = [];
    for (let i=0; i < 5; i++) {
      const updateSocio: SocioEntity = {
        id: `${i}`,
        name: faker.person.fullName(),
        email: faker.internet.email(),
        birthDate: faker.date.birthdate().toString(),
        clubs: []
      };
      updateSocios.push(updateSocio);
    }

     const result : ClubEntity = await service.updateMembersFromClub(club.id, idSocios, updateSocios);
     expect(result).not.toBeNull();
     expect(result.socios[0].email).toBe(updateSocios[0].email);

     await expect(()=> service.updateMembersFromClub("0", idSocios, updateSocios)).rejects.toHaveProperty("message", "The club with the given id was not found");

  });

  it("deleteMemberFromClub should delete a socio from club", async ()=> {

    const socio: SocioEntity = socioList[0];

    await service.deleteMemberFromClub(club.id, socio.id);

    const storedClub: ClubEntity = await clubRepository.findOne({where: {id: club.id}, relations:['socios']});
    const deleteSocio: SocioEntity = storedClub.socios.find(e => e.id === socio.id);

    expect(deleteSocio).toBeUndefined();

  });


  it("deleteMemberFromClub should return exception, invalid socio", async ()=> {


   await expect(()=> service.deleteMemberFromClub(club.id, "0")).rejects.toHaveProperty("message", "The socio with the given id was not found");

  });


  it("deleteMemberFromClub should return exception, invalid club", async ()=> {

    const socio: SocioEntity = socioList[0];


   await expect(()=> service.deleteMemberFromClub("0", socio.id)).rejects.toHaveProperty("message", "The club with the given id was not found");

  });

  it("deleteMemberFromClub should return exception, not associated socio", async ()=> {

    const newSocio: SocioEntity = await socioRepository.save({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      birthDate: faker.date.birthdate().toString()
    });


   await  expect(()=> service.deleteMemberFromClub(club.id, newSocio.id)).rejects.toHaveProperty("message", "The socio with the given id is not associated to the club");

  });




});
