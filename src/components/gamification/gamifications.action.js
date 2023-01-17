import { BEFORE_GSTATS, SET_GPOINTS, SET_CONTESTS, BEFORE_CONTESTS, VERIFY_DISCOUNT, BEFORE_VERIFY_DISCOUNT, GIFT_CARDS, BEFORE_GIFT_CARDS } from '../../redux/types'
import { emptyError } from '../../redux/shared/error/error.action'
import axios from 'axios'
import { ENV } from '../../config/config'
const { gamification } = ENV

export const beforeStats = () => {
    return {
        type: BEFORE_GSTATS
    }
}

export const beforeContests = () => {
    return {
        type: BEFORE_CONTESTS
    }
}

export const beforeVerifyDiscount = () => {
    return {
        type: BEFORE_VERIFY_DISCOUNT
    }
}

export const beforeGiftCards = () => {
    return {
        type: BEFORE_GIFT_CARDS
    }
}

// set gamification points
export const setPoints = () => dispatch => {
    dispatch(emptyError());
    axios?.[gamification.ponits.method](gamification.ponits.url).then((res) => {
        if (res) {
            dispatch({
                type: SET_GPOINTS,
                payload: res.data
            })
        }
    })
}

// create stats
export const createStats = (payload = {}) => dispatch => {
    dispatch(emptyError());

    const config = {
        headers: {
            'Content-Type': 'application/json',
        }
    }
    axios?.[gamification.stats.method](gamification.stats.url, payload, config).then((res) => {
        if (res) {
            dispatch({
                type: BEFORE_GSTATS
            })
        }
    }).catch((err) => console.log('ERR received while making Gamification Stats: ', err))
}

// get contest list
export const getContestList = () => dispatch => {
    dispatch(emptyError());
    axios?.[gamification.contests.method](gamification.contests.url).then((res) => {
        if (res) {
            dispatch({
                type: SET_CONTESTS,
                payload: res.data
            })
        }
    }).catch((err) => console.log('ERR received while fetching Contest List: ', err))
}

// verify discount on gift card
export const giftCardVerification = (payload = {}) => dispatch => {
    dispatch(emptyError());

    const config = {
        headers: {
            'Content-Type': 'application/json',
        }
    }
    axios?.[gamification.giftCardVerification.method](gamification.giftCardVerification.url, payload, config).then((res) => {
        if (res) {
            dispatch({
                type: VERIFY_DISCOUNT,
                payload: res.data
            })
        }
    }).catch((err) => console.log('ERR received while verifying gift card: ', err))
}

// get gift cards list
export const getGiftCards = () => dispatch => {
    dispatch(emptyError());
    axios?.[gamification.giftCards.method](gamification.giftCards.url).then((res) => {
        if (res) {
            dispatch({
                type: GIFT_CARDS,
                payload: res.data
            })
        }
    }).catch((err) => console.log('ERR received while fetching Gift Cards: ', err))
}

// save redeemed gift card 
export const redeemedGiftCardLog = (payload = {}) => dispatch => {
    dispatch(emptyError());

    axios?.[gamification.redeemedGiftCard.method](gamification.redeemedGiftCard.url, payload).then((res) => {
        if (res) {
            // console.log('res', res)
        }
    }).catch((err) => console.log('ERR received while saving used gift card log: ', err))
}