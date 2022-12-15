import { ContentChild, Directive, ElementRef } from '@angular/core';

@Directive({
  selector: 'vaadin-dialog',
})
export class VaadinDialogDirective {
  @ContentChild('content')
  set content(contentRef: ElementRef<HTMLElement>) {
    if (!contentRef) {
      this.dialogElement.renderer = null;
      return;
    }

    this.dialogElement.renderer = (root: HTMLElement) => {
      root.appendChild(contentRef.nativeElement);
    };
  }

  @ContentChild('header')
  set header(headerRef: ElementRef<HTMLElement>) {
    if (!headerRef) {
      this.dialogElement.headerRenderer = null;
      return;
    }

    this.dialogElement.headerRenderer = (root: HTMLElement) => {
      root.appendChild(headerRef.nativeElement);
    };
  }

  @ContentChild('footer')
  set footer(footerRef: ElementRef<HTMLElement>) {
    if (!footerRef) {
      this.dialogElement.footerRenderer = null;
      return;
    }

    this.dialogElement.footerRenderer = (root: HTMLElement) => {
      root.appendChild(footerRef.nativeElement);
    };
  }

  private get dialogElement() {
    return this.elementRef.nativeElement;
  }

  constructor(private elementRef: ElementRef) {}
}
