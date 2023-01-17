import { GET_ERRORS, BEFORE_ACTIVITY, GET_ACTIVITIES } from '../../redux/types';
import { ENV } from './../../config/config';
import { emptyError } from '../../redux/shared/error/error.action'

export const beforeActivity = () => {
    return {
        type: BEFORE_ACTIVITY
    }
}

export const getActivities = (type = null, qs = null) => dispatch => {
    dispatch(emptyError());
    let url = `${ENV.url}activity/list/${type}`;
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
                type: GET_ACTIVITIES,
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