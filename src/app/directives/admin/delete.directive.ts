import { Directive, ElementRef, EventEmitter, HostListener, Input, Output, Renderer2 } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { SpinnerType } from 'src/app/base/base.component';
import { DeleteDialogComponent, DeleteState } from 'src/app/dialogs/delete-dialog/delete-dialog.component';
import { AlertifyService, MessageType, Position } from 'src/app/services/admin/alertify.service';
import { HttpClientService } from 'src/app/services/common/http-client.service';
import { ProductService } from 'src/app/services/common/models/product.service';

declare var $:any;

@Directive({
  selector: '[appDelete]'
})
export class DeleteDirective {

  constructor(
    private element: ElementRef,
    private _renderer : Renderer2,
    private httpClientService: HttpClientService,
    private spinnerService: NgxSpinnerService,
    public dialog: MatDialog,
    private alertifyService: AlertifyService
  ) {
    const img =_renderer.createElement("img");
    img.setAttribute("src","../../../../../assets/delete.png");
    img.setAttribute("style","cursor:pointer;");
    img.width = 25;
    img.height = 25;
    _renderer.appendChild(element.nativeElement,img);
   }

   @Output() callback: EventEmitter<any> = new EventEmitter();
   @Input() id : string;
   @Input() controller : string;
   @HostListener("click")
   async onClick(){
    this.openDialog(async ()=>{
      this.spinnerService.show(SpinnerType.BallPulseSync);
      const td : HTMLTableCellElement = this.element.nativeElement;
      this.httpClientService.delete({controller: this.controller},this.id)
        .subscribe(data => {
          $(td.parentElement).animate({
            opacity:0,
            left: "+50",
            height:"toogle"
          },1000,()=>{
            this.callback.emit();
            this.alertifyService.message("Deletion is successfull",{
                messageType:MessageType.Success,
                position:Position.BottomRight,
                dismissOthers:false
              });
          })
        }, (error) =>{
          this.alertifyService.message("Deletion is not successful. An error is occured",{
            messageType:MessageType.Error,
            position:Position.BottomRight,
            dismissOthers:false
          });
          this.spinnerService.hide(SpinnerType.BallPulseSync);
        });

    });

   }

   openDialog(afterClosed: any): void {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: DeleteState.Yes,
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result == DeleteState.Yes)
        afterClosed();
    });
  }

}
