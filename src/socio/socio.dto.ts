import { IsEmail, IsNotEmpty, IsString } from "@nestjs/class-validator";

export class SocioDto {
    
    @IsString()
    @IsNotEmpty()
    username: string;

    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    birthDate: string;
}