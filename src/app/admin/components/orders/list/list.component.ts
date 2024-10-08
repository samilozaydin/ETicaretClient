import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent, SpinnerType } from 'src/app/base/base.component';
import { ListProduct } from 'src/app/contracts/listProduct';
import { ListOrder } from 'src/app/contracts/order/list-order';
import { OrderDetailDialogComponent, OrderDetailDialogState } from 'src/app/dialogs/order-detail-dialog/order-detail-dialog.component';
import { SelectProductImageDialogComponent } from 'src/app/dialogs/select-product-image-dialog/select-product-image-dialog.component';
import { AlertifyService, MessageType, Position } from 'src/app/services/admin/alertify.service';
import { DialogService } from 'src/app/services/common/dialog.service';
import { OrderService } from 'src/app/services/common/models/order.service';
import { ProductService } from 'src/app/services/common/models/product.service';
declare var $:any;

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent extends BaseComponent implements OnInit {
  displayedColumns: string[] = ['orderCode', 'userName', 'totalPrice','createdDate','completed','viewDetails','delete'];
  dataSource:MatTableDataSource<ListOrder> = null;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(spinner : NgxSpinnerService, private orderService : OrderService,private alertifyService: AlertifyService,
    private dialogService: DialogService
  ){
    super(spinner)
  }
  
  async getOrders(){
    this.showSpinner(SpinnerType.BallPulseSync);
    const allOrders : {totalOrderCount : number, orders: ListOrder[]} = await this.orderService.getAllOrders(this.paginator ? this.paginator.pageIndex :0,this.paginator ?this.paginator.pageSize:5,() => {this.hideSpinner(SpinnerType.BallPulseSync)},
    (error : any) => {
      this.alertifyService.message(error.message,{
        messageType:MessageType.Error,
        position:Position.BottomRight,
        dismissOthers:false,
      })
      this.hideSpinner(SpinnerType.BallPulseSync)
    });    
    this.dataSource = new MatTableDataSource<ListOrder>(allOrders.orders);
    this.paginator.length= allOrders.totalOrderCount;
  }
  async pageChanged(){

    await this.getOrders();
  }

  async ngOnInit() {
    await this.getOrders();

  }

  delete(id,event){
    alert(id);
    const img= event.srcElement;
    $(img.parentElement.parentElement).fadeOut(1500);
  }
  addProductImages(id : string){
    this.dialogService.openDialog({
      componentType: SelectProductImageDialogComponent,
      data:id,
      options:{
        width:"1200px"
      }
    });
  }
  showDetails(id : string){
    this.dialogService.openDialog({
      componentType:OrderDetailDialogComponent,
      data:id,
      afterClosed:() =>{
        
      },
      options:{
        width: "900px"
      }
    });
  }
}
