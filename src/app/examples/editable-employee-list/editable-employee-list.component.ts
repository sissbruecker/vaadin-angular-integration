import { Component } from '@angular/core';
import {Department, Employee, generateEmployees} from "./model";
import '@vaadin/grid-pro';
import '@vaadin/grid-pro/vaadin-grid-pro-edit-column.js';

@Component({
  selector: 'app-editable-employee-list',
  templateUrl: './editable-employee-list.component.html',
  styleUrls: ['./editable-employee-list.component.css']
})
export class EditableEmployeeListComponent {
  employees: Employee[] = generateEmployees(500);
  departmentOptions = [
    Department.MARKETING,
    Department.PRODUCT_DEVELOPMENT,
    Department.SALES,
  ]

  constructor() {
  }

  formatDate(date: Date) {
    const monthString = (date.getMonth() + 1).toString().padStart(2, '0');
    const dateString = (date.getDate()).toString().padStart(2, '0');
    return `${date.getFullYear()}-${monthString}-${dateString}`;
  }
}
