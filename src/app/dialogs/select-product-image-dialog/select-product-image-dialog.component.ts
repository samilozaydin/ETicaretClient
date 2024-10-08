import { Component, Inject, OnInit, Output } from '@angular/core';
import { BaseDialog } from '../base/base-dialog';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FileUploadOptions } from 'src/app/services/common/file-upload/file-upload.component';
import { ProductService } from 'src/app/services/common/models/product.service';
import { ListProductImage } from 'src/app/contracts/list-product-image';
import { NgxSpinnerService } from 'ngx-spinner';
import { SpinnerType } from 'src/app/base/base.component';
import { DialogService } from 'src/app/services/common/dialog.service';
import { DeleteDialogComponent, DeleteState } from '../delete-dialog/delete-dialog.component';
import { AlertifyService, MessageType, Position } from 'src/app/services/admin/alertify.service';

declare var $: any;

@Component({
  selector: 'app-select-product-image-dialog',
  templateUrl: './select-product-image-dialog.component.html',
  styleUrls: ['./select-product-image-dialog.component.scss']
})
export class SelectProductImageDialogComponent extends BaseDialog<SelectProductImageDialogComponent> implements OnInit{

    constructor(dialogRef: MatDialogRef<SelectProductImageDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: SelectProductImageState | string,
      private productService: ProductService,
      private spinner: NgxSpinnerService,
      private dialogService: DialogService,
      private alertify: AlertifyService
    ){
      super(dialogRef);
    }

    @Output() options : Partial<FileUploadOptions> = {
      accept:".png, .jpg, .gif",
      action:"upload",
      controller:"products",
      explanation:"Please select your product image",
      isAdminPage:true,
      queryString:`id=${this.data}`
    }

    images: ListProductImage[];

    async ngOnInit() : Promise<void> {
      this.spinner.show(SpinnerType.BallPulseSync);

      this.images = await this.productService.readImages(this.data as string, () =>{
        this.spinner.hide(SpinnerType.BallPulseSync);

      });
      
    }
    deleteImage(imageId: string, event:any){
      this.dialogService.openDialog({
        componentType: DeleteDialogComponent,
        data: DeleteState.Yes,
        afterClosed: async () => {
          this.spinner.show(SpinnerType.BallPulseSync);
          await this.productService.deleteImage(this.data as string, imageId, ()=>{

            this.spinner.hide(SpinnerType.BallPulseSync);
            const card = $(event.target).closest('.product-image-card');
            card.fadeOut(1000);
            
          });
        }
      })

    }

    showCase(imageId :string){
      this.spinner.show(SpinnerType.BallPulseSync);
      this.productService.changeShowCase(imageId,this.data as string,()=>{
        this.spinner.hide(SpinnerType.BallPulseSync);
        
        this.alertify.message("Change is successfull",{
          messageType:MessageType.Success,
          position:Position.BottomRight
        });

      });
    }
  }
export enum SelectProductImageState{
  Close
}
