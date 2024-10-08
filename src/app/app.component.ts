import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from './services/ui/custom-toastr.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from './services/common/auth.service';
import { Router } from '@angular/router';
import { DynamicLoadComponentService, Component as ComponentName } from './services/common/dynamic-load-component.service';
import { DynamicLoadComponentDirective } from './directives/common/dynamic-load-component.directive';
declare var $:any


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {

  @ViewChild(DynamicLoadComponentDirective,{static:true})
  dynamicLoadComponentDirective: DynamicLoadComponentDirective

  constructor(private toastr: CustomToastrService,public authService : AuthService,private router : Router
    ,private dynamicLoadComponentService: DynamicLoadComponentService
  ) {
    authService.identityChech();
  }
  logOut(){
    localStorage.removeItem("accessToken");
    this.authService.identityChech();
    this.router.navigate([""]);
    this.toastr.message("You are currently logged-out","Log-out",{messageType: ToastrMessageType.Info,position:ToastrPosition.BottomRight})
  }
  loadComponent(){
    this.dynamicLoadComponentService.loadComponent(ComponentName.BasketsComponent,this.dynamicLoadComponentDirective.viewContainerRef);
  }
}