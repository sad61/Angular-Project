import { Component, Input } from '@angular/core';
import { Metrics } from '../metrics';

@Component({
  selector: 'app-sort-menu',
  templateUrl: './sort-menu.component.html',
  styleUrls: ['./sort-menu.component.scss'],
})
export class SortMenuComponent {
  @Input() metricsArr: Metrics[] = [];
}
