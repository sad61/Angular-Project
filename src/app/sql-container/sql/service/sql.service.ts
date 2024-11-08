import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  CreateDeliveryDto,
  CreateSaleDto,
  SaleDto,
} from '../../dto/entities.dto';
import { environment } from 'src/environment/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class SqlService {
  private stockSubject = new BehaviorSubject<
    { name: string; serialNumber: string; pricePerUnit: number }[]
  >([]);
  private saleSubject = new BehaviorSubject<SaleDto[]>([]);
  private socket: Socket;
  private readonly url = 'ws://localhost:4400';

  constructor(
    private readonly httpService: HttpClient,
    private _snackBar: MatSnackBar
  ) {
    this.socket = io(this.url);
    this.listenForUpdates();
  }

  get stock$(): Observable<
    { name: string; serialNumber: string; pricePerUnit: number }[]
  > {
    return this.stockSubject.asObservable();
  }

  get sale$(): Observable<SaleDto[]> {
    return this.saleSubject.asObservable();
  }

  createDelivery(createDeliveryDto: CreateDeliveryDto): void {
    this.httpService
      .post(`${environment.nestAPIEndpoint}/market/delivery`, createDeliveryDto)
      .subscribe({
        next: (res) => {
          this._snackBar.open('Delivery made!', 'dismiss', { duration: 3000 });
        },
      });
  }

  updateStock(): void {
    this.httpService
      .get<{ name: string; serialNumber: string; pricePerUnit: number }[]>(
        `${environment.nestAPIEndpoint}/market/item`
      )
      .pipe(tap((stock) => this.stockSubject.next(stock)))
      .subscribe();
  }

  getItemStockQuantity(name: string): Promise<number | undefined> {
    return this.httpService.get<number>(
      `${environment.nestAPIEndpoint}/market/quantity/${name}`
    ).toPromise()
  }

getTotalPrice(id: number): Promise<number | undefined> {
  return this.httpService.get<number>(
    `${environment.nestAPIEndpoint}/market/sale-items/total-price/${id}`
  ).toPromise();
}

  updateSale(): void {
    this.httpService
      .get<SaleDto[]>(`${environment.nestAPIEndpoint}/market/sale`)
      .pipe(tap((sales) => {
        sales.forEach((sale) => {
          sale.totalPrice = 0; 
        });
        console.log(sales)
        this.saleSubject.next(sales);
      }))
      .subscribe();
  }

  deleteTables(): void {
    this.httpService
      .delete(`${environment.nestAPIEndpoint}/market/tables`)
      .subscribe((res) => console.log(res));
  }

  createSale(createSaleDto: CreateSaleDto) {
    return this.httpService.post(
      `${environment.nestAPIEndpoint}/market/sale`,
      createSaleDto
    );
  }

  private listenForUpdates(): void {
    this.socket.on(
      'stock-update',
      (
        updatedStock: {
          name: string;
          serialNumber: string;
          pricePerUnit: number;
        }[]
      ) => {
        console.log('Received stock update via WebSocket:', updatedStock);
        this.stockSubject.next(updatedStock);
      }
    );
    this.socket.on(
      'sale-update',
      (
        updatedSale: {
          id: number;
          customerCPF: string;
          paymentMethod: string;
          totalPrice: number;
          saleDate: Date;
          isDiscount: boolean;
        }[]
      ) => {
        console.log('Received sale update via WebSocket:', updatedSale);
        this.saleSubject.next(updatedSale);
      }
    );
  }
}
