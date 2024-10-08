import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, PRIMARY_OUTLET } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent, SpinnerType } from 'src/app/base/base.component';
import { CreateBasketItem } from 'src/app/contracts/basket/create-basket-item';
import { ListProductImage } from 'src/app/contracts/list-product-image';
import { ListProduct } from 'src/app/contracts/listProduct';
import { StorageBaseUrl } from 'src/app/contracts/storageBaseUrl';
import { BasketService } from 'src/app/services/common/models/basket.service';
import { FileService } from 'src/app/services/common/models/file.service';
import { ProductService } from 'src/app/services/common/models/product.service';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from 'src/app/services/ui/custom-toastr.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent extends BaseComponent implements OnInit {

  constructor(private productService : ProductService,private activatedRoute: ActivatedRoute,private fileService: FileService,
    private basketService: BasketService, spinner: NgxSpinnerService, private toastrService: CustomToastrService
  ) {
    super(spinner);
  }
  products: any[];;
  newpr : ListProduct[];
  currentPageNo : number;
  totalProductCount : number;
  totalPageCount: number;
  pageSize : number = 12;
  pageList :number[] = [];
  storageBaseUrl: StorageBaseUrl;
  async ngOnInit() {
    this.storageBaseUrl = await this.fileService.getBaseStorageUrl();

    this.activatedRoute.params.subscribe(async (params) => {
      this.currentPageNo = parseInt(params["pageNo"] ?? 1);
      
      const data :{totalProductCount:number, products:ListProduct[]} = await this.productService.read(this.currentPageNo - 1,this.pageSize,
        () =>{

        },
        (error) =>{
          console.log(error);
          
        }
      );
      this.products =  data.products;

      this.products = this.products.map<ListProduct>((p: ListProduct) => {
        
        const listProduct: ListProduct = {
          id: p.id,
          createdDate: p.createdDate,
          imagePath: p.productImageFiles.length ? p.productImageFiles.find(pif => pif.showCase)?.path : "",
          name: p.name,
          price: p.price,
          stock: p.stock,
          updatedDate: p.updatedDate,
          productImageFiles: p.productImageFiles
        };

        return listProduct;
      });
      

      this.totalProductCount = data.totalProductCount;
      this.totalPageCount = Math.ceil(this.totalProductCount/ this.pageSize);
      this.pageList = [];
      
      if(this.currentPageNo -3 <=0){
        let result = this.totalPageCount < 7 ? this.totalPageCount : 7;
        for(let i = 1; i <= result; i++)
          this.pageList.push(i);
      }
      else if(this.currentPageNo +3 >= this.totalPageCount)
        for(let i = this.totalPageCount - 6; i <= this.totalPageCount; i++){
          this.pageList.push(i);
          }
      else
        for(let i = this.currentPageNo -3; i <= this.currentPageNo + 3; i++)
          this.pageList.push(i);
    });
    
  }
  async addToBasket(product: ListProduct){
    this.showSpinner(SpinnerType.BallPulseSync)

    let basketItem : CreateBasketItem = new CreateBasketItem();
    basketItem.productId = product.id;
    basketItem.quantity = 1;

    await this.basketService.add(basketItem);
    this.hideSpinner(SpinnerType.BallPulseSync);
    this.toastrService.message("Product is added into basket","Basket",{
      messageType:ToastrMessageType.Success,
      position:ToastrPosition.BottomRight
    });
  }
  
}
