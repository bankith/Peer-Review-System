import { User } from "@/entities/User";
import { UserDto } from "../User/UserDto";
import { InstructorProfile, InstructorProfileTitleEnum } from "@/entities/InstructorProfile";
import { IAcademicMember } from "@/models/Interfaces/IAcademicMember";

export class InstructorProfileDto extends UserDto implements IAcademicMember {
    instructorProfileId: number;    
    department: string;
    faculty: string;
    title: InstructorProfileTitleEnum;
    picture: string;

    constructor(user: User, profile: InstructorProfile){
        super(user);        
        this.instructorProfileId = profile.id;        
        this.department = profile.department;
        this.faculty = profile.faculty;
        this.title = profile.title;
        this.picture = profile.picture;
    }
}