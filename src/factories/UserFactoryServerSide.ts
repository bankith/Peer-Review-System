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

export class UserFactoryServerSide {
  static async create(user: User): Promise<UserDto> {
    switch (user.role) {
      case UserRoleEnum.student:
        var studentProfile = await AppDataSource
        .getRepository(StudentProfile)
        .createQueryBuilder("StudentProfile")
        .leftJoinAndSelect("StudentProfile.user", "user")
        .where("user.id = :id", { id: user.id })        
        .getOneOrFail();
        
        return new StudentProfileDto(user, studentProfile);
      case UserRoleEnum.instructor:
        var instructorProfile = await AppDataSource
        .getRepository(InstructorProfile)
        .createQueryBuilder("InstructorProfile")
        .leftJoinAndSelect("InstructorProfile.user", "user")
        .where("user.id = :id", { id: user.id })        
        .getOneOrFail();        
        
        return new InstructorProfileDto(user, instructorProfile);
      default:
        throw new Error(`Unsupported role: ${user.role}`);
    }
  }
}
