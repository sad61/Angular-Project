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
  cityFormControl = new FormControl('', [Validators.required]);
  teamFormControl = new FormControl('', [Validators.required]);

  cpfValue!: string;
  cityValue!: string;
  teamValue!: string;

  isDiscount: boolean = false;

  selectedColumn: string = 'name';
  whereValue: string = '';

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

  stockColumns: string[] = [
    'button',
    'name',
    'serialNumber',
    'pricePerUnit',
    'quantity',
  ];

  stockSource!: MatTableDataSource<{
    name: string;
    serialNumber: string;
    pricePerUnit: number;
    quantity: number | undefined;
  }>;

  saleColumns: string[] = [
    'id',
    'customerCPF',
    'paymentMethod',
    'totalPrice',
    'saleDate',
    'isDiscount',
  ];

  salesSource!: MatTableDataSource<{
    id: number;
    customerCPF: string;
    paymentMethod: string;
    saleDate: Date;
    isDiscount: boolean;
    totalPrice: number | undefined;
  }>;

  totalPrice: number = 0;
  totalPriceMap: { [key: number]: number } = {};
  salesQuantity: number = 0;

  constructor(
    private fb: FormBuilder,
    protected sqlService: SqlService,
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
    this.sqlService.stock$.subscribe(async (stock) => {
      const updatedStockPromises = stock.map(async (item) => ({
        ...item,
        quantity: await this.sqlService.getItemStockQuantity(item.name), 
      }));

      let updatedStock = await Promise.all(updatedStockPromises);
      this.stockSource = new MatTableDataSource(updatedStock);
    });
    this.sqlService.updateStock();
    this.sqlService.sale$.subscribe(async (sales) => {
      const updatedSalePromises = sales.map(async (sale) => ({
        ...sale,
        totalPrice: await this.sqlService.getTotalPrice(sale.id),
      }));

      const updatedSale = await Promise.all(updatedSalePromises);

      this.salesSource = new MatTableDataSource(updatedSale);
    });
    this.sqlService.updateSale();
  }

  // async fetchQuantity(
  //   source: {
  //     name: string;
  //     serialNumber: string;
  //     pricePerUnit: number;
  //   }[]
  // ) {
  //   for (const item of source) {
  //     this.quantities[item.name] = await this.sqlService.getItemStockQuantity(item.name);
  //   }
  // }

  get items(): FormArray {
    return this.deliveryForm.get('items') as FormArray;
  }

  createItem(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      quantity: [0, [Validators.required, Validators.min(1)]],
      pricePerUnit: [0, [Validators.required, Validators.min(0.1)]],
      productLocation: ['', Validators.required],
    });
  }

  addItem() {
    this.items.push(this.createItem());
  }

  removeItem(index: number) {
    this.items.removeAt(index);
  }

  removeItemFromBucket(index: number) {
    const itemToRemove = this.bucketSource[index];

    if (itemToRemove) {
      const stockItem = this.stockSource.data.find((stockItem) => stockItem.name === itemToRemove.name)
      if (stockItem)
      {
        stockItem.quantity = stockItem.quantity! + itemToRemove.quantity
      }
      this.bucketSource.splice(index, 1);
      this.bucketSource = [...this.bucketSource];

      this.recalculateTotalPrice();
    }
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

    const stockItem = this.stockSource.data.find((stockItem) => stockItem.name === item.name)
    if (stockItem) {
      stockItem.quantity = (stockItem.quantity || 0) - 1;
    }
    console.log(stockItem)
    this.stockSource.data = [...this.stockSource.data]

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
    this.recalculateTotalPrice();
  }

  recalculateTotalPrice() {
    this.totalPrice = this.bucketSource.reduce(
      (total, item) => total + item.quantity * item.pricePerUnit,
      0
    );

    const teamValue = this.teamFormControl.value;
    const cityValue = this.cityFormControl.value;

    if (
      (teamValue && teamValue.toLowerCase() === 'flamengo') ||
      (cityValue && cityValue.toLowerCase() === 'sousa') ||
      this.paymentMethod ==='Berries'
    ) {
      this.totalPrice *= 0.8;
    }
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
      isDiscount: this.isDiscount,
      items,
    };

    this.sqlService.createSale(createSaleDto).subscribe({
      next: (res) => {
        items.map((item) => {
          const stockItem = this.stockSource.data.find((stockItem) => stockItem.name === item.name);
          if (stockItem) {
            stockItem.quantity = stockItem.quantity! - item.quantity
          }
        });
        this._snackBar.open('Purchase made!', 'Dismiss', { duration: 3000 });
      },
      error: (err) => {
        const message = 'Not enough items on stock';
        this._snackBar.open(message, 'Dismiss', { duration: 3000 });
      },
    });
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
    console.log(createDeliveryDto);
    this.sqlService.createDelivery(createDeliveryDto);
  }

  inputCPF() {
    this.cpfValue = this.cpfFormControl.value!;
    console.log(this.cpfValue);
  }

  inputCity() {
    this.cityValue = this.cityFormControl.value!;
    this.recalculateTotalPrice();
    this.checkDiscount();
  }

  inputTeam() {
    this.teamValue = this.teamFormControl.value!;
    this.recalculateTotalPrice();
    this.checkDiscount();
  }

  applyFilterStock(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.stockSource.filter = filterValue.trim().toLowerCase();
  }

  applyFilterSale(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.salesSource.filter = filterValue.trim().toLowerCase();
  }

  checkDiscount() {
    const cityCondition =
      this.cityValue && this.cityValue.toLowerCase() === 'sousa';
    const teamCondition =
      this.teamValue && this.teamValue.toLowerCase() === 'flamengo';

    this.isDiscount = cityCondition || teamCondition || this.paymentMethod === 'Berries' ? true : false;
  }

  changePaymentMethod(paymentMethod: string) {
    this.paymentMethod = paymentMethod;
  }
}
