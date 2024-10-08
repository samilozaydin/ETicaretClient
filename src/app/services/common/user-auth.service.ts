import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { firstValueFrom } from 'rxjs';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from '../ui/custom-toastr.service';
import { TokenResponse } from 'src/app/contracts/token/tokenResponse';
import { SocialUser } from '@abacritt/angularx-social-login';
import { HttpClientService } from './http-client.service';
import { Token } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class UserAuthService {

  constructor(private httpClientService: HttpClientService,
    private toastrService : CustomToastrService
  ) { }

  async login(UsernameOrEmail: string, Password:string, callback? : () => void) : Promise<any>{
    const observable: Observable<any | TokenResponse> = this.httpClientService.post<any | TokenResponse>({
      controller:"Auth",
      action:"Login"
    },{UsernameOrEmail, Password});
    
    const tokenResponse:TokenResponse = await firstValueFrom(observable) as TokenResponse;
    if(tokenResponse){
      localStorage.setItem("accessToken", tokenResponse.token.accessToken);
      localStorage.setItem("refreshToken", tokenResponse.token.refreshToken);

      this.toastrService.message("User is logged in","Login Successful",{
        messageType: ToastrMessageType.Success,
        position:ToastrPosition.BottomRight
      });
    }
    callback();

  }
  async googleLogin(user : SocialUser, callBackFunction?: () => void ){
    const observable : Observable<SocialUser | TokenResponse>= await this.httpClientService.post<SocialUser | TokenResponse>({
      action:"google-login",
      controller:"auth"
    },user);

    const tokenResponse :TokenResponse = await firstValueFrom(observable) as TokenResponse;
    if(tokenResponse){
      localStorage.setItem("accessToken",tokenResponse.token.accessToken);
      localStorage.setItem("refreshToken", tokenResponse.token.refreshToken);

      this.toastrService.message("Google Login is successful","Login Successful",{
        messageType: ToastrMessageType.Success,
        position:ToastrPosition.BottomRight
      });
    }

    callBackFunction();

  }
  async refreshTokenLogin(refreshToken:string, callBackFunction ?: (state) => void): Promise<any>{
    const observable : Observable<any | TokenResponse> = this.httpClientService.post({
      action:"RefreshTokenLogin",
      controller:"Auth"
    },{refreshToken : refreshToken});
    
    try{
    const tokenResponse :TokenResponse = await firstValueFrom(observable) as TokenResponse;
    if(tokenResponse){
      localStorage.setItem("accessToken",tokenResponse.token.accessToken);
      localStorage.setItem("refreshToken", tokenResponse.token.refreshToken);
    }
    callBackFunction(refreshToken ? true : false);

    }catch{
      callBackFunction(false);

    }
  }

  async passwordReset(email : string,callBackFunction ?: () => void){
    const observable : Observable<any | TokenResponse> = this.httpClientService.post({
      action:"password-reset",
      controller:"Auth"
    },{email : email});
    
    await firstValueFrom(observable);
    callBackFunction();
  }
  
  async  verifyResetToken(resetToken : string,userId : string, callBackFunction ?: () => void){
    const observable : Observable<any> = this.httpClientService.post({
      action:"verify-reset-token",
      controller:"Auth"
    },{
      resetToken : resetToken,
      userId : userId
    });

    const state :boolean =  await firstValueFrom(observable);
    callBackFunction();
    return state;
  }
}
