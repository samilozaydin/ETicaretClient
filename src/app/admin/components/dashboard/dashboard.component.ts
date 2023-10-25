import { Component, Inject } from '@angular/core';
import { AlertifyService, MessageType, Position } from 'src/app/services/admin/alertify.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  constructor(@Inject(AlertifyService) private alertify: AlertifyService){

  }
  m(){
    this.alertify.message("yakisikli",{
      messageType:MessageType.Success,
      position: Position.BottomCenter,
      delay:3,
      dismissOthers:true} );

  }
  n(){
    this.alertify.dismiss();

  }
}
