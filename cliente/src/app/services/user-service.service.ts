import { Injectable } from '@angular/core';
import {Users} from '../dataModels/users';
import { Subject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {

  private usernameSubject = new Subject<string>();
  public usernameObs$ = this.usernameSubject.asObservable();

  private urlSubject = new Subject<string>();
  public urlObs$ = this.urlSubject.asObservable();

  private urlOrdersSubject = new Subject<string>();
  public urlOrdersObs$ = this.urlOrdersSubject.asObservable();

  private productCartSubject = new Subject<string>();
  public productCartObs$ = this.productCartSubject.asObservable();

  logged: boolean = false;
  userName: string = "";
  profile: string = "";
  id: string = "";
  currentPath: string = "";
  previousPath: string = "";
  creditCardInfo = {};
  payment: string;

  isUserLoggedIn;
  public usserLogged:Users;

  constructor() {
    let user = localStorage.getItem('currentUser');
    if (user != null) {
      let parsedUser = JSON.parse(user);
      if(parsedUser){
        this.logged = parsedUser.logged;
        this.userName = parsedUser.userName;
        this.profile = parsedUser.profile;
        this.id = parsedUser.id;
      }
    }
    let path = localStorage.getItem('currentPath');
    if (path != null) {
      this.currentPath = JSON.parse(path);
    }

    let previous = localStorage.getItem('previousPath');
    if (previous != null) {
      this.previousPath = JSON.parse(previous);
    }

    this.creditCardInfo  = {};
  }

  getUserName(){
    return this.userName;
  }

  getProfile(){
    return this.profile;
  }

  getId() {
    return this.id;
  }

  isLogged(){
    return this.logged;
  }

  isAdmin(){
    return this.profile == "admin";
  };

  setUser(user){
    console.log('set user');
    this.logged = user.logged;
    this.userName = user.userName;
    this.profile = user.profile;
    this.id = user.id;
    this.usernameSubject.next(this.userName);
    this.urlSubject.next("/user/"+ this.id);
    this.urlOrdersSubject.next("/orders/"  + this.id);
    localStorage.setItem('currentUser', JSON.stringify(user));
  };

  clearUser(){
    console.log('clear user');
    this.logged = false;
    this.userName = "";
    this.profile = "";
    this.id = "";
    this.usernameSubject.next("");
    this.urlSubject.next("");
    this.urlOrdersSubject.next("");
    localStorage.removeItem('currentUser');
  };

  setPath(path) {
    this.currentPath = path;
    localStorage.setItem('currentPath', JSON.stringify(path));
  };

  getPath() {
    return this.currentPath;
  };

  setPreviousPath(path) {
    this.previousPath = path;
    localStorage.setItem('previousPath', JSON.stringify(path));
  };

  getPreviousPath() {
    return this.previousPath;
  };

  clearCurrentPath() {
    this.currentPath = "";
    localStorage.removeItem('currentPath');
  };

  clearPreviousPath() {
    this.previousPath = "";
    localStorage.removeItem('previousPath');
  };

  setProduct(id, marca, modelo, pvp, imagen, envioOnline) {
    debugger;
    let products = this.getProductsCart();
    let product ={
        id: id,
        modelo: modelo,
        marca: marca,
        pvp: pvp,
        imagen: imagen,
        envioOnline: envioOnline
      }
    if (products == null) {
      products = [];

    }
    products.push(product);
    let countProduct = products.length;
    this.productCartSubject.next(countProduct.toString());
    localStorage.setItem('productsCart',JSON.stringify(products));
  };



  getProductsCart() {
    return JSON.parse(localStorage.getItem('productsCart'));
  };

  removeProduct(element,  all) {
    let products = this.getProductsCart();
    let i;
    let j  =  0;
    if (all) {
      products = products.filter(function(dato){
        if (dato.id == element.id) {
          return false;
        } else {
          return true;
        }
      });
    } else {
      products.forEach(elementProduct => {
        if(element.id == elementProduct.id) {
         i = j;
        }
        j++;
      });
      products.splice(i, 1);
    }

    localStorage.removeItem('productsCart');
    let countProduct = products.length;
    this.productCartSubject.next(countProduct.toString());
    localStorage.setItem('productsCart',JSON.stringify(products));
  };

  removeAllProduct() {
    localStorage.removeItem('productsCart');
    let countProduct = 0;
    this.productCartSubject.next(countProduct.toString());
  };

  setCreditCardData(creditCardData, payment) {
    this.creditCardInfo = creditCardData;
    this.payment = payment;
  }

  getCreditCardData() {
    return this.creditCardInfo;
  }

  getPayment() {
    return this.payment;
  }

  setOrder(data) {
    
    let orders  = {
      send: data.send, 
      products : this.getProductsCart()
    }
    localStorage.setItem('orders',JSON.stringify(orders));

  }

}
