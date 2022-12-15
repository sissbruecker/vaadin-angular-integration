import { Component } from '@angular/core';
import { Notification } from '@vaadin/notification';
import '@vaadin/dialog';
import '@vaadin/horizontal-layout';
import '@vaadin/text-field';

@Component({
  selector: 'app-newsletter-dialog',
  templateUrl: './newsletter-dialog.component.html',
  styleUrls: ['./newsletter-dialog.component.css'],
})
export class NewsletterDialogComponent {
  dialogOpened: boolean = false;
  newsletterMail: string = '';

  openDialog() {
    this.dialogOpened = true;
  }

  signup() {
    Notification.show(`${this.newsletterMail} signed up for newsletter`, {
      theme: 'primary',
    });
    this.dialogOpened = false;
    this.newsletterMail = '';
  }

  cancel() {
    this.dialogOpened = false;
  }
}
