import { Component, inject, OnInit, signal } from '@angular/core';
import { TableModule } from 'primeng/table';
import { UserEdit } from '@primeicons/angular/user-edit';
import { Trash } from '@primeicons/angular/trash';
import { SkeletonModule } from 'primeng/skeleton';
import { Plus } from '@primeicons/angular/plus';
import { IdCard } from '@primeicons/angular/id-card';
import { ButtonModule } from 'primeng/button';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { ReactiveFormsModule} from '@angular/forms';
import { Search } from '@primeicons/angular/search';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { LabelModule } from 'primeng/label';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AddEmpForm } from '../add-emp-form/add-emp-form';
import { EditEmpForm } from '../edit-emp-form/edit-emp-form';
import { EmployeeService } from '../../services/employee_service/employee-service';


@Component({
  imports: [
    ToastModule,
    FormsModule,
    LabelModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    Search,
    ReactiveFormsModule,
    ButtonModule,
    IdCard,
    TableModule,
    UserEdit,
    Trash,
    SkeletonModule,
    Plus,
    AddEmpForm,
    EditEmpForm
],
  selector: 'app-employees',
  styleUrl: './employees.css',
  templateUrl: './employees.html',
  providers: [MessageService]

})
export class Employees implements OnInit{

  nameCtrl = new FormControl('');

  total_records: number=5;
  employees = signal<any>([]);
  emp_db : any;
  loading = signal<boolean>(true) ;
  refresh = signal<boolean>(false) ;
  first: number = 0;
  rows: number = 10;
  name_substr: string = "";
  no_filter_results: boolean = false;

  showEditEmpDialog: boolean = false;
  showAddEmpDialog: boolean = false;

  empCurData :any;
  private messageService = inject(MessageService);


  constructor(
    private employeeService: EmployeeService,
  ){}

  ngOnInit(): void {
    // https://medium.com/@ggrokz/understanding-value-changes-in-rxjs-in-angular-258e64a884bd

    this.nameCtrl.valueChanges
      .subscribe(
        val => {
          this.loading.set(true);
        }
      )

    this.nameCtrl.valueChanges
      .pipe(debounceTime(1000))
      .subscribe(value => {
        // console.log('Value changed:', value);
        if(value == null)value = "";
        this.name_substr = value;
        this.getEmployees(0,this.rows,value)
        this.loading.set(false);
      });

    // loading skeleton animation 
    setTimeout(
      ()=>this.getEmployees(0,15,''),1000
    );
  }

  getEmployees(skip:number, limit:number, filter:string):void{
    this.employeeService.getEmployees(skip,limit,filter).subscribe({
      next : (data)=>{
          this.emp_db = data;
          this.employees.set(this.emp_db.employees);
          this.loading.set(false);
          this.total_records = this.emp_db.total_records;
          this.no_filter_results = (filter != '' && this.emp_db.employees.length == 0);
        },
      error : (error) => {
        this.messageService.add({ severity: 'error', summary: 'Something went wrong', detail: "We couldn’t fetch the employees list." });
        this.loading.set(false)
      }
    }
    )
  }

  // choosing different page in pagination triggers new api call
  // when having 10000 entries loading all at once is slow => limit
  pageChange(event:any){
    this.first = event.first;
    this.rows = event.rows;
    this.getEmployees(event.first, event.rows, this.name_substr);
  }

  editEmp(employee: any){
    // copy so the display doesn't change
    // this.empCurData = structuredClone(employee);
    this.empCurData = employee;
    this.showEditEmpDialog = true;
  }

  addEmp(){
    this.showAddEmpDialog = true;
  }

  deleteEmp(employee:any){
    this.employeeService.deleteEmployee(employee.id).subscribe({
      next : (data)=>{
          this.loading.set(false);
          this.messageService.add({ severity: 'success', summary: 'Deleted successfully', detail: 'Your changes have been saved.' });
        },
      error : (error) => {
        this.messageService.add({ severity: 'error', summary: 'Something went wrong', detail: "We couldn’t complete the action." });
        this.loading.set(false)
      }
    })
  }

  onNotify(){
    // refresh the table
    this.getEmployees(this.first, this.rows, this.name_substr);
  }
}