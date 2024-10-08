import { Injectable } from '@angular/core';
import { HttpClientService } from '../http-client.service';
import { firstValueFrom, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor(private httpClientService: HttpClientService) { }

  async getRoles(page:number, size:number,successCallBack ?: () => void, errorCallBack ?: (error)=> void){
    const observable : Observable<any> = this.httpClientService.get({
      controller:"role",
      queryString:`page=${page}&size=${size}`
    });

    const promisedData = firstValueFrom(observable);
    promisedData.then(successCallBack)
    .catch(errorCallBack);

    return await promisedData 
  }
  
  async create(name: string, successCallBack ?: () => void, errorCallBack ?: (error)=> void): Promise<{succeded :boolean}>{
    const observable : Observable<any> = this.httpClientService.post({
      controller:"role",
    },{name:name});

    const promisedData = firstValueFrom(observable);
    promisedData.then(successCallBack)
    .catch(errorCallBack);

    return await promisedData as {succeded :boolean};
  }
}
