import { BEFORE_APP, SET_BNB, SET_WBNB, SET_MYNT, SET_MYNT_TO_BNB, SET_BNB_TO_WBNB } from './redux/types';

const initialState = {
    rate: null, // BNB to USD rate
    rateAuth: false,
    wbnbRate: null,
    wbnbRateAuth: false,
    myntRate: null,
    myntRateAuth: false,
    myntToBnbRate: null,
    myntToBnbRateAuth: false,
    bnbToWbnbRate: null,
    bnbToWbnbAuth: false
}

export default function appReducer(state = initialState, action) {
    switch (action.type) {
        case SET_BNB:
            return {
                ...state,
                rate: action.payload,
                rateAuth: true
            }
        case SET_WBNB:
            return {
                ...state,
                wbnbRate: action.payload,
                wbnbRateAuth: true,
            }
        case SET_MYNT:
            return {
                ...state,
                myntRate: action.payload,
                myntRateAuth: true
            }
        case SET_MYNT_TO_BNB:
            return {
                ...state,
                myntToBnbRate: action.payload,
                myntToBnbRateAuth: true
            }
        case SET_BNB_TO_WBNB: 
            return {
                ...state,
                bnbToWbnbRate: action.payload,
                bnbToWbnbAuth: true
            }
        case BEFORE_APP:
            return {
                ...state,
                rate: null,
                rateAuth: false,
                wbnbRate: null,
                wbnbRateAuth: false,
                myntRate: null,
                myntRateAuth: false,
                myntToBnbRate: null,
                myntToBnbRateAuth: false,
                bnbToWbnbRate: null,
                bnbToWbnbAuth: false

            }
        default:
            return {
                ...state
            }
    }
}