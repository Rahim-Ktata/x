import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { DeleteEmployeeResponse, EditEmployeeEntry, EditEmployeeOut, EmployeeCreate, EmployeePublic, EmployeeUploadResponse, GetAllEmployees, MatchyUploadEntry } from '../../../models/interfaces/employee';
import { back_base_url } from '../../utils';

@Service()
export class EmployeeService {
  private http = inject(HttpClient);

  getEmployees(skip:number, limit:number, filter: string){
    // the <GetAllEmp> is useless, no verif or err, see Critical in docs
    return this.http.get<GetAllEmployees>(back_base_url + 'employee/get_all_employees', 
        {
            params: {skip: skip, limit: limit, filter: filter},
        }
    );
  }

  editEmployee(id: number,data:EditEmployeeEntry){
    return this.http.patch<EditEmployeeOut>(back_base_url + `employee/edit_employee/${id}`,data);
  }

  addEmployee(entry:EmployeeCreate){
    return this.http.post<EmployeePublic>(back_base_url + 'employee/add_employee',entry)
  }

  deleteEmployee(id:number){
    return this.http.delete<DeleteEmployeeResponse>(back_base_url + `employee/delete_employee/${id}`)
  }

  bulkUploadEmployees(entry:MatchyUploadEntry){
    return this.http.post<EmployeeUploadResponse>(back_base_url + "employees_bulk_upload",entry)
  }
}
