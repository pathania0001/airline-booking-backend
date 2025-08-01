const { StatusCodes } = require("http-status-codes");
const { AppError } = require("../utils");

class CrudRepositories {
  constructor(model) {
    this.model = model;
  }

  async create(data) {
    const response = await this.model.create(data);
    return response;
  }
  async destroy(data) {
    const response = await this.model.destroy({
      where: { id: data },
    });
    if (!response) {
      throw new AppError("Requested item not found", StatusCodes.NOT_FOUND);
    }
    return response;
  }

  async get(data) {
    const response = await this.model.findByPk(data);
    if (!response) {
      throw new AppError("Requested item not found", StatusCodes.NOT_FOUND);
    }

    return response;
  }

  async getAll() {
    const response = await this.model.findAll();
    return response;
  }

  async update(id, data) {
    const res = await this.model.findByPk(id);
    if (!res) {
      throw new AppError("Requested item not found", StatusCodes.NOT_FOUND);
    }
    const response = await this.model.update(data, {
      where: { id: id },
    });
    return response;
  }
}

module.exports = CrudRepositories;
