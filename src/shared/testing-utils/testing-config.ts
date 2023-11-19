import { TypeOrmModule } from "@nestjs/typeorm"
import { ClubEntity } from "../../club/club.entity";
import { SocioEntity } from "../../socio/socio.entity";

export const TyperOrmTestingConfig = () => [

    TypeOrmModule.forRoot({
       type: "sqlite",
       database: ":memory:",
       dropSchema: true,
       entities: [SocioEntity, ClubEntity],
       synchronize: true,
       keepConnectionAlive: true 
    }),

    TypeOrmModule.forFeature([SocioEntity, ClubEntity])
];