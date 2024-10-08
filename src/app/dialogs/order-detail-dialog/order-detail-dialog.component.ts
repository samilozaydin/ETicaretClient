import { Component, Inject, OnInit } from '@angular/core';
import { BaseDialog } from '../base/base-dialog';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { OrderService } from 'src/app/services/common/models/order.service';
import { SingleOrder } from 'src/app/contracts/order/single-order';
import { DialogService } from 'src/app/services/common/dialog.service';
import { CompleteOrderDialogComponent, OrderCompleteState } from '../complete-order-dialog/complete-order-dialog.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { SpinnerType } from 'src/app/base/base.component';
import { AlertifyService, MessageType, Position } from 'src/app/services/admin/alertify.service';

@Component({
  selector: 'app-order-detail-dialog',
  templateUrl: './order-detail-dialog.component.html',
  styleUrls: ['./order-detail-dialog.component.scss']
})
export class OrderDetailDialogComponent extends BaseDialog<OrderDetailDialogComponent> implements OnInit {
  
  singleOrder : SingleOrder;
  dataSource : any[];
  totalPrice: number;
  constructor(dialogRef: MatDialogRef<OrderDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: OrderDetailDialogState | string,
    private orderService:OrderService,
    private dialogService: DialogService,
    private ngxSpinnerService: NgxSpinnerService,
    private alertifyService : AlertifyService
  ) {
    super(dialogRef);
  }

  async ngOnInit(): Promise<void> {

    this.singleOrder =  await this.orderService.getOrderById(this.data as string);
    this.dataSource = this.singleOrder.basketItems;
    this.totalPrice = this.singleOrder.basketItems.map((basketItem,idx) => basketItem.quantity * basketItem.price)
      .reduce((price,current) => price+current,0);
  }

  completeOrder(){
    this.dialogService.openDialog({
      componentType: CompleteOrderDialogComponent,
      data: OrderCompleteState.Yes,
      afterClosed: async () => {
        this.ngxSpinnerService.show(SpinnerType.BallPulseSync);
        await this.orderService.completeOrder(this.data as string,
          () => {
          this.alertifyService.message("Order is successfully completed",{
            messageType:MessageType.Success,
            position:Position.BottomRight
          });
        },
          (error)=>{

            this.alertifyService.message("Order is not completed",{
              messageType:MessageType.Warning,
              position:Position.BottomRight
            });
        });
        this.ngxSpinnerService.hide(SpinnerType.BallPulseSync);
        
      }
    });
    
  }

  displayedColumns: string[] = ['name','price','quantity','totalPrice'];
  clickedRows = new Set<any>();

}

export enum OrderDetailDialogState{
  Cancel,OrderCompleted
}

