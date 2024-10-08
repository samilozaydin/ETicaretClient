import { Component, EventEmitter, Output } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent, SpinnerType } from 'src/app/base/base.component';
import { AlertifyService, MessageType, Position } from 'src/app/services/admin/alertify.service';
import { FileUploadOptions } from 'src/app/services/common/file-upload/file-upload.component';
import { RoleService } from 'src/app/services/common/models/role.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent extends BaseComponent {
  constructor(spinner : NgxSpinnerService, private alertify:AlertifyService, private roleService: RoleService){
    super(spinner);
  }
  
  @Output() createdRole : EventEmitter<string> = new EventEmitter();
  @Output() fileUploadOptions: Partial<FileUploadOptions> ={
    controller:"products",
    action:"upload",
    explanation:"Drag images or select images...",
    isAdminPage:true,
    accept:".png, .jpg, .jpeg"
  };
  
  create(name:HTMLInputElement){
    this.showSpinner(SpinnerType.BallPulseSync);

    this.roleService.create(name.value, ()=>{
      this.hideSpinner(SpinnerType.BallPulseSync);
      this.alertify.message("Role is created successfully",{
        position: Position.BottomRight,
        messageType: MessageType.Success,
        delay: 5000,
        dismissOthers:false
      });
      this.createdRole.emit(name.value);
    },
    (errorMessage) => {
     this.alertify.message(errorMessage,
       {
          dismissOthers : false,
          messageType: MessageType.Error,
          position: Position.BottomRight
      });
    });
  }
}