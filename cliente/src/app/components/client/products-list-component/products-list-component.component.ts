import { Component, AfterViewInit, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FrontServiceService } from '../../../services/front/front-service.service';
import { Properties } from '../../../dataModels/properties';
import {FormControl, Validators} from '@angular/forms';
import { filter } from 'rxjs/operators';
import { Options, LabelType } from 'ng5-slider';
import { MatPaginator } from '@angular/material/paginator';
import { fromEvent } from 'rxjs';
import { map, debounceTime, startWith } from 'rxjs/operators';
import { UserServiceService} from '../../../services/user-service.service';


@Component({
  selector: 'app-products-list-component',
  templateUrl: './products-list-component.component.html',
  styleUrls: ['./products-list-component.component.css']
})
export class ProductsListComponentComponent implements OnInit, AfterViewInit {

  products;
  category: string;
  filters=[];
  options = [];
  brands = [];
  requestUrl: string;
  checked:string;
  minValue:number=0;
  maxValue: number=1000;
  placeholderExample: string;
  numPage: number;
  resultsLength = 0;
  itemsPerPageLabel: string ="";
  observer = null;
  pageSize=12;
  isSmallScreenObs;
  isSmallScreen;
  isSmallScreenObs2;
  isSmallScreen2;
  isSmallScreenObs3;
  isSmallScreen3;
  isSmallScreenObs4;
  isSmallScreen4;


  optionsSlider: Options = {
    floor: 0,
    ceil: 1000,
    translate: (value: number, label: LabelType): string => {
      switch (label) {
        case LabelType.Low:
          return  value + '€' ;
        case LabelType.High:
          return value + '€' ;
        default:
          return value + '€' ;
      }
    }
  };

  placeHolderFeature =[
    {category: "Portatiles", placeholder:"Ej: 1TB"},
    {category: "Lavadoras", placeholder:"Ej: 6Kg"},
    {category: "Depiladoras", placeholder:"Ej: Ipl Luz pulsada"},
    {category: "Televisores", placeholder:"Ej: 32 pulgadas"},
  ]

  //paginacion
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(private activeRoute: ActivatedRoute,
              private frontSrv: FrontServiceService,
              private userSrv: UserServiceService, 
              private router: Router) { }

              ngAfterViewInit() {
debugger;
              }
  ngOnInit() {
    this.userSrv.setPath(this.router.url);
    let me  = this;
    // Checks if screen size is less than 1024 pixels
    const checkScreenSize = () => document.body.offsetWidth < 1440;

    // Create observable from window resize event throttled so only fires every 500ms
    // const screenSizeChanged$ = Observable.fromEvent(window, 'resize').throttleTime(500).map(checkScreenSize);
    const screenSizeChanged2$ = fromEvent(window, 'resize').pipe(debounceTime(500)).pipe(map(checkScreenSize));
    // Start off with the initial value use the isScreenSmall$ | async in the
    // view to get both the original value and the new value after resize.
    this.isSmallScreenObs = screenSizeChanged2$.pipe(startWith(checkScreenSize())).subscribe(o => { me.isSmallScreen = o; });

    const checkScreenSize2 = () => document.body.offsetWidth < 1080;
    const screenSizeChanged3$ = fromEvent(window, 'resize').pipe(debounceTime(500)).pipe(map(checkScreenSize2));
    this.isSmallScreenObs2 = screenSizeChanged3$.pipe(startWith(checkScreenSize2())).subscribe(o => { me.isSmallScreen2 = o; });

    const checkScreenSize3 = () => document.body.offsetWidth < 800;
    const screenSizeChanged4$ = fromEvent(window, 'resize').pipe(debounceTime(500)).pipe(map(checkScreenSize3));
    this.isSmallScreenObs3 = screenSizeChanged4$.pipe(startWith(checkScreenSize3())).subscribe(o => { me.isSmallScreen3 = o; });

    const checkScreenSize4 = () => document.body.offsetWidth < 1175;
    const screenSizeChanged5$ = fromEvent(window, 'resize').pipe(debounceTime(500)).pipe(map(checkScreenSize4));
    this.isSmallScreenObs4 = screenSizeChanged5$.pipe(startWith(checkScreenSize4())).subscribe(o => { me.isSmallScreen4 = o; });

    let url = "front/" + this.activeRoute.snapshot.url[1].path + "/" + this.activeRoute.snapshot.url[2].path;
    this.category = this.activeRoute.snapshot.url[2].path;
    this.requestUrl = Properties.nevado_client_localhost  + Properties.nevado_client_base_context +  '/' + url;
    this.getProductData(this.requestUrl, this.options, this.filters);
    let urlBrands = Properties.nevado_client_localhost  + Properties.nevado_client_base_context +  '/front/brands?category=' + this.category;

    this.frontSrv.getBrands(urlBrands).subscribe(data => {
      me.setBrands(data);
    })
    let placeholderFilter =  this.placeHolderFeature.find(element => element.category == this.category);
    if (placeholderFilter != undefined) {
      this.placeholderExample =  placeholderFilter.placeholder;
    }
    
    this.numPage=1;

  }

  setBrands(data) {
    this.brands = data;
  }

  onChange(event) {
    debugger;
    this.options = this.options.filter(function(dato){
      if (dato.campo == "sort") {
        return false;
      } else {
        return true;
      }
    });
    this.options = this.options.filter(function(dato){
      if (dato.campo == "order") {
        return false;
      } else {
        return true;
      }
    });
    switch(event) {
      case "baratos": {
        this.options.push({campo: 'sort', value: 'precioOrden'});
        this.options.push({campo: 'order', value: 'asc'});
        break;
      };
      case "caros": {
        this.options.push({campo: 'sort', value: 'precioOrden'});
        this.options.push({campo: 'order', value: 'desc'});
        break;
      };
      case "ventas": {
        this.options.push({campo: 'sort', value: 'ventas'});
        this.options.push({campo: 'order', value: 'desc'});
        break;
      }
      case "opiniones": {
        this.options.push({campo: 'sort', value: 'starRating'});
        this.options.push({campo: 'order', value: 'desc'});
        break;
      }
      case "none": {
        this.options = [];
        break;
      }
    }
    this.getProductData(this.requestUrl, this.options, this.filters);
  }

  getProductData(urlRequest, options, filters)  {
    debugger;
    let me = this;
    let o="";
    if (options.length != 0) {
      for (let  i = 0; i < options.length; i++) {
        if(i < options.length-1){
          o = o + options[i].campo  + "=" +  options[i].value + "&";
        } else {
          o = o + options[i].campo  + "=" +  options[i].value
        }
      }
      if(o.indexOf('pageSize') == -1)  {
        o =  o + "&pageSize="+this.pageSize;
      }
      if (o.indexOf('pageIndex') == -1) {
        o =  o + "&pageIndex="+ 1;
      }

    } else{
      if (o == "") {
        o = "pageSize=" + this.pageSize + "&pageIndex=" + 1;
      }
    }
    if (filters.length != 0) {
      let b =  "";
      for (let j = 0; j < filters.length; j++) {
        if (filters[j].campo == "brand") {
          b = b + filters[j].value + ",";
        } else {
          if (o != "") {
            o = o + "&" + filters[j].campo + "=" + filters[j].value;
          } else {
            o = o + filters[j].campo + "=" + filters[j].value;
          }
        }
      }
      if (b !=  "") {
        b = "brands=" + b.substring(0, b.length-1);
      }
      if (o !=  "") {
        o = o + "&" + b;
      } else {
        o = b;
      }
    }
    let url = urlRequest + "?" + o;
    this.frontSrv.getProductData(url).subscribe(data => {
      debugger;

       me.setProduct(data, me);
       me.setTotalProducts(data, me);
    });
  }

  setTotalProducts(data, context) {
    debugger;
    context.resultsLength  = data.count;
  };

  setProduct(data, context) {
    context.products = data.data;
  }

  changeBrand(event)  {
    debugger;
    this.options = this.options.filter(function(dato){
      if (dato.campo == "pageIndex") {
        return false;
      } else {
        return true;
      }
    });
    this.options.push({campo: 'pageIndex', value: 1});
    this.paginator.pageIndex = 0;
    if (event.checked) {
      this.filters.push({campo: 'brand', value: event.source._elementRef.nativeElement.innerText});
    } else {
      this.filters = this.filters.filter(function(dato){
        if(dato.value == event.source._elementRef.nativeElement.innerText) {
          return false;
        } else {
          return true;
        }
      });
    };
    this.getProductData(this.requestUrl, this.options, this.filters);
  };

  changeAvailability(event) {
    this.options = this.options.filter(function(dato){
      if (dato.campo == "pageIndex") {
        return false;
      } else {
        return true;
      }
    });
    this.options.push({campo: 'pageIndex', value: 1})
    this.paginator.pageIndex = 0;
    if (event.checked) {
      this.filters.push({campo: 'stock', value: event.source._elementRef.nativeElement.innerText});
    } else {
      this.filters = this.filters.filter(function(dato){
        if(dato.value == event.source._elementRef.nativeElement.innerText){
          return false;
        } else {
          return true;
        }
      });
    };
    this.getProductData(this.requestUrl, this.options, this.filters);
  };

  changeOffer(event){
    this.options = this.options.filter(function(dato){
      if (dato.campo == "pageIndex") {
        return false;
      } else {
        return true;
      }
    });
    this.options.push({campo: 'pageIndex', value: 1})
    this.paginator.pageIndex = 0;
    if (event.checked) {
      this.filters.push({campo: 'offer', value: event.source._elementRef.nativeElement.innerText});
    } else {
      this.filters = this.filters.filter(function(dato){
        if(dato.value == event.source._elementRef.nativeElement.innerText){
          return false;
        } else {
          return true;
        };
      });
    };
    this.getProductData(this.requestUrl, this.options, this.filters);
  };

  changeFeatures(event) {
    this.options = this.options.filter(function(dato){
      if (dato.campo == "pageIndex") {
        return false;
      } else {
        return true;
      }
    });
    this.options.push({campo: 'pageIndex', value: 1})
    this.paginator.pageIndex = 0;
    this.filters = this.filters.filter(function(dato){
      if (dato.campo == "feature") {
        return false;
      } else {
        return true;
      }
    });
    if (event.target.value != ""){
      this.filters.push({campo: 'feature', value:  event.target.value});
    };
    this.getProductData(this.requestUrl, this.options, this.filters);
  }

  changePrice() {
    
    this.options = this.options.filter(function(dato){
      if (dato.campo == "pageIndex") {
        return false;
      } else {
        return true;
      }
    });
    this.options.push({campo: 'pageIndex', value: 1})
    this.paginator.pageIndex = 0;
    this.filters = this.filters.filter(function(dato){
      if (dato.campo == "min") {
        return false;
      } else {
        return true;
      }
    });
    this.filters = this.filters.filter(function(dato){
      if (dato.campo == "max") {
        return false;
      } else {
        return true;
      }
    });
    this.filters.push({campo: 'min', value:  this.minValue});
    this.filters.push({campo: 'max', value:  this.maxValue});
    this.getProductData(this.requestUrl, this.options, this.filters);
  }


  paginar(event) {
    
    this.pageSize = event.pageSize;
    this.options = this.options.filter(function(dato){
      if (dato.campo == "pageSize") {
        return false;
      } else {
        return true;
      }
    });
    this.options = this.options.filter(function(dato){
      if (dato.campo == "pageIndex") {
        return false;
      } else {
        return true;
      }
    });
    this.options.push({campo: 'pageSize', value: event.pageSize});
    this.options.push({campo: 'pageIndex', value: event.pageIndex + 1})
    this.getProductData(this.requestUrl, this.options, this.filters);
  }

};
