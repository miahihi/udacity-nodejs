import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { productService } from '../services/product/product.service';
import { product } from '../shared/models/product';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from '../services/cart/cart.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @Output() productAdded = new EventEmitter<any>(); // Output event emitter
  quantities: number = 0;
  selectedValue: number;
  products: product[] = [];
  product!: product;

  constructor(private productService: productService,
    private cartService: CartService,
    private route: ActivatedRoute, private router: Router) {
    this.selectedValue = 1;
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params.searchTerm)
        this.products = this.productService.getAllproductsBySearchTerm(params.searchTerm);
      else
        this.productService.getAll().subscribe((products: product[]) => {
          this.products = products;
        });
    });
  }

  onSelectChange(event: any) {
    this.selectedValue = event.target.value;
    console.log(this.selectedValue);
  }

  addToCart(id: any) {
    this.productService.getProductById(parseInt(id)).subscribe(
      product => {
        this.product = product;
        this.cartService.addToCart(this.product, this.selectedValue);
        console.log(this.selectedValue);
        this.productAdded.emit(product); // Emit the added product
        window.alert('Add to cart successfully!');
      });
  }
}
