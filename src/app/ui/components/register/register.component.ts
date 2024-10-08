import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent } from 'src/app/base/base.component';
import { CreateUser } from 'src/app/contracts/users/create-user';
import { User } from 'src/app/entities/user';
import { UserService } from 'src/app/services/common/models/user.service';
import { CustomToastrService, ToastrMessageType, ToastrOptions, ToastrPosition } from 'src/app/services/ui/custom-toastr.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent extends BaseComponent implements OnInit {
  registerForm: FormGroup;
  submitted : boolean;
  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private toastrService : CustomToastrService,
    spinner : NgxSpinnerService
  ){
    super(spinner);
  }
  get registerFromControls(){
    return this.registerForm.controls;
  }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      nameSurname : ["", [
        Validators.required,
        Validators.maxLength(50),
        Validators.minLength(3)
      ]],
      username: ["", [
        Validators.required,
        Validators.maxLength(50),
        Validators.minLength(3)
      ]],
      email: ["", [
        Validators.required,
        Validators.maxLength(50),
        Validators.minLength(3),
        Validators.email
      ]],
      password: ["", [
        Validators.required,
      ]],
      passwordCorrect: ["", [
        Validators.required,
      ]],
    },{
      validators:(group: AbstractControl) : ValidationErrors |null=>{
        let password = group.get("password").value;
        let passwordCorrect = group.get("passwordCorrect").value;
        return password === passwordCorrect ? null : {notSame :true};
      }
    });
  }
  async onSubmit(user : User){
    this.submitted = true;

    if(this.registerForm.invalid){
      return;
    }
    debugger;
    const result : CreateUser =  await this.userService.create(user);
    debugger;
    if(result.succeeded){
      this.toastrService.message(result.message,"User Registration",{
        messageType: ToastrMessageType.Success,
        position: ToastrPosition.BottomRight
      });
    }
    else{
      this.toastrService.message(result.message,"User Registration Failed",{
        messageType: ToastrMessageType.Error,
        position: ToastrPosition.BottomRight
      });
    }
  }
}
