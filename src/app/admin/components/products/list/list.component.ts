import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent, SpinnerType } from 'src/app/base/base.component';
import { ListProduct } from 'src/app/contracts/listProduct';
import { SelectProductImageDialogComponent } from 'src/app/dialogs/select-product-image-dialog/select-product-image-dialog.component';
import { AlertifyService, MessageType, Position } from 'src/app/services/admin/alertify.service';
import { DialogService } from 'src/app/services/common/dialog.service';
import { ProductService } from 'src/app/services/common/models/product.service';

declare var $: any;

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent extends BaseComponent implements OnInit{
  displayedColumns: string[] = ['name', 'stock', 'price','createdDate','updateDate',"photos",'edit','delete'];
  dataSource:MatTableDataSource<ListProduct> = null;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(spinner : NgxSpinnerService, private productService : ProductService,private alertifyService: AlertifyService,
    private dialogService: DialogService
  ){
    super(spinner)
  }
  
  async getProducts(){
    this.showSpinner(SpinnerType.BallPulseSync);
    const allProducts : {totalProductCount : number, products: ListProduct[]} = await this.productService.read(this.paginator ? this.paginator.pageIndex :0,this.paginator ?this.paginator.pageSize:5,() => {this.hideSpinner(SpinnerType.BallPulseSync)},
    
    (error) => {
      this.alertifyService.message(error,{
        messageType:MessageType.Error,
        position:Position.BottomRight,
        dismissOthers:false,
      })
      this.hideSpinner(SpinnerType.BallPulseSync)
    });
    this.dataSource = new MatTableDataSource<ListProduct>(allProducts.products);
    this.paginator.length= allProducts.totalProductCount;
  }
  async pageChanged(){

    await this.getProducts();
  }

  async ngOnInit() {
    await this.getProducts();

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
  

}
