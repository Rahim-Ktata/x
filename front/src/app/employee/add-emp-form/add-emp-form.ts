import { Component, Input, signal, model } from '@angular/core';
import {email, form, FormField, required } from '@angular/forms/signals';
import { EmployeeCreate } from '../../../models/interfaces/employee';
import { Role } from '../../../models/enums/role';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { ContractType } from '../../../models/enums/contract_type';
import { Gender } from '../../../models/enums/gender';
import { AccountStatus } from '../../../models/enums/account_status';
import { SelectModule } from 'primeng/select';
import { Shared } from '../shared';
import { DatePickerModule } from 'primeng/datepicker';



@Component({
  imports: [
    DatePickerModule,
    SelectModule,
    ButtonModule,
    DialogModule,
    FormField,
    InputTextModule,
  ],
  selector: 'app-add-emp-form',
  styleUrl: './add-emp-form.css',
  templateUrl: './add-emp-form.html',
})
export class AddEmpForm {
  shared = Shared;

  showAddEmpDialog = model<boolean>(false);


  // see: signal forms | signal forms valdiation ng official docs
  addEmpModel = signal<EmployeeCreate>({
    roles: [Role.ADMIN],
    first_name : '',
    last_name : '',
    email : '',
    number : 0, 
    birth_date : new Date(),
    address : '',
    cnss_number : '',
    contract_type : ContractType.APPRENTI,
    gender : Gender.FEMALE,
    account_status : AccountStatus.INACTIVE,
    phone_number : '',
  });

  addEmpForm = form(this.addEmpModel,
    (schemaPath) => {
      required(schemaPath.email, {message: 'Email is required'});
      email(schemaPath.email, {message: 'Enter a valid email address'});
      // required(schemaPath.password, {message: 'Password is required'});
    }
  );

  addEmp(){
    this.showAddEmpDialog.set(false);
  }
}
