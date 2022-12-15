import { Component } from '@angular/core';
import {Notification} from "@vaadin/notification";

@Component({
  selector: 'app-newsletter-dialog',
  templateUrl: './newsletter-dialog.component.html',
  styleUrls: ['./newsletter-dialog.component.css']
})
export class NewsletterDialogComponent {
  newsletterDialogOpened: boolean = false;
  newsletterMail: string = '';

  showNewsletterDialog() {
    this.newsletterDialogOpened = true;
  }

  handleNewsletterSignup() {
    Notification.show(`${this.newsletterMail} signed up for newsletter`, {
      theme: 'primary',
    });
    this.newsletterDialogOpened = false;
    this.newsletterMail = '';
  }

  handleNewsletterCancel() {
    this.newsletterDialogOpened = false;
  }
}
