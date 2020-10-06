 import { Component, OnInit, ViewChild, ElementRef, Output , EventEmitter} from '@angular/core';

import { UserServiceService} from '../../services/user-service.service';
import { AuthServiceService} from '../../services/auth-service.service';
import { OrdersServiceService } from '../../services/admin/orders/orders-service.service';
import { Subscription, timer } from "rxjs";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  isCollapsed: boolean;
  logU: boolean = false;
  @Output() marginContainer = new EventEmitter<string>();
  username: string;
  id: string;
  url: string;
  urlOrders: string
  countOrders: number;
  showPedidos: boolean;
  productsCart: string;

  private usernameRef: Subscription = null;
  private urlRef: Subscription = null;
  private urlRefOrders: Subscription =null;
  private countOrdersRef: Subscription = null;
  private productsCartRef: Subscription = null;
  logTimer;


  @ViewChild("headerNav", {read: false, static: true}) headerNav: ElementRef;
  @ViewChild("headerNavbarDropdownList", {read: false, static: true}) headerNavbarDropdownList: ElementRef;
 // @ViewChild("headerNavbarDropdownButton",{read:false, static: true}) headerNavbarDropdownButton:ElementRef;


  constructor(private userService: UserServiceService,
              private authService: AuthServiceService,
              private ordersService: OrdersServiceService) {
  }

  ngOnInit() {
    this.isCollapsed = true;
    if (this.userService.isLogged()) {
      this.username = this.userService.getUserName().split('@')[0];
      this.id = this.userService.getId();
      if (!this.userService.isAdmin()) {
        this.url= "/user/" + this.id;
        this.urlOrders= "/orders/" + this.id;
      } else {
        this.url ="/admin/clients";
      }

    }


    var me = this;

    this.usernameRef = this.userService.usernameObs$.subscribe((username)=>{
      me.username = username;
    })

    this.urlRef = this.userService.urlObs$.subscribe((url)=> {
      me.url = url;
    })

    this.urlRefOrders = this.userService.urlOrdersObs$.subscribe((urlOrders) => {
      console.log("entro "+ urlOrders);
      me.urlOrders = urlOrders
    })

    this.countOrdersRef = this.ordersService.countOrdersObs$.subscribe((countOrders)=>{
      me.countOrders = countOrders;
    })

    this.productsCartRef = this.userService.productCartObs$.subscribe((productsCart)=>{
      me.productsCart = productsCart;
    })

    let products = this.userService.getProductsCart();
    if (products  != null) {
      me.productsCart = products.length;
    } else  {
      me.productsCart = "0";
    }



  }

  onResize(event) {
    this.containerMargin();
  }

  ngOnDestroy(){
    this.usernameRef.unsubscribe();
    this.urlRef.unsubscribe();
    this.urlRefOrders.unsubscribe();
    this.countOrdersRef.unsubscribe();
  }

  containerMargin() {
    let navbar = this.headerNav.nativeElement;
    let dropdownNavbar = this.headerNavbarDropdownList.nativeElement;

    let height = 78;

		if(navbar && navbar.offsetHeight){
			height = navbar.offsetHeight;
		}

    if(dropdownNavbar && dropdownNavbar.classList.contains("show")){
			height -= dropdownNavbar.offsetHeight;
    }
    this.marginContainer.emit(height + "px");

  };



}
