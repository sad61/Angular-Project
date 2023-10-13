import {
  AfterViewInit,
  Component,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { Container } from './container';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { HeaderComponent } from '../header/header.component';
import { ContainersService } from './services/containers.service';
import { Subscription, catchError, of } from 'rxjs';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

@Component({
  selector: 'app-containers',
  templateUrl: './containers.component.html',
  styleUrls: ['./containers.component.css'],
})
export class ContainersComponent implements OnInit {
  [x: string]: any;
  checkModel: { left?: boolean; middle?: boolean; right?: boolean } = {
    left: false,
    middle: true,
    right: false,
  };

  singleModel = '';

  constructor(
    private http: HttpClient,
    private containersService: ContainersService
  ) {}

  containerName: string = 'Alfonso';

  someNumber: number = 10;

  object: Object = {
    foo: 'bar',
    baz: 'qux',
    nested: { xyz: 3, numbers: [1, 2, 3, 4, 5] },
  };

  hide: boolean = false;

  containerList: Container[] = [];
  containerBuffer: Container[] = [];
  buffer: any;

  totalBytes = 0;

  @ViewChild(HeaderComponent) headerComponent!: HeaderComponent;
  @ViewChildren(HeaderComponent)
  headerChildrenComponent!: QueryList<HeaderComponent>;

  subscribtion!: Subscription;

  containers$ = this.containersService.getRooms$.pipe(
    catchError((error) => {
      return of([]);
    })
  );

  ngOnInit(): void {
    this.containersService.getRooms$.subscribe((rooms) => {
      this.containerList = rooms;
    });

    this.containersService.getPhotos().subscribe((event) => {
      switch (event.type) {
        case HttpEventType.Sent: {
          console.log('Request has been sent');
          break;
        }
        case HttpEventType.ResponseHeader: {
          console.log('Request success');
          break;
        }
        case HttpEventType.DownloadProgress: {
          this.totalBytes += event.loaded;
          break;
        }
        case HttpEventType.Response: {
          console.log(event.body);
          break;
        }
      }
    });
  }

  ngOnDestroy() {}

  toggle() {
    // if (this.containerList.length > 1) {
    //   this.buffer = this.containerList[this.containerList.length - 1];
    //   this.containerList = this.containerList.slice(0, -1);
    //   this.containerBuffer.unshift(this.buffer);
    // }
    const lastContainer = this.containerList[this.containerList.length - 1];
    if (lastContainer.roomNumber !== undefined)
      this.containersService.delete(lastContainer.roomNumber).subscribe();
  }
  restore() {
    this.containerList = this.containerList.concat(this.containerBuffer);
    this.containerBuffer.length = 0;
  }
  selectContainer(container: Container) {}

  addContainer() {
    const container: Container = {
      roomNumber: '20',
      roomType: 'extra big',
      amenities: 'Air Conditioner, Free Wi-Fi, TV, Bathroom, Kitchen',
      photos:
        'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60',
      checkinTime: new Date('11-Nov-2021'),
      checkoutTime: new Date('12-Nov-2021'),
      rating: 4.5,
      booked: false,
    };
    // this.containerList = [...this.containerList, container];
    this.containersService.addContainer(container).subscribe((data) => {
      this.containerList = data;
    });
  }
}
