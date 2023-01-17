import { GET_ERRORS, BEFORE_RANKING, GET_RANKINGS, GET_TRENDING, BEFORE_TRENDING , GET_TOP_COLLECTIONS, BEFORE_TOP_COLLECTIONS} from '../../redux/types';
import { ENV } from './../../config/config';
import { emptyError } from '../../redux/shared/error/error.action'

export const beforeRanking = () => {
    return {
        type: BEFORE_RANKING
    }
}

export const beforeTrending = () => {
    return {
        type: BEFORE_TRENDING
    }
}

export const beforeTopCollection = () => {
    return {
        type: BEFORE_TOP_COLLECTIONS
    }
}

export const getRankings = (qs = null) => dispatch => {
    dispatch(emptyError());
    let url = `${ENV.url}rankings/list`;
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
        if (data.success) {
            dispatch({
                type: GET_RANKINGS,
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

export const getTrendingCollections = () => dispatch => {
    dispatch(emptyError());
    let url = `${ENV.url}rankings/trending-collections`;

    fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token,
        }
    }).then(res => res.json()).then(data => {
        if (data.success) {
            dispatch({
                type: GET_TRENDING,
                payload: data
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

export const getTopCollections = () => dispatch => {
    dispatch(emptyError());
    let url = `${ENV.url}rankings/top-collections`;

    fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token,
        }
    }).then(res => res.json()).then(data => {
        if (data.success) {
            dispatch({
                type: GET_TOP_COLLECTIONS,
                payload: data
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