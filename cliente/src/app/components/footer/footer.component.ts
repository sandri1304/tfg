import { Component, OnInit } from '@angular/core';

import { UserServiceService} from '../../services/user-service.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  constructor(private userService: UserServiceService) { }

  ngOnInit() {
  }

}
