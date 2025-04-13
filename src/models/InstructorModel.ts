import { StudentProfileDto } from "@/dtos/StudentProfile/StudentProfileDto";
import { UserDto } from "@/dtos/User/UserDto";
import { StudentProfileLevelEnum } from "@/entities/StudentProfile";
import { User, UserRoleEnum } from "@/entities/User";
import { UserModel } from "./UserModel";
import { AcademicMember } from "./Interfaces/AcademicMember";
import { InstructorProfileDto } from "@/dtos/InstructorProfile/InstructorProfileDto";
import { InstructorProfileTitleEnum } from "@/entities/InstructorProfile";

export class InstructorModel extends UserModel implements AcademicMember{
    instructerProfileId: number;    
    title: InstructorProfileTitleEnum;        
    picture: string;
    department: string;
    faculty: string;

    constructor(data :InstructorProfileDto){
        super(data)
        this.instructerProfileId = data.instructorProfileId;
        this.title = data.title;        
        this.picture = data.picture;
        this.department = data.department;
        this.faculty = data.faculty;
    }
}