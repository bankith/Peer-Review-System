import { AxiosResponse } from "axios";

export interface ICourseUser {
    GetMyCourses(): Promise<AxiosResponse>;    
}
