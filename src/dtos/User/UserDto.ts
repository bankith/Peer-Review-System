import { User, UserRoleEnum } from "@/entities/User";

export class UserDto {
    userId: number;
    email: string;
    name: string;    
    role: UserRoleEnum;

    isPassOTP: boolean;

    constructor(user: User){
        this.userId = user.id;
        this.email = user.email;
        this.name = user.name;
        this.role = user.role;
    }
}