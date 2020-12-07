//!
//! Copyright (c) 2020 - SneakGeek. All rights reserved
//!

import * as ElasticSearch from "@elastic/elasticsearch";
import { Shoe } from "../../database";
import { ISearchService } from "./ISearchService";
import { injectable, inject } from "inversify";
import HttpStatus from "http-status";
import { LogProvider, TelemetryNamespace } from "../../providers/LogProvider";
import { ObjectId } from "mongodb";
import { EnvironmentProvider } from "../../providers/EnvironmentProvider";
import { UpdateShoeInput } from "../../model";

export class QueryBuilder {
  private title: string;
  private brands: string[];
  private gender: string;
  private pageSize: number;
  private currentPage: number;

  public setTitle(title: string): QueryBuilder {
    this.title = title;
    return this;
  }

  public setBrand(brands: string[]): QueryBuilder {
    this.brands = brands;
    return this;
  }

  public setGender(gender: string): QueryBuilder {
    this.gender = gender;
    return this;
  }

  public setPageSize(size: number): QueryBuilder {
    this.pageSize = size;
    return this;
  }

  public setCurrentPage(page: number): QueryBuilder {
    this.currentPage = page;
    return this;
  }

  public build() {
    if (typeof this.title === "undefined") {
      throw new Error("Must define title");
    }

    if (!this.pageSize) {
      throw new Error("Must define page size");
    }

    if (typeof this.currentPage === "undefined") {
      throw new Error("Must define current page");
    }

    const filter = [];
    const must: Array<any> = [
      {
        wildcard: {
          "media.imageUrl": "?*",
        },
      },
    ];

    if (this.title.length > 0) {
      must.push({
        match: {
          title: this.title,
        },
      });
    }

    if (this.brands && this.brands.length > 0) {
      filter.push({ terms: { "brand.keyword": this.brands } });
    }

    if (this.gender) {
      filter.push({ term: { "gender.keyword": this.gender } });
    }

    // Always fixed sort by releaseDate
    // Always return result with imageUrl
    return {
      sort: [{ releaseDate: { order: "desc" } }],
      from: this.currentPage,
      size: this.pageSize,
      query: {
        bool: {
          must,
          filter: [...filter, { exists: { field: "media.thumbUrl" } }],
        },
      },
    };
  }
}

@injectable()
export class SearchService implements ISearchService {
  private client: ElasticSearch.Client;
  private readonly shoeIndexName = "shoe";
  private readonly nodeEndpoint = EnvironmentProvider.env.ElasticSearchEndpoint;

  public constructor() {
    const isElasticCloud = EnvironmentProvider.env.IsElasticCloud;
    if (!isElasticCloud) {
      this.client = new ElasticSearch.Client({
        node: this.nodeEndpoint,
      });
    } else {
      throw new Error("Elastic Cloud authentication is not supported");
    }
  }

  public async initialize(): Promise<void> {
    const startTime = Date.now();

    const { body } = await this.client.indices.exists({
      index: this.shoeIndexName,
      ignore_unavailable: false,
    });

    if (!body) {
      LogProvider.instance.info(
        `[${TelemetryNamespace.ElasticNS}] :: Initializing index ${this.shoeIndexName}`
      );

      const { body, statusCode } = await this.client.indices.create(
        {
          index: this.shoeIndexName,
          body: {
            mappings: {
              properties: {
                id: { type: "keyword" },
                brand: { type: "keyword" },
                category: { type: "keyword" },
                colorway: { type: "text" },
                description: { type: "text" },
                gender: { type: "keyword" },
                releaseDate: { type: "date" },
                name: { type: "text" },
                styleId: { type: "text" },
                title: { type: "text" },
                tags: { type: "nested" },
                media: {
                  properties: {
                    gallery: { type: "text" },
                    thumbUrl: { type: "text" },
                    smallImageUrl: { type: "text" },
                    hidden: { type: "boolean" },
                  },
                },
                retailPrice: { type: "double" },
                year: { type: "integer" },
              },
            },
          },
        },
        {
          ignore: [400],
        }
      );

      if (statusCode === HttpStatus.OK) {
        LogProvider.instance.info(
          `[${TelemetryNamespace.ElasticNS}] :: Successfully initialize ${this.shoeIndexName} index`
        );
      } else {
        const error = `[GHN] Failed to initialze index:\n${JSON.stringify(body)}`;
        LogProvider.instance.error(error);

        throw new Error(error);
      }
    }
  }

  public async indexShoes(shoes: Partial<Shoe>[]) {
    LogProvider.instance.info(
      `[ElasticSearch] Populating ${this.shoeIndexName} index with ${shoes.length} indices`
    );
    // _id is reserved for ElasticSearch
    const indexedShoes = shoes
      .map((s) => {
        const noUnderscoreId = Object.assign({}, s);
        delete noUnderscoreId._id;

        return [
          { index: { _index: this.shoeIndexName } },
          Object.assign({ id: s._id }, noUnderscoreId),
        ];
      })
      .reduce((prevValue, currentValue) => [...prevValue, ...currentValue]);

    const response = await this.client.bulk({
      refresh: true,
      body: indexedShoes,
    });

    const { body: bulkResponse } = response;

    if (bulkResponse.error) {
      LogProvider.instance.error(bulkResponse.error);
    } else {
      const count = await this._getCount();
      LogProvider.instance.info("Populated", count.toString(), "indices");
    }
  }

  public async isPopulated(): Promise<boolean> {
    const count = await this._getCount();
    return count > 0;
  }

  public async search(
    page: number,
    size: number,
    title: string,
    brands?: string[],
    gender?: string
  ) {
    const query = new QueryBuilder()
      .setPageSize(size)
      .setCurrentPage(page)
      .setTitle(title)
      .setBrand(brands)
      .setGender(gender)
      .build();

    const { body, statusCode } = await this.client.search({
      method: "POST",
      index: this.shoeIndexName,
      body: query,
      explain: true,
    });

    if (statusCode === HttpStatus.OK) {
      const count = body.hits.total.value;
      const shoes = body.hits.hits.map((t) => ({
        ...t._source,
        _id: new ObjectId(t._source.id),
        esId: t._id,
      }));

      return { count, shoes };
    }

    return {
      count: 0,
      shoes: [],
    };
  }

  public async updateShoe(updateInput: UpdateShoeInput) {
    const { statusCode } = await this.client.update({
      index: this.shoeIndexName,
      id: updateInput.shoeEsId,
      body: {
        doc: updateInput.getBody(),
      },
    });

    if (statusCode !== HttpStatus.OK) {
      throw new Error();
    }
  }

  private async _getCount(): Promise<number> {
    const { body } = await this.client.cat.count({
      index: this.shoeIndexName,
      format: "json",
      v: true,
    });

    return body[0].count;
  }
}
