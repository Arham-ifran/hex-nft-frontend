import { BEFORE_SETTINGS, GET_SETTINGS, GET_ERRORS } from '../../../redux/types';
import { emptyError } from '../../../redux/shared/error/error.action';
import { ENV } from '../../../config/config';


export const beforeSettings = () => {
    return {
        type: BEFORE_SETTINGS
    }
}

export const getSettings = () => dispatch => {
    dispatch(emptyError());
    let url = `${ENV.url}settings/get`;

    fetch(url, {
        method: 'GET',
        headers: {
            'content-type': 'application/json',
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token
        }
    }).then(res => res.json()).then(data => {
        if (data.success) {
            dispatch({
                type: GET_SETTINGS,
                payload: data.settings
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
}