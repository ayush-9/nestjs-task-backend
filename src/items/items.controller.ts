import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Patch,
  Query,
  UsePipes,
  UseGuards,
  Req,
  ValidationPipe,
} from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { ItemsService } from './items.service';
import { Item, ItemStatus } from './interfaces/item.interface';
import { ItemStatusValidationPipe } from './item-status.pipe';
import { ItemFilterAndSearchDto } from './dto/item-filter-by-status.dto';
import { JoiValidationPipe } from './joi-validation-pipe.pipe';
import * as Joi from 'joi';
import { AuthGuard } from '@nestjs/passport';

const joischemaforitemscreation = Joi.object({
  name: Joi.string().required(),
  qty: Joi.number().integer().min(0).required(),
  index: Joi.number().integer().min(0).required(),
  description: Joi.string().required(),
});

@Controller('items')
@UseGuards(AuthGuard())
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Get()
  findFiltered(
    @Query() filterbystatusDto: ItemFilterAndSearchDto,
    @Req() req,
  ): Promise<Item[]> {
    if (Object.keys(filterbystatusDto).length) {
      return this.itemsService.findFiltered(filterbystatusDto, req.user);
    }
    return this.itemsService.findAll(1, req.user);
  }

  @Get(':id')
  findOne(@Param('id') id, @Req() req): Promise<Item> {
    return this.itemsService.findOne(id, req.user);
  }

  @Patch()
  updateindex(@Body('result') result, @Req() req): Promise<Item[]> {
    return this.itemsService.updateindex(result, req.user);
  }
  @Put()
  updateindexcomp(@Body('result') result, @Req() req): Promise<Item[]> {
    return this.itemsService.updateindexcomp(result, req.user);
  }

  @Post()
  @UsePipes(new JoiValidationPipe(joischemaforitemscreation))
  create(@Body() createItemDto: CreateItemDto, @Req() req): Promise<Item> {
    return this.itemsService.create(createItemDto, req.user);
  }

  @Delete(':id')
  delete(@Param('id') id, @Req() req): Promise<Item> {
    return this.itemsService.delete(id, req.user);
  }

  @Patch(':id/status')
  updateStatus(
    @Body('status', ItemStatusValidationPipe) status: ItemStatus,
    @Param('id') id,
    @Req() req,
  ): Promise<Item> {
    return this.itemsService.updateStatus(id, status, req.user);
  }

  @Put(':id')
  @UsePipes(ValidationPipe)
  update(
    @Body() updateItemDto: CreateItemDto,
    @Param('id') id,
    @Req() req,
  ): Promise<Item> {
    return this.itemsService.update(id, updateItemDto, req.user);
  }
}
