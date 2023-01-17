import { BEFORE_RANKING, GET_RANKINGS, GET_TRENDING, BEFORE_TRENDING, GET_TOP_COLLECTIONS, BEFORE_TOP_COLLECTIONS } from '../../redux/types';

const initialState = {
    stats: null,
    statsAuth: false,

    trendingsRes : {},
    trendingsAuth : false,
    
    topCollectionsRes : {},
    topCollectionsAuth : false
}

export default function rankRed(state = initialState, action) {
    switch (action.type) {
        case GET_RANKINGS:
            return {
                ...state,
                stats: action.payload,
                statsAuth: true
            }
        case BEFORE_RANKING:
            return {
                ...state,
                stats: null,
                statsAuth: false
            }
        case GET_TRENDING:
            return {
                ...state,
                trendingsRes: action.payload,
                trendingsAuth: true
            }
        case BEFORE_TRENDING:
            return {
                ...state,
                trendingsRes: {},
                trendingsAuth: false
            }
        case GET_TOP_COLLECTIONS:
            return {
                ...state,
                topCollectionsRes: action.payload,
                topCollectionsAuth: true
            }
        case BEFORE_TOP_COLLECTIONS:
            return {
                ...state,
                topCollectionsRes: {},
                topCollectionsAuth: false
            }
        default:
            return {
                ...state
            }
    }
}