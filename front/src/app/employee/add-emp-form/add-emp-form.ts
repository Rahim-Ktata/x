import { Component, signal, model, Output, EventEmitter, inject } from '@angular/core';
import { pattern, minLength, maxLength, email, form, FormField, required, minDate, maxDate, validate } from '@angular/forms/signals';
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
import { SelectButtonModule } from 'primeng/selectbutton';
import { MessageModule } from 'primeng/message';
import { MotionOptions } from '@primeuix/motion';
import { EmployeeService } from '../../services/employee_service/employee-service';
import { MessageService } from 'primeng/api';
import { Spinner } from '@primeicons/angular/spinner';
import { ToastModule } from 'primeng/toast';


@Component({
  imports: [
    ToastModule,
    MessageModule,
    SelectButtonModule,
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

  constructor(
    private employeeService: EmployeeService,
  ){}


  loading = model<boolean>(false);
  @Output() notify = new EventEmitter();
  private messageService = inject(MessageService);
  showAddEmpDialog = model<boolean>(false);


  // see: signal forms | signal forms valdiation ng official docs
  addEmpModel = signal<EmployeeCreate>({
    roles: [Role.VENDOR],
    first_name : 'example_',
    last_name : 'example',
    email : 'example@gmail.com',
    number : 0, 
    birth_date : new Date('2000-01-01'),
    address : '',
    cnss_number : '12345678-12',
    contract_type : ContractType.CDI,
    gender : Gender.MALE,
    account_status : AccountStatus.INACTIVE,
    phone_number : '11222333',
  });

  addEmpForm = form(this.addEmpModel,
    (schemaPath) => {
      required(schemaPath.email, {message: 'Email is required'});
      email(schemaPath.email, {message: 'Enter a valid email address'});
      // required(schemaPath.password, {message: 'Password is required'});
      required(schemaPath.first_name, {message: 'First name is required'});
      required(schemaPath.last_name, {message: 'Last name is required'});
      // maxDate(schemaPath.birth_date, new Date('2025-01-01'), {message: 'Invalid birthdate'});

      required(schemaPath.phone_number, {message: 'Phone is required'});
      required(schemaPath.birth_date, {message: 'Birth date is required'});

      maxLength(schemaPath.first_name, 50, {message: 'First name is too long'});
      maxLength(schemaPath.last_name, 50, {message: 'Last name is too long'});
      maxLength(schemaPath.address, 50, {message: 'address is too long'});

      pattern(schemaPath.phone_number, /^\d{8}$/, {
        message: 'Phone must be 8 digits',
      });
      pattern(schemaPath.cnss_number, /^\d{8}-\d{2}$/, {
        message: 'Cnss number must be in format: 12345678-12',
      });

      validate(schemaPath.cnss_number, ({value}) => {
        if (value() == '' && 
            (this.addEmpModel().contract_type==ContractType.CDI) ||
            (this.addEmpModel().contract_type==ContractType.CDD)
          ) {
          return {
            kind: 'https',
            message: "Cnss number is Mandatory for Cdi and Cdd",
          };
        }
        return null;
      });

    }
  );

  public commitAddEmp(){
    // let birth_date = this.addEmpModel().birth_date
    // this.addEmpModel().birth_date = new Date(birth_date.toISOString());
    let addEntry = this.addEmpModel();

      this.messageService.add({
          severity: 'secondary',
          summary: 'Please wait...',
          detail: 'Sending invitation email. This may take a moment.',
          icon: 'pi pi-spinner pi-spin',
          key: 'promise',
          sticky: true
      });
        

    this.employeeService.addEmployee(this.addEmpModel()).subscribe({
      next: (data)=>{
        this.messageService.clear('promise');

        // a toast
        if(data.status_code == 200){
          this.messageService.add({ severity: 'success', summary: 'Saved successfully', detail: data.detail });
        }
        else{
          this.messageService.add({ severity: 'error', summary: 'Something went wrong', detail: data.detail });
        }

        this.loading.set(true);
        // refresh table with new data
        this.notify.emit();
      },
      error: (error)=>{
        this.messageService.clear('promise');
        if(error.error.detail){
          this.messageService.add({ severity: 'error', summary: 'Something went wrong', detail: error.error.detail });
        }
        else
          this.messageService.add({ severity: 'error', summary: 'Something went wrong', detail: "We couldn’t complete the action." });
      }
    })
    this.showAddEmpDialog.set(false);
  }
}
