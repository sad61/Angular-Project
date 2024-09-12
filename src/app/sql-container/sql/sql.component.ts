import { Component, ViewChild } from '@angular/core';
import {
  CreateDeliveryDto,
  CreateItemDto,
  CreateSaleDto,
} from '../dto/entities.dto';
import { SqlService } from './service/sql.service';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import {
  MatTable,
  MatTableDataSource,
  MatTableModule,
} from '@angular/material/table';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface PeriodicElement {
  name: string;

  weight: number;
  symbol: string;
}

const bucket: Array<{
  name: string;
  quantity: number;
  serialNumber: string;
  pricePerUnit: number;
}> = [];

const stock: Array<{
  name: string;
  serialNumber: string;
  pricePerUnit: number;
}> = [];

const sale: Array<{
  id: number;
  customerCPF: string;
  paymentMethod: string;
}> = [];

@Component({
  selector: 'app-sql',
  templateUrl: './sql.component.html',
  styleUrls: ['./sql.component.scss'],
})
export class SqlComponent {
  cpfFormControl = new FormControl('', [
    Validators.required,
    Validators.pattern(/^\d{11}$/),
  ]);
  cpfValue!: string;
  deliveryForm: FormGroup;
  paymentMethods: string[] = ['Berries', 'Pix', 'Débito', 'Crédito'];
  paymentMethod: string = 'Berries';

  bucketColumns: string[] = [
    'button',
    'name',
    'serialNumber',
    'quantity',
    'pricePerUnit',
  ];
  bucketSource = [...bucket];

  stockColumns: string[] = ['button', 'name', 'serialNumber', 'pricePerUnit'];

  stockSource = [...stock];

  saleColumns: string[] = ['id', 'customerCPF', 'paymentMethod'];

  salesSource = [...sale];

  totalPrice: number = 0;

  constructor(
    private fb: FormBuilder,
    private sqlService: SqlService,
    private _snackBar: MatSnackBar
  ) {
    this.deliveryForm = this.fb.group({
      supplierName: ['', Validators.required],
      supplierID: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      contactInfo: ['', Validators.required],
      items: this.fb.array([this.createItem()]),
    });
  }

  async ngOnInit() {
    this.sqlService.stock$.subscribe((stock) => (this.stockSource = stock));
    this.sqlService.updateStock();
    this.sqlService.sale$.subscribe((sale) => (this.salesSource = sale));
    this.sqlService.updateSale();
  }

  get items(): FormArray {
    return this.deliveryForm.get('items') as FormArray;
  }

  createItem(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      quantity: [0, [Validators.required, Validators.min(1)]],
      pricePerUnit: [0, [Validators.required, Validators.min(0.1)]],
    });
  }

  addItem() {
    this.items.push(this.createItem());
  }

  removeItem(index: number) {
    this.items.removeAt(index);
  }

  removeItemFromBucket(index: number) {
    this.bucketSource.splice(index, 1);
    this.bucketSource = [...this.bucketSource];
  }

  addItemToBucket(item: {
    name: string;
    quantity: number;
    pricePerUnit: number;
    serialNumber: string;
  }) {
    const existingItem = this.bucketSource.find(
      (bucketItem) => bucketItem.name === item.name
    );

    if (existingItem) {
      existingItem.quantity += 1;
      this.bucketSource = [...this.bucketSource];
    } else {
      this.bucketSource = [
        ...this.bucketSource,
        {
          ...item,
          quantity: 1,
        },
      ];
    }
    this.totalPrice = this.bucketSource.reduce(
      (total, item) => total + item.quantity * item.pricePerUnit,
      0
    );
  }

  buyEverythingInBucket() {
    if (!this.cpfFormControl.valid) {
      this.cpfFormControl.markAllAsTouched();
      return;
    }

    if (this.bucketSource.length == 0) {
      this._snackBar.open('Your bucket is empty', 'dismiss', {
        duration: 3000,
      });
    }

    const items = this.bucketSource.map((item) => ({
      name: item.name,
      serialNumber: item.serialNumber,
      quantity: item.quantity,
    }));

    const createSaleDto: CreateSaleDto = {
      customerCPF: this.cpfValue,
      paymentMethod: this.paymentMethod,
      items,
    };

    this.sqlService.createSale(createSaleDto);
    this.bucketSource = [];
    this.totalPrice = 0;
  }

  async callDelivery() {
    if (!this.deliveryForm.valid) {
      this._snackBar.open('Input the necessary values!', 'dismiss', {
        duration: 3000,
      });
      this.deliveryForm.markAllAsTouched();
      return;
    }

    const createDeliveryDto = {
      name: this.deliveryForm.get('supplierName')?.value,
      supplierId: this.deliveryForm.get('supplierID')?.value,
      contactInfo: this.deliveryForm.get('contactInfo')?.value,
      deliveryDate: new Date(),
      items: this.deliveryForm.get('items')?.value,
    };

    this.sqlService.createDelivery(createDeliveryDto);
  }

  inputCPF() {
    this.cpfValue = this.cpfFormControl.value!;
    console.log(this.cpfValue);
  }

  changePaymentMethod(paymentMethod: string) {
    this.paymentMethod = paymentMethod;
  }
}
