import { BEFORE_COLLECTION, GET_COLLECTION, GET_COLLECTIONS, UPSERT_COLLECTION, DELETE_COLLECTION, SET_LANDING_COLLECTIONS, BEFORE_NOTABLE_DROPS, GET_NOTABLE_DROPS } from '../../redux/types';

const initialState = {
    collection: null,
    collections: null,
    pagination: null,
    deleteAuth: false,
    upsertAuth: false,
    getAuth: false,
    landingCollections: false,
    notableDrops : null,
    notableDropsAuth : false
}

export default function colsRed(state = initialState, action) {
    switch (action.type) {
        case SET_LANDING_COLLECTIONS:
            return {
                ...state,
                landingCollections: action.payload
            }
        case GET_COLLECTION:
            return {
                ...state,
                collection: action.payload.collection,
                getAuth: true
            }
        case UPSERT_COLLECTION:
            return {
                ...state,
                collection: action.payload,
                upsertAuth: true
            }
        case DELETE_COLLECTION:
            return {
                ...state,
                collection: action.payload,
                deleteAuth: true
            }
        case GET_COLLECTIONS:
            return {
                ...state,
                collections: action.payload.collections,
                pagination: action.payload.pagination,
                getAuth: true
            }
        case BEFORE_COLLECTION:
            return {
                ...state,
                collection: null,
                collections: null,
                pagination: null,
                deleteAuth: false,
                upsertAuth: false,
                getAuth: false
            }
        case GET_NOTABLE_DROPS:
            return {
                ...state,
                notableDrops: action.payload,
                notableDropsAuth: true
            }
        case BEFORE_NOTABLE_DROPS:
            return {
                ...state,
                notableDrops: null,
                notableDropsAuth: false
            }
        default:
            return {
                ...state
            }
    }
}