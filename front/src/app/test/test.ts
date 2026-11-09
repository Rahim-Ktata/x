import { Component } from '@angular/core';

import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { CardModule } from 'primeng/card';



@Component({
  imports: [CardModule, RouterModule, CommonModule, StyleClassModule],
  selector: 'app-test',
  styleUrl: './test.css',
  templateUrl: './test.html',
})
export class Test {}



// import { Component, inject } from '@angular/core';
// import { MenuItem } from 'primeng/api';

// import { AppConfigurator } from './app.configurator';
// import { LayoutService } from '@/app/layout/service/layout.service';

// @Component({
//     selector: 'app-topbar',
//     standalone: true,
//     imports: [RouterModule, CommonModule, StyleClassModule],
//     template: ` 
// })
// export class AppTopbar {
//     items!: MenuItem[];

//     layoutService = inject(LayoutService);

//     toggleDarkMode() {
//         this.layoutService.layoutConfig.update((state) => ({
//             ...state,
//             darkTheme: !state.darkTheme
//         }));
//     }
// }
