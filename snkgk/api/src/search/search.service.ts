import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import mongoose from 'mongoose';
import { QueryBuilder } from './query.builder';

@Injectable()
export class SearchService {
  private static readonly INDEX_NAME = 'shoes';
  private logger = new Logger(SearchService.name);

  constructor(private esService: ElasticsearchService) {}

  async initialize() {
    const { body } = await this.esService.indices.exists({
      index: SearchService.INDEX_NAME,
      ignore_unavailable: false,
    });

    if (!body) {
      const { body, statusCode } = await this.esService.indices.create(
        {
          index: SearchService.INDEX_NAME,
          body: {
            mappings: {
              properties: {
                id: { type: 'keyword' },
                brand: { type: 'keyword' },
                category: { type: 'keyword' },
                colorway: { type: 'text' },
                description: { type: 'text' },
                gender: { type: 'keyword' },
                releaseDate: { type: 'date' },
                name: { type: 'text' },
                styleId: { type: 'text' },
                imageUrl: { type: 'text' },
                title: { type: 'text' },
              },
            },
          },
        },
        { ignore: [400] },
      );

      if (statusCode === HttpStatus.OK) {
        this.logger.verbose('Successfully index ElasticSearch');
      } else {
        this.logger.error(
          'Failed to initialize ElasticSearch',
          JSON.stringify(body),
        );
      }
    }
  }

  async indexShoes(shoes: Array<any>) {
    // _id is reserved for ElasticSearch
    const indexedShoes = shoes
      .map((s) => {
        const noUnderscoreId = Object.assign({}, s);
        delete noUnderscoreId._id;

        return [
          { index: { _index: SearchService.INDEX_NAME } },
          Object.assign({ id: s._id }, noUnderscoreId),
        ];
      })
      .reduce((prevValue, currentValue) => [...prevValue, ...currentValue]);
    const response = await this.esService.bulk({
      refresh: true,
      body: indexedShoes,
    });
    const { body: bulkResponse } = response;

    if (bulkResponse.error) {
      throw new Error(bulkResponse.error);
    } else {
      const count = await this.getCount();
      this.logger.verbose(`Populated ${count.toString()} indices`);
    }
  }

  async getCount() {
    const { body } = await this.esService.cat.count({
      index: SearchService.INDEX_NAME,
      format: 'json',
      v: true,
    });

    return body[0].count;
  }

  async drop() {
    return this.esService.indices.delete({
      index: [SearchService.INDEX_NAME],
    });
  }

  async search(
    page: number,
    size: number,
    title: string,
    brands?: string[],
    gender?: string,
  ) {
    const query = new QueryBuilder()
      .setPageSize(size)
      .setCurrentPage(page)
      .setTitle(title)
      .setBrand(brands)
      .setGender(gender)
      .build();

    const { body, statusCode } = await this.esService.search({
      method: 'POST',
      index: SearchService.INDEX_NAME,
      body: query,
      explain: true,
    });

    if (statusCode === HttpStatus.OK) {
      const count = body.hits.total.value;
      const shoes = body.hits.hits.map((t) => ({
        ...t._source,
        _id: new mongoose.Types.ObjectId(t._source.id),
        esId: t._id,
      }));

      return { count, shoes };
    }

    return { count: 0, shoes: [] };
  }
}
