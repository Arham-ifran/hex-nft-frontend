import { toast } from 'react-toastify';
import { GET_ERRORS, BEFORE_NFT, GET_NFTS, GET_NFT, UPSERT_NFT, SEARCH_NFT, BEFORE_METADATA, REFRESH_METADATA, CANCEL_LISTING, BEFORE_LISTING, TRANSFER_NFT, BEFORE_TRANSFER_NFT, BUY_NFT, BEFORE_BUY_NFT, GET_HOMEPAGE_NFTS, BEFORE_HOMEPAGE_NFTS, GET_STAKING_PERCENT, BEFORE_STAKING_PERCENT } from '../../redux/types';
import { ENV } from './../../config/config';
import { emptyError } from '../../redux/shared/error/error.action';
import { getStakingPercentWeb3 } from '../../utils/web3'

export const beforeStakingPercent = () => {
    return {
        type: BEFORE_STAKING_PERCENT
    }
}

export const beforeBuy = () => {
    return {
        type: BEFORE_BUY_NFT
    }
}

export const beforeNFT = () => {
    return {
        type: BEFORE_NFT
    }
}

export const beforeHomepageNfts = () => {
    return {
        type: BEFORE_HOMEPAGE_NFTS
    }
}

export const beforeListing = () => {
    return {
        type: BEFORE_LISTING
    }
}

export const beforeMetadata = () => {
    return {
        type: BEFORE_METADATA
    }
}

export const beforeTransfer = () => {
    return {
        type: BEFORE_TRANSFER_NFT
    }
}

export const refreshMetadata = (body) => dispatch => {
    dispatch(emptyError());
    const url = `${ENV.url}nfts/update-metadata`;

    fetch(url, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token,
            'x-access-token': ENV.getUserKeys('accessToken') && ENV.getUserKeys('accessToken').accessToken ? ENV.getUserKeys('accessToken').accessToken : ''
        },
        body: JSON.stringify(body)
    }).then(res => res.json()).then(data => {
        if (data.success) {
            toast.success(data.message)
            dispatch({
                type: REFRESH_METADATA,
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
        dispatch({
            type: GET_ERRORS,
            payload: error
        })
    })
};

export const upsertNFT = (type = 'create', body, method = 'POST') => dispatch => {
    dispatch(emptyError());
    const url = `${ENV.url}nfts/${type}`;

    fetch(url, {
        method,
        headers: {
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token,
            'x-access-token': ENV.getUserKeys('accessToken') && ENV.getUserKeys('accessToken').accessToken ? ENV.getUserKeys('accessToken').accessToken : ''
        },
        body
    }).then(res => res.json()).then(data => {
        if (data.success) {
            // toast.success(data.message)
            dispatch({
                type: UPSERT_NFT,
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

export const getNFTs = (qs = '') => dispatch => {
    dispatch(emptyError());
    let url = `${ENV.url}nfts/list`

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
                type: GET_NFTS,
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
}

export const getNFT = (nftId, qs = '') => dispatch => {
    dispatch(emptyError());
    let url = `${ENV.url}nfts/get/${nftId}`;

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
                type: GET_NFT,
                payload: data.nft
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

export const searchNft = (type = null, qs = null) => dispatch => {
    dispatch(emptyError());
    let url = `${ENV.url}nfts/search/${type}`;
    if (qs)
        url += `?${qs}`
    // const url = `${ENV.url}nfts/search/${name}`;
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
                type: SEARCH_NFT,
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

export const cancelListing = (nftId, sellingMethod, cancelListingSign) => dispatch => {
    dispatch(emptyError());
    const url = `${ENV.url}nfts/cancel-listing`;

    fetch(url, {
        method: 'PUT',
        headers: {
            'content-type': 'application/json',
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token,
            'x-access-token': ENV.getUserKeys('accessToken') && ENV.getUserKeys('accessToken').accessToken ? ENV.getUserKeys('accessToken').accessToken : ''
        },
        body: JSON.stringify({ nftId, sellingMethod, cancelListingSign })
    }).then(res => res.json()).then(data => {
        if (data.success) {
            dispatch({
                type: CANCEL_LISTING,
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

export const buyNFT = (body) => dispatch => {
    dispatch(emptyError());
    const url = `${ENV.url}nfts/buy`;

    fetch(url, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token,
            'x-access-token': ENV.getUserKeys('accessToken') && ENV.getUserKeys('accessToken').accessToken ? ENV.getUserKeys('accessToken').accessToken : ''
        },
        body: JSON.stringify(body)
    }).then(res => res.json()).then(data => {
        if (data.success) {
            toast.success(data.message)
            dispatch({
                type: BUY_NFT,
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
        dispatch({
            type: GET_ERRORS,
            payload: error
        })
    })
};

export const buyWithPayPal = (body) => dispatch => {
    dispatch(emptyError());
    const url = `${ENV.url}nfts/buy-with-paypal`;

    fetch(url, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token,
            'x-access-token': ENV.getUserKeys('accessToken') && ENV.getUserKeys('accessToken').accessToken ? ENV.getUserKeys('accessToken').accessToken : ''
        },
        body: JSON.stringify(body)
    }).then(res => res.json()).then(data => {
        if (data.success) {
            window.location.href = data.link
        } else {
            toast.error(data.message)
            dispatch({
                type: GET_ERRORS,
                payload: data
            })
        }
    }).catch(error => {
        dispatch({
            type: GET_ERRORS,
            payload: error
        })
    })
};

export const getHomepageNfts = () => (dispatch) => {
    toast.dismiss()
    dispatch(emptyError())
    let url = `${ENV.url}nfts/homepage-nfts`

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
                    type: GET_HOMEPAGE_NFTS,
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

export const fetchFile = (file) => (dispatch) => {
    dispatch(emptyError())
    fetch(file, {
        method: 'GET',
        headers: {
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token,
        },
    })
        // .then((res) => res.json())
        .then((data) => {
        }).catch((err) => {
            dispatch({
                type: GET_ERRORS,
                payload: err,
            })
        })
}

// get NFT staking percentage from other platform
export const getStakingPercent = (stakingPercentData) => async dispatch => {
    dispatch(emptyError())

    const stakingPercent = await getStakingPercentWeb3(stakingPercentData)
    if (stakingPercent)
        dispatch({
            type: GET_STAKING_PERCENT,
            payload: stakingPercent
        })
}