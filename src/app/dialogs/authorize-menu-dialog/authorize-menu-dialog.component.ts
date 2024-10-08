import { Component, Inject, OnInit } from '@angular/core';
import { BaseDialog } from '../base/base-dialog';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RoleService } from 'src/app/services/common/models/role.service';
import { ListRole } from 'src/app/contracts/role/list-role';
import { MatSelectionList } from '@angular/material/list';
import { AuthorizationEndpointService } from 'src/app/services/common/models/authorization-endpoint.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { SpinnerType } from 'src/app/base/base.component';

@Component({
  selector: 'app-authorize-menu-dialog',
  templateUrl: './authorize-menu-dialog.component.html',
  styleUrls: ['./authorize-menu-dialog.component.scss']
})
export class AuthorizeMenuDialogComponent extends BaseDialog<AuthorizeMenuDialogComponent> implements OnInit {
  constructor(
    dialogRef: MatDialogRef<AuthorizeMenuDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AuthorizeMenuState| {code:string,name:string,menuName:string},
    private roleService: RoleService,
    private authorizationEndpointsService: AuthorizationEndpointService,
    private spinnerService: NgxSpinnerService
  ) {
    super(dialogRef);
  }
  datas:{ totalRoleCount :number ,roles: ListRole[]};
  assignedRoles: any;
  listRoles: {role:string, selected:boolean}[]

  async ngOnInit(): Promise<void> {
    this.datas = await this.roleService.getRoles(-1,-1);
    this.assignedRoles= await this.authorizationEndpointsService.getRolesToEndpoint(this.data["code"],this.data["menuName"]);

    this.listRoles = this.datas.roles.map((element) => {return {role:element.name,selected: this.assignedRoles["roles"] != null ? this.assignedRoles["roles"].includes(element.name) : false}})
  }

  async assignRoles(rolesList:MatSelectionList){

    const roles :string[]= rolesList.selectedOptions.selected.map(element => element._elementRef.nativeElement.innerText);
    this.spinnerService.show(SpinnerType.BallPulseSync);
    this.authorizationEndpointsService.assignRoleEndpoint(roles,this.data["code"],this.data["menuName"],()=>{
      this.spinnerService.hide(SpinnerType.BallPulseSync);
    },(error)=>{
      this.spinnerService.hide(SpinnerType.BallPulseSync);
    } );

  }
}
export enum AuthorizeMenuState{
  Yes,No
}