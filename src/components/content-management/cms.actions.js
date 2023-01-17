import { GET_CONTENT_PAGES, BEFORE_CONTENT, GET_CONTENT_PAGE, GET_ERRORS } from '../../redux/types';
import { ENV } from './../../config/config';
import { emptyError } from '../../redux/shared/error/error.action'


export const beforeContent = () => {
    return {
        type: BEFORE_CONTENT
    }
}

export const getContentPages = () => dispatch => {
    dispatch(emptyError());
    let url = `${ENV.url}content/list`;

    fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token,
        }
    }).then(res => res.json()).then(data => {
        if (data.success) {
            dispatch({
                type: GET_CONTENT_PAGES,
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

export const getContentPage = (slug) => dispatch => {
    dispatch(emptyError());
    let url = `${ENV.url}content/get-content-page/${slug}`;

    fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token,
        }
    }).then(res => res.json()).then(data => {
        if (data.success) {
            dispatch({
                type: GET_CONTENT_PAGE,
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

