import { Component } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent, SpinnerType } from 'src/app/base/base.component';
import { AlertifyService, MessageType, Position } from 'src/app/services/admin/alertify.service';
import { UserAuthService } from 'src/app/services/common/user-auth.service';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss']
})
export class PasswordResetComponent extends BaseComponent {
  
  constructor(ngxSpinnerService : NgxSpinnerService,
    private userAuthService: UserAuthService,
    private alertifyService: AlertifyService
  ) {
    super(ngxSpinnerService);
    
  }

  passwordReset(email:string){
    this.showSpinner(SpinnerType.BallPulseSync)
    this.userAuthService.passwordReset(email, () => {
      this.hideSpinner(SpinnerType.BallPulseSync);  
      this.alertifyService.message("Please check your mail",{
        messageType:MessageType.Success,
        position:Position.BottomRight
      })
    });
  }
}
