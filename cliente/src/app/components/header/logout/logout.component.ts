import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

import { AuthServiceService } from '../../../services/auth-service.service';
import { UserServiceService} from '../../../services/user-service.service';



@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

  constructor(private authService: AuthServiceService, private userService: UserServiceService, private router: Router) { }

  ngOnInit() {
    var logout = this;
    this.authService.getLogout().subscribe(function (response) {
        logout.userService.clearUser();
        logout.userService.clearCurrentPath();
        logout.userService.clearPreviousPath();
        logout.router.navigate(['/home']);
    });
  }
};
