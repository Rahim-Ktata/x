import { Routes } from '@angular/router';
import { Layout } from './layout/layout';
import { Test } from './test/test';
import { Notfound } from './not-found/not-found'
import { Employees } from './employee/employees/employees';

export const routes: Routes = [
    {
    // path: 'team/:id',
    path:'xyz',
    component: Test,
    },
    // {
    // // path: 'team/:id',
    // path:'',
    // component: Layout,
    // children: [{
    //     // path: 'user/:name',
    //     path: 'x',
    //     component: Test 
    // }]
    // }

    {path: 'employees', component: Employees},
    {path: '', component: Test},  // provide sth otherwise it goes to 404
    {path: '**', component: Notfound},  // should be last
];
