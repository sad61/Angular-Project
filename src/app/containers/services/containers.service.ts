import {
  HttpClient,
  HttpClientModule,
  HttpHeaders,
  HttpRequest,
} from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Container } from '../container';
import { Observable, shareReplay } from 'rxjs';
import { AppConfig } from 'src/app/AppConfig/appconfig.interface';
import { APP_SERVICE_CONFIG } from 'src/app/AppConfig/appconfig.service';

@Injectable({
  providedIn: 'root',
})
export class ContainersService {
  headers = new HttpHeaders({ token: 'chambra' });
  getRooms$ = this.http
    .get<Container[]>('api/rooms', { headers: this.headers })
    .pipe(shareReplay(1));

  constructor(
    private http: HttpClient,
    @Inject(APP_SERVICE_CONFIG) private config: AppConfig
  ) {
  }

  getContainersList() {
    return this.http.get<Container[]>('./api/room');
  }

  addContainer(container: Container) {
    return this.http.post<Container[]>('./api/rooms', container);
  }

  delete(id: string) {
    return this.http.delete<Container[]>(`./api/rooms/${id}`);
  }

  getPhotos() {
    const request = new HttpRequest(
      'GET',
      `https://jsonplaceholder.typicode.com/photos`,
      {
        reportProgress: true,
      }
    );
    return this.http.request(request);
  }
}
