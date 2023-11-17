import { Test, TestingModule } from '@nestjs/testing';
import { SocioService } from './socio.service';
import { SocioEntity } from './socio.entity';
import { Repository } from 'typeorm';
import { TyperOrmTestingConfig } from '../../src/shared/testing-utils/testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import {faker} from '@faker-js/faker';
import { serialize } from 'v8';

describe('SocioService', () => {
  let service: SocioService;
  let repository: Repository<SocioEntity>;
  let socioList: SocioEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TyperOrmTestingConfig()],
      providers: [SocioService],
    }).compile();

    service = module.get<SocioService>(SocioService);
    repository = module.get<Repository<SocioEntity>>(getRepositoryToken(SocioEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    socioList = [];
    for(let i = 0; i < 5; i++){
        const socio: SocioEntity = await repository.save({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        birthDate: faker.date.birthdate().toString()});

        socioList.push(socio);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all socios', async () => {
    const socios: SocioEntity[] = await service.findAll();
    expect(socios).not.toBeNull();
    expect(socios).toHaveLength(socioList.length);
  })

  it('findAll should return a socio by id', async () => {
    const socioStored: SocioEntity = socioList[0];
    const socio: SocioEntity = await service.findOne(socioStored.id);

    expect(socio).not.toBeNull();
    expect(socio.name).toEqual(socioStored.name);
    expect(socio.birthDate).toEqual(socioStored.birthDate);
    expect(socio.email).toEqual(socioStored.email);
  })

  it('findOne should throw an exception for an invalid socio', async () => {
    await expect(()=> service.findOne("0")).rejects.toHaveProperty("message", "The socio with the given id was not found");
  });

  it("create should return a new socio", async () => {
    const socio: SocioEntity = {
      id: "",
      name: faker.person.fullName(),
      email: faker.internet.email(),
      birthDate: faker.date.birthdate().toString(),
      clubs: []
    };

    const newSocio : SocioEntity = await service.create(socio);
    expect(newSocio).not.toBeNull();

    const storedSocio: SocioEntity = await repository.findOne({where: {id: newSocio.id}, relations:['clubs']})
    expect(storedSocio).not.toBeNull();
    expect(storedSocio.email).toEqual(newSocio.email);
    expect(storedSocio.birthDate).toEqual(newSocio.birthDate);
    expect(storedSocio.name).toEqual(newSocio.name);
    

  });

  it("update should modify a socio", async ()=>{
    const socio : SocioEntity = socioList[0];
    socio.name = "name";
    socio.email = "name@gmail.com";
    const socioUpdate : SocioEntity = await service.update(socio.id, socio);
    expect(socioUpdate).not.toBeNull();

    const storedSocio: SocioEntity = await repository.findOne({where: {id: socio.id}});
    expect(storedSocio).not.toBeNull();
    expect(storedSocio.name).toEqual(socio.name);
    

  });

  it("update should throw an exception for an invalid socio", async ()=>{

    let socio = socioList[0];
    socio = {
      ...socio, name: "new name", email: "newname@gmail.com"
    };

    await expect(()=>service.update("0", socio)).rejects.toHaveProperty("message", "The socio with the given id was not found");

  });

  it("delete should remove a socio", async ()=>{
    const socio: SocioEntity = socioList[0];
    await service.delete(socio.id);
     const deleteSocio: SocioEntity = await repository.findOne({where: {id: socio.id}});
     expect(deleteSocio).toBeNull();

  });

  it("delete should throw an exeption for an invalid socio", async ()=>{
    const socio: SocioEntity = socioList[0];
     await expect(()=> service.delete("0")).rejects.toHaveProperty("message", "The socio with the given id was not found");

  });


});
