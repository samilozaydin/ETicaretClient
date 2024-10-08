import { ComponentFactoryResolver, Injectable, ViewContainerRef } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DynamicLoadComponentService {

  constructor() { }

  async loadComponent(component:Component, viewContainerView: ViewContainerRef){
    let _component : any = null;
    
    switch(component){
      case Component.BasketsComponent:
        _component = (await import("../../ui/components/baskets/baskets.component")).BasketsComponent;
        break;
      default:
        
        break;
    }

    viewContainerView.clear();
    viewContainerView.createComponent(_component);

  }
}

export enum Component{
  BasketsComponent
}
