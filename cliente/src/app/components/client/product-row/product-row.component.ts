import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FrontServiceService } from '../../../services/front/front-service.service';
import { fromEvent } from 'rxjs';
import { map, debounceTime, startWith } from 'rxjs/operators';
import { NgbCarousel, NgbSlideEvent, NgbSlideEventSource } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-product-row',
  templateUrl: './product-row.component.html',
  styleUrls: ['./product-row.component.css']
})
export class ProductRowComponent implements OnInit {

  @Input() public front;

  person = ['a', 'b', 'c', 'd', 'e'];
  products = [];

  isSmallScreenObs;
  isSmallScreen;


  paused = false;
  unpauseOnArrow = false;
  pauseOnIndicator = false;
  pauseOnHover = true;

  @ViewChild('carousel', {static : true}) carousel: NgbCarousel;

  images = [62, 83, 466, 965, 982, 1043, 738].map((n) => `https://picsum.photos/id/${n}/900/500`);

  constructor(private frontSrv: FrontServiceService) { }

  ngOnInit() {
    if (this.front.url) {
      var me = this;
      this.frontSrv.getProductData(this.front.url).subscribe(data => {
          me.products = data['items'];
       });
    }

    // Checks if screen size is less than 1024 pixels
    const checkScreenSize = () => document.body.offsetWidth < 800;

    // Create observable from window resize event throttled so only fires every 500ms
    // const screenSizeChanged$ = Observable.fromEvent(window, 'resize').throttleTime(500).map(checkScreenSize);
    const screenSizeChanged2$ = fromEvent(window, 'resize').pipe(debounceTime(500)).pipe(map(checkScreenSize));
    // Start off with the initial value use the isScreenSmall$ | async in the
    // view to get both the original value and the new value after resize.
    var me = this;
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
