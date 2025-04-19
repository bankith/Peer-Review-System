import { StudentProfileDto } from "@/dtos/StudentProfile/StudentProfileDto";
import { UserDto } from "@/dtos/User/UserDto";
import { StudentProfileLevelEnum } from "@/entities/StudentProfile";
import { User, UserRoleEnum } from "@/entities/User";
import { UserModel } from "./UserModel";
import { IAcademicMember } from "./Interfaces/IAcademicMember";
import { InstructorProfileDto } from "@/dtos/InstructorProfile/InstructorProfileDto";
import { InstructorProfileTitleEnum } from "@/entities/InstructorProfile";
import { IProfile } from "./Interfaces/IProfile";
import { AxiosResponse } from "axios";
import ApiService from "@/services/apiService";

export class InstructorModel
  extends UserModel
  implements IAcademicMember, IProfile
{
  instructerProfileId: number;
  title: InstructorProfileTitleEnum;
  picture: string;
  department: string;
  faculty: string;

  static #instance: InstructorModel;
  public static override get instance(): InstructorModel {
    if (!InstructorModel.#instance) {
      if (typeof window !== "undefined") {
        var user = localStorage.getItem("user");
        if (user != undefined) {
          var instructorProfileDto = JSON.parse(user) as InstructorProfileDto;
          InstructorModel.#instance = new InstructorModel(instructorProfileDto);
        } else {
          InstructorModel.#instance = new InstructorModel();
        }
      }
    }
    return InstructorModel.#instance;
  }

  constructor(data?: InstructorProfileDto) {
    super(data);
    if (data != null) {
      this.instructerProfileId = data.instructorProfileId;
      this.title = data.title;
      this.picture = data.picture;
      this.department = data.department;
      this.faculty = data.faculty;
    }
  }

  public UpdateInstructorData(newData: InstructorProfileDto) {
    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(newData));
    }
    InstructorModel.#instance = new InstructorModel(newData);
  }

  IsAlreadyDownLoadProfile(): boolean {
    console.log("instructerProfileId: " + this.instructerProfileId);
    if (!this.instructerProfileId || this.instructerProfileId <= 0)
      return false;

    return true;
  }

  GetProfile(): Promise<AxiosResponse> {
    return ApiService.instance.client.get("/auth/profile").then((response) => {
      const data = response.data.data as InstructorProfileDto;
      if (data) {
        ApiService.instance.saveUserDTO(data);
        InstructorModel.instance.UpdateInstructorData(data);
      }

      return response;
    });
  }

  GetAssignmentbyAssignmentId(assignmentId: number): Promise<AxiosResponse> {
    return ApiService.instance.client
      .get(`/teacher/assignment?assignmentId=${assignmentId}`)
      .then((response) => {
        const data = response.data.data as InstructorProfileDto;
        if (data) {
          ApiService.instance.saveUserDTO(data);
          InstructorModel.instance.UpdateInstructorData(data);
        }

        return response;
      });
  }

  PostPeerReviewConfiguration(data: any): Promise<AxiosResponse> {
    return ApiService.instance.client
      .post("/teacher/peerreviewconfigure/peerreview", data)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        console.error("Error posting peer review configuration:", error);
        throw error;
      });
  }
  PostPeerReviewSubmissionMatching(
    peerReviewId: number,
    data: any
  ): Promise<AxiosResponse> {
    return ApiService.instance.client
      .post(`/teacher/peerreviewconfigure/peerreviewsubmission/matching?peerReviewId=${peerReviewId}`, data)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        console.error("Error posting peer review submission matching:", error);
        throw error;
      });
  }
}
