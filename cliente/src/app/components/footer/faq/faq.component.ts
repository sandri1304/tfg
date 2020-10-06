import { Component, OnInit } from '@angular/core';
import { UserServiceService } from 'src/app/services/user-service.service';
import { FormBuilder } from '@angular/forms';
import { FaqServiceService } from 'src/app/services/faq/faq-service.service';
import { ToastrService } from 'ngx-toastr'; 

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class FaqComponent implements OnInit {

  sameProducts: boolean  = false;
  samePrice: boolean  = false;
  daysOrder: boolean  = false;
  payments: boolean  = false;
  schedule: boolean  = false;
  shop: boolean  = false;
  dataBill: boolean = false;
  returnProduct: boolean = false;
  lessProduct: boolean = false;
  badCondition: boolean = false;
  otherOrder: boolean = false;
  warranty: boolean = false;
  sendQuestion;
  nameUser: string;
  idUser: string;
  message = {};

  constructor(private userService: UserServiceService,
              private sendQuestionFormBuilder: FormBuilder, 
              private faqServiceService : FaqServiceService,
              private toastr: ToastrService) { 

    this.sendQuestion = this.sendQuestionFormBuilder.group({
      question: ''
    });
  }

  ngOnInit() {
    if (this.userService.isLogged()) {
      this.nameUser = this.userService.getUserName();
      this.idUser = this.userService.getId();
    }
    
  }

  selectItem(item) {
    switch(item) {
      case 1: {
        this.sameProducts = true;
        this.samePrice = false;
        this.daysOrder = false;
        this.payments = false;
        this.schedule = false;
        this.shop = false;
        this.dataBill= false;
        this.returnProduct = false;
        this.lessProduct = false;
        this.badCondition = false;
        this.otherOrder = false;
        this.warranty = false;
        break;
      }
      case 2: {
        this.sameProducts = false;
        this.samePrice = true;
        this.daysOrder = false;
        this.payments = false;
        this.schedule = false;
        this.shop = false;
        this.dataBill= false;
        this.returnProduct = false;
        this.lessProduct = false;
        this.badCondition = false;
        this.otherOrder = false;
        this.warranty = false;
        break;
      }
      case 3: {
        this.sameProducts = false;
        this.samePrice = false;
        this.daysOrder = true;
        this.payments = false;
        this.schedule = false;
        this.shop = false;
        this.dataBill= false;
        this.returnProduct = false;
        this.lessProduct = false;
        this.badCondition = false;
        this.otherOrder = false;
        this.warranty = false;
        break;
      }
      case 4: {
        this.sameProducts = false;
        this.samePrice = false;
        this.daysOrder = false;
        this.payments = true;
        this.schedule = false;
        this.shop = false;
        this.dataBill= false;
        this.returnProduct = false;
        this.lessProduct = false;
        this.badCondition = false;
        this.otherOrder = false;
        this.warranty = false;
        break;
      }
      case 5: {
        this.sameProducts = false;
        this.samePrice = false;
        this.daysOrder = false;
        this.payments = false;
        this.schedule = true;
        this.shop = false;
        this.dataBill= false;
        this.returnProduct = false;
        this.lessProduct = false;
        this.badCondition = false;
        this.otherOrder = false;
        this.warranty = false;
        break;
      }
      case 6: {
        this.sameProducts = false;
        this.samePrice = false;
        this.daysOrder = false;
        this.payments = false;
        this.schedule = false;
        this.shop = true;
        this.dataBill= false;
        this.returnProduct = false;
        this.lessProduct = false;
        this.badCondition = false;
        this.otherOrder = false;
        this.warranty = false;
        break;
      }
      case 7: {
        this.sameProducts = false;
        this.samePrice = false;
        this.daysOrder = false;
        this.payments = false;
        this.schedule = false;
        this.shop = false;
        this.dataBill= true;
        this.returnProduct = false;
        this.lessProduct = false;
        this.badCondition = false;
        this.otherOrder = false;
        this.warranty = false;
        break;
      }
      case 8: {
        this.sameProducts = false;
        this.samePrice = false;
        this.daysOrder = false;
        this.payments = false;
        this.schedule = false;
        this.shop = false;
        this.dataBill= false;
        this.returnProduct = true;
        this.lessProduct = false;
        this.badCondition = false;
        this.otherOrder = false;
        this.warranty = false;
        break;
      }
      case 9: {
        this.sameProducts = false;
        this.samePrice = false;
        this.daysOrder = false;
        this.payments = false;
        this.schedule = false;
        this.shop = false;
        this.dataBill= false;
        this.returnProduct = false;
        this.lessProduct = true;
        this.badCondition = false;
        this.otherOrder = false;
        this.warranty = false;
        break;
      }
      case 10: {
        this.sameProducts = false;
        this.samePrice = false;
        this.daysOrder = false;
        this.payments = false;
        this.schedule = false;
        this.shop = false;
        this.dataBill= false;
        this.returnProduct = false;
        this.lessProduct = false;
        this.badCondition = true;
        this.otherOrder = false;
        this.warranty = false;
        break;
      }
      case 11: {
        this.sameProducts = false;
        this.samePrice = false;
        this.daysOrder = false;
        this.payments = false;
        this.schedule = false;
        this.shop = false;
        this.dataBill= false;
        this.returnProduct = false;
        this.lessProduct = false;
        this.badCondition = false;
        this.otherOrder = true;
        this.warranty = false;
        break;
      }
      case 12: {
        this.sameProducts = false;
        this.samePrice = false;
        this.daysOrder = false;
        this.payments = false;
        this.schedule = false;
        this.shop = false;
        this.dataBill= false;
        this.returnProduct = false;
        this.lessProduct = false;
        this.badCondition = false;
        this.otherOrder = false;
        this.warranty = true;
        break;
      }
    }
  }

  onSubmit(questionData) {
    this.message = {
      idUser: this.idUser,
      name: this.nameUser, 
      message: questionData.question,
      read: false
    }

    let me = this; 
    this.faqServiceService.saveMessage(this.message).subscribe(function(response){
      if (response.body.code == 200) {
        me.toastr.success("El mensaje ha sido envíado al administrador", "", {
          timeOut: 3000
        });
      }  else {
        me.toastr.error("El mensaje no se ha podido enviar", "", {
          timeOut: 3000
        });
      }
    });
  }

}
