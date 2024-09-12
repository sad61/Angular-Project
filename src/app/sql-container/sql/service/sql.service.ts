import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateDeliveryDto, CreateSaleDto } from '../../dto/entities.dto';
import { environment } from 'src/environment/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class SqlService {
  private stockSubject = new BehaviorSubject<{ name: string; serialNumber: string; pricePerUnit: number }[]>([]);
  private saleSubject = new BehaviorSubject<{ id: number; customerCPF: string; paymentMethod: string }[]>([]);
  private socket: Socket;
  private readonly url = 'ws://localhost:4400';


  constructor(
    private readonly httpService: HttpClient,
    private _snackBar: MatSnackBar
  ) {
    this.socket = io(this.url);
    this.listenForUpdates();
  }

  get stock$(): Observable<{ name: string; serialNumber: string; pricePerUnit: number }[]> {
    return this.stockSubject.asObservable();
  }

  get sale$(): Observable<{ id: number; customerCPF: string; paymentMethod: string }[]> {
    return this.saleSubject.asObservable();
  }

  createDelivery(createDeliveryDto: CreateDeliveryDto): void {
    this.httpService.post(`${environment.nestAPIEndpoint}/market/delivery`, createDeliveryDto)
      .subscribe({next: (res)=> {this._snackBar.open('Delivery made!', 'dismiss', {duration: 3000})}});
  }

  updateStock(): void {
    this.httpService.get<{ name: string; serialNumber: string; pricePerUnit: number }[]>(
      `${environment.nestAPIEndpoint}/market/item`
    ).pipe(
      tap(stock => this.stockSubject.next(stock))
    ).subscribe();
  }

  updateSale(): void {
    this.httpService.get<{ id: number; customerCPF: string; paymentMethod: string }[]>(
      `${environment.nestAPIEndpoint}/market/sale`
    ).pipe(
      tap(sale => this.saleSubject.next(sale))
    ).subscribe();
  }

  deleteTables(): void {
    this.httpService.delete(`${environment.nestAPIEndpoint}/market/tables`)
      .subscribe(res => console.log(res));
  }

  createSale(createSaleDto: CreateSaleDto) {
    return this.httpService.post(`${environment.nestAPIEndpoint}/market/sale`, createSaleDto).subscribe({next: (res)=> {this._snackBar.open('Purchase made!', 'dismiss', {duration: 3000})}})
  }

  private listenForUpdates(): void {
    this.socket.on('stock-update', (updatedStock: { name: string; serialNumber: string; pricePerUnit: number }[]) => {
      console.log('Received stock update via WebSocket:', updatedStock);
      this.stockSubject.next(updatedStock);
    });
    this.socket.on('sale-update', (updatedSale: { id: number; customerCPF: string; paymentMethod: string }[]) => {
      console.log('Received sale update via WebSocket:', updatedSale);
      this.saleSubject.next(updatedSale)
    });
  }
  
}
