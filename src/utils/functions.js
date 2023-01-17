import axios from "axios";
import { ENV } from '../config/config';
let baseUrl = ENV.url;

export const axiosSyncPost = (url, data, isMultipart = false) => {
  return new Promise((resolve, reject) => {
    const params = new URLSearchParams();
    let keys = Object.keys(data);
    for (let x = 0; x < keys.length; x++) {
      params.append(keys[x], data[keys[x]]);
    }

    const config = {
      headers: {
        'Content-Type': isMultipart ? 'multipart/form-data' : 'application/x-www-form-urlencoded',
        "Authorization": ENV.Authorization,
        "x-auth-token": ENV.x_auth_token,
        'x-access-token': ENV.getUserKeys('accessToken') && ENV.getUserKeys('accessToken').accessToken ? ENV.getUserKeys('accessToken').accessToken : ''
      },
    };

    url = baseUrl + url;

    axios.post(url, params, config).then(
      (res) => {
        resolve(res.data);
      },
      (error) => {
        resolve(error)
      },
    );
  });
};
export const axiosPostFormData = (url, body, isMultipart = false) => {
  return new Promise((resolve, reject) => {
    const config = {
      headers: {
        // 'Content-Type': isMultipart ? 'multipart/form-data' : 'application/json',
        "Authorization": ENV.Authorization,
        "x-auth-token": ENV.x_auth_token,
        'x-access-token': ENV.getUserKeys('accessToken') && ENV.getUserKeys('accessToken').accessToken ? ENV.getUserKeys('accessToken').accessToken : ''
      },
    };

    url = baseUrl + url;

    axios.post(url, body, config).then(
      (res) => {
        resolve(res.data)
      },
      (error) => {
        resolve(error)
      },
    );
  });
};

export const ipfsToUrl = (str) => {
  if (!!str && typeof(str) === 'object') {
    return str
  }
  if (!str || str?.trim() === '') {
    return ENV.globalPlaceholderImage
  }
  if (str.includes('ipfs://')) {
    str = str.replace('ipfs://', '')
    return `https://ipfs.io/ipfs/${str}`
  }
  return str
}

export const generateRandomString = (length)=> {
  let result = '';
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let charactersLength = characters.length;
  for ( let i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
 }
 return Date.now().toString(36)+result;
}