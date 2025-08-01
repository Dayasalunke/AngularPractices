import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../services/product.service';
import { cart, product } from '../data-type';
import { warn } from 'node:console';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-product-details',
  standalone: false,
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css',
})
export class ProductDetailsComponent implements OnInit {
  productData: undefined | product;
  productQuantity: number = 1;
  quantity: number = 1;
  removeCart = false;
  cartData: product | undefined;

  constructor(
    private activateRoute: ActivatedRoute,
    private product: ProductService,@Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    let productId = this.activateRoute.snapshot.paramMap.get(`productId`);
    // console.warn(productId);
  if(isPlatformBrowser(this.platformId)){
      this.product.getProduct(productId).subscribe((result) => {
        this.productData = result;

        let cartData = localStorage.getItem('localCart');
        if (productId && cartData) {
          let items = JSON.parse(cartData);
          items = items.filter(
            (item: product) => productId === item.id.toString()
          );
          // console.log(items.length)
          if ( items.length != Number(NaN) && items.length ) {
            this.removeCart = true;
          } else {
            this.removeCart = false;
          }
        }
        let user = localStorage.getItem('user');
        if (user) {
          let userId = user && JSON.parse(user).id;
          this.product.getCartList(userId);
          
          this.product.cartData.subscribe((result) => {
          let item = result.filter((item: product) =>
          productId === item.productId?.toString()
          );
// console.log(item.length)
         if (item.length) {
         this.cartData = item[0];
         this.removeCart = true;
         }
         });
        }
      });
    }
  }

  handleQuantity(val: string) {
    if (this.productQuantity < 20 && val === 'plus') {
      this.productQuantity += 1;
      // this.productQuantity = this.productQuantity + 1;
    } else if (this.productQuantity > 1 && val === 'min') {
      this.productQuantity -= 1;
      // this.productQuantity = this.productQuantity - 1;
    }
  }
  addToCart() {
    if (this.productData) {
      this.productData.quantity = this.productQuantity;
      if (!localStorage.getItem('user')) {
        this.product.localAddToCart(this.productData);
        this.removeCart = true;
      } else {
        let user = localStorage.getItem('user');
        let userId = user && JSON.parse(user).id;
        let cartData: cart = {
          ...this.productData,
          productId: this.productData.id,
          userId,
        };
        delete cartData.id;
        this.product.addToCart(cartData).subscribe((result) => {
          if (result) {
            this.product.getCartList(userId);
            // console.warn(cartData);
            this.removeCart = true;
          }
        });
      }
    }
  }
removeToCart(productId: number) {

  if (!localStorage.getItem('user')) {
    this.product.removeItemFromCart(productId);
    this.removeCart = false;
  } else {
    this.removeCart = false;
      let user = localStorage.getItem('user');
      let userId = user && JSON.parse(user).id;
    if (this.cartData && this.cartData.id != null) {
 this.product.removeToCart(this.cartData.id).subscribe((result) => {
    if (result) {
      this.product.getCartList(userId);
    }
  });
} else {
  // console.warn('Invalid cartData or cartData.id is null');
}
    }
  }
}


