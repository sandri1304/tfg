import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { map, debounceTime, startWith } from 'rxjs/operators';
import { fromEvent } from 'rxjs';

import { FrontServiceService } from '../../../services/front/front-service.service';
import { UserServiceService }from '../../../services/user-service.service';

@Component({
  selector: 'app-categorie-home',
  templateUrl: './categorie-home.component.html',
  styleUrls: ['./categorie-home.component.css']
})
export class CategorieHomeComponent implements OnInit {

  categories;
  title: string;
  isSmallScreenObs;
  isSmallScreen;
  isSmallScreenObs2;
  isSmallScreen2;
  isSmallScreenObs3;
  isSmallScreen3;

  classLarge: boolean;
  classSmall: boolean;
  classImage: boolean;
  classSound: boolean;
  classTelephony: boolean;
  classPersonalCare : boolean;
  classCleaning : boolean;
  classAir  : boolean;
  classComputing: boolean;

  constructor(private activeRoute: ActivatedRoute, 
              private frontSrv: FrontServiceService,
              private userSrv:  UserServiceService,
              private router: Router,
    ) { }


  ngOnInit() {
    this.userSrv.setPath(this.router.url);
    let url = this.activeRoute.snapshot;
    switch(url.url[1].path) {
      case "largeAppliances": {
        this.title = "Gran Electrodoméstico";
        this.classLarge  = true;
        this.classSmall =  false;
        this.classImage = false;
        this.classSound  = false;
        this.classTelephony = false;
        this.classPersonalCare = false;
        this.classCleaning = false;
        this.classComputing =  false;
        break;
      }
      case "smallKitchenAppliances": {
        this.title = "Pequeño Electrodoméstico de cocina";
        this.classSmall =  true;
        this.classLarge  = false;
        this.classImage = false; 
        this.classTelephony = false;
        this.classPersonalCare = false;
        this.classCleaning = false;
        this.classSound  = false;
        this.classAir  = false;
        this.classComputing =  false;
        break;
      }
      case "image": {
        this.title = "Imagen";
        this.classSmall =  false;
        this.classLarge  = false; 
        this.classImage = true;
        this.classSound  = false;
        this.classTelephony = false;
        this.classPersonalCare = false;
        this.classCleaning = false;
        this.classAir  = false;
        this.classComputing =  false;
        break;
      }
      case "sound": {
        this.title = "Sonido";
        this.classLarge  = false;
        this.classSmall =  false;
        this.classImage = false;
        this.classSound  = true;
        this.classTelephony = false;
        this.classPersonalCare = false;
        this.classCleaning = false;
        this.classAir  = false;
        this.classComputing =  false;
        break;
      }
      case "telephony": {
        this.title = "Telefonía y electrónica";
        this.classLarge  = false;
        this.classSmall =  false;
        this.classImage = false;
        this.classSound  = false;
        this.classTelephony = true;
        this.classPersonalCare = false;
        this.classCleaning = false;
        this.classAir  = false;
        this.classComputing =  false;
        break;
      }
      case "personalCare": {
        this.title = "Cuidado Personal";
        this.classLarge  = false;
        this.classSmall =  false;
        this.classImage = false;
        this.classSound  = false;
        this.classTelephony = false;
        this.classPersonalCare = true;
        this.classCleaning = false;
        this.classAir  = false;
        this.classComputing =  false;
        break;
      }
      case "cleaning": {
        this.title = "Limpieza";
        this.classLarge  = false;
        this.classSmall =  false;
        this.classImage = false;
        this.classSound  = false;
        this.classTelephony = false;
        this.classPersonalCare = false;
        this.classCleaning = true;
        this.classAir  = false;
        this.classComputing =  false;
        break;
      }
      case "airConditioning": {
        this.title = "Climatización";
        this.classLarge  = false;
        this.classSmall =  false;
        this.classImage = false;
        this.classSound  = false;
        this.classTelephony = false;
        this.classPersonalCare = false;
        this.classCleaning = false;
        this.classAir  = true;
        this.classComputing =  false;
        break;
      }
      case "computing": {
        this.title = "Informática";
        this.classLarge  = false;
        this.classSmall =  false;
        this.classImage = false;
        this.classSound  = false;
        this.classTelephony = false;
        this.classPersonalCare = false;
        this.classCleaning = false;
        this.classAir  = false;
        this.classComputing =  true;
        break;
      }
    }
    let urlGet =  "front/" + url.url[1].path;
    let me = this;
    this.frontSrv.getCategoriesData(this.title, urlGet).subscribe(data => {
      me.categories = data;
    });

     // Checks if screen size is less than 1024 pixels
     const checkScreenSize = () => document.body.offsetWidth < 1058;

     // Create observable from window resize event throttled so only fires every 500ms
     // const screenSizeChanged$ = Observable.fromEvent(window, 'resize').throttleTime(500).map(checkScreenSize);
     const screenSizeChanged2$ = fromEvent(window, 'resize').pipe(debounceTime(500)).pipe(map(checkScreenSize));
     // Start off with the initial value use the isScreenSmall$ | async in the
     // view to get both the original value and the new value after resize.
     this.isSmallScreenObs = screenSizeChanged2$.pipe(startWith(checkScreenSize())).subscribe(o => { me.isSmallScreen = o; });

     const checkScreenSize2 = () => document.body.offsetWidth < 694;
     const screenSizeChanged3$ = fromEvent(window, 'resize').pipe(debounceTime(500)).pipe(map(checkScreenSize2));
     this.isSmallScreenObs2 = screenSizeChanged3$.pipe(startWith(checkScreenSize())).subscribe(o => { me.isSmallScreen2 = o; });

     const checkScreenSize3 = () => document.body.offsetWidth < 1175;
     const screenSizeChanged4$ = fromEvent(window, 'resize').pipe(debounceTime(500)).pipe(map(checkScreenSize3));
     this.isSmallScreenObs3 = screenSizeChanged4$.pipe(startWith(checkScreenSize())).subscribe(o => { me.isSmallScreen3 = o; });
  }

  addClassForCategorie() {
    let item = this.router.url;
    console.log(item);
  }
}
