import { product } from "./product";

export class CartItem{
  quantity: number;

  
    constructor(product:product,quan :number){
      this.product = product;  
      this.quantity = quan;
    }
    product:product;
   
    get price():number{
        return this.product.price * this.quantity;
    }
}