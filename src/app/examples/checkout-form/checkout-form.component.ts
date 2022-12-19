import { Component } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Notification } from '@vaadin/notification';
import '@vaadin/button';
import '@vaadin/icon';
import '@vaadin/icons';
import '@vaadin/select';
import '@vaadin/text-field';

interface PaymentMethodOption {
  value: string;
  label: string;
  icon: string;
}

const paymentOptions: PaymentMethodOption[] = [
  {
    value: '',
    label: '',
    icon: '',
  },
  {
    value: 'cash',
    label: 'Cash',
    icon: 'vaadin:cash',
  },
  {
    value: 'credit-card',
    label: 'Credit Card',
    icon: 'vaadin:card',
  },
  {
    value: 'piggy',
    label: 'Piggy Bank',
    icon: 'vaadin:piggy-bank',
  },
];

@Component({
  selector: 'app-checkout-form',
  templateUrl: './checkout-form.component.html',
  styleUrls: ['./checkout-form.component.css'],
})
export class CheckoutFormComponent {
  checkoutForm = this.formBuilder.group({
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
    address: new FormControl('', [Validators.required]),
    paymentMethod: new FormControl(null, [Validators.required]),
  });
  paymentOptions = paymentOptions;

  constructor(private formBuilder: FormBuilder) {}

  get nameField() {
    return this.checkoutForm.get('name')!;
  }

  get addressField() {
    return this.checkoutForm.get('address')!;
  }

  get paymentMethodField() {
    return this.checkoutForm.get('paymentMethod')!;
  }

  get nameErrors() {
    if (this.nameField.errors?.['required']) {
      return 'This field is required';
    }
    if (this.nameField.errors?.['minlength']) {
      return 'This field requires at least four characters';
    }
    return '';
  }

  get addressErrors() {
    if (this.addressField.errors?.['required']) {
      return 'This field is required';
    }
    return '';
  }

  get paymentMethodErrors() {
    if (this.paymentMethodField.errors?.['required']) {
      return 'This field is required';
    }
    return '';
  }

  onSubmit(): void {
    this.checkoutForm.markAllAsTouched();
    this.checkoutForm.updateValueAndValidity();

    if (!this.checkoutForm.invalid) {
      Notification.show(
        `Submitted checkout form: ${JSON.stringify(this.checkoutForm.value)}`,
        { theme: 'primary' }
      );
      this.checkoutForm.reset();
    }
  }
}
