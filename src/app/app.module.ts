import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { ProductListComponent } from './examples/product-list/product-list.component';
import { StockInfoComponent } from './examples/product-list/stock-info/stock-info.component';
import {
  VaadinDialogFooterRendererDirective,
  VaadinDialogHeaderRendererDirective,
  VaadinDialogRendererDirective,
  VaadinGridRendererDirective,
  VaadinSelectDirective,
  VaadinTextFieldDirective,
} from './vaadin.directive';

@NgModule({
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      { path: '', component: ProductListComponent },
      { path: 'examples/product-list', component: ProductListComponent },
    ]),
  ],
  declarations: [
    AppComponent,
    ProductListComponent,
    VaadinTextFieldDirective,
    VaadinSelectDirective,
    VaadinDialogRendererDirective,
    VaadinDialogHeaderRendererDirective,
    VaadinDialogFooterRendererDirective,
    VaadinGridRendererDirective,
    StockInfoComponent,
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
