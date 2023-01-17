import { toast } from 'react-toastify';
import { ENV } from './../../config/config';
import { GET_ERRORS, SET_USER, GET_USER, SET_CREATORS, TOP_SELLERS, SET_INDIVIDUAL_USER, BEFORE_USER, SET_BANNER, USER_TRADE } from '../../redux/types';
import { emptyError } from '../../redux/shared/error/error.action';

export const beforeUser = () => {
    return {
        type: BEFORE_USER
    }
}

// method to set user data
export const setUser = (user) => dispatch => {
    dispatch(emptyError())
    dispatch({
        type: SET_USER,
        payload: user
    })
}

export const setBanner = (banner) => dispatch => {
    dispatch(emptyError())
    dispatch({
        type: SET_BANNER,
        payload: banner
    })
}

// method to get user data
export const getUser = () => dispatch => {
    dispatch({
        type: GET_USER
    })
}

// method to login using wallet address and sign
export const login = (payload) => dispatch => {
    dispatch(emptyError());
    const url = `${ENV.url}auth/login/`;
    fetch(url, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token
        },
        body: JSON.stringify(payload)
    }).then(res => res.json()).then(data => {
        if (data.status) {
            localStorage.removeItem('referralId')
            ENV.encryptUserData(data.data);
            dispatch({
                type: SET_USER,
                payload: data.data
            })
        } else {
            dispatch({
                type: GET_ERRORS,
                payload: data
            })
        }
    }).catch(errors => {
        dispatch({
            type: GET_ERRORS,
            payload: errors
        })
    })
};

// method to signup using wallet address, sign, and payload
export const signup = (payload) => dispatch => {
    dispatch(emptyError());
    const url = `${ENV.url}auth/register/`;
    fetch(url, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token
        },
        body: JSON.stringify(payload)
    }).then(res => res.json()).then(data => {
        if (data.status) {
            ENV.encryptUserData(data.data);
            dispatch({
                type: SET_USER,
                payload: data.data
            })
        } else {
            dispatch({
                type: GET_ERRORS,
                payload: data
            })
        }
    }).catch(errors => {
        dispatch({
            type: GET_ERRORS,
            payload: errors
        })
    })
};

// method to update user's profile, update user's payload
export const updateProfile = (body) => dispatch => {
    dispatch(emptyError());
    const url = `${ENV.url}users/`;
    fetch(url, {
        method: 'PUT',
        headers: {
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token,
            'x-access-token': ENV.getUserKeys('accessToken') && ENV.getUserKeys('accessToken').accessToken ? ENV.getUserKeys('accessToken').accessToken : ''
        },
        body
    }).then(res => res.json()).then(data => {
        if (data.status) {
            ENV.encryptUserData(data.data);
            dispatch({
                type: SET_USER,
                payload: data.data
            })
            toast.success(data.message)
        } else {
            dispatch({
                type: GET_ERRORS,
                payload: data
            })
        }
    }).catch(errors => {
        dispatch({
            type: GET_ERRORS,
            payload: errors
        })
    })
};

// method to get authors' details
export const getTopSellers = (qs = '') => dispatch => {
    toast.dismiss()
    dispatch(emptyError());
    let url = `${ENV.url}users/top-sellers`

    if (qs)
        url += `?${qs}`

    fetch(url, {
        method: 'GET',
        headers: {
            'content-type': 'application/json',
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token,
            'x-access-token': ENV.getUserKeys('accessToken') && ENV.getUserKeys('accessToken').accessToken ? ENV.getUserKeys('accessToken').accessToken : ''
        }
    }).then(res => res.json()).then(data => {
        if (data.status) {
            dispatch({
                type: TOP_SELLERS,
                payload: data.data
            })
        } else {
            dispatch({
                type: GET_ERRORS,
                payload: data
            })
        }
    }).catch(errors => {
        dispatch({
            type: GET_ERRORS,
            payload: errors
        })
    })
};

// method to get authors' details
export const getCreators = (qs = '') => dispatch => {
    toast.dismiss()
    dispatch(emptyError());
    let url = `${ENV.url}users/creators`

    if (qs)
        url += `?${qs}`

    fetch(url, {
        method: 'GET',
        headers: {
            'content-type': 'application/json',
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token,
            'x-access-token': ENV.getUserKeys('accessToken') && ENV.getUserKeys('accessToken').accessToken ? ENV.getUserKeys('accessToken').accessToken : ''
        }
    }).then(res => res.json()).then(data => {
        if (data.status) {
            dispatch({
                type: SET_CREATORS,
                payload: data.data
            })
        } else {
            dispatch({
                type: GET_ERRORS,
                payload: data
            })
        }
    }).catch(errors => {
        dispatch({
            type: GET_ERRORS,
            payload: errors
        })
    })
};

// method to get authors' details
export const getUserById = (userId) => dispatch => {
    dispatch(emptyError());
    const url = `${ENV.url}users/${userId}`;
    fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token,
            'x-access-token': ENV.getUserKeys('accessToken') && ENV.getUserKeys('accessToken').accessToken ? ENV.getUserKeys('accessToken').accessToken : ''
        }
    }).then(res => res.json()).then(data => {
        if (data.status) {
            dispatch({
                type: SET_INDIVIDUAL_USER,
                payload: data.data
            })
        } else {
            dispatch({
                type: GET_ERRORS,
                payload: data
            })
        }
    }).catch(errors => {
        dispatch({
            type: GET_ERRORS,
            payload: errors
        })
    })
};

export const listTrade = (qs) => dispatch => {
    toast.dismiss()
    dispatch(emptyError());
    let url = `${ENV.url}users/list-trade`;
    if (qs)
        url += `?${qs}`
    fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token,
            'x-access-token': ENV.getUserKeys('accessToken') && ENV.getUserKeys('accessToken').accessToken ? ENV.getUserKeys('accessToken').accessToken : ''
        }
    }).then(res => res.json()).then(data => {
        if (data.success) {
            dispatch({
                type: USER_TRADE,
                payload: data.data
            })
        } else {
            dispatch({
                type: GET_ERRORS,
                payload: data
            })
        }
    }).catch(errors => {
        dispatch({
            type: GET_ERRORS,
            payload: errors
        })
    })
};

// method to get authors' details
export const setIndividualUserData = (user) => dispatch => {
    dispatch(emptyError());
    dispatch({
        type: SET_INDIVIDUAL_USER,
        payload: user
    })
};