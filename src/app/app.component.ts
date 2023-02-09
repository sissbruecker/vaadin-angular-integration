import { Component } from '@angular/core';
import '@vaadin/app-layout';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  constructor() {}

  detectionCounter = 0;

  ngDoCheck() {
    console.log(
      `Change detection cycle #${++this.detectionCounter}`,
      // Error().stack
    );
  }
}
