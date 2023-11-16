import { SocioEntity } from "src/socio/socio.entity";
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ClubEntity {
    

    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @Column()
    image: string;
    
    @Column()
    foundationDate: string;
    
    @Column()
    description: string;

    @ManyToMany(
        () => SocioEntity, socio => socio.clubs
    )
    @JoinTable()
    socios: SocioEntity[];

}