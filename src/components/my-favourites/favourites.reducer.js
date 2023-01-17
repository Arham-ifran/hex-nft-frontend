import { BEFORE_FAVOURITE, GET_USER_FAVOURITES, ADD_USER_FAVOURITE, REMOVE_FAVOURITE } from '../../redux/types';

const initialState = {
    getFavouritesRes: null,
    getFavouritesAuth: false,

    addTofavouriteRes : {},

    removeFavouriteRes : {}
}

export default function faqRed(state = initialState, action) {
    switch (action.type) {
        case GET_USER_FAVOURITES:
            return {
                ...state,
                getFavouritesRes: action.payload,
                getFavouritesAuth: true
            }
        case ADD_USER_FAVOURITE:
            return {
                ...state,
                addTofavouriteRes: action.payload,
            }
        case REMOVE_FAVOURITE:
            return {
                ...state,
                removeFavouriteRes: action.payload,
            }
        case BEFORE_FAVOURITE:
            return {
                ...state,
                getFavouritesRes: null,
                getFavouritesAuth: false,

                addTofavouriteRes : {},

                removeFavouriteRes : {}
            }
        default:
            return {
                ...state
            }
    }
}