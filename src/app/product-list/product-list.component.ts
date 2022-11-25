import { Component } from '@angular/core';
import '@vaadin/button';

import { products } from '../products';
import {Notification} from "@vaadin/notification";

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent {
  products = products;

  share() {
    Notification.show("The product has been shared!", {theme: 'primary'})
  }

  onNotify() {
    Notification.show("You will be notified when the product goes on sale", {theme: 'primary'})
  }
}


/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at https://angular.io/license
*/
