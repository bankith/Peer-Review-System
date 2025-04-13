import { StudentProfileDto } from "@/dtos/StudentProfile/StudentProfileDto";
import { UserDto } from "@/dtos/User/UserDto";
import { StudentProfileLevelEnum } from "@/entities/StudentProfile";
import { User, UserRoleEnum } from "@/entities/User";
import { UserModel } from "./UserModel";
import { AcademicMember } from "./Interfaces/AcademicMember";

export class StudentModel extends UserModel implements AcademicMember{
    studentProfileId: number;
    studentId: string;
    level: StudentProfileLevelEnum;
    picture: string;

    department: string;
    faculty: string;

    constructor(studentprofile :StudentProfileDto){
        super(studentprofile)
        this.studentProfileId = studentprofile.studentProfileId;
        this.studentId = studentprofile.studentId;
        this.level = studentprofile.level;
        this.picture = studentprofile.picture;
        this.department = studentprofile.department;
        this.faculty = studentprofile.faculty;
    }
}