import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class GetUploadURLDto {
    
    @IsNotEmpty()
    fileName: string; 
    
    @IsNotEmpty()
    fileType: string  

}
