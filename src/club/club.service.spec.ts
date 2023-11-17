import { Test, TestingModule } from '@nestjs/testing';
import { ClubService } from './club.service';
import { TyperOrmTestingConfig } from '../../src/shared/testing-utils/testing-config';
import { ClubEntity } from './club.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import {faker} from '@faker-js/faker';

describe('ClubService', () => {
  let service: ClubService;
  let repository: Repository<ClubEntity>;
  let listClubs: ClubEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TyperOrmTestingConfig()],
      providers: [ClubService],
    }).compile();

    service = module.get<ClubService>(ClubService);
    repository = module.get<Repository<ClubEntity>>(getRepositoryToken(ClubEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    listClubs = [];
    for(let i = 0; i < 5; i++){
        const club: ClubEntity = await repository.save({
        image: faker.image.url(),
        description: faker.lorem.sentence(10),
        foundationDate: faker.date.anytime().toString()});

        listClubs.push(club);
    }

  }





  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all clubs', async () => {
    const clubs: ClubEntity[] = await service.findAll();
    expect(clubs).not.toBeNull();
    expect(clubs).toHaveLength(listClubs.length);
  });


  it('findOne should return a club by id', async () => {
    const clubStored: ClubEntity = listClubs[0];
    const club: ClubEntity = await service.findOne(clubStored.id);

    expect(club).not.toBeNull();
    expect(club.image).toEqual(clubStored.image);
    expect(club.foundationDate).toEqual(clubStored.foundationDate);
    expect(club.description).toEqual(clubStored.description);
  });

  it('findOne should throw an exception for an invalid club', async () => {
    await expect(()=> service.findOne("0")).rejects.toHaveProperty("message", "The club with the given id was not found");
  });

  it("create should return a new club", async () => {
    const club: ClubEntity = {
      id: "",
      image: faker.image.url(),
        description: faker.lorem.sentence(10),
        foundationDate: faker.date.anytime().toString(),
      socios: []
    };

    const newClub : ClubEntity = await service.create(club);
    expect(newClub).not.toBeNull();

    const storedclub: ClubEntity = await repository.findOne({where: {id: newClub.id}, relations:['socios']})
    expect(storedclub).not.toBeNull();
    expect(storedclub.image).toEqual(newClub.image);
    expect(storedclub.foundationDate).toEqual(newClub.foundationDate);
    expect(storedclub.description).toEqual(newClub.description);
    

  });

  it("update should modify a club", async ()=>{
    const club : ClubEntity = listClubs[0];
    club.image = "http://imagenes.com-co";
    club.description= "lorem ipsum";
    const clubUpdate : ClubEntity = await service.update(club.id, club);
    expect(clubUpdate).not.toBeNull();

    const storedSocio: ClubEntity = await repository.findOne({where: {id: club.id}});
    expect(storedSocio).not.toBeNull();
    expect(storedSocio.image).toEqual(club.image);
    
  });

  it("update should throw an exception for an invalid club", async ()=>{

    let club = listClubs[0];
    club = {
      ...club, image: "http://imagen.com.co", description: "lorem ipsum"
    };

    await expect(()=>service.update("0", club)).rejects.toHaveProperty("message", "The club with the given id was not found");

  });


  it("delete should remove a club", async ()=>{
    const club: ClubEntity = listClubs[0];
    await service.delete(club.id);
     const deleteClub: ClubEntity = await repository.findOne({where: {id: club.id}});
     expect(deleteClub).toBeNull();

  });

  it("delete should throw an exeption for an invalid club", async ()=>{
    const socio: ClubEntity = listClubs[0];
     await expect(()=> service.delete("0")).rejects.toHaveProperty("message", "The club with the given id was not found");

  });










});
