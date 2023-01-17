import { BEFORE_AUCTION, GET_AUCTIONS, REMOVE_FAVOURITE_AUCTION, ADD_FAVOURITE_AUCTION, BEFORE_FAVOURITE } from '../../redux/types';

const initialState = {
    auctions: null,
    pagination: null,
    getAuth: false,

    auctionsData: {},
    auctionsAuth: false,

    addTofavouriteResAuctions : {},
    removeFavouriteResAuctions : {}

}

export default function auctionsReducer(state = initialState, action) {
    switch (action.type) {
        case GET_AUCTIONS:
            return {
                ...state,
                auctions: action.payload.auctions,
                pagination: action.payload.pagination,
                getAuth: true
            }
        case BEFORE_AUCTION:
            return {
                ...state,
                auctionsData: {},
                auctionsAuth: false,
                removeFavouriteResAuctions : {},
                addTofavouriteResAuctions : {}
            }
        case ADD_FAVOURITE_AUCTION:
            return {
                ...state,
                addTofavouriteResAuctions : {...action.payload }
            }
        case REMOVE_FAVOURITE_AUCTION:
            return {
                ...state,
                removeFavouriteResAuctions : {...action.payload}
            }
        case BEFORE_FAVOURITE:
            return {
                ...state,
                addTofavouriteResAuctions : {},
                removeFavouriteResAuctions : {}
            }
        default:
            return {
                ...state
            }
    }
}