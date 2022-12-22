import {
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
export class VaadinGridColumnDirective implements OnDestroy {
  private _cellTemplate?: TemplateRef<any>;
  private _headerTemplate?: TemplateRef<any>;
  private _footerTemplate?: TemplateRef<any>;
  private _scheduler: RenderScheduler | null = null;
  private renderings: CellRendering[] = [];
  private headerRendering: CellRendering | undefined;
  private footerRendering: CellRendering | undefined;

  get column() {
    return this.elementRef.nativeElement;
  }

  get scheduler() {
    if (!this._scheduler) {
      this._scheduler = RenderScheduler.getOrCreate(this.column, this.zone);
    }
    return this._scheduler;
  }

  @ContentChild('cell')
  public set cell(template: TemplateRef<any>) {
    // Remove renderer when template is removed
    if (!template) {
      this.column.renderer = null;
      return;
    }
    // Avoid re-defining the renderer function when the same template
    // is set again. This seemingly can happen when using structural
    // directives in the template.
    if (this._cellTemplate === template) {
      return;
    }
    this._cellTemplate = template;

    this.column.renderer = (
      cell: HTMLElement,
      column: GridColumn,
      model: GridItemModel<unknown>
    ) => {
      this.scheduler.schedule(() => {
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

          if (this.column.tagName === 'VAADIN-GRID-PRO-EDIT-COLUMN') {
            // After finishing editing with grid pro the cell is emptied,
            // so re-attach the previously rendered DOM nodes
            rendering.attach();
          }
        }
      });
    };
  }

  @ContentChild('header')
  public set header(template: TemplateRef<any>) {
    // Remove renderer when template is removed
    if (!template) {
      this.column.headerRenderer = null;
      return;
    }
    // Avoid re-defining the renderer function when the same template
    // is set again. This seemingly can happen when using structural
    // directives in the template.
    if (this._headerTemplate === template) {
      return;
    }
    this._headerTemplate = template;

    this.column.headerRenderer = (cell: HTMLElement, column: GridColumn) => {
      this.scheduler.schedule(() => {
        const context: CellRenderingContext = { column };

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
    // Remove renderer when template is removed
    if (!template) {
      this.column.footerRenderer = null;
      return;
    }
    // Avoid re-defining the renderer function when the same template
    // is set again. This seemingly can happen when using structural
    // directives in the template.
    if (this._footerTemplate === template) {
      return;
    }
    this._footerTemplate = template;

    this.column.footerRenderer = (cell: HTMLElement, column: GridColumn) => {
      this.scheduler.schedule(() => {
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
    private zone: NgZone
  ) {}

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

  static getOrCreate(column: GridColumn, zone: NgZone): RenderScheduler {
    // Reuse same scheduler for all columns on the same grid
    const grid = column.parentElement;
    let scheduler = (grid as any).__angularRenderScheduler;

    if (!scheduler) {
      scheduler = new RenderScheduler(zone);
      (grid as any).__angularRenderScheduler = scheduler;
    }

    return scheduler;
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

  attach() {
    // Sanity check: There shouldn't be a case where nodes
    // need to be attached unless the cell itself is empty
    if (!this.cell.firstChild) {
      this.embeddedViewRef.rootNodes.forEach((rootNode) =>
        this.cell.appendChild(rootNode)
      );
    }
  }

  destroy() {
    this.embeddedViewRef.destroy();
  }
}
