import { Directive, ElementRef, EventEmitter, HostListener, Input, Output, Renderer2 } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { SpinnerType } from 'src/app/base/base.component';
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
    private productService: ProductService,
    private spinnerService: NgxSpinnerService
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
   onClick(){
    this.spinnerService.show(SpinnerType.BallPulseSync);
    const td : HTMLTableCellElement = this.element.nativeElement;
    this.productService.delete(this.id);
    $(td.parentElement).fadeOut(1500,() =>{
      this.callback.emit();
    }); 
   }
}
