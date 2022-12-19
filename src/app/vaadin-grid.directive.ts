import {
  AfterViewChecked,
  ContentChild,
  Directive,
  ElementRef,
  EmbeddedViewRef,
  NgZone,
  OnDestroy,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { GridColumn, GridItemModel } from '@vaadin/grid';

@Directive({
  selector:
    'vaadin-grid-column, vaadin-grid-sort-column, vaadin-grid-pro-edit-column',
})
export class VaadinGridRendererDirective
  implements OnDestroy, AfterViewChecked
{
  static scheduler: RenderScheduler;

  private renderings: CellRendering[] = [];
  private headerRendering: CellRendering | undefined;
  private footerRendering: CellRendering | undefined;

  @ContentChild('cell')
  public set cell(template: TemplateRef<any>) {
    const columnElement = this.elementRef.nativeElement;

    if (!template) {
      columnElement.renderer = null;
      return;
    }

    columnElement.renderer = (
      cell: HTMLElement,
      column: GridColumn,
      model: GridItemModel<unknown>
    ) => {
      VaadinGridRendererDirective.scheduler.schedule(() => {
        let rendering = CellRendering.fromCell(cell);
        const context: CellRenderingContext = {
          column,
          row: model,
        };

        if (!rendering) {
          rendering = CellRendering.create(
            cell,
            this.viewContainerRef,
            template,
            context
          );
          this.renderings.push(rendering);
        } else {
          rendering.update(context);
        }
      });
    };
  }

  @ContentChild('header')
  public set header(template: TemplateRef<any>) {
    const columnElement = this.elementRef.nativeElement;

    if (!template) {
      columnElement.headerRenderer = null;
      return;
    }

    columnElement.headerRenderer = (cell: HTMLElement, column: GridColumn) => {
      const context: CellRenderingContext = { column };

      VaadinGridRendererDirective.scheduler.schedule(() => {
        if (!this.headerRendering) {
          this.headerRendering = CellRendering.create(
            cell,
            this.viewContainerRef,
            template,
            context
          );
        } else {
          this.headerRendering.update(context);
        }
      });
    };
  }

  @ContentChild('footer')
  public set footer(template: TemplateRef<any>) {
    const columnElement = this.elementRef.nativeElement;

    if (!template) {
      columnElement.footerRenderer = null;
      return;
    }

    columnElement.footerRenderer = (cell: HTMLElement, column: GridColumn) => {
      VaadinGridRendererDirective.scheduler.schedule(() => {
        const context: CellRenderingContext = { column };

        if (!this.footerRendering) {
          this.footerRendering = CellRendering.create(
            cell,
            this.viewContainerRef,
            template,
            context
          );
        } else {
          this.footerRendering.update(context);
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

  ngAfterViewChecked(): void {
    // TODO: Find reliable way of teleporting rendered DOM nodes to grid cells
    // Templates that contain structural directives seem to detach / move
    // rendered DOM nodes at times (during change detection?).
    // This workaround should reattach the nodes to the grid cell after
    // change detection.
    this.renderings.forEach((rendering) => {
      rendering.reattach();
    });
    if (this.headerRendering) {
      this.headerRendering.reattach();
    }
    if (this.footerRendering) {
      this.footerRendering.reattach();
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

type RenderTask = () => void;

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

export interface CellRenderingContext {
  row?: GridItemModel<unknown>;
  column: GridColumn<unknown>;
}

export class CellRendering {
  constructor(
    private cell: HTMLElement,
    private embeddedViewRef: EmbeddedViewRef<unknown>,
    private context: CellRenderingContext
  ) {}

  static create(
    cell: HTMLElement,
    viewRef: ViewContainerRef,
    templateRef: TemplateRef<unknown>,
    initialContext: CellRenderingContext
  ) {
    // Instantiate Angular view from template, passing grid item model as context
    const embeddedViewRef = viewRef.createEmbeddedView(
      templateRef,
      initialContext
    );

    // Create rendering instance and store on grid cell
    // so that we can later access it to update data
    const rendering = new CellRendering(cell, embeddedViewRef, initialContext);
    (cell as any).__angularCellRendering = rendering;

    // Move rendered DOM nodes to grid cell
    rendering.attach();

    return rendering;
  }

  static fromCell(cell: HTMLElement): CellRendering | undefined {
    return (cell as any).__angularCellRendering;
  }

  update(context: CellRenderingContext) {
    // Just update the grid item model in the context, and
    // rely on change detection to update the Angular view
    Object.assign(this.context, context);
  }

  reattach() {
    // If nodes have been removed from the grid cell, reattach them
    if (!this.cell.firstChild) {
      this.embeddedViewRef.rootNodes.forEach((rootNode) =>
        this.cell.appendChild(rootNode)
      );
    }
  }

  attach(cell: HTMLElement = this.cell) {
    cell.innerHTML = '';
    this.embeddedViewRef.rootNodes.forEach((rootNode) =>
      cell.appendChild(rootNode)
    );
  }

  destroy() {
    this.embeddedViewRef.destroy();
  }
}
