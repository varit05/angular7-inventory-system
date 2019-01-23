import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';


import { UnassignedComponent } from './components/unassigned/unassigned.component';
import { AssignedComponent } from './components/assigned/assigned.component';

@NgModule({
  imports: [CommonModule, HttpClientModule, SweetAlert2Module.forRoot()],
  declarations: [UnassignedComponent, AssignedComponent],
  exports: [AssignedComponent]
})
export class SharedModule {}
