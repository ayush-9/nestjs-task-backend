import { ItemStatus } from '../interfaces/item.interface';

export class ItemFilterAndSearchDto {
  status: ItemStatus;
  search: string;
  sort: number; //1 for asc & -1 for desc
}
