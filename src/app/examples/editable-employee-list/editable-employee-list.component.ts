import { Component } from '@angular/core';
import { Department, Employee, generateEmployees } from './model';
import '@vaadin/date-picker';
import '@vaadin/grid-pro';
import '@vaadin/grid-pro/vaadin-grid-pro-edit-column.js';
import '@vaadin/number-field';

@Component({
  selector: 'app-editable-employee-list',
  templateUrl: './editable-employee-list.component.html',
  styleUrls: ['./editable-employee-list.component.css'],
})
export class EditableEmployeeListComponent {
  employees: Employee[] = generateEmployees(500);
  departmentOptions = [
    Department.MARKETING,
    Department.PRODUCT,
    Department.SALES,
  ];

  formatDate(date: Date) {
    return date.toISOString().split('T')[0];
  }
}
