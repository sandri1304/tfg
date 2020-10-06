import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from "@angular/router";
import { timer } from 'rxjs';
import { Properties } from '../../dataModels/properties';
import { OrdersServiceService } from 'src/app/services/admin/orders/orders-service.service';
import { UserServiceService} from '../../services/user-service.service';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})

export class AdminComponent implements OnInit {

  isCollapsed: boolean[] = [true, true, true];
  accordeonElements: string[] = ['orders', 'catalogue', 'sclient'];
  logTimer;

  @Output() countOrders = new EventEmitter<number>();
  timerCountOrder;

  constructor(private router: Router,
  private ordersService: OrdersServiceService,
  private userService: UserServiceService) { }

  ngOnInit() {
    //this.router.navigate(['/admin/clientes']);
    // if (this.userService.isAdmin()) {
    //   this.router.navigate([Properties.nevado_client_admin_context + '/orders']);
    if (this.userService.isLogged() && !this.userService.isAdmin()){
      this.router.navigate(['/']);
    } else if(!this.userService.isLogged() && !this.userService.isAdmin()) {
      this.router.navigate(['/login']);
    }



    this.logTimer = timer(0, 30000).subscribe(val => {
      this.ordersService.getOrderPending().subscribe(count => {
        if (count != "error") {
          this.ordersService.setCountOrdersSubject(parseInt(count));
        } else {
          this.ordersService.setCountOrdersSubject(0);
        }
     })
    });
  }

  toggle(id) {
    let index = this.accordeonElements.indexOf(id);
    if (index > -1) {
      for (let i = 0; i < this.isCollapsed.length; i++) {
        if (i == index) {
          this.isCollapsed[index] = !this.isCollapsed[index];
        } else {
          this.isCollapsed[i] = true;
        }
      }
    }
  }

  ngOnDestroy() {
    if (this.logTimer != null) {
      this.logTimer.unsubscribe();
    }
  }
}
