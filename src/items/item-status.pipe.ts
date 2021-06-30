import { BadRequestException, PipeTransform } from '@nestjs/common';
import { ItemStatus } from './interfaces/item.interface';

export class ItemStatusValidationPipe implements PipeTransform {
  readonly statusValues = [
    ItemStatus.DONE,
    ItemStatus.PENDING,
    ItemStatus.PROGRESS,
    ItemStatus.REVIEW,
  ];
  private isvalid(status: any) {
    const index = this.statusValues.indexOf(status);
    return index !== -1;
  }
  transform(value: any) {
    value = value.toUpperCase();

    if (!this.isvalid(value)) {
      throw new BadRequestException(`"${value}" is not a valid status`);
    }
    return value;
  }
}
