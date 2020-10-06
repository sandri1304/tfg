import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Router } from "@angular/router";

@Component({
  selector: 'app-client-categorie',
  templateUrl: './client-categorie.component.html',
  styleUrls: ['./client-categorie.component.css']
})
export class ClientCategorieComponent implements OnInit {

  @Input() public dataCategory;
  imagen:string | ArrayBuffer = null;

  constructor(private router: Router) { }

  ngOnInit() {
    console.log(this.dataCategory.nombre);
    this.imagen = this.dataCategory.imagen;
  }

  getProducts() {
    let url = "/home/category/" + this.dataCategory.nombre;
    this.router.navigate([url]);
  }

}
