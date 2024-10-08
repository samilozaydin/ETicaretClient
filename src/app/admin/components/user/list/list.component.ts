import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent, SpinnerType } from 'src/app/base/base.component';
import { ListUser } from 'src/app/contracts/list-user';
import { AuthorizeUserDialogComponent } from 'src/app/dialogs/authorize-user-dialog/authorize-user-dialog.component';
import { AlertifyService, MessageType, Position } from 'src/app/services/admin/alertify.service';
import { DialogService } from 'src/app/services/common/dialog.service';
import { UserService } from 'src/app/services/common/models/user.service';
declare var $:any;
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent extends BaseComponent implements OnInit {
  displayedColumns: string[] = ['userName', 'nameSurname', 'email','twoFactorEnabled',"role",'delete'];
  dataSource:MatTableDataSource<ListUser> = null;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(spinner : NgxSpinnerService, private userService : UserService, private alertifyService: AlertifyService,
    private dialogService: DialogService
  ){
    super(spinner)
  }
  
  async getUsers(){
    this.showSpinner(SpinnerType.BallPulseSync);
    const allUsers : {totalUserCount : number, users: ListUser[]} = await this.userService.getAllUsers(this.paginator ? this.paginator.pageIndex :0,this.paginator ?this.paginator.pageSize:5,() => {this.hideSpinner(SpinnerType.BallPulseSync)},
    (error) => {
      this.alertifyService.message(error,{
        messageType:MessageType.Error,
        position:Position.BottomRight,
        dismissOthers:false,
      })
      this.hideSpinner(SpinnerType.BallPulseSync)
    });    
    
    this.dataSource = new MatTableDataSource<ListUser>(allUsers.users);
    this.paginator.length= allUsers.totalUserCount;
  }
  async pageChanged(){

    await this.getUsers();
  }

  async ngOnInit() {
    await this.getUsers();

  }

  delete(id,event){
    alert(id);
    const img= event.srcElement;
    $(img.parentElement.parentElement).fadeOut(1500);
  }
  assignRole(id:string){
    this.dialogService.openDialog({
      componentType: AuthorizeUserDialogComponent,
      data:{id:id},
      afterClosed: ()=>{
        this.alertifyService.message("Roles is assigned",{
          messageType: MessageType.Success,
          position:Position.BottomRight
        })

      }
    })
  }
}
