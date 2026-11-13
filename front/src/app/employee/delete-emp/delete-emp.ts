import { Component, EventEmitter, inject, Input, model, Output } from '@angular/core';
import { EmployeeService } from '../../services/employee_service/employee-service';
import { MessageService } from 'primeng/api';
import { Spinner } from '@primeicons/angular/spinner';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

@Component({
  imports: [
    ButtonModule,
    ToastModule,
    DialogModule,
  ],
  selector: 'app-delete-emp',
  styleUrl: './delete-emp.css',
  templateUrl: './delete-emp.html',
})
export class DeleteEmp {

  showDeleteEmpDialog = model<boolean>(false);
  loading = model<boolean>(false);
  @Input() empCurData: any = undefined;
  @Output() notify = new EventEmitter();
  private messageService = inject(MessageService);

  constructor(
    private employeeService: EmployeeService,
  ){}

  deleteEmp(){
      this.messageService.add({
          severity: 'secondary',
          summary: 'Please wait...',
          detail: 'Your request is being processed. This may take a moment.',
          icon: 'pi pi-spinner pi-spin',
          key: 'promise',
          sticky: true
      });

    this.employeeService.deleteEmployee(this.empCurData.id).subscribe({
      next : (data)=>{
          this.messageService.clear('promise');

          if(data.status_code == 200){
            this.messageService.add({ severity: 'success', summary: 'Deleted successfully', detail: 'Your changes have been saved.' });
          }
          else{
            this.messageService.add({ severity: 'error', summary: 'Something went wrong', detail: data.detail });
          }

          // refresh table with new data
          this.loading.set(true);
          this.notify.emit();
        },
      error : (error) => {
        this.messageService.clear('promise');

        if(error.error.detail){
          this.messageService.add({ severity: 'error', summary: 'Something went wrong', detail: error.error.detail });
        }
        else{
          this.messageService.add({ severity: 'error', summary: 'Something went wrong', detail: "We couldn’t complete the action." });
        }
      }
    })

    this.showDeleteEmpDialog.set(false);
  }
}
