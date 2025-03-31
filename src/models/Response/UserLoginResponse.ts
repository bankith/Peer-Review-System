import { User } from "@/entities/User";

export default class UserLoginResponse {
    email: string;
    password: string;
    token: string;

    public static From(user: User){
        const newUser = new UserLoginResponse();
        newUser.email = user.email;
        newUser.password = user.password;        
        return newUser;
    }   
}
  