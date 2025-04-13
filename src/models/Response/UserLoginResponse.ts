import { UserDto } from "@/dtos/User/UserDto";
import { User } from "@/entities/User";

export default class UserLoginResponse {
    email: string;    
    token: string;
    user: UserDto;    

    public static From(user: UserDto){
        const newUser = new UserLoginResponse();
        newUser.email = user.email;        
        newUser.user = user;
        
        return newUser;
    }   
}
  