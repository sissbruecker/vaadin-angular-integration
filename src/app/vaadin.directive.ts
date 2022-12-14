import {
  ContentChild,
  Directive,
  ElementRef,
  EmbeddedViewRef,
  forwardRef,
  NgZone,
  OnDestroy,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TextField } from '@vaadin/text-field';
import { GridColumn, GridItemModel } from '@vaadin/grid';

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

type RenderTask = () => void;

@Directive({
  selector: 'vaadin-grid-column, vaadin-grid-sort-column',
})
export class VaadinGridRendererDirective implements OnDestroy {
  static scheduler: RenderScheduler;

  private renderings: CellRendering[] = [];
  private headerRendering: CellRendering | undefined;
  private footerRendering: CellRendering | undefined;

  @ContentChild('cell')
  public set cell(template: TemplateRef<any>) {
    const column = this.elementRef.nativeElement;

    if (!template) {
      column.renderer = null;
      return;
    }

    column.renderer = (
      cell: HTMLElement,
      _column: GridColumn,
      model: GridItemModel<unknown>
    ) => {
      VaadinGridRendererDirective.scheduler.schedule(() => {
        let rendering = CellRendering.fromCell(cell);

        if (!rendering) {
          rendering = CellRendering.create(
            cell,
            this.viewContainerRef,
            template,
            model
          );
          this.renderings.push(rendering);
        } else {
          rendering.update(model);
        }
      });
    };
  }

  @ContentChild('header')
  public set header(template: TemplateRef<any>) {
    const column = this.elementRef.nativeElement;

    if (!template) {
      column.headerRenderer = null;
      return;
    }

    column.headerRenderer = (
      cell: HTMLElement,
      _column: GridColumn,
      model: GridItemModel<unknown>
    ) => {
      VaadinGridRendererDirective.scheduler.schedule(() => {
        if (!this.headerRendering) {
          this.headerRendering = CellRendering.create(
            cell,
            this.viewContainerRef,
            template,
            model
          );
        } else {
          // this.headerRendering.update(model);
        }
      });
    };
  }

  @ContentChild('footer')
  public set footer(template: TemplateRef<any>) {
    const column = this.elementRef.nativeElement;

    if (!template) {
      column.footerRenderer = null;
      return;
    }

    column.footerRenderer = (
      cell: HTMLElement,
      _column: GridColumn,
      model: GridItemModel<unknown>
    ) => {
      VaadinGridRendererDirective.scheduler.schedule(() => {
        if (!this.footerRendering) {
          this.footerRendering = CellRendering.create(
            cell,
            this.viewContainerRef,
            template,
            model
          );
        } else {
          // this.footerRendering.update(model);
        }
      });
    };
  }

  constructor(
    private elementRef: ElementRef,
    private viewContainerRef: ViewContainerRef,
    public zone: NgZone
  ) {
    if (!VaadinGridRendererDirective.scheduler) {
      VaadinGridRendererDirective.scheduler = new RenderScheduler(zone);
    }
  }

  ngOnDestroy(): void {
    // Destroy all Angular views created as part of cell rendering
    this.renderings.forEach((rendering) => rendering.destroy());
    if (this.headerRendering) {
      this.headerRendering.destroy();
    }
    if (this.footerRendering) {
      this.footerRendering.destroy();
    }
  }
}

class RenderScheduler {
  private tasks: RenderTask[] = [];
  private renderRequest: number | null = null;

  constructor(private zone: NgZone) {
    this.render = this.render.bind(this);
  }

  schedule(task: RenderTask) {
    if (!this.renderRequest) {
      this.renderRequest = requestAnimationFrame(this.render);
    }

    this.tasks.push(task);
  }

  private render() {
    this.zone.run(() => {
      this.tasks.forEach((task) => task());
      this.renderRequest = null;
      this.tasks = [];
    });
  }
}

class CellRendering {
  private embeddedViewRef: EmbeddedViewRef<unknown>;
  private context: { model: GridItemModel<unknown> };

  constructor(
    embeddedViewRef: EmbeddedViewRef<unknown>,
    context: { model: GridItemModel<unknown> }
  ) {
    this.embeddedViewRef = embeddedViewRef;
    this.context = context;
  }

  static create(
    cell: HTMLElement,
    viewRef: ViewContainerRef,
    templateRef: TemplateRef<unknown>,
    model: GridItemModel<unknown>
  ) {
    // Instantiate Angular view from template, passing grid item model as context
    const context = { model };
    const embeddedViewRef = viewRef.createEmbeddedView(templateRef, { model });

    // Move rendered DOM nodes to grid cell
    cell.innerHTML = '';
    embeddedViewRef.rootNodes.forEach((rootNode) => cell.appendChild(rootNode));

    // Create rendering instance and store on grid cell
    // so that we can later access it to update data
    const rendering = new CellRendering(embeddedViewRef, context);
    (cell as any).__angularCellRendering = rendering;

    return rendering;
  }

  static fromCell(cell: HTMLElement): CellRendering | undefined {
    return (cell as any).__angularCellRendering;
  }

  update(model: GridItemModel<unknown>) {
    // Just update the grid item model in the context, and
    // rely on change detection to update the Angular view
    this.context.model.item = model.item;
  }

  destroy() {
    this.embeddedViewRef.destroy();
  }
}
