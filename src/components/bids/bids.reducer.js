import { BEFORE_BID, GET_BIDS, CREATE_BID, DELETE_BID, ACCEPT_BID } from '../../redux/types';

const initialState = {
    bid: null,
    bids: null,
    pagination: null,
    highestBid: null,
    deleteAuth: false,
    createAuth: false,
    getAuth: false,
    acceptAuth: false
}

export default function bidsRed(state = initialState, action) {
    switch (action.type) {
        case GET_BIDS:
            return {
                ...state,
                bids: action.payload.bids,
                pagination: action.payload.pagination,
                highestBid: action.payload.highestBid,
                getAuth: true
            }
        case CREATE_BID:
            return {
                ...state,
                bid: action.payload,
                createAuth: true
            }
        case ACCEPT_BID:
            return {
                ...state,
                bid: action.payload,
                acceptAuth: true
            }
        case DELETE_BID:
            return {
                ...state,
                bid: action.payload,
                deleteAuth: true
            }
        case BEFORE_BID:
            return {
                ...state,
                bid: null,
                bids: null,
                pagination: null,
                highestBid: null,
                deleteAuth: false,
                createAuth: false,
                getAuth: false,
                acceptAuth: false
            }
        default:
            return {
                ...state
            }
    }
}