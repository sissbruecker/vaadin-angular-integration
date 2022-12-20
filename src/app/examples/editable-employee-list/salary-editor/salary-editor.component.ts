import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { CustomGridEditor } from '../../../vaadin-grid-pro.directive';
import { NumberField } from '@vaadin/number-field';
import '@vaadin/number-field';

@Component({
  selector: 'app-salary-editor',
  templateUrl: './salary-editor.component.html',
  styleUrls: ['./salary-editor.component.css'],
})
export class SalaryEditorComponent implements CustomGridEditor<number> {
  @Input() value: number = 0;
  @ViewChild('numberField') numberField!: ElementRef<NumberField>;

  get nativeElement(): HTMLElement {
    return this.elementRef.nativeElement;
  }

  constructor(private elementRef: ElementRef<HTMLElement>) {}

  focus() {
    this.numberField.nativeElement.focus();
  }

  formatValue(value: number) {
    return value.toString();
  }

  parseValue(value: string) {
    return parseInt(value) || 0;
  }
}
