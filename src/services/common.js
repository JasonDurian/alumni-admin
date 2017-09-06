import { request, config } from '../utils'

const { apiPrefix } = config

export default class Services {
  constructor(url) {
    this.baseUrl = `${apiPrefix}/${url}`
  }

  query({ page = 1, pageSize = 10, keywords = '', createTime = '', status = '' }) {
    return request(`${this.baseUrl}?page=${page}&limit=${pageSize}&keywords=${keywords}&time=${createTime.toString()}&status=${status}`, {
      needAuth: true
    });
  }

  queryOne({ id }) {
    return request(`${this.baseUrl}/${id}`, {
      needAuth: true
    });
  }

  create(values) {
    return request(`${this.baseUrl}`, {
      method: 'POST',
      needAuth: true,
      body: JSON.stringify(values),
    });
  }

  update(id, values) {
    return request(`${this.baseUrl}/${id}`, {
      method: 'PUT',
      needAuth: true,
      body: JSON.stringify(values)
    });
  }

  remove(id) {
    return request(`${this.baseUrl}/${id}`, {
      method: 'DELETE',
      needAuth: true,
    });
  }

  multiRemove(values) {
    return request(`${this.baseUrl}/deletes`, {
      method: 'POST',
      needAuth: true,
      body: JSON.stringify(values),
    });
  }

  multiEnable(values) {
    return request(`${this.baseUrl}/enables`, {
      method: 'POST',
      needAuth: true,
      body: JSON.stringify(values),
    });
  }

  multiCheck(values) {
    return request(`${this.baseUrl}/checks`, {
      method: 'POST',
      needAuth: true,
      body: JSON.stringify(values),
    });
  }
}
