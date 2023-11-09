import { Directive, ElementRef, EventEmitter, HostListener, Input, Output, Renderer2 } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { SpinnerType } from 'src/app/base/base.component';
import { DeleteDialogComponent, DeleteState } from 'src/app/dialogs/delete-dialog/delete-dialog.component';
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
    public dialog: MatDialog
  ) {
    const img =_renderer.createElement("img");
    img.setAttribute("src","../../../../../assets/delete.png");
    img.setAttribute("style","cursor:pointer;");
    img.width = 25;
    img.height = 25;
    _renderer.appendChild(element.nativeElement,img);
   }

   @Output() callback: EventEmitter<any> = new EventEmitter();
   @Input() id : string
   @HostListener("click")
   async onClick(){
    this.openDialog(async ()=>{
      this.spinnerService.show(SpinnerType.BallPulseSync);
      const td : HTMLTableCellElement = this.element.nativeElement;
      await this.productService.delete(this.id);
      $(td.parentElement).animate({
        opacity:0,
        left: "+50",
        height:"toogle"
      },1000,()=>{
        this.callback.emit();
      })
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
