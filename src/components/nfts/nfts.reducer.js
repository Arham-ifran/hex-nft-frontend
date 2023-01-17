import { BEFORE_NFT, GET_NFTS, GET_NFT, UPSERT_NFT, SEARCH_NFT, BEFORE_METADATA, REFRESH_METADATA, CANCEL_LISTING, BEFORE_LISTING, TRANSFER_NFT, BEFORE_TRANSFER_NFT, BUY_NFT, BEFORE_BUY_NFT, GET_HOMEPAGE_NFTS, BEFORE_HOMEPAGE_NFTS, GET_STAKING_PERCENT, BEFORE_STAKING_PERCENT } from '../../redux/types';

const initialState = {
    nftsData: {},
    nftsAuth: false,
    upsertAuth: false,
    searchAuth: false,
    searchData: null,

    refreshAuth: false,
    cancelListingAuth: false,
    transferAuth: false,

    buyAuth: false,
    buyNFTData: null,

    homepageNfts: {},
    homepageNftsAuth: false,

    stakingPercent: 0,
    stakingPercentAuth: false
}

export default function nftsRed(state = initialState, action) {
    switch (action.type) {
        case BEFORE_BUY_NFT:
            return {
                ...state,
                buyAuth: false,
                buyNFTData: null
            }
        case BUY_NFT:
            return {
                ...state,
                buyAuth: true,
                buyNFTData: action.payload
            }
        case BEFORE_TRANSFER_NFT:
            return {
                ...state,
                transferAuth: false
            }
        case TRANSFER_NFT:
            return {
                ...state,
                transferAuth: true
            }
        case BEFORE_LISTING:
            return {
                ...state,
                cancelListingAuth: false
            }
        case CANCEL_LISTING:
            return {
                ...state,
                cancelListingAuth: true
            }
        case BEFORE_METADATA:
            return {
                ...state,
                refreshAuth: false
            }
        case REFRESH_METADATA:
            return {
                ...state,
                refreshAuth: true
            }
        case UPSERT_NFT:
            return {
                ...state,
                nftsData: action.payload,
                upsertAuth: true
            }
        case SEARCH_NFT:
            return {
                ...state,
                searchData: action.payload,
                searchAuth: true
            }
        case GET_NFT:
            return {
                ...state,
                nftsData: action.payload,
                nftsAuth: true
            }
        case GET_NFTS:
            return {
                ...state,
                nftsData: action.payload,
                nftsAuth: true
            }
        case BEFORE_NFT:
            return {
                ...state,
                nftsData: {},
                nftsAuth: false,
                upsertAuth: false,
                searchAuth: false,
                searchData: null,
                cancelListingAuth: false
            }
        case GET_HOMEPAGE_NFTS:
            return {
                ...state,
                homepageNfts: action.payload,
                homepageNftsAuth: true
            }
        case BEFORE_HOMEPAGE_NFTS:
            return {
                ...state,
                homepageNfts: {},
                homepageNftsAuth: false,
            }
        case GET_STAKING_PERCENT:
            return {
                ...state,
                stakingPercent: action.payload,
                stakingPercentAuth: true
            }
        case BEFORE_STAKING_PERCENT:
            return {
                ...state,
                stakingPercent: 0,
                stakingPercentAuth: false
            }
        default:
            return {
                ...state
            }
    }
}