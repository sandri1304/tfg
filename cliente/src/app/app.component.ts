import { Component, Input, HostBinding } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { HeaderComponent } from './components/header/header.component';
import { UserServiceService } from './services/user-service.service';
import 'hammerjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {


  @HostBinding('class') class = 'd-flex flex-column app_root_container';



  @Input() header: HeaderComponent;
  logU: boolean;

  containerStyle: {};

  constructor(private userService: UserServiceService, private activeRoute: ActivatedRoute, private router: Router) { }

  onclick() {
    var margin = this.logU;
  }

  getMargin(marginContainer: string) {
    this.containerStyle = {
      "margin-top": marginContainer
    }
  }

  ngOnInit(): void {
    const url: Observable<string> = this.activeRoute.url.pipe(map(segments => segments.join('/')));
    this.userService.setPreviousPath(JSON.parse(localStorage.getItem('currentPath')));
    url.subscribe(currentUrl => this.userService.setPath(currentUrl));
    //this.router.navigate(['home']);
  }
}
