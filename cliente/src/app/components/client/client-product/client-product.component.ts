import { Component, OnInit, Input } from '@angular/core';
import { Properties } from '../../../dataModels/properties';
import { Router } from "@angular/router";
import { UserServiceService } from '../../../services/user-service.service';

@Component({
  selector: 'app-client-product',
  templateUrl: './client-product.component.html',
  styleUrls: ['./client-product.component.css']
})
export class ClientProductComponent implements OnInit {

  imagen:string | ArrayBuffer = null;
  oferta: boolean = false;
  reducePVP;
  previousPVP = {};
  previousPVP2 = {};
  freeSend:boolean=false;
  currentRate;

  @Input() public dataProduct;

  constructor(private router: Router,
              private userSrv: UserServiceService) { }




  ngOnInit() {
    debugger;
    this.initOffer();
    if (this.dataProduct.envioGratuito) {
      this.freeSend = this.dataProduct.envioGratuito;
    }
    this.currentRate = this.dataProduct.estrellas / this.dataProduct.usuarios;
    this.imagen = this.dataProduct.imagen;
  }

  goToDetailProduct() {
    console.log(this.dataProduct._id);
    let url = "/home/product/" + this.dataProduct._id;
    this.router.navigate([url], { queryParams: { category: this.dataProduct.categoria }});
  }

  buyProduct() {
    debugger;
    let id = this.dataProduct._id;
    let marca = this.dataProduct.marca;
    let modelo = this.dataProduct.modelo;
    let imagen =  this.dataProduct.imagen;
    let pvp = (this.reducePVP != null) ? this.reducePVP : this.dataProduct.pvp;
    this.userSrv.setProduct(id, marca, modelo,pvp, imagen, true);

    let url = "/home/cart/";
    this.router.navigate([url]);
  }


  initOffer(){
    if (this.dataProduct.ofertas != null) {
  
      let offer = this.dataProduct.ofertas;
      if (Array.isArray(offer) && offer[0] != null ) {
        this.dataProduct.ofertas = offer[0];
      }else if(this.dataProduct.ofertas.descuento != null) {
        
      }else{
        return;
      }

      let today = new Date();
      let dateInit = new Date(this.dataProduct.ofertas.fechaInicio);
      let dateFin =  new Date(this.dataProduct.ofertas.fechaFin);
      if  (dateInit <= today && dateFin >=  today){
        this.oferta = true;
        this.reducePVP = Math.round((this.dataProduct.pvp - (this.dataProduct.pvp * this.dataProduct.ofertas.descuento) / 100.00)*100)/100;
        this.previousPVP = {
          "color": "rgb(211, 212, 213)",
          "text-decoration": "line-through",
          "font-size": "60%",
        };
      };
    }
  
  }
}


