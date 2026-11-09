import { Component, EventEmitter, inject, Input, model, OnChanges, Output, signal, SimpleChanges } from '@angular/core';
import {email, form, FormField, required } from '@angular/forms/signals';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { EditEmployeeEntry } from '../../../models/interfaces/employee';
import { EmployeeService } from '../../services/employee_service/employee-service';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ContractType } from '../../../models/enums/contract_type';
import { Gender } from '../../../models/enums/gender';
import { AccountStatus } from '../../../models/enums/account_status';
import { Role } from '../../../models/enums/role';
import { SelectModule } from 'primeng/select';
import { Shared } from '../shared';


@Component({
  imports: [
    SelectModule,
    ButtonModule,
    DialogModule,
    FormField,
    InputTextModule,
  ],
  selector: 'app-edit-emp-form',
  styleUrl: './edit-emp-form.css',
  templateUrl: './edit-emp-form.html',
})
export class EditEmpForm implements OnChanges{
  shared = Shared;

  constructor(
    private employeeService: EmployeeService,
  ){}


  showEditEmpDialog = model<boolean>(false);
  loading = model<boolean>(false);
  @Input() empCurData: any = undefined;
  @Output() notify = new EventEmitter();
  private messageService = inject(MessageService);

  ngOnChanges(changes: SimpleChanges): void {
    this.editEmpModel.set({
      first_name : this.empCurData?.first_name,
      last_name : this.empCurData?.last_name,
      birth_date : this.empCurData?.birth_date,
      address : this.empCurData?.address,
      cnss_number : this.empCurData?.cnss_number ,
      contract_type : this.empCurData?.contract_type,
      gender : this.empCurData?.gender,
      account_status : this.empCurData?.account_status,
      phone_number :  this.empCurData?.phone_number,
      roles: this.empCurData?.roles
    });
  }

  // see: signal forms | signal forms valdiation ng official docs
  editEmpModel = signal<EditEmployeeEntry>({
    first_name: '',
    last_name: '',
    birth_date : new Date(),
    address : '',
    cnss_number : '',
    contract_type : ContractType.CDD,
    gender : Gender.MALE,
    account_status : AccountStatus.INACTIVE,
    phone_number : '',
    roles: [Role.ADMIN]
  });

  editEmpForm = form(this.editEmpModel,
    (schemaPath) => {
      required(schemaPath.first_name, {message: 'First name is required'});
      required(schemaPath.last_name, {message: 'Last name is required'});
      // email(schemaPath.email, {message: 'Enter a valid email address'});
      // required(schemaPath.password, {message: 'Password is required'});
    }
  );

  commitEditEmpChanges(){
    let editEntry = this.editEmpModel();
    this.employeeService.editEmployee(this.empCurData.id,editEntry).subscribe({
      next: (data)=>{
        // a toast
        if(data.status_code == '200'){
          this.messageService.add({ severity: 'success', summary: 'Saved successfully', detail: 'Your changes have been saved.' });
        }
        else{
          this.messageService.add({ severity: 'error', summary: 'Something went wrong', detail: data.msg });
        }

        this.loading.set(true);
        this.notify.emit();
        // refresh table with new data
        // this.getEmployees(this.first, this.rows, this.name_substr);
      },
      error: (error)=>{
        this.messageService.add({ severity: 'error', summary: 'Something went wrong', detail: "We couldn’t complete the action." });
      }
    })
    this.showEditEmpDialog.set(false);
  }

}
