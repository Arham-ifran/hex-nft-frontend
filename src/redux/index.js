import { combineReducers } from 'redux'
import auctionReducer from './../components/auctions/auctions.reducer'
import nftReducer from './../components/nfts/nfts.reducer'
import userReducer from './../components/user/user.reducer'
import walletReducer from './../components/wallet/wallet.reducer'
import categoryReducer from './../components/categories/categories.reducer'
import collectionReducer from './../components/collections/collections.reducer'
import errorReducer from './shared/error/error.reducer'
import settingsReducer from '../components/home/footer/footer.reducer'
import faqReducer from '../components/faq/faq.reducer'
import offersReducer from '../components/offers/offers.reducer'
import bidsReducer from '../components/bids/bids.reducer'
import navBarReducer from '../components/home/navBar/navBar.reducer'
import contactsReducer from '../components/contact/contact.reducer'
import activityReducer from '../components/activity/activity.reducer'
import rankingsReducer from '../components/rankings/rankings.reducer'
import earningsReducer from '../components/earnings/earnings.reducer'
import appReducer from '../App.reducer'
import integrationReducer from '../components/integration/integration.reducer'
import nftHistoryReducer from '../components/history/history.reducer'
import nftReportingsReducer from '../components/nftReportings/nftReportings.reducer'
import cmsReducer from '../components/content-management/cms.reducer'
import favouritesReducer from '../components/my-favourites/favourites.reducer'
import subscriptionsReducer from '../components/home/stayInLoop/stayInLoop.reducer'
import gamificationReducer from '../components/gamification/gamification.reducer'

export default combineReducers({
    // home: homeReducer,
    auction: auctionReducer,
    nft: nftReducer,
    reports: nftReportingsReducer,
    user: userReducer,
    wallet: walletReducer,
    category: categoryReducer,
    collection: collectionReducer,
    error: errorReducer,
    settings: settingsReducer,
    faqs: faqReducer,
    offer: offersReducer,
    bid: bidsReducer,
    navBar: navBarReducer,
    contact: contactsReducer,
    activities: activityReducer,
    rankings: rankingsReducer,
    earnings: earningsReducer,
    app: appReducer,
    integration: integrationReducer,
    nftHistory: nftHistoryReducer,
    cms: cmsReducer,
    favourites: favouritesReducer,
    subscriptions: subscriptionsReducer,
    gamification: gamificationReducer
})