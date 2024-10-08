import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from '../ui/custom-toastr.service';
import { UserAuthService } from './user-auth.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { SpinnerType } from 'src/app/base/base.component';

@Injectable({
  providedIn: 'root'
})
export class HttpErrorHandlerInterceptorService implements HttpInterceptor {

  constructor(private toastrService:CustomToastrService,
    private userAuthService: UserAuthService,
    private router: Router,
    private spinnerService : NgxSpinnerService
  ) { }
  
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(req).pipe(catchError( (error) => {
      
      switch(error.status){
        case HttpStatusCode.Unauthorized:
          
          const refreshToken : string = localStorage.getItem("refreshToken");
          
          this.userAuthService.refreshTokenLogin(refreshToken, (state) =>{
              if (!state){
                const url = this.router.url;
  
                if(url == "/products"){
                  this.toastrService.message("To add a product to basket, you have to login to your account","Unauthorized Attempt",
                    {
                      messageType: ToastrMessageType.Warning,
                      position:ToastrPosition.BottomRight
                    });
                }else{
                  this.toastrService.message("Unauthorized attempt is detected. You cannot enter this page","Unauthorized Attempt",
                    {
                      messageType: ToastrMessageType.Warning,
                      position:ToastrPosition.BottomRight
                    });
                }
            }
          }).then(data =>{});
         // console.log("refreshtoken işlemi deneme2");

        break;
        case HttpStatusCode.InternalServerError:
          this.toastrService.message("Server encounter an error","An error is occured",
            {
              messageType: ToastrMessageType.Warning,
              position:ToastrPosition.BottomRight
            });
        break;
        case HttpStatusCode.BadRequest:
          this.toastrService.message("Request has a problem.","Bad Request",
            {
              messageType: ToastrMessageType.Warning,
              position:ToastrPosition.BottomRight
            });
        break;
        case HttpStatusCode.NotFound:
          this.toastrService.message("Requested data cannot be found","Not Found",
            {
              messageType: ToastrMessageType.Warning,
              position:ToastrPosition.BottomRight
            });
        break;
        default:
          this.toastrService.message("Unexcepted error is occured","Unexcepted Error",
            {
              messageType: ToastrMessageType.Warning,
              position:ToastrPosition.BottomRight
            });
          break;
      }

      this.spinnerService.hide(SpinnerType.BallPulseSync);
      return of(error);
    }));

  }

}
