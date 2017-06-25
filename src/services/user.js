import { request, config } from '../utils'

const { apiPrefix, api } = config
const { user } = api
const USER_URL = `${apiPrefix}/users`

export function query({current, pageSize, keyword}) {
  return request(`${USER_URL}?page=${current}&limit=${pageSize}`, {
    needAuth: true
  });
}

export async function queryOne (params) {
  return request({
    url: user,
    method: 'get',
    data: params,
  })
}

export async function create (params) {
  return request({
    url: user.replace('/:id', ''),
    method: 'post',
    data: params,
  })
}

export async function remove (params) {
  return request({
    url: user,
    method: 'delete',
    data: params,
  })
}

export async function update (params) {
  return request({
    url: user,
    method: 'patch',
    data: params,
  })
}
