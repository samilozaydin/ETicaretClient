import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsComponent } from './products.component';
import { RouterModule } from '@angular/router';
import {MatSidenavModule} from '@angular/material/sidenav';
import { CreateComponent } from './create/create.component';
import { ListComponent } from './list/list.component';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import { DeleteDirective } from 'src/app/directives/admin/delete.directive';
import {MatDialogModule} from '@angular/material/dialog';
import { DeleteDialogComponent } from 'src/app/dialogs/delete-dialog/delete-dialog.component';


@NgModule({
  declarations: [
    ProductsComponent,
    CreateComponent,
    ListComponent,  
    DeleteDialogComponent,  
    DeleteDirective,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {path:"",component:ProductsComponent}
    ]),
    MatSidenavModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatDialogModule
  ]
})
export class ProductsModule { }
