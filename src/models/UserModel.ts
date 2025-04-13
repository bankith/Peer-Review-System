import { UserDto } from "@/dtos/User/UserDto";
import { User, UserRoleEnum } from "@/entities/User";

export class UserModel {
    userId: number;
    email: string;
    name: string;    
    role: UserRoleEnum;

    constructor(user: UserDto){
        this.userId = user.userId;
        this.email = user.email;
        this.name = user.name;
        this.role = user.role;
    }
}