import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent, SpinnerType } from 'src/app/base/base.component';
import { Product } from 'src/app/contracts/product';
import { HttpClientService } from 'src/app/services/common/http-client.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent extends BaseComponent implements OnInit {
  
  constructor(spinner : NgxSpinnerService, private httpClient: HttpClientService) {
    super(spinner);
    
  }
  ngOnInit(): void {
    this.showSpinner(SpinnerType.BallPulseSync);
  
    //this.httpClient.post({controller:"products"},{name:"Kalem",stock:120,price:15}).subscribe();
    //this.httpClient.post({controller:"products"},{name:"Elma",stock:80,price:7.5}).subscribe();
    //this.httpClient.post({controller:"products"},{name:"Silgi",stock:20,price:5}).subscribe();
    //this.httpClient.get({controller:"products"}).subscribe(data => {console.log(data)});
    //this.httpClient.put({controller:"products"},{id:"18820a84-63f0-4306-9341-3810996191af", name:"Teste", stock:175, price:12}).subscribe();
    //this.httpClient.delete({controller:"products"},"18820a84-63f0-4306-9341-3810996191af").subscribe();
    this.httpClient.get<Product[]>({controller:"products"}).subscribe( data => {console.log(data)});
  }
}