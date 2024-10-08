import { Injectable } from '@angular/core';
import { HttpClientService } from '../http-client.service';
import { CreateOrder } from 'src/app/contracts/order/create-order';
import { firstValueFrom, Observable } from 'rxjs';
import { ListOrder } from 'src/app/contracts/order/list-order';
import { SingleOrder } from 'src/app/contracts/order/single-order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private httpClientService :HttpClientService) { }

  async create(order: CreateOrder) : Promise<void>{
    const observable :Observable<any>= await this.httpClientService.post({
      controller:"orders"
    },order);

    await firstValueFrom(observable);

  }
  async getAllOrders (page : number = 0, size : number = 5,successCallback ?: () => void, errorCallBack ?: (error) => void ) : Promise<{totalOrderCount : number, orders: ListOrder[]}>{
    const observable :Observable<{totalOrderCount : number, orders: ListOrder[]}>= await this.httpClientService.get<{totalOrderCount : number, orders: ListOrder[]}>({
      controller:"orders",
      queryString:`page=${page}&size=${size}`
    });

    const promiseData = firstValueFrom(observable);
    promiseData.then(value => successCallback())
      .catch(error => errorCallBack(error));

    return await promiseData;

  }
  async getOrderById (id: string,successCallback ?: () => void, errorCallBack ?: (error) => void ) : Promise<SingleOrder>{

   const observable : Observable<SingleOrder>= this.httpClientService.get<SingleOrder>({
      controller:"orders",
    },id);
    
    const promisedData = firstValueFrom(observable);
    promisedData.then(()=> successCallback())
    .catch(error => errorCallBack(error));

    return await promisedData;
  }
  async completeOrder(id: string,successCallback ?: () => void, errorCallBack ?: (error) => void ):Promise<void>{

    const observable : Observable<any> = this.httpClientService.get({
      controller:"orders",
      action:"complete-order",
    },id);
    
    const promisedData = firstValueFrom(observable);
    promisedData.then(()=> successCallback())
    .catch(error => errorCallBack(error));

  } 
}
