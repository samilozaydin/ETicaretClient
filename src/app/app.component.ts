import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from './services/ui/custom-toastr.service';
declare var $:any


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ETicaretClient';

  constructor(private toastr: CustomToastrService) {
    this.toastr.message('Hello world!', 'Toastr fun!',{
      messageType:ToastrMessageType.Error,
      position:ToastrPosition.BottomLeft});
    this.toastr.message('Hello world!', 'Toastr fun!',{
      messageType:ToastrMessageType.Success,
      position:ToastrPosition.TopLeft});
    this.toastr.message('Hello world!', 'Toastr fun!',{
      messageType:ToastrMessageType.Info,
      position:ToastrPosition.TopRight});
    this.toastr.message('Hello world!', 'Toastr fun!',{
      messageType:ToastrMessageType.Warning,
      position:ToastrPosition.BottomRight});
    

  }

}

