import { BEFORE_GSTATS, SET_GPOINTS, SET_CONTESTS, BEFORE_CONTESTS, VERIFY_DISCOUNT, BEFORE_VERIFY_DISCOUNT, GIFT_CARDS, BEFORE_GIFT_CARDS } from '../../redux/types'

const initialState = {
    points: null, // points daa retrieved from gamification
    statsAuth: false, // create stats for gamification auth,
    contests: null,
    contestsAuth: false,
    verifyDiscount: null,
    verifyDiscountAuth: false,
    giftCardsList: null,
    giftCardsAuth: false
}

export default function gamificationReducer(state = initialState, action) {
    switch (action.type) {
        case SET_GPOINTS:
            return {
                ...state,
                points: action.payload
            }
        case BEFORE_GSTATS:
            return {
                ...state,
                statsAuth: false
            }
        case SET_CONTESTS:
            return {
                ...state,
                contests: action.payload,
                contestsAuth: true
            }
        case BEFORE_CONTESTS:
            return {
                ...state,
                contestsAuth: false,
                contests: null
            }
        case VERIFY_DISCOUNT:
            return {
                ...state,
                verifyDiscount: action.payload,
                verifyDiscountAuth: true
            }
        case BEFORE_VERIFY_DISCOUNT:
            return {
                ...state,
                verifyDiscount: null,
                verifyDiscountAuth: false
            }
        case GIFT_CARDS:
            return {
                ...state,
                giftCardsList: action.payload,
                giftCardsAuth: true
            }
        case BEFORE_GIFT_CARDS:
            return {
                ...state,
                giftCardsList: null,
                giftCardsAuth: false
            }
        default:
            return {
                ...state
            }
    }
}