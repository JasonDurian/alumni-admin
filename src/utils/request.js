import fetch from 'dva/fetch';
import { prefix } from './config'

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

function parseErrorMessage({ code, error }) {
  // const { code, error } = data;
  if (code !== 200) {
    let e = new Error(error);
    e.number = code
    throw e
  }
  return error;
}

const headerHandler = (tokenInfo, values = {
  'Accept': 'application/json',
  'Content-Type': 'application/json'
}) => (
  {...tokenInfo, ...values}
)

const optionsHandler = (options, values = {
  'Accept': 'application/json',
  'Content-Type': 'application/json'
}) => {
  let auth = {}
  if (!!options.needAuth) {
    delete options.needAuth
    auth = {
      credentials: 'include',
      headers: {
        ...values,
        authKey: localStorage.getItem(`${prefix}authKey`)
      }
    }
  } else {
    auth = {
      headers: values
    }
  }
  return {...options, ...auth}
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */

export default async function request(url, options = {}) {

  // const newHeader = headerHandler(!!options.headers ? options.headers : {})
  // const newOption = {...options, headers: newHeader}

  const newOption = optionsHandler(options)
  const response = await fetch(url, newOption);

  checkStatus(response);

  const data = await response.json();

  parseErrorMessage(data)

  // console.log(data)

  return data;
}
