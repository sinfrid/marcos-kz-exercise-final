import { Component, Input, OnInit } from '@angular/core';
import { DataService } from './data.service';

@Component({
  selector: 'html-marker',
  template: `
    <h5>{{ data.city }}</h5>
    <p>
      {{ data.value }}
    </p>
    <p>
      {{ data.value }}
    </p>
    <p>
      {{ data.value }}
    </p>
    <p>
      {{ data.value }}
    </p>
  `
})
export class HTMLMarkerComponent {
  @Input() data;
}