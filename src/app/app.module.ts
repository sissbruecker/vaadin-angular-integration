import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { ProductListComponent } from './examples/product-list/product-list.component';
import { StockInfoComponent } from './examples/product-list/stock-info/stock-info.component';
import { NewsletterDialogComponent } from './examples/newsletter-dialog/newsletter-dialog.component';
import {
  VaadinSelectDirective,
  VaadinTextFieldDirective,
} from './vaadin.directive';
import {VaadinGridRendererDirective} from "./vaadin-grid.directives";
import {
  VaadinDialogDirective
} from "./vaadin-dialog.directive";

@NgModule({
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      { path: '', component: ProductListComponent },
      { path: 'examples/product-list', component: ProductListComponent },
      { path: 'examples/newsletter-dialog', component: NewsletterDialogComponent },
    ]),
  ],
  declarations: [
    AppComponent,
    ProductListComponent,
    VaadinTextFieldDirective,
    VaadinSelectDirective,
    VaadinDialogDirective,
    VaadinGridRendererDirective,
    StockInfoComponent,
    NewsletterDialogComponent,
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
