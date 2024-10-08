import { Injectable } from '@angular/core';
import { HttpClientService } from '../http-client.service';
import { User } from 'src/app/entities/user';
import { CreateUser } from 'src/app/contracts/users/create-user';
import { Observable } from 'rxjs/internal/Observable';
import { firstValueFrom } from 'rxjs';
import { Token } from 'src/app/contracts/token/token';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from '../../ui/custom-toastr.service';
import { TokenResponse } from 'src/app/contracts/token/tokenResponse';
import { SocialUser } from '@abacritt/angularx-social-login';
import { ListUser } from 'src/app/contracts/list-user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClientService: HttpClientService,
    private toastrService : CustomToastrService
  ) { }

  async create (user :User) : Promise<CreateUser>{
    const observable : Observable<CreateUser| User> = this.httpClientService.post<CreateUser | User>({
      controller:"users"
    },user);
    
    return await firstValueFrom(observable) as CreateUser;
  }

  async updatePassword(userId: string, resetToken:string, password:string,passwordConfirm:string,successCallBack ?: () => void, errorCallBack ?: (error) => void){
    const observable : Observable<any> = this.httpClientService.post({
      controller:"users",
      action:"update-password"
    },{
      userId:userId,
      resetToken:resetToken,
      password:password,
      passwordConfirm:passwordConfirm
    });

    const promiseData : Promise <any>=  firstValueFrom(observable);
    promiseData.then(()=>successCallBack())
    .catch((error)=> errorCallBack(error));

    return promiseData;
  }
  async getAllUsers (page : number = 0, size : number = 5,successCallback ?: () => void, errorCallBack ?: (error) => void ) : Promise<{totalUserCount : number, users: ListUser[]}>{
    const observable :Observable<{totalUserCount : number, users: ListUser[]}>= await this.httpClientService.get<{totalUserCount : number, users: ListUser[]}>({
      controller:"users",
      queryString:`page=${page}&size=${size}`
    });

    const promiseData = firstValueFrom(observable);
    promiseData.then(value => successCallback())
      .catch(error => errorCallBack(error));

    return await promiseData;

  }
  async assignRoleToUser(id: string, roles:string[],successCallBack ?: ()=> void, errorCallBack ?: (error) => void){
    const observable : Observable<any> = this.httpClientService.post({
      controller:"users",
      action:"assign-role-to-user"
    },{
      roles : roles,
      id:id
    });

    const promisedData = observable.subscribe({
      next:successCallBack,
      error: errorCallBack
    });
    
    await promisedData;
  }

  async getRolesToUser(userId: string, successCallBack ?: ()=> void, errorCallBack ?: (error) => void) : Promise<string[]>{
    const observable : Observable<{roles:string[]}> = this.httpClientService.get<{roles:string[]}>({
      controller:"users",
      action:"get-roles-to-user"
    },userId);

    const promisedData = firstValueFrom(observable);
    promisedData.then(value => successCallBack())
    .catch(error => errorCallBack(error));
    
    return (await promisedData).roles;
  }
}
