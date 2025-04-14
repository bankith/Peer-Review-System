import { StudentProfileDto } from "@/dtos/StudentProfile/StudentProfileDto";
import { UserDto } from "@/dtos/User/UserDto";
import { StudentProfileLevelEnum } from "@/entities/StudentProfile";
import { User, UserRoleEnum } from "@/entities/User";
import { UserModel } from "./UserModel";
import { IAcademicMember } from "./Interfaces/IAcademicMember";

export class StudentModel extends UserModel implements IAcademicMember{
    studentProfileId: number;
    studentId: string;
    level: StudentProfileLevelEnum;
    picture: string;

    department: string;
    faculty: string;

    static #instance: StudentModel;
    public static override get instance(): StudentModel {
        if (!StudentModel.#instance) {
            if (typeof window !== "undefined") {
                var user = localStorage.getItem('user');
                if(user){
                  var studentProfileDto = JSON.parse(user) as StudentProfileDto;
                  StudentModel.#instance = new StudentModel(studentProfileDto);                  
                }else{
                  StudentModel.#instance = new StudentModel();
                }
            }            
        }        
        return StudentModel.#instance;
    }

    constructor(studentprofile? :StudentProfileDto){
        super(studentprofile)
        if(studentprofile){
            this.studentProfileId = studentprofile.studentProfileId;
            this.studentId = studentprofile.studentId;
            this.level = studentprofile.level;
            this.picture = studentprofile.picture;
            this.department = studentprofile.department;
            this.faculty = studentprofile.faculty;
        }
    }
}