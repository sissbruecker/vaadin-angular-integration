import {
  ContentChild,
  Directive,
  ElementRef,
  forwardRef,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TextField } from '@vaadin/text-field';
import { GridItemModel } from '@vaadin/grid';

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

@Directive({
  selector: '[vaadin-dialog-renderer]',
})
export class VaadinDialogRendererDirective {
  constructor(private elementRef: ElementRef) {
    const content = elementRef.nativeElement;
    const dialog = content.parentElement;

    dialog.renderer = (root: HTMLElement) => {
      root.appendChild(content);
    };
  }
}

@Directive({
  selector: '[vaadin-dialog-header-renderer]',
})
export class VaadinDialogHeaderRendererDirective {
  constructor(private elementRef: ElementRef) {
    const content = elementRef.nativeElement;
    const dialog = content.parentElement;

    dialog.headerRenderer = (root: HTMLElement) => {
      root.appendChild(content);
    };
  }
}

@Directive({
  selector: '[vaadin-dialog-footer-renderer]',
})
export class VaadinDialogFooterRendererDirective {
  constructor(private elementRef: ElementRef) {
    const content = elementRef.nativeElement;
    const dialog = content.parentElement;

    dialog.footerRenderer = (root: HTMLElement) => {
      root.appendChild(content);
    };
  }
}

@Directive({
  selector: 'vaadin-grid-column',
})
export class VaadinGridRendererDirective {
  @ContentChild('cell')
  public set cell(template: TemplateRef<any>) {
    if (!template) {
      return;
    }

    const column = this.elementRef.nativeElement;
    column.renderer = (
      root: HTMLElement,
      _: unknown,
      model: GridItemModel<unknown>
    ) => {
      if (!template) {
        console.warn('Cell template not found');
        return;
      }

      const embeddedViewRef = this.viewContainerRef.createEmbeddedView(
        template,
        { model }
      );
      embeddedViewRef.detectChanges();
      // Detach immediately, as we only need to access the generated DOM nodes,
      // and have no other way of detecting when a rendered view is not used anymore
      embeddedViewRef.detach();

      root.innerHTML = '';
      embeddedViewRef.rootNodes.forEach((rootNode) =>
        root.appendChild(rootNode)
      );
    };
  }

  constructor(
    private elementRef: ElementRef,
    private viewContainerRef: ViewContainerRef
  ) {}
}

@Directive({
  selector: '[vaadin-submit-button]',
})
export class VaadinSubmitButtonDirective {
  constructor(private elementRef: ElementRef) {
    const button = elementRef.nativeElement;
    let parent = button.parentElement;

    while (parent != null && parent.tagName !== 'FORM') {
      parent = parent.parentElement;
    }

    if (parent) {
      button.addEventListener('click', () => parent.submit());
      parent.addEventListener('keypress', (e: KeyboardEvent) => {
        if (e.key === 'Enter') {
          button.click();
        }
      });
    }
  }
}
