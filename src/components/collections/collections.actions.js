import { toast } from 'react-toastify'
import { GET_ERRORS, BEFORE_COLLECTION, GET_COLLECTION, GET_COLLECTIONS, UPSERT_COLLECTION, DELETE_COLLECTION, SET_LANDING_COLLECTIONS, BEFORE_NOTABLE_DROPS, GET_NOTABLE_DROPS } from '../../redux/types'
import { emptyError } from '../../redux/shared/error/error.action'
import { ENV } from './../../config/config'

export const beforeCollection = () => {
  return {
    type: BEFORE_COLLECTION
  }
}

export const beforeNotableDrops = () => {
  return {
    type: BEFORE_NOTABLE_DROPS
  }
}

export const setLandingCollections = (check = false) => (dispatch) => {
  dispatch({
    type: SET_LANDING_COLLECTIONS,
    payload: check,
  })
}

export const getCollection = (collectionId, page = null) => (
  dispatch,
) => {
  toast.dismiss()
  dispatch(emptyError())
  const url = `${ENV.url}collection/get/${collectionId}?page=${page}`

  fetch(url, {
    method: 'GET',
    headers: {
      'content-type': 'application/json',
      Authorization: ENV.Authorization,
      'x-auth-token': ENV.x_auth_token,
      'x-access-token':
        ENV.getUserKeys('accessToken') &&
          ENV.getUserKeys('accessToken').accessToken
          ? ENV.getUserKeys('accessToken').accessToken
          : '',
    },
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        dispatch({
          type: GET_COLLECTION,
          payload: data,
        })
      } else {
        toast.error(data.message)
        dispatch({
          type: GET_ERRORS,
          payload: data,
        })
      }
    })
    .catch((error) => {
      if (error.response && error.response.data) {
        const { data } = error.response
        if (data.message) toast.error(data.message)
      }
      dispatch({
        type: GET_ERRORS,
        payload: error,
      })
    })
}

export const getCollections = (qs = null) => (dispatch) => {
  toast.dismiss()
  dispatch(emptyError())
  let url = `${ENV.url}collection/list`
  if (qs) url += `?${qs}`

  fetch(url, {
    method: 'GET',
    headers: {
      'content-type': 'application/json',
      Authorization: ENV.Authorization,
      'x-auth-token': ENV.x_auth_token,
      'x-access-token':
        ENV.getUserKeys('accessToken') &&
          ENV.getUserKeys('accessToken').accessToken
          ? ENV.getUserKeys('accessToken').accessToken
          : '',
    },
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        dispatch({
          type: GET_COLLECTIONS,
          payload: data.data,
        })
      } else {
        toast.error(data.message)
        dispatch({
          type: GET_ERRORS,
          payload: data,
        })
      }
    })
    .catch((error) => {
      if (error.response && error.response.data) {
        const { data } = error.response
        if (data.message) toast.error(data.message)
      }
      dispatch({
        type: GET_ERRORS,
        payload: error,
      })
    })
}

export const upsertCollection = (apiURL, body, method = 'POST') => (
  dispatch,
) => {
  dispatch(emptyError())
  const url = `${ENV.url}${apiURL}`

  fetch(url, {
    method,
    headers: {
      Authorization: ENV.Authorization,
      'x-auth-token': ENV.x_auth_token,
      'x-access-token':
        ENV.getUserKeys('accessToken') &&
          ENV.getUserKeys('accessToken').accessToken
          ? ENV.getUserKeys('accessToken').accessToken
          : '',
    },
    body,
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        toast.success(data.message)
        dispatch({
          type: UPSERT_COLLECTION,
          payload: data,
        })
      } else {
        toast.error(data.message)
        dispatch({
          type: GET_ERRORS,
          payload: data,
        })
      }
    })
    .catch((error) => {
      if (error.response && error.response.data) {
        const { data } = error.response
        if (data.message) toast.error(data.message)
      }
      dispatch({
        type: GET_ERRORS,
        payload: error,
      })
    })
}

export const deleteCollection = (collectionId) => (dispatch) => {
  dispatch(emptyError())
  let url = `${ENV.url}collection/delete/${collectionId}`

  fetch(url, {
    method: 'DELETE',
    headers: {
      'content-type': 'application/json',
      Authorization: ENV.Authorization,
      'x-auth-token': ENV.x_auth_token,
      'x-access-token':
        ENV.getUserKeys('accessToken') &&
          ENV.getUserKeys('accessToken').accessToken
          ? ENV.getUserKeys('accessToken').accessToken
          : '',
    },
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        toast.success(data.message)
        dispatch({
          type: DELETE_COLLECTION,
          payload: data,
        })
      } else {
        toast.error(data.message)
        dispatch({
          type: GET_ERRORS,
          payload: data,
        })
      }
    })
    .catch((error) => {
      if (error.response && error.response.data) {
        const { data } = error.response
        if (data.message) toast.error(data.message)
      }
      dispatch({
        type: GET_ERRORS,
        payload: error,
      })
    })
}

export const getNotableDrops = () => (dispatch) => {
  toast.dismiss()
  dispatch(emptyError())
  let url = `${ENV.url}collection/notable-drops`

  fetch(url, {
    method: 'GET',
    headers: {
      'content-type': 'application/json',
      Authorization: ENV.Authorization,
      'x-auth-token': ENV.x_auth_token,
      'x-access-token':
        ENV.getUserKeys('accessToken') &&
          ENV.getUserKeys('accessToken').accessToken
          ? ENV.getUserKeys('accessToken').accessToken
          : '',
    },
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        dispatch({
          type: GET_NOTABLE_DROPS,
          payload: data,
        })
      } else {
        toast.error(data.message)
        dispatch({
          type: GET_ERRORS,
          payload: data,
        })
      }
    })
    .catch((error) => {
      if (error.response && error.response.data) {
        const { data } = error.response
        if (data.message) toast.error(data.message)
      }
      dispatch({
        type: GET_ERRORS,
        payload: error,
      })
    })
}
