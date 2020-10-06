import { Component, OnInit, Input, ViewChild  } from '@angular/core';
import { fromEvent } from 'rxjs';
import { map, debounceTime, startWith } from 'rxjs/operators';
import { NgbCarousel, NgbSlideEvent, NgbSlideEventSource } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-categorie-row-colum',
  templateUrl: './categorie-row-colum.component.html',
  styleUrls: ['./categorie-row-colum.component.css']
})
export class CategorieRowColumComponent implements OnInit {

  isSmallScreenObs;
  isSmallScreen;

  @Input() public categories;

  constructor() { }

  ngOnInit() {

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

}
