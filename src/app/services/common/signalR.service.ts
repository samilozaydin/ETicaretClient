import { Inject, Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {


  constructor(@Inject("baseSignalRUrl") private signalRUrl: string) { }
  
  start(hubURL : string){
    hubURL = this.signalRUrl + hubURL
    const builder : HubConnectionBuilder = new HubConnectionBuilder();
      
    const hubConnection = builder.withUrl(hubURL)
    .withAutomaticReconnect()
    .build();

    hubConnection.start()
    .then(()=>{
      console.log("Connected");
    })
    .catch((error) => setTimeout(() => this.start(hubURL),2000));
    

    hubConnection.onreconnected(() => console.log("Reconnected"));
    hubConnection.onreconnecting(() => console.log("Reconnecting"));
    hubConnection.onclose(() => console.log("Connection is closed"));
    return hubConnection;  
  }
  

  invoke(hubURL:string, procedureName:string,message :any, callback?: () => void, errorCallBack?: (error: any)=>void){
    this.start(hubURL).invoke(procedureName,message)
    .then(callback)
    .catch(errorCallBack);
  }

  on(hubURL:string,procedureName:string,callback: (...message) => void){
    this.start(hubURL).on(procedureName,callback);
  }
}
