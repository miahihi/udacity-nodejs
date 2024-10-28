import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from '../services/cart/cart.service';
import { productService } from '../services/product/product.service';
import { product } from '../shared/models/product';

@Component({
  selector: 'app-product-page',
  templateUrl: './product-page.component.html',
  styleUrls: ['./product-page.component.css']
})
export class productPageComponent implements OnInit {

  product!: product;
  quantities: number = 0;
  selectedValue: number;
 
  constructor(private activatedRoute:ActivatedRoute,
    private productService: productService,
    private cartService: CartService,
    private router: Router,
    private route: ActivatedRoute) { 
    this.selectedValue = 1;
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params.id) {
        this.productService.getProductById(parseInt(params.id, 10)).subscribe(product => {
          this.product = product;
        });
      }
    });
  }

  onSelectChange(event: any) {
    this.selectedValue = event.target.value;
    console.log(this.selectedValue); 
  }

  addToCart(){
    this.cartService.addToCart(this.product,this.selectedValue);
    console.log(this.selectedValue)
    window.alert('Add to cart successfully!');
    this.router.navigateByUrl('/cart-page');
  }

}
