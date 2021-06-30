import { Injectable, NotFoundException } from '@nestjs/common';
import { Item, ItemStatus } from './interfaces/item.interface';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ItemFilterAndSearchDto } from './dto/item-filter-by-status.dto';
import { User } from 'src/users/user.interface';

@Injectable()
export class ItemsService {
  constructor(@InjectModel('Item') private readonly itemModel: Model<Item>) {}

  async findAll(sort, user: User): Promise<Item[]> {
    if (sort == -1) {
      const data = await this.itemModel
        .find({ user_id: user.id })
        .sort({ updatedAt: sort });
      console.log(data);
      return data;
    }
    return await this.itemModel.find({ user_id: user.id }).sort({ index: 1 });
  }

  async findFiltered(
    filterbystatusDto: ItemFilterAndSearchDto,
    user: User,
  ): Promise<Item[]> {
    const { search, status, sort } = filterbystatusDto;
    let Allitems = await this.findAll(sort, user);

    if (status) {
      //Allitems = Allitems.filter((item) => item.status === status); //less optimized
      Allitems = await this.itemModel
        .find({ user_id: user.id, status: status })
        .sort({ index: 1 }); //more optimized
    }
    if (search) {
      // Allitems = Allitems.filter(
      //   (item) =>
      //     item.name?.toLowerCase().includes(search.toLowerCase()) ||
      //     item.description?.toLowerCase().includes(search.toLowerCase()),
      // ); //less optimized
      Allitems = await this.itemModel
        .find({
          user_id: user.id,
        })
        .where({
          $or: [
            { name: new RegExp(search, 'i') }, //i for case insensitivity check
            { description: new RegExp(search, 'i') },
          ],
        }); //more optimized
    }
    return Allitems;
  }

  async findOne(id: string, user: User): Promise<Item> {
    const found = await this.itemModel.findOne({ _id: id, user_id: user.id });
    if (!found) {
      throw new NotFoundException(`Item with id ${id} not found`);
    }
    return found;
  }

  async create(item: Item, user: User): Promise<Item> {
    //item.status = ItemStatus.PENDING;
    const newItem = new this.itemModel(item);
    newItem.user_id = user.id;
    return await newItem.save();
  }

  async delete(id: string, user: User): Promise<Item> {
    const found = await this.itemModel.findOne({ _id: id, user_id: user.id });
    if (!found) {
      throw new NotFoundException(
        `No Item with id ${id} available for deletion`,
      );
    }
    return await this.itemModel.findByIdAndRemove(id);
  }

  async updateStatus(
    id: string,
    status: ItemStatus,
    user: User,
  ): Promise<Item> {
    const Item = await this.itemModel.findOne({ _id: id, user_id: user.id });
    if (!Item) {
      throw new NotFoundException(`No Item with id ${id} available to update`);
    }
    Item.status = status;
    return await Item.save();
  }

  async updateindex(result, user: User): Promise<Item[]> {
    const arrayofitems = await this.itemModel.find({
      index: { $lte: result.destination.index, $gt: result.source.index },
      user_id: user.id,
    });
    //console.log(arrayofitems);
    arrayofitems.forEach(async function (item) {
      item.index = item.index - 1;
      await item.save();
    });
    const Item = await this.itemModel.findOne({
      index: result.source.index,
      user_id: user.id,
    });
    Item.index = result.destination.index;
    await Item.save();
    return await this.findAll(1, user);
  }

  async updateindexcomp(result, user: User): Promise<Item[]> {
    const arrayofitems = await this.itemModel.find({
      index: { $lt: result.source.index, $gte: result.destination.index },
      user_id: user.id,
    });
    arrayofitems.forEach(async function (item) {
      item.index = item.index + 1;
      await item.save();
    });
    const Item = await this.itemModel.findOne({
      index: result.source.index,
      user_id: user.id,
    });
    Item.index = result.destination.index;
    await Item.save();
    return await this.findAll(1, user);
  }
  async update(id: string, item: Item, user: User): Promise<Item> {
    const Item = await this.itemModel.findOne({ _id: id, user_id: user.id });
    if (!Item) {
      throw new NotFoundException(`No Item with id ${id} available to update`);
    }
    Item.name = item.name;
    Item.description = item.description;
    Item.qty = item.qty;
    Item.index = item.index;
    return await Item.save();
  }
}
