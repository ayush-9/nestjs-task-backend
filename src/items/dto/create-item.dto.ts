import { ItemStatus } from '../interfaces/item.interface';
import { IsInt, Length, Min } from 'class-validator';
export class CreateItemDto {
  @Length(2, 30)
  readonly name: string;
  @Length(5, 1000)
  readonly description: string;
  @IsInt()
  @Min(0)
  readonly qty: number;
  @IsInt()
  @Min(0)
  readonly index: number;
  readonly status: ItemStatus;
  readonly user_id: string;
}
