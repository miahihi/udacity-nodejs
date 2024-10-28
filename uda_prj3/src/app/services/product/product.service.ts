import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { product } from '../../shared/models/product';
import { Tag } from '../../shared/models/Tag';

@Injectable({
  providedIn: 'root',
})
export class productService {
  private baseUrl = '/assets/data.json'
  private products: product[] = [];
  private tags: Tag[] = [];

  constructor(private http: HttpClient) {
  }

  // getproductById(id: number): product | undefined {
  //   return this.products.find(product => product.id === id);
  // }


  getAllproductsBySearchTerm(searchTerm: string): product[] {
    return this.products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
   getAll() {
    return this.http.get <product []> (this.baseUrl)
  }
  getProductById(id: number): Observable<product> {
    return this.getAll().pipe(
      map(products => products.find(product => product.id === id)!)
    );
  }
}