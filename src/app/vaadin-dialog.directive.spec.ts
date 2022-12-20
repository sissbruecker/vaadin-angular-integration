import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import '@vaadin/dialog';
import {
  css,
  registerStyles,
} from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { VaadinDialogDirective } from './vaadin-dialog.directive';

// Disable closing animation of dialog overlay,
// so we don't need to wait before running next test
registerStyles(
  'vaadin-dialog-overlay',
  css`
    :host([opening]),
    :host([closing]),
    :host([opening]) [part='overlay'],
    :host([closing]) [part='overlay'] {
      animation: none !important;
    }
  `
);

describe('vaadin-dialog.directive', () => {
  function getHeader(): Element {
    // From dialog overlay, get slotted header element created by web component
    return document.querySelector(
      'vaadin-dialog-overlay > div[slot="header-content"]'
    )!;
  }

  function getFooter(): Element {
    // From dialog overlay, get slotted footer element created by web component
    return document.querySelector(
      'vaadin-dialog-overlay > div[slot="footer"]'
    )!;
  }

  function getMain(): Element {
    // From dialog overlay, get slotted child that is in main slot (not header or footer)
    return document.querySelector('vaadin-dialog-overlay > div:not([slot])')!;
  }

  describe('with header', () => {
    @Component({
      template: `
        <vaadin-dialog [opened]="opened">
          <div #header>
            <h1>{{ label }}</h1>
            <button *ngIf="showCloseButton">Close</button>
          </div>
        </vaadin-dialog>
      `,
    })
    class TestDialogWithHeader {
      opened = true;
      label = 'Header';
      showCloseButton = false;
    }

    let fixture: ComponentFixture<TestDialogWithHeader>;

    function getHeaderContents(): Element[] {
      const header = getHeader();
      expect(header)
        .withContext('Could not find dialog header slot')
        .toBeTruthy();

      // Get our header content wrapper (#header)
      const wrapper = header.firstElementChild!;
      expect(wrapper)
        .withContext('Could not find dialog header content wrapper')
        .toBeTruthy();

      // Return child elements from wrapper, without comment nodes
      return Array.from(wrapper.children);
    }

    beforeEach(() => {
      fixture = TestBed.configureTestingModule({
        declarations: [VaadinDialogDirective, TestDialogWithHeader],
      }).createComponent(TestDialogWithHeader);
      fixture.detectChanges();
    });

    it('should render header content', async () => {
      const headerContents = getHeaderContents();
      expect(headerContents.length).toEqual(1);
      expect(headerContents[0].tagName).toEqual('H1');
      expect(headerContents[0].textContent).toEqual('Header');
    });

    it('should render updated header content', async () => {
      // Update label
      fixture.componentInstance.label = 'Updated header';
      fixture.detectChanges();

      const headerContents = getHeaderContents();
      expect(headerContents.length).toEqual(1);
      expect(headerContents[0].tagName).toEqual('H1');
      expect(headerContents[0].textContent).toEqual('Updated header');
    });

    it('should render conditional header content', async () => {
      // Show conditional element
      fixture.componentInstance.showCloseButton = true;
      fixture.detectChanges();

      // Verify both elements are rendered
      const headerContents = getHeaderContents();
      expect(headerContents.length).toEqual(2);
      expect(headerContents[0].tagName).toEqual('H1');
      expect(headerContents[0].textContent).toEqual('Header');
      expect(headerContents[1].tagName).toEqual('BUTTON');
      expect(headerContents[1].textContent).toEqual('Close');
    });

    it('should not render footer', () => {
      const footer = getFooter();
      expect(footer).toBeFalsy();
    });

    it('should not render main content', () => {
      const content = getMain();
      expect(content).toBeFalsy();
    });
  });

  describe('with footer', () => {
    @Component({
      template: `
        <vaadin-dialog [opened]="opened">
          <div #footer>
            <span>{{ label }}</span>
            <button *ngIf="showCloseButton">Close</button>
          </div>
        </vaadin-dialog>
      `,
    })
    class TestDialogWithFooter {
      opened = true;
      label = 'Footer';
      showCloseButton = false;
    }

    let fixture: ComponentFixture<TestDialogWithFooter>;

    function getFooterContents(): Element[] {
      // From dialog overlay, get slotted footer element created by web component
      const footer = getFooter();
      expect(footer)
        .withContext('Could not find dialog footer slot')
        .toBeTruthy();

      // Get our footer content wrapper (#footer)
      const wrapper = footer.firstElementChild!;
      expect(wrapper)
        .withContext('Could not find dialog footer content wrapper')
        .toBeTruthy();

      // Return child elements from wrapper, without comment nodes
      return Array.from(wrapper.children);
    }

    beforeEach(() => {
      fixture = TestBed.configureTestingModule({
        declarations: [VaadinDialogDirective, TestDialogWithFooter],
      }).createComponent(TestDialogWithFooter);
      fixture.detectChanges();
    });

    it('should render footer content', async () => {
      const footerContents = getFooterContents();
      expect(footerContents.length).toEqual(1);
      expect(footerContents[0].tagName).toEqual('SPAN');
      expect(footerContents[0].textContent).toEqual('Footer');
    });

    it('should render updated footer content', async () => {
      // Update label
      fixture.componentInstance.label = 'Updated footer';
      fixture.detectChanges();

      const footerContents = getFooterContents();
      expect(footerContents.length).toEqual(1);
      expect(footerContents[0].tagName).toEqual('SPAN');
      expect(footerContents[0].textContent).toEqual('Updated footer');
    });

    it('should render conditional footer content', async () => {
      // Show conditional element
      fixture.componentInstance.showCloseButton = true;
      fixture.detectChanges();

      // Verify both elements are rendered
      const footerContents = getFooterContents();
      expect(footerContents.length).toEqual(2);
      expect(footerContents[0].tagName).toEqual('SPAN');
      expect(footerContents[0].textContent).toEqual('Footer');
      expect(footerContents[1].tagName).toEqual('BUTTON');
      expect(footerContents[1].textContent).toEqual('Close');
    });

    it('should not render header', () => {
      const header = getHeader();
      expect(header).toBeFalsy();
    });

    it('should not render main content', () => {
      const content = getMain();
      expect(content).toBeFalsy();
    });
  });

  describe('with content', () => {
    @Component({
      template: `
        <vaadin-dialog [opened]="opened">
          <div #content>
            <span>{{ label }}</span>
            <button *ngIf="showCloseButton">Close</button>
          </div>
        </vaadin-dialog>
      `,
    })
    class TestDialogWithContent {
      opened = true;
      label = 'Content';
      showCloseButton = false;
    }

    let fixture: ComponentFixture<TestDialogWithContent>;

    function getMainContents(): Element[] {
      // Get our main content wrapper (#content)
      const wrapper = getMain();
      expect(wrapper)
        .withContext('Could not find dialog main content wrapper')
        .toBeTruthy();

      // Return child elements from wrapper, without comment nodes
      return Array.from(wrapper.children);
    }

    beforeEach(() => {
      fixture = TestBed.configureTestingModule({
        declarations: [VaadinDialogDirective, TestDialogWithContent],
      }).createComponent(TestDialogWithContent);
      fixture.detectChanges();
    });

    it('should render main content', async () => {
      const mainContents = getMainContents();
      expect(mainContents.length).toEqual(1);
      expect(mainContents[0].tagName).toEqual('SPAN');
      expect(mainContents[0].textContent).toEqual('Content');
    });

    it('should render updated main content', async () => {
      // Update label
      fixture.componentInstance.label = 'Updated content';
      fixture.detectChanges();

      const mainContents = getMainContents();
      expect(mainContents.length).toEqual(1);
      expect(mainContents[0].tagName).toEqual('SPAN');
      expect(mainContents[0].textContent).toEqual('Updated content');
    });

    it('should render conditional main content', async () => {
      // Show conditional element
      fixture.componentInstance.showCloseButton = true;
      fixture.detectChanges();

      // Verify both elements are rendered
      const mainContents = getMainContents();
      expect(mainContents.length).toEqual(2);
      expect(mainContents[0].tagName).toEqual('SPAN');
      expect(mainContents[0].textContent).toEqual('Content');
      expect(mainContents[1].tagName).toEqual('BUTTON');
      expect(mainContents[1].textContent).toEqual('Close');
    });

    it('should not render header', () => {
      const header = getHeader();
      expect(header).toBeFalsy();
    });

    it('should not render footer', () => {
      const footer = getFooter();
      expect(footer).toBeFalsy();
    });
  });
});
