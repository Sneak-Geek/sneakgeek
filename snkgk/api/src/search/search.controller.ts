import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  constructor(private searchService: SearchService) {}

  @Get('/')
  async searchShoes(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('title') title: string,
    @Query('brand') brand?: string,
    @Query('gender') gender?: string,
  ) {
    const brands = brand ? brand?.split(',') : undefined;
    return this.searchService.search(page, limit, title, brands, gender);
  }
}
