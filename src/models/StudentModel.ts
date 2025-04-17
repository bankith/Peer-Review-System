import { StudentProfileDto } from "@/dtos/StudentProfile/StudentProfileDto";
import { UserDto } from "@/dtos/User/UserDto";
import { StudentProfileLevelEnum } from "@/entities/StudentProfile";
import { User, UserRoleEnum } from "@/entities/User";
import { UserModel } from "./UserModel";
import { IAcademicMember } from "./Interfaces/IAcademicMember";
import { IProfile } from "./Interfaces/IProfile";
import { AxiosResponse } from "axios";
import ApiService from "@/services/apiService";
import { IStudentAssignment } from "./Interfaces/IStudentAssignment";
import { AssignmentSubmissionDto } from "@/dtos/Assignment/AssignmentSubmissionDto";

export class StudentModel extends UserModel implements IAcademicMember, IStudentAssignment{
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


    public UpdateStudentData(newData: StudentProfileDto) {        
        if (typeof window !== "undefined") {
              localStorage.setItem('user', JSON.stringify(newData));
        }          
        StudentModel.#instance = new StudentModel(newData);
    }

    GetProfile(): Promise<AxiosResponse> {
        return ApiService.instance.client.get('/auth/profile').then(response => {        
            const data = response.data.data as StudentProfileDto;               
            if(data){
                ApiService.instance.saveUserDTO(data);                    
                StudentModel.instance.UpdateStudentData(data);
            }
            
            return response;
        })
    }

    GetAssignment(assignmentId: Number): Promise<AxiosResponse> {
        return ApiService.instance.client.get('/auth/assignments/' + assignmentId )
    }
    SubmitAssignment(assignmentSubmissionDto: AssignmentSubmissionDto): Promise<AxiosResponse> {
        return ApiService.instance.client.post('/auth/assignments/submission', assignmentSubmissionDto);
    }
}