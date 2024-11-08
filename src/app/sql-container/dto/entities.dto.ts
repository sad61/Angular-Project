// dto/entities.dto.ts
export class CreateDeliveryDto {
  name!: string;
  supplierId!: number;
  contactInfo!: string;
  deliveryDate!: Date;
  items!: Array<{
    name: string;
    quantity: number;
    pricePerUnit: number;
    description?: string | undefined;
  }>;
}

export class CreateItemDto {
  name!: string;
  description!: string;
  quantity!: number;
  pricePerUnit!: number;
}

export class CreateSaleDto {
  customerCPF!: string;
  paymentMethod!: string;
  isDiscount!: boolean;
  items!: Array<{ name: string; serialNumber: string; quantity: number }>;
}

export class SaleDto {
  id!: number;
  customerCPF!: string;
  paymentMethod!: string;
  totalPrice!: number;
  saleDate!: Date;
  isDiscount!: boolean;
}
