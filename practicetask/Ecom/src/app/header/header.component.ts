import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../services/product.service';
import { product } from '../data-type';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  menuType: string = 'default';
  sellerName: string = '';
  searchResult: undefined|product[];
  userName:string="";

  constructor(private route: Router, private product: ProductService) {}

  ngOnInit(): void {
    this.route.events.subscribe((val: any) => {
      if (val.url) {
        if (localStorage.getItem('seller') && val.url.includes('seller')) {
          let sellerStore = localStorage.getItem('seller');
          let sellerData = sellerStore && JSON.parse(sellerStore)[0];
          this.sellerName = sellerData.name;
          this.menuType = 'seller';
        } else if(localStorage.getItem(`user`)){
          let userStore=localStorage.getItem(`user`);
          let userData=userStore && JSON.parse(userStore);
          this.userName=userData.name;
          this.menuType='user';
        } else {
          this.menuType = 'default';
        }
      }
    });
  }

  logout() {
    localStorage.removeItem('seller');
    this.route.navigate(['/']);
  }
  userLogout(){
    localStorage.removeItem('user');
    this.route.navigate(['/user-auth']);
  }

  searchProduct(query: KeyboardEvent) {
    const element = query.target as HTMLInputElement;
    const searchTerm = element.value;
  
    if (searchTerm) {
      this.product.searchProduct(searchTerm).subscribe((result: product[]) => {
        if (result.length > 5) {
          result.length = 5;
        }
        this.searchResult = result;
      });
    } else {
      this.searchResult = [];
    }
  }
  
  

  hideSearch() {
    this.searchResult = undefined; 
  }
  
  redirectToDetails(id:string){
  this.route.navigate(['/details/',id]);
  }
  submitSearch(val: string) {
      this.route.navigate([`search/${val}`]);
  }
}