import { Component, OnInit } from '@angular/core';
import { UserServiceService } from '../../../services/user-service.service';
import { element } from 'protractor';
import { Router, ActivatedRoute } from "@angular/router";
import { fromEvent } from 'rxjs';
import { map, debounceTime, startWith } from 'rxjs/operators';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-cart-component',
  templateUrl: './cart-component.component.html',
  styleUrls: ['./cart-component.component.css']
})
export class CartComponentComponent implements OnInit {

  productTitle: string;
  products = [];
  imagen: string | ArrayBuffer = null;
  total: number= 0;
  isSmallScreenObs;
  isSmallScreen;


  constructor(private userService: UserServiceService, 
              private router: Router,
              private activeRoute: ActivatedRoute,
    ) { }

  ngOnInit() {
    this.userService.setPath(this.router.url);
    this.productTitle = (this.userService.getProductsCart().length == 0)? "No  hay artículos en la cesta" : (this.userService.getProductsCart().length > 1) ? "Artículos" : "Artículo";
    let prods = this.userService.getProductsCart();
    let me = this;

    let productsCopy= [];
    let prodIds = [];
    prods.forEach(element => {
      if( productsCopy[element.id] == null){
        element.numProduct = 1;
        element.totalpvp =  element.pvp;
        if (element.envioOnline) {
          element.online = true;
          element.shop = false;
        } else {
          element.online = false;
          element.shop = true;
        }
        
        productsCopy[element.id] =  element;
        prodIds.push(element.id);
      }else{
        productsCopy[element.id].numProduct++;
        productsCopy[element.id].totalpvp = productsCopy[element.id].pvp  * productsCopy[element.id].numProduct;
      }
      this.total =Math.round(( this.total + element.pvp) * 100)/100;

    });

    prodIds.forEach(id =>{
      me.products.push(productsCopy[id]);
    })

    // Checks if screen size is less than 1024 pixels
    const checkScreenSize = () => document.body.offsetWidth < 968;
    const screenSizeChanged3$ = fromEvent(window, 'resize').pipe(debounceTime(500)).pipe(map(checkScreenSize));
    this.isSmallScreenObs = screenSizeChanged3$.pipe(startWith(checkScreenSize())).subscribe(o => { me.isSmallScreen = o; });

  }

  addProduct(i) {
    this.products[i].numProduct = this.products[i].numProduct +  1;
    this.products[i].totalpvp = Math.round( (this.products[i].pvp  * this.products[i].numProduct)*100)/100;
    this.userService.setProduct(this.products[i].id, this.products[i].marca, this.products[i].modelo, this.products[i].pvp, this.products[i].imagen, true);
    this.total = Math.round(( this.total + this.products[i].pvp)*100)/100;

  }

  lessProduct(i) {
    let nProduct = this.products[i].numProduct - 1 ;
    if(nProduct == 0) nProduct = 1;
    this.products[i].numProduct = nProduct ;
    this.products[i].totalpvp = Math.round((this.products[i].pvp  * this.products[i].numProduct)*100)/100;
    this.userService.removeProduct(this.products[i], false);
    this.total = Math.round(( this.total  - this.products[i].pvp)*100)/100;
  }

  modifiedOnline(event, i) {
    this.products[i].online = event.checked;
    this.products[i].shop = !event.checked;

    let productsOnline = this.userService.getProductsCart();

    for (let j =  0; j < productsOnline.length; j++) {
      this.userService.removeProduct(this.products[j], true);
    }

    for(let d = 0; d <productsOnline.length; d++) {
      if  (i== d && productsOnline[d].id == this.products[i].id) {
        this.userService.setProduct(productsOnline[d].id, productsOnline[d].marca, productsOnline[d].modelo, productsOnline[d].pvp, productsOnline[d].imagen, !productsOnline[d].envioOnline);
      } else{
        this.userService.setProduct(productsOnline[d].id, productsOnline[d].marca, productsOnline[d].modelo, productsOnline[d].pvp, productsOnline[d].imagen, productsOnline[d].envioOnline);
      }
    }
  }


  modifiedShop(event, i) {
    this.products[i].shop = event.checked;
    this.products[i].online = !event.checked;
    let productsOnline = this.userService.getProductsCart();

    for (let j =  0; j < productsOnline.length; j++) {
      this.userService.removeProduct(this.products[j], true);
    }

    for(let d = 0; d <productsOnline.length; d++) {
      if  (i== d && productsOnline[d].id == this.products[i].id) {
        this.userService.setProduct(productsOnline[d].id, productsOnline[d].marca, productsOnline[d].modelo, productsOnline[d].pvp, productsOnline[d].imagen, !productsOnline[d].envioOnline);
      } else{
        this.userService.setProduct(productsOnline[d].id, productsOnline[d].marca, productsOnline[d].modelo, productsOnline[d].pvp, productsOnline[d].imagen, productsOnline[d].envioOnline);
      }
    }
  }


  removeProduct(i) {

    this.userService.removeProduct(this.products[i], true);
    this.products.splice(i, 1);
    this.total = 0;
    this.products.forEach(element => {
      this.total =Math.round(( this.total + element.pvp) * 100)/100;
    })
  }

  removeCart() {
    this.total = 0;
    this.productTitle  = "No hay artículos en tu cesta"
    this.products=[];
    this.userService.removeAllProduct();
  }

  keepBuying() {
    let url = "/home";
    this.router.navigate([url]);
  }

  processOrder(){
    let urlRedirect;
    let params;
    if (this.userService.isLogged()) {
      let id = this.userService.getId();
      urlRedirect = '/user/' + id;
      params ="cart";
    } else {
      urlRedirect = '/login';
      params =  '/home/cart';
    }


    this.router.navigate([urlRedirect], { queryParams: { url: params }});
  }

}
