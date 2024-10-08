import { EventEmitter, Injectable, Output } from '@angular/core';
import { HttpClientService } from '../http-client.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertifyService } from '../../admin/alertify.service';
import { CreateProduct } from 'src/app/contracts/createProduct';
import { HttpErrorResponse } from '@angular/common/http';
import { ListProduct } from 'src/app/contracts/listProduct';
import { ObserversModule } from '@angular/cdk/observers';
import { firstValueFrom, Observable } from 'rxjs';
import { ListProductImage } from 'src/app/contracts/list-product-image';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private httpClient : HttpClientService) { }
  

  
  create(product: CreateProduct, successCallback?: ()=> void, errorCallBack ?: (errorMessage :string) => void){
    this.httpClient.post<CreateProduct>({controller:"products"},product)
    .subscribe({
      next: result => {
        successCallback();
      },
      error :(error : HttpErrorResponse )=> {
        var _error : Array<{key: string ,value: Array<string>}> = error.error
        var message ="";

        _error.forEach((content,index) => {
          content.value.forEach((value,index) => {
            message +=`${value} <br/>`    
          });
        });
        
        errorCallBack(message);
      }
  });
  }
  async read(page : number = 0, size : number = 5 ,successCallback ?: () => void, errorCallBack ?: (error) => void) : Promise<{totalProductCount : number, products: ListProduct[]}>{

    const observedData = this.httpClient.get<{totalProductCount : number, products: ListProduct[]}>({
      controller:"products",
      queryString:`page=${page}&size=${size}`
    });
    const promisedData = firstValueFrom(observedData)

    promisedData.then(d => successCallback())
    .catch((errorMessage : HttpErrorResponse) => errorCallBack(errorMessage.message))

    
    return await promisedData;
  }

  async delete(id:string){
    const observedData = this.httpClient.delete(
      {controller:"products"},id);

    await firstValueFrom(observedData);
  }

  async readImages(id:string, successCallback ?: () => void): Promise<ListProductImage[]>{
    const observableData : Observable<ListProductImage[]> =this.httpClient.get<ListProductImage[]>({
      action:"getproductimages",
      controller:"products"
    },id);
    const images : ListProductImage[] = await firstValueFrom(observableData);
    successCallback();
    return images;

  }
  async deleteImage(productId: string, imageId: string,successCallback ?: () => void){
    const deleteObservable = this.httpClient.delete({
      action:"deleteImage",
      controller:"products",
      queryString: `imageId=${imageId}`
    },productId)

    await firstValueFrom(deleteObservable);
    successCallback();
  }
  async changeShowCase(imageId: string,productId:string, successCallback ?: ()=> void): Promise<void>{
    const changeShowCaseObservable = this.httpClient.get({
      controller:"products",
      action:"changeShowCaseImage",
      queryString:`imageId=${imageId}&productId=${productId}`
    });

    await firstValueFrom(changeShowCaseObservable);
    successCallback();
  }
}
