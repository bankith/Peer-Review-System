import { StudentProfileDto } from "@/dtos/StudentProfile/StudentProfileDto";
import { UserDto } from "@/dtos/User/UserDto";
import { StudentProfileLevelEnum } from "@/entities/StudentProfile";
import { User, UserRoleEnum } from "@/entities/User";
import { UserModel } from "./UserModel";
import { IAcademicMember } from "./Interfaces/IAcademicMember";
import { InstructorProfileDto } from "@/dtos/InstructorProfile/InstructorProfileDto";
import { InstructorProfileTitleEnum } from "@/entities/InstructorProfile";

export class InstructorModel extends UserModel implements IAcademicMember{
    instructerProfileId: number;    
    title: InstructorProfileTitleEnum;        
    picture: string;
    department: string;
    faculty: string;

    static #instance: InstructorModel;
    public static override get instance(): InstructorModel {
        if (!InstructorModel.#instance) {
            if (typeof window !== "undefined") {
                var user = localStorage.getItem('user');
                if(user){
                  var instructorProfileDto = JSON.parse(user) as InstructorProfileDto;
                  InstructorModel.#instance = new InstructorModel(instructorProfileDto);
                }else{
                    InstructorModel.#instance = new InstructorModel();
                }
            }            
        }
        return InstructorModel.#instance;
    }

    constructor(data? :InstructorProfileDto){
        super(data);
        if(data != null){
            this.instructerProfileId = data.instructorProfileId;
            this.title = data.title;        
            this.picture = data.picture;
            this.department = data.department;
            this.faculty = data.faculty;
        }
    }
}