import { User } from "@/entities/User";

export default class UserLoginResponse {
    email: string;    
    token: string;
    user: User;    

    public static From(user: User){
        const newUser = new UserLoginResponse();
        newUser.email = user.email;        
        newUser.user = user;
        newUser.user.passwordHash = "";
        
        return newUser;
    }   
}
  