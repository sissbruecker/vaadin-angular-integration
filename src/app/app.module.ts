import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { TopBarComponent } from './top-bar/top-bar.component';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductAlertsComponent } from './product-alerts/product-alerts.component';
import { CartComponent } from './cart/cart.component';
import {
  VaadinDialogFooterRendererDirective,
  VaadinDialogHeaderRendererDirective,
  VaadinDialogRendererDirective,
  VaadinGridRendererDirective,
  VaadinSelectDirective,
  VaadinTextFieldDirective,
} from './vaadin.directive';
import { NewsletterDialogComponent } from './newsletter-dialog/newsletter-dialog.component';
import { StockInfoComponent } from './stock-info/stock-info.component';

@NgModule({
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      { path: '', component: ProductListComponent },
      { path: 'cart', component: CartComponent },
    ]),
  ],
  declarations: [
    AppComponent,
    TopBarComponent,
    ProductListComponent,
    ProductAlertsComponent,
    CartComponent,
    VaadinTextFieldDirective,
    VaadinSelectDirective,
    VaadinDialogRendererDirective,
    VaadinDialogHeaderRendererDirective,
    VaadinDialogFooterRendererDirective,
    VaadinGridRendererDirective,
    NewsletterDialogComponent,
    StockInfoComponent,
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}

/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at https://angular.io/license
*/
