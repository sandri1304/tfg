import { Component, OnInit  } from '@angular/core';
import {FrontServiceService } from '../../../services/front/front-service.service';
import { FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UserServiceService  }  from '../../../services/user-service.service';
import { Router, ActivatedRoute } from "@angular/router";
import { ActionSequence } from 'protractor';

import { MatRadioChange } from '@angular/material';

declare let paypal: any;

@Component({
  selector: 'app-payment-methods',
  templateUrl: './payment-methods.component.html',
  styleUrls: ['./payment-methods.component.css']
})

export class PaymentMethodsComponent implements OnInit  {

  payments;
  payment: string;
  creditCardForm;
  idUser: string;
  idClient: string;
 
  addScript: boolean = false;
  addButton: boolean = false;
  visa = /^4\d{3}-?\d{4}-?\d{4}-?\d{4}$/;
  mastercard = /^5[1-5]\d{2}-?\d{4}-?\d{4}-?\d{4}$/;

  date1 =  /^\d{1,2}\/\d{2,2}$/;
  date2 =  /^\d{1,2}\/\d{2,4}$/;
  total=0;


  paypalConfig:  any = {
    env: 'sandbox',
    client: {
      sandbox: 'AcetckagNAGCl4yDvWSGAdpqNfOLyPjEyUFGv2SZoV9pZ7LlDqvTE4HPDKe65tgIna5_mOE7EgEjxeD6'
    },
    commit: true, 
    payment: (data, actions) => {
      return actions.payment.create({
        payment: {
          transactions: [
            {amount: {total: this.total, currency:'EUR'}}
          ]
        }
      });
    },
    onAuthorize: (data, actions) => {
      return actions.payment.execute().then((payment) =>{
        debugger;
        console.log('Pago efectuado correctamente');
        console.log(payment);
        this.finishShopping();
      });
    }
  };

  addPaypalScript(){
    this.addScript =  true;
    return new Promise((resolve, reject) => {
      let scripttagElement = document.createElement('script');
      scripttagElement.src = 'https://www.paypalobjects.com/api/checkout.js';
      scripttagElement.onload = resolve;
      document.body.appendChild(scripttagElement);
    });
  };


  addpaypal(){
    if(!this.addScript){
      this.addPaypalScript().then(() => {
        paypal.Button.render(this.paypalConfig, "#paypal-checkout-button")
        
      })
    }
  }


  radioChange(event: MatRadioChange) {
    if(event.value == 'Paypal' && !this.addButton){
      this.addButton = true;
      this.addpaypal();
    }
}

  constructor(private frontService: FrontServiceService,
              private creditCardFormSrv: FormBuilder,
              private toastr: ToastrService,
              private userService: UserServiceService,
              private router: Router,
              private activeRoute: ActivatedRoute) {

      this.creditCardForm = this.creditCardFormSrv.group({
        typeCard: '',
        nameHeadline: '',
        expirationDate: '',
        numCard: '',
        ccv: ''
      });
  }



  ngOnInit() {
    let me = this;
    this.frontService.getPaymentsMethod().subscribe(data => {
      me.payments = data;
    });
    this.idClient = this.activeRoute.snapshot.params.idclient;
    this.idUser  = this.activeRoute.snapshot.queryParams.idUser;
    let products = this.userService.getProductsCart();
    for (let i = 0; i < products.length; i++) {
      this.total = this.total + products[i].pvp;
    }
  }

  onSubmit(creditCardData) {
    let creditCardInfo;
    let errorCreditCard = false;
    let payment = this.payment;
    if  (this.payment == "Tarjeta de crédito") {
      if (creditCardData.typeCard  ==  "MasterCard") {
        if (!this.mastercard.test(creditCardData.numCard)) {
          this.toastr.error("El número de la tarjeta de crédito no tiene el formato correcto", "", {
            timeOut: 3000

          });
          errorCreditCard = true;
        }
      }
      if(creditCardData.typeCard == "Visa") {
        if (!this.visa.test(creditCardData.numCard)) {
          this.toastr.error("El número de la tarjeta de crédito no tiene el formato correcto", "", {
            timeOut: 3000
          });
          errorCreditCard = true;
        }
      }

      if (!this.date1.test(creditCardData.expirationDate)  &&  !this.date2.test(creditCardData.expirationDate)) {
        this.toastr.error("Fecha de expiración incorrecta", "", {
          timeOut: 3000
        });
        errorCreditCard = true;
      }

      if (creditCardData.ccv.toString().length != 3) {
        this.toastr.error("El código CVV tiene un formato incorrecto", "", {
          timeOut: 3000
        });
        errorCreditCard = true;
      }

      if (creditCardData.typeCard != "MasterCard" && creditCardData.typeCard != "Visa" ) {
        this.toastr.error("Seleccione un tipo de tarjeta correcto", "", {
          timeOut: 3000
        });
        errorCreditCard = true;
      }

      if (creditCardData.nameHeadline == null || creditCardData.nameHeadline == undefined  || creditCardData.nameHeadline == "") {
        this.toastr.error("El nombre del titular es obligatorio", "", {
          timeOut: 3000
        });
        errorCreditCard = true;
      }

      if (errorCreditCard) {
        return;
      }

      this.userService.setCreditCardData(creditCardData, this.payment);
      this.finishShopping();
    }
  }




  finishShopping() {
    let products = this.userService.getProductsCart();
    let productsArray = [];
    let paid = true;
    if (this.payment == 'Contrareembolso') {
      paid = false;
    };

    let orders = {
      idClient: this.idClient,
      idUser: this.idUser,
      products: products, 
      payment: this.payment,
      paid: paid
    };
    let me = this;
    this.frontService.saveOrder(orders).subscribe(response => {
      if (response.body.code == 200) {
        me.toastr.success(response.body.message, "", {
          timeOut: 3000
        });
        this.userService.removeAllProduct();
        let urlRedirect = "/home";
        this.router.navigate([urlRedirect]);
      } else {
        me.toastr.error(response.body.message, "", {
          timeOut: 3000
        });
      } ;
    })

    

  }
}
