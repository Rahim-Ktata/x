import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { DeleteEmployeeResponse, EditEmployeeEntry, EditEmployeeOut, EmployeeCreate, EmployeePublic, GetAllEmployees } from '../../../models/interfaces/employee';

@Service()
export class EmployeeService {
  private http = inject(HttpClient);

  getEmployees(skip:number, limit:number, filter: string){
    // the <GetAllEmp> is useless, no verif or err, see Critical in docs
    return this.http.get<GetAllEmployees>('http://127.0.0.1:8000/employee/get_all_employees', 
        {
            params: {skip: skip, limit: limit, filter: filter},
        }
    );
  }

  editEmployee(id: number,data:EditEmployeeEntry){
    return this.http.patch<EditEmployeeOut>(`http://127.0.0.1:8000/employee/edit_employee/${id}`,data);
  }

  addEmployee(entry:EmployeeCreate){
    return this.http.post<EmployeePublic>('http://127.0.0.1:8000/employee/add_employee',entry)
  }

  deleteEmployee(id:number){
    return this.http.delete<DeleteEmployeeResponse>(`http://127.0.0.1:8000/employee/delete_employee/${id}`)
  }
}
