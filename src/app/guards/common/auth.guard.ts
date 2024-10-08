import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { NgxSpinnerService } from 'ngx-spinner';
import { SpinnerType } from 'src/app/base/base.component';
import { _isAuthenticated, AuthService } from 'src/app/services/common/auth.service';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from 'src/app/services/ui/custom-toastr.service';

export const authGuard: CanActivateFn = (route, state) => {
  const spinnerService = inject(NgxSpinnerService);
  spinnerService.show(SpinnerType.BallPulseSync);
  
  const token : string = localStorage.getItem("accessToken");
  const jwtHelperService = inject(JwtHelperService);
  const router = inject(Router);
  const toastrService = inject(CustomToastrService);
  const authService = inject(AuthService);

  /*let expired : boolean;

  try{
    expired = jwtHelperService.isTokenExpired(token);
  } catch{
    expired = true;
  } */

  if(!_isAuthenticated){
    router.navigate(["login"], {queryParams: {returnUrl: state.url}});
    toastrService.message("You must log-in to your account","Unauthorized Access"
      ,{messageType: ToastrMessageType.Info, position:ToastrPosition.BottomRight})
  }
  spinnerService.hide(SpinnerType.BallPulseSync);

  return true;
};
