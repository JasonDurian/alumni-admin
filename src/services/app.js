import { request, config } from '../utils'

const { apiPrefix } = config
const BASE_URL = `${apiPrefix}/base`
const USER_URL = `${apiPrefix}/users`

export function login(values) {
  return request(`${BASE_URL}/login`, {
    method: 'POST',
    credentials: 'include',             //需要设置sessionID
    body: JSON.stringify(values),
  });
}

export function logout(values) {
  return request(`${BASE_URL}/logout`, {
    method: 'POST',
    credentials: 'include',             //需要设置sessionID
    body: JSON.stringify(values),
  });
}

export function query() {
  return request(`${USER_URL}/query`, {
    method: 'POST',
    needAuth: true,
  });
}
