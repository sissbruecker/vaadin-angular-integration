import {Component, Injector} from '@angular/core';
import '@vaadin/app-layout';
import {createCustomElement} from "@angular/elements";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(injector: Injector) {
    // Example of how to create custom element from Angular component,
    // which could be used in a renderer function

    // let cartGridActionsElement = createCustomElement(CartGridActionsComponent, {injector});
    // customElements.define('cart-grid-actions', cartGridActionsElement);
  }
}


/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at https://angular.io/license
*/
