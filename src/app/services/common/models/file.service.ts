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
import { StorageBaseUrl } from 'src/app/contracts/storageBaseUrl';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private httpClient : HttpClientService) { }
  
  async getBaseStorageUrl() : Promise<StorageBaseUrl>{
    const observable : Observable<StorageBaseUrl> = this.httpClient.get<StorageBaseUrl>({
        controller:"Files",
        action:"GetBaseStorageUrl"
    });

    const data : StorageBaseUrl = await firstValueFrom(observable);
    
    return await firstValueFrom(observable);
  }

}
