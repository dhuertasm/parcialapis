import { IsNotEmpty, IsString, IsUrl, MaxLength,} from "@nestjs/class-validator";

export class ClubDto {
    
    @IsUrl()
    @IsNotEmpty()
    image: string;
    
    @IsString()
    @IsNotEmpty()
    foundationDate: string;
    
    @MaxLength(100)
    @IsNotEmpty()
    description: string;




}