import { Component, OnInit, ViewChild,  ElementRef, Renderer2, Input} from '@angular/core';

import { Properties } from '../../../dataModels/properties';
import { Router, ActivatedRoute } from '@angular/router';
import { FrontServiceService } from '../../../services/front/front-service.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, DialogPosition } from '@angular/material/dialog';
import { fromEvent } from 'rxjs';
import { map, debounceTime, startWith } from 'rxjs/operators';
import { DetailPhotoProductComponent } from '../detail-photo-product/detail-photo-product.component';
import { ReviewComponentComponent  } from '../review-component/review-component.component';
import { UserServiceService } from '../../../services/user-service.service';

@Component({
  selector: 'app-product-detail-client',
  templateUrl: './product-detail-client.component.html',
  styleUrls: ['./product-detail-client.component.css']
})
export class ProductDetailClientComponent implements OnInit {

  product={};

  @Input() public caracteristicas;

  imagen:string | ArrayBuffer = null;
  imagenBrand:  string | ArrayBuffer = null;
  reducePVP:number;
  offer: boolean;
  currentRate:number;
  opinions:string;
  brand: string;
  notes: number;
  freeShipping: boolean;
  stock: boolean;
  promotion: string;
  previousPVP = {};
  hideDiv = {};
  isSmallScreenObs;
  isSmallScreen;
  isSmallScreenObs2;
  isSmallScreen2;
  isSmallScreenObs3;
  isSmallScreen3;
  isSmallScreenObs4;
  isSmallScreen4;
  isSmallHeightObs;
  height;
  count5Star: number = 0;
  count4Star: number = 0;
  count3Star: number = 0;
  count2Star: number = 0;
  count1Star: number = 0;
  countPrice: number = 0;
  reviews;
  recomendation: boolean;
  reviewsCopy;
  filter1: boolean = false;
  filter2: boolean = false;
  filter3: boolean = false;
  filter4: boolean = false;
  filter5: boolean = false;
  category: string;

  @ViewChild("caracteristicas", { static: false }) caract: ElementRef;

  related =
   {
    code: 'similarProduct',
    url: '/nevado/front/similarProducts',
    title: 'Artículos relacionados',
    category:''
  };

  constructor(private activeRoute: ActivatedRoute,
              private frontSrv: FrontServiceService,
              public dialog: MatDialog,
              private userSrv: UserServiceService,
              private router: Router,
              private renderer: Renderer2) { }


  ngOnInit() {
    this.userSrv.setPath(this.router.url);
    this.category = this.activeRoute.snapshot.queryParams.category;
    this.related.url= this.related.url + '?idProduct=' + this.activeRoute.snapshot.url[2].path  +'&category=' +  this.category ;
    let url = "front/" + this.activeRoute.snapshot.url[1].path + "/" + this.activeRoute.snapshot.url[2].path;
    let requestUrl = Properties.nevado_client_localhost  + Properties.nevado_client_base_context +  '/' + url;
    let me = this;
    this.frontSrv.getProductData(requestUrl).subscribe(data => {
      me.product = data;
      console.log(me.product);
      me.setData(me.product, me);
    });
    // Checks if screen size is less than 1024 pixels
    const checkScreenSize = () => document.body.offsetWidth < 1024;

    const checkScreenheight = () => document.body.offsetWidth < 600;
    const screenheightChanged2$ = fromEvent(window, 'resize').pipe(debounceTime(500)).pipe(map(checkScreenheight));
    this.isSmallHeightObs = screenheightChanged2$.pipe(startWith(checkScreenheight())).subscribe(o => { me.height = o; });

    // Create observable from window resize event throttled so only fires every 500ms
    // const screenSizeChanged$ = Observable.fromEvent(window, 'resize').throttleTime(500).map(checkScreenSize);
    const screenSizeChanged2$ = fromEvent(window, 'resize').pipe(debounceTime(500)).pipe(map(checkScreenSize));
    // Start off with the initial value use the isScreenSmall$ | async in the
    // view to get both the original value and the new value after resize.
    this.isSmallScreenObs = screenSizeChanged2$.pipe(startWith(checkScreenSize())).subscribe(o => { me.isSmallScreen = o; });

    const checkScreenSize2 = () => document.body.offsetWidth < 414;
    const screenSizeChanged3$ = fromEvent(window, 'resize').pipe(debounceTime(500)).pipe(map(checkScreenSize2));
    this.isSmallScreenObs2 = screenSizeChanged3$.pipe(startWith(checkScreenSize2())).subscribe(o => { me.isSmallScreen2 = o; });

    const checkScreenSize4 = () => document.body.offsetWidth < 1175;
    const screenSizeChanged5$ = fromEvent(window, 'resize').pipe(debounceTime(500)).pipe(map(checkScreenSize4));
    this.isSmallScreenObs4 = screenSizeChanged5$.pipe(startWith(checkScreenSize4())).subscribe(o => { me.isSmallScreen4 = o; });
  }

  setData(productData, context) {
    context.related.category = productData.categoria;
    if (productData.caracteristicas != null && productData.caracteristicas != "") {
      let features = context.renderer.createElement('div');
      context.renderer.addClass(features, 'featuresClass');
      features.innerHTML = productData.caracteristicas;
      context.renderer.appendChild(context.caract.nativeElement, features);
    }
    debugger;
    if (productData.otros != null && productData.otros != "" && productData.otros != undefined && productData.otros != "undefined") {
      let others = context.renderer.createElement('div');
      context.renderer.addClass(others, 'othersClass');
      others.innerHTML = productData.otros;
      context.renderer.appendChild(context.caract.nativeElement, others);
    }

    context.imagen = productData.imagen;
    if (productData.ofertas != null ){
      let today = new Date();
      let dateInit = new Date(productData.ofertas.fechaInicio);
      let dateFin =  new Date(productData.ofertas.fechaFin);
      if  (dateInit <= today && dateFin >=  today){
        context.reducePVP = Math.round((productData.pvp - (productData.pvp * productData.ofertas.descuento) / 100.00)*100)/100;
        context.offer = true;
        context.promotion = productData.ofertas.descripcion;

      }
    }

    context.currentRate = productData.estrellas / productData.usuarios;
    context.notes = productData.comentarios.length
    context.opinions = (context.notes == 1) ? "opinión" : "opiniones";
    context.brand =  productData.marca;
    context.freeShipping = (productData.envioGratuito) ? true:  false;
    context.stock  = (productData.stock > 0) ? true : false;
    if (productData.stock > 0  && productData.stock < 10) {
      context.stockStyle = {
        "background-color":"rgb(249,246,230)",
        "color":"rgb(236,201,8)",
      }
    } else if (productData.stock > 10) {
      context.stockStyle = {
        "background-color":"rgb(231,249,230)",
        "color":"rgb(25,103,20)",

      }
    }

    let reviews  = productData.comentarios;
    reviews.forEach(element => {
      if(element.calificacionGeneral == 1) {
        context.count1Star++;
      } else if (element.calificacionGeneral  == 2) {
        context.count2Star++;
      } else if (element.calificacionGeneral == 3)  {
        context.count3Star++;
      } else if (element.calificacionGeneral == 4)  {
        context.count4Star++;
      } else if (element.calificacionGeneral == 5)  {
        context.count5Star++;
      }
      if (element.calidadPrecio != 0 && element.calidadPrecio != null) {
        context.countPrice = context.countPrice + element.calidadPrecio;
      }
    });
    if (productData.usuarios != 0  && productData.usuarios != null) {
      context.countPrice = context.countPrice / productData.usuarios;
    }

    context.reviews = reviews;
    this.reviewsCopy = this.reviews;
    let url = "front/brand";
    this.frontSrv.getBrand(url, context.brand).subscribe(data => {
      context.setImageBrand(data);
    })
  }

  setImageBrand(data) {
    this.imagenBrand = data.imagen;
  }

  openPhoto(){
    if (!this.isSmallScreen) {
      this.openDialog(this.imagen, DetailPhotoProductComponent, "800px", "650px");
    }

  }

  addReview(){
    if (this.userSrv.isLogged()) {
      let widthScreen;
      let heightScreen;
      if(this.isSmallScreen2) {
        widthScreen = "300px"
      }  else if (!this.isSmallScreen2 && this.isSmallScreen) {
        widthScreen = "400px"
      }  else {
        widthScreen = "800px"
      }
      if (this.height) {
        heightScreen = "300px"
      } else {
        heightScreen = "550px"
      }
      this.openDialog(this.product, ReviewComponentComponent, widthScreen, heightScreen );
    } else {
      let urlRedirect = '/login';
      let params =  '/home/' + this.activeRoute.snapshot.url[1].path + '/' + this.activeRoute.snapshot.url[2].path;
      this.router.navigate([urlRedirect], { queryParams: { url: params }});
    }
  }

  //abre la ventana de borrado de productos
  openDialog(image, component, x, y): void {
    let position: DialogPosition = {};
    position.top="85px";
    const dialogRef = this.dialog.open(component, {
      width: x,
      height: y,
      disableClose:true,
      position: position,
      data: image
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  };

  filterReviews(num){
    switch(num) {
      case 1: {
        this.filter1 = true;
        this.filter2 = false;
        this.filter3 = false;
        this.filter4 = false;
        this.filter5 = false;
        break;
      }
      case 2: {
        this.filter2 = true;
        this.filter1 = false;
        this.filter3 = false;
        this.filter4 = false;
        this.filter5 = false;
        break;
      }
      case 3: {
        this.filter3 = true;
        this.filter1 = false;
        this.filter2 = false;
        this.filter4 = false;
        this.filter5 = false;
        break;
      }
      case 4: {
        this.filter4 = true;
        this.filter1 = false;
        this.filter2 = false;
        this.filter3 = false;
        this.filter5 = false;
        break;
      }
      case 5: {
        this.filter5 = true;
        this.filter1 = false;
        this.filter2 = false;
        this.filter3 = false;
        this.filter4 = false;
        break;
      }
    }


    let r = this.reviewsCopy;
    this.reviews =  r.filter(review => (review.calificacionGeneral == num));
  }

  cleanFilters() {
    this.filter1 = false;
    this.filter2 = false;
    this.filter3 = false;
    this.filter4 = false;
    this.filter5 = false;
    this.reviews = this.reviewsCopy;
  }

  buyProduct() {
    debugger;
    let id = this.setId(this.product);

    let imagen =  this.imagen;
    let pvp = this.setPVP(this.product);
    let brand = this.setBrand(this.product);
    let model = this.setModel(this.product);
    this.userSrv.setProduct(id,brand, model, pvp, imagen, true);

    let url = "/home/cart/";
    this.router.navigate([url]);
  }

  setId(productData){
    let id = productData._id;
    return id;
  }

  setBrand(productData) {
    return productData.marca;
  }

  setModel(productData) {
    return productData.modelo;
  }

  setPVP(productData) {
    return (this.reducePVP  != null) ? this.reducePVP : productData.pvp;
  }
}
