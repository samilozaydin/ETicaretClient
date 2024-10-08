import { Injectable } from '@angular/core';
import { HttpClientService } from '../http-client.service';
import { firstValueFrom, Observable } from 'rxjs';
import { Menu } from 'src/app/contracts/application-configuration/menu';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {

  constructor(private httpClientService : HttpClientService) { }

  async getAuthorizeDefinitionEndpoints(successCallback ?: ()=> void, errorCallBack ?: (error) =>void){
    const observable : Observable<Menu[]> = this.httpClientService.get<Menu[]>({
      controller:"ApplicationService"
    });

    const promisedData = firstValueFrom(observable);
    promisedData.then(successCallback)
    .catch(errorCallBack);

    return await promisedData;

  }
}
