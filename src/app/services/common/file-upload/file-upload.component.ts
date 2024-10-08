import { Component,Input } from '@angular/core';
import { NgxFileDropEntry } from 'ngx-file-drop';
import { HttpClientService } from '../http-client.service';
import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { AlertifyService, MessageType, Position } from '../../admin/alertify.service';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from '../../ui/custom-toastr.service';
import { DialogService } from '../dialog.service';
import { MatDialog } from '@angular/material/dialog';
import { FileUploadDialogComponent, FileUploadDialogState } from 'src/app/dialogs/file-upload-dialog/file-upload-dialog.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { SpinnerType } from 'src/app/base/base.component';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent {

  constructor(
    private httpClientService: HttpClientService,
    private alertifyService:AlertifyService,
    private toastrService:CustomToastrService,
    private dialog: MatDialog,
    private dialogService: DialogService,
    private spinner : NgxSpinnerService
    ) {}

  public files: NgxFileDropEntry[];
  @Input() options : Partial<FileUploadOptions>;

  public selectedFiles(files: NgxFileDropEntry[]) {
    this.files = files;
    const fileData : FormData = new FormData();
    for(const file of files){
      (file.fileEntry as FileSystemFileEntry).file((_file:File) =>{
        fileData.append(_file.name,_file,file.relativePath)
      })
    }
    this.dialogService.openDialog({
      componentType: FileUploadDialogComponent,
      data: FileUploadDialogState.Yes,
      afterClosed: () =>{
        this.spinner.show(SpinnerType.BallPulseSync);
        this.httpClientService.post({
          controller:this.options.controller,
          action: this.options.action,
          queryString: this.options.queryString,
          headers: new HttpHeaders({"responseType":"blob"})
        },fileData).subscribe({
          next : (data) =>{
            this.spinner.hide(SpinnerType.BallPulseSync);
            const message = "File is uploaded successfully";
            
            if(this.options.isAdminPage){
              this.alertifyService.message(message,{
                messageType:MessageType.Message,
                position : Position.BottomRight,
                dismissOthers: false
              });
            }else{
              this.toastrService.message(message,"Successful",{
                messageType:ToastrMessageType.Success,
                position: ToastrPosition.BottomRight
              })
            }
          },
          error: (error:HttpErrorResponse) =>{
            this.spinner.hide(SpinnerType.BallPulseSync);
            const message = "File is not uploaded successfully";
            
            if(this.options.isAdminPage){
              this.alertifyService.message(message,{
                messageType:MessageType.Error,
                position : Position.BottomRight,
                dismissOthers: false
              });
            }else{
              this.toastrService.message(message,"Unsuccessful",{
                messageType:ToastrMessageType.Error,
                position: ToastrPosition.BottomRight
              })
            }
          }
        })
      }
    })

  } 


}

export class FileUploadOptions{
  controller ?: string;
  action ?: string;
  queryString ?: string;
  explanation ?: string;
  accept ?: string;
  isAdminPage ?: boolean = false;

}