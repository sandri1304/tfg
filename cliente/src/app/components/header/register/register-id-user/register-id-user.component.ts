import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {Router} from "@angular/router";

import { AuthServiceService } from '../../../../services/auth-service.service';
import { UserServiceService } from '../../../../services/user-service.service';

@Component({
  selector: 'app-register-id-user',
  templateUrl: './register-id-user.component.html',
  styleUrls: ['./register-id-user.component.css']
})
export class RegisterIdUserComponent implements OnInit {

  //userId: UsersId;
  message: String;
  constructor(private authService: AuthServiceService, private activeRoute: ActivatedRoute, private router: Router, private userService: UserServiceService) {
  }

  ngOnInit() {
    let registerIdUser = this;
    let idUser = this.activeRoute.snapshot.params.idUser;
    this.authService.getRegisterIdUser(idUser).subscribe(function(response) {
      registerIdUser.message = response.body.message;
      if (registerIdUser.userService.isLogged()) {
        registerIdUser.router.navigate(['/user/' + idUser]);
      } else {
        registerIdUser.router.navigate(['/login']);
      }
    });
  }

}
