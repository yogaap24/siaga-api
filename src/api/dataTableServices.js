class DataTableService {
  constructor(prismaModel, query) {
    this.prismaModel = prismaModel;
    this.query = query;
  }

  async getResult(fieldsToExclude = []) {
    let result;

    // Initialize queryOptions to pass to findMany
    const queryOptions = {};

    // Search columns
    if (this.query.search_columns && this.query.search_keys) {
      queryOptions.where = {
        OR: this.query.search_columns
          .split(", ")
          .map((searchColumn, index) => ({
            [searchColumn]: {
              contains: this.query.search_keys.split(", ")[index],
              mode: "insensitive",
            },
          })),
      };
    }

    // Filter columns
    if (this.query.filter_columns && this.query.filter_values) {
      queryOptions.where = {
        AND: this.query.filter_columns
          .split(", ")
          .map((filterColumn, index) => ({
            [filterColumn]: {
              equals: this.query.filter_values.split(", ")[index],
            },
          })),
      };
    }

    // Filter Date columns
    if (this.query.filter_date_columns && this.query.filter_start_date && this.query.filter_end_date) {
      const startDate = new Date(this.query.filter_start_date);
      const endDate = new Date(this.query.filter_end_date);
      endDate.setDate(endDate.getDate() + 1);

      console.log(startDate, endDate);

      queryOptions.where = {
        AND: this.query.filter_date_columns
          .split(", ")
          .map((filterDateColumn, index) => ({
            [filterDateColumn]: {
              gte: startDate,
              lte: endDate,
            },
          })),
      };
    }

    // Sort columns
    if (this.query.sort_column && this.query.sort_type) {
      queryOptions.orderBy = {
        [this.query.sort_column]: this.query.sort_type.toLowerCase(),
      };
    }

    // Pagination
    if (this.query.per_page && this.query.page) {
      queryOptions.skip =
        (parseInt(this.query.page) - 1) * parseInt(this.query.per_page);
      queryOptions.take = parseInt(this.query.per_page);
    }

    // Pagination with default page
    if (this.query.per_page && !this.query.page) {
      queryOptions.skip = 0;
      queryOptions.take = parseInt(this.query.per_page);
    }

    // Pagination with default per_page
    if (!this.query.per_page && this.query.page) {
      queryOptions.skip = (parseInt(this.query.page) - 1) * 5;
      queryOptions.take = 5;
    }

    // Default pagination
    if (!this.query.per_page && !this.query.page) {
      queryOptions.skip = 0;
      queryOptions.take = 5;
    }

    // Fetch results with combined filters
    result = await this.prismaModel.findMany(queryOptions);

    // Filter exclude columns
    if (fieldsToExclude.length > 0 && Array.isArray(result)) {
      result = result.map((item) => {
        return Object.keys(item).reduce((acc, field) => {
          if (!fieldsToExclude.includes(field)) {
            acc[field] = item[field];
          }
          return acc;
        }, {});
      });
    }

    return result;
  }
}

module.exports = DataTableService;
