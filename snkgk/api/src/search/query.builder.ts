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
    if (typeof this.title === 'undefined') {
      throw new Error('Must define title');
    }

    if (!this.pageSize) {
      throw new Error('Must define page size');
    }

    if (typeof this.currentPage === 'undefined') {
      throw new Error('Must define current page');
    }

    const filter = [];
    const must: Array<any> = [
      {
        wildcard: {
          'media.thumbUrl': '?*',
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
      filter.push({ terms: { 'brand.keyword': this.brands } });
    }

    if (this.gender) {
      filter.push({ term: { 'gender.keyword': this.gender } });
    }

    // Always fixed sort by releaseDate
    // Always return result with imageUrl
    return {
      sort: [{ releaseDate: { order: 'desc' } }],
      from: this.currentPage,
      size: this.pageSize,
      query: {
        bool: {
          must,
          filter: [...filter, { exists: { field: 'media.thumbUrl' } }],
        },
      },
    };
  }
}
