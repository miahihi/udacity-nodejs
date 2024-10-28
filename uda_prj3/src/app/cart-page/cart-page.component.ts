import { Component, OnInit } from '@angular/core';
import { CartService } from '../services/cart/cart.service';
import { Cart } from '../shared/models/Cart';
import { CartItem } from '../shared/models/CartItem';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-cart-page',
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.css']
})
export class CartPageComponent implements OnInit {
  cart!: Cart;
  fullName: string = '';
  address: string = '';
  creditCard: string = '';

  constructor(private cartService: CartService, private route: ActivatedRoute, private router: Router) {
    this.setCart();
  }

  ngOnInit(): void {}

  // Listen to productAdded event and update the cart
  onProductAdded(product: any) {
    console.log('Product added to cart:', product);
    this.setCart();
  }

  removeFromCart(cartItem: CartItem) {
    this.cartService.removeFromCart(cartItem.product.id);
    this.setCart();
  }

  changeQuantity(cartItem: CartItem, quantityInString: string) {
    const quantity = parseInt(quantityInString);
    this.cartService.changeQuantity(cartItem.product.id, quantity);
    this.setCart();
  }

  setCart() {
    this.cart = this.cartService.getCart();
  }

  clearForm() {
    this.fullName = '';
    this.address = '';
    this.creditCard = '';
  }

  remove(cartItem: CartItem) {
    const confirmed = window.confirm('Are you sure you want to remove the product from your cart?');
    if (confirmed) {
      this.cartService.removeFromCart(cartItem.product.id);
      this.setCart();
    }
  }

  onSubmit() {
    const order = {
      fullName: this.fullName,
      address: this.address,
      creditCard: this.creditCard,
      items: this.cart.items
    };
    if (order != null) {
      const navigationExtras: NavigationExtras = {
        state: {
          fullName: this.fullName,
          price: this.cart.totalPrice
        }
      };
      this.router.navigateByUrl('/success', navigationExtras);
      console.log(navigationExtras);
      this.cart.items = [];
      this.clearForm();
    }
    console.log('Order submitted:', order);
  }
}
