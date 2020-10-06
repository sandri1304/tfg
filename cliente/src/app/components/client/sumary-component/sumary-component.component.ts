import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { UserServiceService } from '../../../services/user-service.service';

@Component({
  selector: 'app-sumary-component',
  templateUrl: './sumary-component.component.html',
  styleUrls: ['./sumary-component.component.css']
})
export class SumaryComponentComponent implements OnInit {

  products = [];
  imagen: string | ArrayBuffer = null;
  total: number= 0;

  constructor(private userService: UserServiceService,
              private router: Router) { }

  ngOnInit() {
    let prods = this.userService.getProductsCart();
    let me = this;

    let productsCopy= [];
    let prodIds = [];
    prods.forEach(element => {
      if( productsCopy[element.id] == null){
        element.numProduct = 1;
        element.totalpvp =  element.pvp;
        element.online = true;
        element.shop = false;
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
  }

}
