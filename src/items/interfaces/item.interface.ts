export interface Item {
  id?: string;
  name: string;
  description?: string;
  qty: number;
  index: number;
  status: ItemStatus;
  user_id: string;
}

export enum ItemStatus {
  PENDING = 'PENDING',
  PROGRESS = 'PROGRESS',
  REVIEW = 'REVIEW',
  DONE = 'DONE',
}
