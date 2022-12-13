import {
  Component,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { CartService } from '../cart.service';
import '@vaadin/grid';
import '@vaadin/grid/vaadin-grid-filter-column.js';
import '@vaadin/text-field';
import '@vaadin/select';
import '@vaadin/button';
import '@vaadin/icon';
import '@vaadin/icons';
import { GridItemModel } from '@vaadin/grid';
import { Product } from '../products';
import { Notification } from '@vaadin/notification';

interface PaymentMethodOption {
  value: string;
  label: string;
  icon: string;
}

const paymentOptions: PaymentMethodOption[] = [
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
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  checkoutForm = this.formBuilder.group({
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
    address: new FormControl('', [Validators.required]),
    paymentMethod: new FormControl(null, [Validators.required]),
  });

  paymentOptions = paymentOptions;
  items: Product[] = [];

  message: string = 'Initial message';

  constructor(
    public cartService: CartService,
    private formBuilder: FormBuilder,
  ) {}

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

  ngOnInit(): void {
    this.cartService.items$.subscribe((items) => {
      this.items = items;
    });
  }

  onRemoveItem(item: Product) {
    this.cartService.removeFromCart(item);
  }

  onSubmit(): void {
    // Process checkout data here
    this.checkoutForm.markAllAsTouched();
    this.checkoutForm.updateValueAndValidity();

    if (!this.checkoutForm.invalid) {
      this.cartService.clearCart();
      Notification.show(
        `Your order has been submitted: ${JSON.stringify(
          this.checkoutForm.value
        )}`,
        { theme: 'primary' }
      );
      this.checkoutForm.reset();
    }
  }

  updateMessage() {
    this.message = this.message + ".";
  }

  priceRenderer(root: HTMLElement, _: unknown, model: GridItemModel<Product>) {
    root.textContent = '$' + model.item.price.toFixed(2);
  }
}
