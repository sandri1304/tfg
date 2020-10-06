import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-product-home',
  templateUrl: './product-home.component.html',
  styleUrls: ['./product-home.component.css']
})
export class ProductHomeComponent implements OnInit {

  front = [
    {
      code: 'ofertas',
      url: '/nevado/front/ofertas',
      title: 'Nuestras Ofertas'
    },
    {
      code: 'topventas',
      url: '/nevado/front/topVentas',
      title: 'Los Productos más vendidos'
    }
  ];

  constructor() { }

  ngOnInit() {
  }

}
