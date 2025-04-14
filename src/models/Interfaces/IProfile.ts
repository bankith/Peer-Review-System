import { AxiosResponse } from "axios";

export interface IProfile {
    GetProfile(): Promise<AxiosResponse>;
    IsAlreadyDownLoadProfile(): boolean;
}
  