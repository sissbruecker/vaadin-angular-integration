import { Directive, ElementRef, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TextField } from '@vaadin/text-field';

class VaadinValueFieldDirective implements ControlValueAccessor {
  constructor(private elementRef: ElementRef) {}

  get element(): TextField {
    return this.elementRef.nativeElement;
  }

  registerOnChange(fn: any): void {
    this.element.addEventListener('value-changed', (e) => {
      fn(e.detail.value);
    });
  }

  registerOnTouched(fn: any): void {
    this.element.addEventListener('blur', (e) => {
      fn();
    });
  }

  writeValue(value: string): void {
    this.element.value = value;
  }
}

@Directive({
  selector: 'vaadin-text-field',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => VaadinTextFieldDirective),
      multi: true,
    },
  ],
})
export class VaadinTextFieldDirective extends VaadinValueFieldDirective {
  constructor(elementRef: ElementRef) {
    super(elementRef);
  }
}

@Directive({
  selector: 'vaadin-select',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => VaadinSelectDirective),
      multi: true,
    },
  ],
})
export class VaadinSelectDirective extends VaadinValueFieldDirective {
  constructor(elementRef: ElementRef) {
    super(elementRef);
  }
}
