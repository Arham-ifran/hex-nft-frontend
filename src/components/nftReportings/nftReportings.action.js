import { GET_REPORTS, GET_REPORT, BEFORE_REPORT, BEFORE_NFT_REPORT, ADD_REPORT_RESPONSE, ADD_REPORT, GET_REPORT_MESSAGES, GET_REPORTED_USERS, GET_ERRORS} from '../../redux/types'
import { toast } from 'react-toastify';
import { emptyError } from '../../redux/shared/error/error.action';
import { ENV } from './../../config/config';

export const beforeReports = () => {
    return {
        type: BEFORE_REPORT
    }
}

export const beforeUserNftReports = () => {
    return {
        type: BEFORE_NFT_REPORT
    }
}

export const getUserNftReports = (body, userId = null, nftId = null, isNftId = false) => dispatch => {
    toast.dismiss()
    dispatch(emptyError());
    let url = `${ENV.url}reports/get`;
    body.isNftId = isNftId
    if(userId !== null && userId !== ''){
        url = `${url}/${userId}`
    }
    if(nftId !== null && nftId !== ''){
        // url = `${url}/${nftId}`
        body.nftId = nftId
    }


    fetch(url, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token,
            'x-access-token': ENV.getUserKeys('accessToken') && ENV.getUserKeys('accessToken').accessToken ? ENV.getUserKeys('accessToken').accessToken : ''

        },
        body : JSON.stringify(body)
    }).then(res => res.json()).then(data => {
        if (data.success) {
            // toast.success(data.message)
            dispatch({
                type: GET_REPORTS,
                payload: data
            })
        } else {
            toast.error(data.message)
            dispatch({
                type: GET_ERRORS,
                payload: data
            })
        }
    }).catch(error => {
        if (error.response && error.response.data) {
            const { data } = error.response
            if (data.message)
                toast.error(data.message)
        }
        dispatch({
            type: GET_ERRORS,
            payload: error
        })
    })
};

export const getReport = (reportId) => dispatch => {
    toast.dismiss()
    dispatch(emptyError());
    let url = `${ENV.url}reports/get-report/${reportId}`;

    fetch(url, {
        method: 'GET',
        headers: {
            // 'content-type': 'application/json',
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token,
            'x-access-token': ENV.getUserKeys('accessToken') && ENV.getUserKeys('accessToken').accessToken ? ENV.getUserKeys('accessToken').accessToken : ''

        },
        // body : JSON.stringify(body)
    }).then(res => res.json()).then(data => {
        if (data.success) {
            // toast.success(data.message)
            dispatch({
                type: GET_REPORT,
                payload: data
            })
        } else {
            toast.error(data.message)
            dispatch({
                type: GET_ERRORS,
                payload: data
            })
        }
    }).catch(error => {
        if (error.response && error.response.data) {
            const { data } = error.response
            if (data.message)
                toast.error(data.message)
        }
        dispatch({
            type: GET_ERRORS,
            payload: error
        })
    })
};

export const addReport = (body) => dispatch => {
    dispatch(emptyError());
    const url = `${ENV.url}reports/add-report`;
    fetch(url, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token,
            'x-access-token': ENV.getUserKeys('accessToken') && ENV.getUserKeys('accessToken').accessToken ? ENV.getUserKeys('accessToken').accessToken : ''
,
            
        },
        body: JSON.stringify(body)
    }).then(res => res.json()).then(data => {
        if (data.success) {
            toast.success(data.message)
            dispatch({
                type: ADD_REPORT,
                payload: data
            })
        } else {
            toast.error(data.message)
            dispatch({
                type: GET_ERRORS,
                payload: data
            })
        }
    }).catch(error => {
        if (error.response && error.response.data) {
            const { data } = error.response
            if (data.message)
                toast.error(data.message)
        }
        dispatch({
            type: GET_ERRORS,
            payload: error
        })
    })
};

// report responses

export const addReportResponse = (body) => dispatch => {
    dispatch(emptyError());
    const url = `${ENV.url}reports/add-report-response`;
    fetch(url, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token,
            'x-access-token': ENV.getUserKeys('accessToken') && ENV.getUserKeys('accessToken').accessToken ? ENV.getUserKeys('accessToken').accessToken : ''
,
            
        },
        body: JSON.stringify(body)
    }).then(res => res.json()).then(data => {
        if (data.success) {
            // toast.success(data.message)
            dispatch({
                type: ADD_REPORT_RESPONSE,
                payload: data
            })
        } else {
            toast.error(data.message)
            dispatch({
                type: GET_ERRORS,
                payload: data
            })
        }
    }).catch(error => {
        if (error.response && error.response.data) {
            const { data } = error.response
            if (data.message)
                toast.error(data.message)
        }
        dispatch({
            type: GET_ERRORS,
            payload: error
        })
    })
};

export const getReportedNftUsers = (id) => dispatch => {
    dispatch(emptyError());
    let url = `${ENV.url}reports/reported-nft-users`;
    let body = { id }
    fetch(url, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token,
            'x-access-token': ENV.getUserKeys('accessToken') && ENV.getUserKeys('accessToken').accessToken ? ENV.getUserKeys('accessToken').accessToken : '',       
        },
        body : JSON.stringify(body)
    }).then(res => res.json()).then(data => {
        if (data.success) {
            // if (!qs)
            //     toast.success(data.message)
            dispatch({
                type: GET_REPORTED_USERS,
                payload: data
            })
        } else {
            // if (!qs)
            //     toast.error(data.message)
            dispatch({
                type: GET_ERRORS,
                payload: data
            })
        }
    }).catch(error => {
        if (error.response && error.response.data) {
            const { data } = error.response
            if (data.message)
                toast.error(data.message)
        }
        dispatch({
            type: GET_ERRORS,
            payload: error
        })
    })
};
