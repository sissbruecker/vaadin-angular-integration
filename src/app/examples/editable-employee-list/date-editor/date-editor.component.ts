import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { CustomGridEditor } from '../../../vaadin-grid-pro.directive';
import { DatePicker } from '@vaadin/date-picker';
import '@vaadin/date-picker';

@Component({
  selector: 'app-date-editor',
  templateUrl: './date-editor.component.html',
  styleUrls: ['./date-editor.component.css'],
})
export class DateEditorComponent implements CustomGridEditor<Date | null> {
  @Input() value: Date | null = null;
  @ViewChild('datePicker') datePicker!: ElementRef<DatePicker>;

  get nativeElement(): HTMLElement {
    return this.elementRef.nativeElement;
  }

  focus() {
    this.datePicker.nativeElement.focus();
  }

  formatDate(date: Date | null) {
    if (!date) {
      return '';
    }
    return date.toISOString().split('T')[0];
  }

  parseDate(isoDateString: string) {
    const parts = isoDateString.split('-');
    if (parts.length !== 3) {
      return null;
    }
    return new Date(
      Date.UTC(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]))
    );
  }

  constructor(private elementRef: ElementRef<HTMLElement>) {}
}
