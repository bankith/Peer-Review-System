import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class UploadURLDto {
    
    uploadUrl: string; 

    finalFileUrl: string;     
}
