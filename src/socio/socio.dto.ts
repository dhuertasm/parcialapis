import { IsEmail, IsNotEmpty, IsString } from "@nestjs/class-validator";

export class SocioDto {
    
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    birthDate: string;
}