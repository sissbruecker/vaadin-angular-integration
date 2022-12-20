import { Component } from '@angular/core';
import { Notification } from '@vaadin/notification';
import '@vaadin/checkbox';
import '@vaadin/dialog';
import '@vaadin/horizontal-layout';
import '@vaadin/text-field';

interface NewsletterOptions {
  marketing: boolean;
  releases: boolean;
  blog: boolean;
}

@Component({
  selector: 'app-newsletter-dialog',
  templateUrl: './newsletter-dialog.component.html',
  styleUrls: ['./newsletter-dialog.component.css'],
})
export class NewsletterDialogComponent {
  dialogOpened: boolean = false;
  mail: string = '@vaadin.com';
  showOptions: boolean = false;
  options: NewsletterOptions = {
    marketing: true,
    releases: true,
    blog: true,
  };

  openDialog() {
    this.dialogOpened = true;
  }

  signup() {
    Notification.show(
      `${this.mail} signed up for newsletter ${JSON.stringify(this.options)}`,
      {
        theme: 'primary',
      }
    );
    // Reset dialog
    this.dialogOpened = false;
    this.mail = '';
    this.showOptions = false;
    this.options = {
      marketing: true,
      releases: true,
      blog: true,
    };
  }

  cancel() {
    this.dialogOpened = false;
  }
}
