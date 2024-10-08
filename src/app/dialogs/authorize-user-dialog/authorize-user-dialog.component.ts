import { Component, Inject, OnInit } from '@angular/core';
import { BaseDialog } from '../base/base-dialog';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSelectionList } from '@angular/material/list';
import { SpinnerType } from 'src/app/base/base.component';
import { RoleService } from 'src/app/services/common/models/role.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthorizationEndpointService } from 'src/app/services/common/models/authorization-endpoint.service';
import { ListRole } from 'src/app/contracts/role/list-role';
import { UserService } from 'src/app/services/common/models/user.service';
import { AlertifyService } from 'src/app/services/admin/alertify.service';

@Component({
  selector: 'app-authorize-user-dialog',
  templateUrl: './authorize-user-dialog.component.html',
  styleUrls: ['./authorize-user-dialog.component.scss']
})
export class AuthorizeUserDialogComponent extends BaseDialog<AuthorizeUserDialogComponent> implements OnInit {
  constructor(
    dialogRef: MatDialogRef<AuthorizeUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AuthorizeMenuState| {id:string},
    private roleService: RoleService,
    private spinnerService: NgxSpinnerService,
    private userService: UserService,
    private alertifyService:AlertifyService
  ) {
    super(dialogRef);
  }
  datas:{ totalRoleCount :number ,roles: ListRole[]};
  assignedRoles: any;
  listRoles: {role:string, selected:boolean}[]

  async ngOnInit(): Promise<void> {
    this.datas = await this.roleService.getRoles(-1,-1);

    this.spinnerService.show(SpinnerType.BallPulseSync);
    this.assignedRoles= await this.userService.getRolesToUser(this.data["id"],()=>{
      this.spinnerService.hide(SpinnerType.BallPulseSync);
    },(error)=>{
      this.spinnerService.hide(SpinnerType.BallPulseSync);
    } )
    

    this.listRoles = this.datas.roles.map((element) => {return {role:element.name,selected: this.assignedRoles != null ? this.assignedRoles.includes(element.name) : false}})
      console.log(this.listRoles);
    console.log(this.assignedRoles);
    
  }

  async assignRoles(rolesList:MatSelectionList){

    const roles :string[]= rolesList.selectedOptions.selected.map(element => element._elementRef.nativeElement.innerText);
    this.spinnerService.show(SpinnerType.BallPulseSync);
    this.userService.assignRoleToUser(this.data["id"],roles,()=>{
      this.spinnerService.hide(SpinnerType.BallPulseSync);
    },(error)=>{
      this.spinnerService.hide(SpinnerType.BallPulseSync);
    } );

  }
}
export enum AuthorizeMenuState{
  Yes,No
}