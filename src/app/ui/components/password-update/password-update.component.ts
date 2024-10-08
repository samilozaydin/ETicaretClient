import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent, SpinnerType } from 'src/app/base/base.component';
import { AlertifyService, MessageType, Position } from 'src/app/services/admin/alertify.service';
import { UserService } from 'src/app/services/common/models/user.service';
import { UserAuthService } from 'src/app/services/common/user-auth.service';

@Component({
  selector: 'app-password-update',
  templateUrl: './password-update.component.html',
  styleUrls: ['./password-update.component.scss']
})
export class PasswordUpdateComponent extends BaseComponent implements OnInit{

  state : any;

  constructor(spinner: NgxSpinnerService,
    private userAuthService : UserAuthService,
    private activatedRoute: ActivatedRoute,
    private alertifyService : AlertifyService,
    private userService: UserService,
    private router:Router
  ){
    super(spinner);
    
  }

   ngOnInit(): void {
    
    this.showSpinner(SpinnerType.BallPulseSync);
    this.activatedRoute.params.subscribe({
      next: async params => {
        const userId = params["userId"];
        const resetToken = params["resetToken"];
        this.state=  await this.userAuthService.verifyResetToken(resetToken,userId, ()=>{
          this.hideSpinner(SpinnerType.BallPulseSync);
        });
        
      }
    });
  }

  updatePassword(password :string,passwordConfirm :string){
    this.showSpinner(SpinnerType.BallPulseSync);
    
    if(password != passwordConfirm){
      this.alertifyService.message("Please verify your password",{
        messageType:MessageType.Warning,
        position:Position.BottomRight
      })
      this.hideSpinner(SpinnerType.BallPulseSync);
      return;
    }

      this.activatedRoute.params.subscribe({
        next: async params => {
          const userId = params["userId"];
          const resetToken = params["resetToken"];
          this.state =  await this.userService.updatePassword(userId,resetToken,password,passwordConfirm, ()=>{
            this.alertifyService.message("Password is successfully changed",{
              messageType:MessageType.Success,
              position:Position.BottomRight
            })
            this.router.navigate(["/login"]);
          },
        (error)=>{
          this.alertifyService.message(error,{
            messageType:MessageType.Warning,
            position:Position.BottomRight
          });
        });
        this.hideSpinner(SpinnerType.BallPulseSync);

        }
      });
    
  }
}
