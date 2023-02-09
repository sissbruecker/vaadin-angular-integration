import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { CheckoutFormComponent } from './examples/checkout-form/checkout-form.component';
import { ProductListComponent } from './examples/product-list/product-list.component';
import { StockInfoComponent } from './examples/product-list/stock-info/stock-info.component';
import { NewsletterDialogComponent } from './examples/newsletter-dialog/newsletter-dialog.component';
import { EditableEmployeeListComponent } from './examples/editable-employee-list/editable-employee-list.component';
import { DateEditorComponent } from './examples/editable-employee-list/date-editor/date-editor.component';
import { SalaryEditorComponent } from './examples/editable-employee-list/salary-editor/salary-editor.component';
import { GridPerformanceComponent } from './examples/grid-performance/grid-performance.component';
import {
  VaadinSelectDirective,
  VaadinTextFieldDirective,
} from './vaadin.directive';
import {
  VaadinGridDirective,
  VaadinGridColumnDirective,
} from './vaadin-grid.directive';
import { VaadinDialogDirective } from './vaadin-dialog.directive';
import { VaadinGridProEditColumnDirective } from './vaadin-grid-pro.directive';
import {AlbumTreeViewComponent} from "./examples/album-tree-view/album-tree-view.component";

@NgModule({
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      { path: '', component: ProductListComponent },
      { path: 'examples/product-list', component: ProductListComponent },
      {
        path: 'examples/newsletter-dialog',
        component: NewsletterDialogComponent,
      },
      { path: 'examples/checkout-form', component: CheckoutFormComponent },
      {
        path: 'examples/editable-employee-list',
        component: EditableEmployeeListComponent,
      },
      {
        path: 'examples/album-tree-view',
        component: AlbumTreeViewComponent,
      },
      {
        path: 'examples/grid-performance',
        component: GridPerformanceComponent,
      },
    ]),
  ],
  declarations: [
    AppComponent,
    GridPerformanceComponent,
    ProductListComponent,
    VaadinTextFieldDirective,
    VaadinSelectDirective,
    VaadinDialogDirective,
    VaadinGridDirective,
    VaadinGridColumnDirective,
    VaadinGridProEditColumnDirective,
    StockInfoComponent,
    NewsletterDialogComponent,
    CheckoutFormComponent,
    EditableEmployeeListComponent,
    DateEditorComponent,
    SalaryEditorComponent,
    AlbumTreeViewComponent,
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
