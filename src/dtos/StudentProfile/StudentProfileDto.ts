import { User, UserRoleEnum } from "@/entities/User";
import { UserDto } from "../User/UserDto";
import { StudentProfile, StudentProfileLevelEnum } from "@/entities/StudentProfile";

export class StudentProfileDto extends UserDto {
    studentProfileId: number;
    studentId: string;
    department: string;
    faculty: string;
    level: StudentProfileLevelEnum;
    picture: string;

    constructor(user: User, profile: StudentProfile){
        super(user);        
        this.studentProfileId = profile.id;
        this.studentId = profile.studentId;
        this.department = profile.department;
        this.faculty = profile.faculty;
        this.level = profile.level;
        this.picture = profile.picture;
    }
}