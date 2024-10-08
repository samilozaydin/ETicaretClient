import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent, SpinnerType } from 'src/app/base/base.component';
import { ListBasketItem } from 'src/app/contracts/basket/list-basket-item';
import { UpdateBasketItem } from 'src/app/contracts/basket/update-basket-item';
import { CreateOrder } from 'src/app/contracts/order/create-order';
import { BasketItemDeleteState, BasketItemRemoveDialogComponent } from 'src/app/dialogs/basket-item-remove-dialog/basket-item-remove-dialog.component';
import { ShoppingCompleteDialogComponent, ShoppingCompleteState } from 'src/app/dialogs/shopping-complete-dialog/shopping-complete-dialog.component';
import { DialogService } from 'src/app/services/common/dialog.service';
import { BasketService } from 'src/app/services/common/models/basket.service';
import { OrderService } from 'src/app/services/common/models/order.service';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from 'src/app/services/ui/custom-toastr.service';
declare var $ :any;

@Component({
  selector: 'app-baskets',
  templateUrl: './baskets.component.html',
  styleUrls: ['./baskets.component.scss']
})


export class BasketsComponent extends BaseComponent implements OnInit {
  
  basketItems: ListBasketItem[];
  constructor(spinner : NgxSpinnerService,
    private basketService: BasketService,
    private orderService: OrderService,
    private toastrService: CustomToastrService,
    private router: Router,
    private dialogService: DialogService
  ) {
    super(spinner);
    
  }

  async ngOnInit(): Promise<void> {
    //this.showSpinner(SpinnerType.BallPulseSync);
    this.showSpinner(SpinnerType.BallPulseSync);
    this.basketItems = await this.basketService.get();
    this.hideSpinner(SpinnerType.BallPulseSync);
  }
  async changeQuantity(event :any){
    this.showSpinner(SpinnerType.BallPulseSync);
    const basketItemId : string = event.target.attributes["id"].value;
    const quantity :number = event.target.value;

    const updateBasketItem : UpdateBasketItem = new UpdateBasketItem();
    updateBasketItem.basketItemId = basketItemId;
    updateBasketItem.quantity = quantity;
    console.log(updateBasketItem);
    
    await this.basketService.updateBasketItemQuantity(updateBasketItem);
    this.hideSpinner(SpinnerType.BallPulseSync);

  }
  async deleteBasketItem(basketItemId: string){
    $("#basketModal").modal("hide");
    this.dialogService.openDialog({
      componentType: BasketItemRemoveDialogComponent,
      data: BasketItemDeleteState.Yes,
      afterClosed: async () =>{
        this.showSpinner(SpinnerType.BallPulseSync);

        await this.basketService.remove(basketItemId);
        $("#"+basketItemId).fadeOut(750, () =>this.hideSpinner(SpinnerType.BallPulseSync));

      }
    });

  }
  async makeOrder(){
    $("#basketModal").modal("hide");

    this.dialogService.openDialog({
      componentType:ShoppingCompleteDialogComponent,
      afterClosed: async() =>{
        this.showSpinner(SpinnerType.BallPulseSync);

        const order: CreateOrder = new CreateOrder();
        order.address ="Trial";
        order.description ="Order Description";
        await this.orderService.create(order);
    
        this.toastrService.message("Order is send","Order Successfully Send",{
          messageType:ToastrMessageType.Success,
          position:ToastrPosition.BottomRight
        });
        this.hideSpinner(SpinnerType.BallPulseSync);
        this.router.navigate(["/"]);

      },
      data:ShoppingCompleteState.Yes
    });

  }
}