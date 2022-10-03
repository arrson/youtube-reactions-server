import {
  Controller,
  HttpException,
  HttpStatus,
  Get,
  Query,
} from '@nestjs/common';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  searchChannel(@Query('name') name: string) {
    if (!name) {
      throw new HttpException(
        { status: HttpStatus.BAD_REQUEST, error: '"name" is required.' },
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.searchService.searchByChannelName(name);
  }

  @Get('channel-info')
  getChannelInfo(@Query('id') id: string) {
    return this.searchService.getChannelInfo(id);
  }
}
