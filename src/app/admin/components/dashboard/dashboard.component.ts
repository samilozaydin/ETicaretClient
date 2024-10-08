import { Component, Inject, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent, SpinnerType } from 'src/app/base/base.component';
import { HubUrls } from 'src/app/constans/hub-urls';
import { ReceiveFunctions } from 'src/app/constans/receive-functions';
import { AlertifyService, MessageType, Position } from 'src/app/services/admin/alertify.service';
import { SignalRService } from 'src/app/services/common/signalR.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent extends BaseComponent implements OnInit {
  constructor(@Inject(AlertifyService) private alertify: AlertifyService, spinner : NgxSpinnerService,private signalRService: SignalRService){
    super(spinner);
    

  }
  ngOnInit(): void {
    //this.showSpinner(SpinnerType.BallPulseSync);
    this.signalRService.on(HubUrls.ProductHub,ReceiveFunctions.ProductAddedMessageReceiveFuction, message => {

      this.alertify.message(message,{
        messageType:MessageType.Nofify,
        position:Position.BottomRight
      })
    });
    this.signalRService.on(HubUrls.OrderHub,ReceiveFunctions.OrderAddedMessageReceiveFuction, message => {

      this.alertify.message(message,{
        messageType:MessageType.Nofify,
        position:Position.BottomRight
      })
    });
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
