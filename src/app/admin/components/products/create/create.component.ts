import { Component, EventEmitter, Output } from '@angular/core';
import { NgxSpinner, NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent, SpinnerType } from 'src/app/base/base.component';
import { CreateProduct } from 'src/app/contracts/createProduct';
import { AlertifyOptions, AlertifyService, MessageType, Position } from 'src/app/services/admin/alertify.service';
import { FileUploadOptions } from 'src/app/services/common/file-upload/file-upload.component';
import { ProductService } from 'src/app/services/common/models/product.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent extends BaseComponent {
  constructor(private productService: ProductService, spinner : NgxSpinnerService, private alertify:AlertifyService){
    super(spinner);
  }
  
  @Output() createdProduct : EventEmitter<CreateProduct> = new EventEmitter();
  @Output() fileUploadOptions: Partial<FileUploadOptions> ={
    controller:"products",
    action:"upload",
    explanation:"Drag images or select images...",
    isAdminPage:true,
    accept:".png, .jpg, .jpeg"
  };
  
  create(name:HTMLInputElement,stock:HTMLInputElement,price:HTMLInputElement){
    this.showSpinner(SpinnerType.BallPulseSync);
    const createProduct: CreateProduct = new CreateProduct();
    createProduct.name= name.value;
    createProduct.price= parseFloat(price.value);
    createProduct.stock = parseInt(stock.value);

    this.productService.create(createProduct, ()=>{
      this.hideSpinner(SpinnerType.BallPulseSync);
      this.alertify.message("Product is created successfully",{
        position: Position.BottomRight,
        messageType: MessageType.Success,
        delay: 5000,
        dismissOthers:false
      });
      this.createdProduct.emit(createProduct);
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
