import { InstructorProfileDto } from "@/dtos/InstructorProfile/InstructorProfileDto";
import { StudentProfileDto } from "@/dtos/StudentProfile/StudentProfileDto";
import { UserDto } from "@/dtos/User/UserDto";
import { User } from "@/entities/User";

export default class UserLoginResponse {
    email: string;    
    token: string;
    user: UserDto;
    // studentProfileDto: StudentProfileDto;
    // instructorProfileDto: InstructorProfileDto;

    public static From(user: UserDto){
        const newUser = new UserLoginResponse();
        newUser.email = user.email;        
        newUser.user = user;

        // if(user instanceof StudentProfileDto){
        //     newUser.studentProfileDto = user;
        // }
        // else if(user instanceof InstructorProfileDto){
        //     newUser.instructorProfileDto = user;
        // }
        
        return newUser;
    }   
}
  