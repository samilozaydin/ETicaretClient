import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent, SpinnerType } from 'src/app/base/base.component';
import { TokenResponse } from 'src/app/contracts/token/tokenResponse';
import { AuthService } from 'src/app/services/common/auth.service';
import { HttpClientService } from 'src/app/services/common/http-client.service';
import { UserService } from 'src/app/services/common/models/user.service';
import { UserAuthService } from 'src/app/services/common/user-auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent extends BaseComponent {

    constructor(
      private userAuthService : UserAuthService,
      spinner: NgxSpinnerService,
      private authService : AuthService,
      private activatedRoute: ActivatedRoute,
      private router: Router,
      private socialAuthService: SocialAuthService,
    ){
      super(spinner);
      this.socialAuthService.authState.subscribe(async (user : SocialUser) =>{
        console.log(user);
        this.showSpinner(SpinnerType.BallPulseSync);
        await this.userAuthService.googleLogin(user, () => {
          this.hideSpinner(SpinnerType.BallPulseSync)
          this.authService.identityChech();
        });
      })
    }
    async login(usernameOrEmail : string,passwords:string){
      this.showSpinner(SpinnerType.BallPulseSync);
      await this.userAuthService.login(usernameOrEmail,passwords, () =>{
        this.authService.identityChech();
        this.activatedRoute.queryParams.subscribe(
          params =>{
            const returnUrl: string = params["returnUrl"];
            if (returnUrl)
              this.router.navigate([returnUrl])
          }
        )
        this.hideSpinner(SpinnerType.BallPulseSync);
      });

    }
}
