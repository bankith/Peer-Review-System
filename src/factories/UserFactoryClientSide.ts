import { AppDataSource } from "@/data-source";
import { InstructorProfileDto } from "@/dtos/InstructorProfile/InstructorProfileDto";
import { StudentProfileDto } from "@/dtos/StudentProfile/StudentProfileDto";
import { UserDto } from "@/dtos/User/UserDto";
import { InstructorProfile } from "@/entities/InstructorProfile";
import { StudentProfile } from "@/entities/StudentProfile";
import { User, UserRoleEnum } from "@/entities/User";
import { InstructorModel } from "@/models/InstructorModel";
import { StudentModel } from "@/models/StudentModel";
import { UserModel } from "@/models/UserModel";

export class UserFactoryClientSide {

  static create(user?: UserDto): UserModel {    
    var userLocal = localStorage.getItem('user');
    if(!userLocal){
      return UserModel.instance;
    }      
    var userDto = JSON.parse(userLocal) as UserDto;

    if(userDto instanceof StudentProfileDto){
      return StudentModel.instance
    }
    else if(userDto instanceof InstructorProfileDto){
      return InstructorModel.instance
    }
    else{
      return UserModel.instance;
    }
  }
}
