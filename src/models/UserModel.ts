import { UserDto } from "@/dtos/User/UserDto";
import { User, UserRoleEnum } from "@/entities/User";
import { IAuthenticatable } from "./Interfaces/IAuthenticatable";
import ApiService from '@/services/apiService';
import { AxiosResponse } from "axios";
import { ICourseUser } from "./Interfaces/ICourseUser";
import { INotification } from "./Interfaces/INotification";

export class UserModel implements IAuthenticatable, ICourseUser, INotification {
    static #instance: UserModel;
    public static get instance(): UserModel {
        if (!UserModel.#instance) {
            if (typeof window !== "undefined") {
                var user = localStorage.getItem('user');
                console.log("user " + user)
                if(user != "undefined"){
                  var userDto = JSON.parse(user!) as UserDto;
                  
                  UserModel.#instance = new UserModel(userDto);                  
                }else{
                  UserModel.#instance = new UserModel();
                }
            }            
        }        
        return UserModel.#instance;
    }

    public UpdateUserData(newUser: UserDto) {        
        if (typeof window !== "undefined") {
              localStorage.setItem('user', JSON.stringify(newUser));
        }          
        UserModel.#instance = new UserModel(newUser);
    }

    userId: number;
    email: string;
    name: string;    
    role: UserRoleEnum;

    constructor(user?: UserDto){
        if(user != null){
            this.userId = user.userId;
            this.email = user.email;
            this.name = user.name;
            this.role = user.role;
        }
    }
    
    GetMyCourses(): Promise<AxiosResponse> {
        return ApiService.instance.client.get('/auth/courses');
    }
    Logout() {
        ApiService.instance.logout();
    }
    RequestOTP(): Promise<AxiosResponse> {
        return ApiService.instance.client.get('/login/otp');
    }
    CheckOTP(otpPin: string): Promise<AxiosResponse> {
        return ApiService.instance.client.post('/login/otp', { OTPPin: otpPin })
                .then(response => {        
                    const { token, user } = response.data.data;
                    ApiService.instance.saveToken(token);       
                    if(user){
                        ApiService.instance.saveUser(user);        
                        UserModel.instance.UpdateUserData(user)
                    }
                    return response;
                })
    }
    ByPassOTP(): Promise<AxiosResponse> {
        return ApiService.instance.client.get('/login/otp/bypass')
               .then(response => {
                 const { token, user } = response.data.data;
                 ApiService.instance.saveToken(token);
                 if(user){
                    ApiService.instance.saveUser(user);        
                    UserModel.instance.UpdateUserData(user)
                }
                 return response;
               });
    }
    
    LoginWithEmailAndPassword(email: string, password: string): Promise<AxiosResponse> {
       return ApiService.instance.client.post('/login', { email: email, password: password })
              .then(response => {        
                    const { token, user } = response.data.data;
                    ApiService.instance.saveToken(token);     
                    if(user){
                        ApiService.instance.saveUser(user);        
                        UserModel.instance.UpdateUserData(user)
                    }
                    return response;
              })
    }

    GetNotifications(): Promise<AxiosResponse> {
        return ApiService.instance.client.get('/auth/notifications');
    }
    MarkAllNotificationsAsRead(): Promise<AxiosResponse> {
        return ApiService.instance.client.get('auth/notifications/markAllAsRead');
    }
}