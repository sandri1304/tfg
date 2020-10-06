import { Component, ViewChild, OnInit } from '@angular/core';
import { NgbCarousel, NgbSlideEvent, NgbSlideEventSource } from '@ng-bootstrap/ng-bootstrap';
import { UserServiceService} from '../../services/user-service.service';
import {Router,ActivatedRoute} from "@angular/router";
import { fromEvent } from 'rxjs';
import { map, debounceTime, startWith } from 'rxjs/operators';



@Component({
  selector: 'app-init-page',
  templateUrl: './init-page.component.html',
  styleUrls: ['./init-page.component.css']
})
export class InitPageComponent implements OnInit {

  //images = ["../assets/fondo4.png", "../assets/fondo3.png", "../assets/fondo2.png", "/assets/fondo1.png"];

  images = ['imagen1', 'imagen2', 'imagen3'];

  paused = false;
  unpauseOnArrow = false;
  pauseOnIndicator = false;
  pauseOnHover = true;
  isSmallScreenObs;
  isSmallScreen;
  isSmallScreenObs2;
  isSmallScreen2;
  isSmallScreenObs3;
  isSmallScreen3;

  @ViewChild('carousel', { static: true }) carousel: NgbCarousel;

  constructor(private userService: UserServiceService,
      private router: Router) { }

  ngOnInit() {
    if (this.userService.isAdmin()){
      this.router.navigate(["/admin"]);
    };

    let me = this;
    // Checks if screen size is less than 1024 pixels
    const checkScreenSize = () => document.body.offsetWidth < 1175;
    // Create observable from window resize event throttled so only fires every 500ms
    // const screenSizeChanged$ = Observable.fromEvent(window, 'resize').throttleTime(500).map(checkScreenSize);
    const screenSizeChanged2$ = fromEvent(window, 'resize').pipe(debounceTime(500)).pipe(map(checkScreenSize));
    // Start off with the initial value use the isScreenSmall$ | async in the
    // view to get both the original value and the new value after resize.
    this.isSmallScreenObs = screenSizeChanged2$.pipe(startWith(checkScreenSize())).subscribe(o => { me.isSmallScreen = o; });
  }

  togglePaused() {
    if (this.paused) {
      this.carousel.cycle();
    } else {
      this.carousel.pause();
    }
    this.paused = !this.paused;
  }

  onSlide(slideEvent: NgbSlideEvent) {
    if (this.unpauseOnArrow && slideEvent.paused &&
      (slideEvent.source === NgbSlideEventSource.ARROW_LEFT || slideEvent.source === NgbSlideEventSource.ARROW_RIGHT)) {
      this.togglePaused();
    }
    if (this.pauseOnIndicator && !slideEvent.paused && slideEvent.source === NgbSlideEventSource.INDICATOR) {
      this.togglePaused();
    }
  }

}
