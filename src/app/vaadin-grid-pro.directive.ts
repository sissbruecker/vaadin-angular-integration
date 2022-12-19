import { Component, Directive, ElementRef, Input } from '@angular/core';
import { GridProEditColumn } from '@vaadin/grid-pro/vaadin-grid-pro-edit-column';

export interface CustomGridEditor<TValue> extends Component {
  value: TValue;
  nativeElement: HTMLElement;
  focusElement?: HTMLElement;
}

@Directive({
  selector: 'vaadin-grid-pro-edit-column',
})
export class VaadinGridProEditColumnDirective {
  private _editor?: CustomGridEditor<any>;

  @Input('editor')
  set editor(editor: CustomGridEditor<any>) {
    this._editor = editor;
    if (!editor) {
      this.column.editModeRenderer = null;
      return;
    }

    // Patch editor element to delegate focus if custom focus element is defined
    let originalFocus = editor.nativeElement.focus;
    editor.nativeElement.focus = () => {
      if (editor.focusElement) {
        editor.focusElement.focus();
      } else {
        originalFocus.apply(editor.nativeElement);
      }
    };
    // Create value property on custom editor element that delegates to
    // value property of Angular component
    Object.defineProperty(editor.nativeElement, 'value', {
      get() {
        return editor.value;
      },
      set(value: any) {
        editor.value = value;
      },
    });

    this.column.editModeRenderer = (cell: HTMLElement) => {
      cell.appendChild(editor.nativeElement);
    };
  }

  private get column(): GridProEditColumn<any> {
    return this.elementRef.nativeElement;
  }

  constructor(private elementRef: ElementRef) {}
}
