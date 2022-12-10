import { Injectable } from '@angular/core';
import {Product} from "./products";
import {BehaviorSubject} from "rxjs";

function generateItems() {
  const products = [];
  for(let i = 0; i < 500; i++) {
    const product: Product = {
      id: i,
      name: `Product ${i}`,
      description: `Description ${i}`,
      price: i
    }
    products.push(product);
  }
  return products;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private items: BehaviorSubject<Product[]> = new BehaviorSubject([] as Product[]);
  items$ = this.items.asObservable();

  constructor() {
    this.items.next(generateItems());
  }

  addToCart(product: Product) {
    this.items.next([...this.items.value, product])
  }

  removeFromCart(product: Product) {
    this.items.next(this.items.value.filter(item => item !== product));
  }

  getItems() {
    return this.items;
  }

  clearCart() {
    this.items.next([])
  }
}
