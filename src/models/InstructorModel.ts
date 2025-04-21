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
import { IPeerReviewGrading } from "./Interfaces/IPeerReviewGrading";
import { AddCommentAndScoreDto } from "@/dtos/PeerReview/AddCommentAndScore/AddCommentAndScoreDto";

export class InstructorModel
  extends UserModel
  implements IAcademicMember, IProfile, IPeerReviewGrading
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

  GetPeerReviewById(peerReviewId: number): Promise<AxiosResponse> {
    return ApiService.instance.client
      .get(`/teacher/course/peerreview?id=${peerReviewId}`)
      .then((response) => {
        return response; 
      })
      .catch((error) => {
        console.error("Error fetching peer review by ID:", error);
        throw error;
      });
  }

  GetPeerReviewSubmissions(peerReviewId: number): Promise<AxiosResponse> {
    return ApiService.instance.client
      .get(`/teacher/course/peerreviewsubmissions?peerReviewId=${peerReviewId}`)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        console.error("Error fetching peer review submissions:", error);
        throw error;
      });
  }

  UpdatePeerReview(data: any): Promise<AxiosResponse> {
    return ApiService.instance.client
      .put("/teacher/peerreviewconfigure/updatingpeerreview", data)
      .then((response) => {
        return response; // ส่ง response กลับไป
      })
      .catch((error) => {
        console.error("Error updating peer review:", error);
        throw error; // โยน error กลับไปให้จัดการในที่เรียกใช้
      });
  }

  PostAssignmentSubmission(payload: any): Promise<AxiosResponse> {
    return ApiService.instance.client
      .post("/teacher/assignment/submission", payload)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        console.error("Error posting assignment submission:", error);
        throw error;
      });
  }

  GetAssignmentSubmissionDetail(courseId: string, assignmentId: string): Promise<AxiosResponse> {
    return ApiService.instance.client
      .get(`/teacher/assignment/submission/detail?courseId=${courseId}&assignmentId=${assignmentId}`)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        console.error("Error fetching assignment submission detail:", error);
        throw error;
      });
  }  

  UpdateAssignment(payload: any): Promise<AxiosResponse> {
    return ApiService.instance.client
      .put("/teacher/assignment/editing", payload)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        console.error("Error updating assignment:", error);
        throw error;
      });
  }

  GetAssignmentsByCourseId(courseId: string): Promise<AxiosResponse> {
    return ApiService.instance.client
      .get(`/teacher/assignments?courseId=${courseId}`)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        console.error("Error fetching assignments by course ID:", error);
        throw error;
      });
  }

  GetPeerReviewsByCourseId(courseId: string): Promise<AxiosResponse> {
    return ApiService.instance.client
      .get(`/teacher/peerreviews?courseId=${courseId}`)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        console.error("Error fetching peer reviews by course ID:", error);
        throw error;
      });
  }


  GetCommentAndGrading(peerReviewSubmissionId: number): Promise<AxiosResponse> {
    return ApiService.instance.client
    .get(`/auth/peerreview/peerReviewSubmission/${peerReviewSubmissionId}/getCommentAndGrading`)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      console.error("Error GetCommentAndGrading:", error);
      throw error;
    });
  }
  AddCommentAndGrading(peerReviewSubmissionId: number, comment: string, score: number): Promise<AxiosResponse> {
    var data = new AddCommentAndScoreDto()
    data.message = comment;
    data.score = score;
    return ApiService.instance.client
    .post(`/auth/peerreview/peerReviewSubmission/${peerReviewSubmissionId}/addCommentAndGrading`, data)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      console.error("Error GetCommentAndGrading:", error);
      throw error;
    });
  }
}
