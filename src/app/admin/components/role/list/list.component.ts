import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent, SpinnerType } from 'src/app/base/base.component';
import { ListRole } from 'src/app/contracts/role/list-role';
import { AlertifyService, MessageType, Position } from 'src/app/services/admin/alertify.service';
import { DialogService } from 'src/app/services/common/dialog.service';
import { RoleService } from 'src/app/services/common/models/role.service';
declare var $ :any;

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent extends BaseComponent implements OnInit{
  displayedColumns: string[] = ['name','edit','delete'];
  dataSource:MatTableDataSource<ListRole> = null;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(spinner : NgxSpinnerService, private roleService : RoleService,private alertifyService: AlertifyService,
    private dialogService: DialogService
  ){
    super(spinner)
  }
  
  async getRoles(){
    this.showSpinner(SpinnerType.BallPulseSync);
    const allRoles : {totalRoleCount : number, roles: ListRole[]} = await this.roleService.getRoles(this.paginator ? this.paginator.pageIndex :0,this.paginator ?this.paginator.pageSize:5,() => {this.hideSpinner(SpinnerType.BallPulseSync)},
    (error) => {
      this.alertifyService.message(error,{
        messageType:MessageType.Error,
        position:Position.BottomRight,
        dismissOthers:false,
      })
      this.hideSpinner(SpinnerType.BallPulseSync)
    });
    this.dataSource = new MatTableDataSource<ListRole>(allRoles.roles);
    this.paginator.length= allRoles.totalRoleCount;
  }
  async pageChanged(){

    await this.getRoles();
  }

  async ngOnInit() {
    await this.getRoles();

  }

  delete(id,event){
    alert(id);
    const img= event.srcElement;
    $(img.parentElement.parentElement).fadeOut(1500);
  }


}
