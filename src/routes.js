// layouts
import layout1 from './layouts/layout1/layout1';
import layout2 from './layouts/layout2/layout2';
// import layout3 from './layouts/layout3/layout3';
import layout4 from './layouts/layout4/layout4';

// components
import Template from './components/template/template';
import ExploreAll from './components/explore/explore-all';
import LiveAuctions from './components/auctions/live-auctions-list';
import ItemDetails from './components/item-detail/item-detail';
import Activity from './components/activity/activity';
import Rankings from './components/rankings/rankings';
import Earnings from './components/earnings/earnings';
import HelpCenter from './components/help-center/help-center';
import Authors from './components/authors-list/authors-list';
import Author from './components/author/author';
import Profile from './components/profile/profile';
import CreateNFT from './components/create-nft/create-nft';
import MyCollections from './components/collections/my-collections';
import AllCollections from './components/collections/all-collections';
import CreateCollection from './components/create-collection/create-collection';
import EidtCollection from './components/create-collection/edit-collection';
import CollectionDetails from './components/collections/collection-details';
import Wallet from './components/wallet/wallet';
import Contact from './components/contact/contact';
import SellNFT from './components/nfts/sell-nft';
import NotFound from './components/not-found/not-found';
import HowItWorks from './components/how-it-works/how-it-works';
import PrivacyTerms from './components/privacy-&-terms/privacy-&-terms';
import Integration from './components/integration/integration';
import Faq from './components/faq/faq'
import Trading from './components/trading/trading'
import ExploreCategory from './components/categories/explore-category'
import NftReportings from './components/nftReportings/nftReportings';
import ViewNftReport from './components/nftReportings/nftReport';
import MyFavourites from './components/my-favourites/favourites'
import CMS from './components/content-management/contentPages'
import GiftCards from './components/giftCards/giftCards';

// routes
const routes = [
    { path: '/', access: true, exact: true, title: 'Template', layout: layout4, component: Template },
    { path: '/explore-all', access: true, exact: true, title: 'Explore', layout: layout2, component: ExploreAll },
    { path: '/faq', access: true, exact: true, title: 'Faq', layout: layout2, component: Faq },
    { path: '/auctions', access: true, exact: true, title: 'Live Auctions', layout: layout2, component: LiveAuctions },
    { path: '/item-details/:item', access: true, exact: true, title: 'Item Details', layout: layout2, component: ItemDetails },
    { path: '/item-details/:item/:referral', access: true, exact: true, title: 'Item Details', layout: layout2, component: ItemDetails },
    { path: '/sell-item/:itemId', access: true, exact: true, title: 'Sell Item', layout: layout2, component: SellNFT },
    { path: '/activity', access: true, exact: true, title: 'Activity', layout: layout2, component: Activity },
    { path: '/rankings', access: true, exact: true, title: 'Rankings', layout: layout2, component: Rankings },
    { path: '/gift-cards', access: true, exact: true, title: 'Gift Cards', layout: layout2, component: GiftCards },
    { path: '/earnings', access: true, exact: true, title: 'Earnings', layout: layout2, component: Earnings },
    { path: '/trading-history', access: true, exact: true, title: 'Trading', layout: layout2, component: Trading },
    { path: '/help-center', access: true, exact: true, title: 'Help Center', layout: layout1, component: HelpCenter },
    { path: '/authors', access: true, exact: true, title: 'Authors', layout: layout2, component: Authors },
    { path: '/author/:authorId', access: true, exact: true, title: 'Author Profile', layout: layout1, component: Author },
    { path: '/profile', access: true, exact: true, title: 'Profile', layout: layout1, component: Profile },
    { path: '/create', access: true, exact: true, title: 'Create', layout: layout2, component: CreateNFT },
    { path: '/my-collections', access: true, exact: true, title: 'Collections', layout: layout2, component: MyCollections },
    { path: '/collection/create', access: true, exact: true, title: 'Create Collection', layout: layout2, component: CreateCollection },
    { path: '/collections', access: true, exact: true, title: 'Collections', layout: layout2, component: AllCollections },
    { path: '/collection/edit/:id', access: true, exact: true, title: 'Create Collection', layout: layout2, component: EidtCollection },
    { path: '/collection/:collectionId', access: true, exact: true, title: 'Collection Details', layout: layout1, component: CollectionDetails },
    { path: '/nft-reports', access: true, exact: true, title: 'NFT Reportings', layout: layout2, component: NftReportings },
    { path: '/nft-reports/:reportId', access: true, exact: true, title: 'NFT Report', layout: layout1, component: ViewNftReport },
    { path: '/login/:referrer', access: true, exact: true, title: 'login', layout: layout4, component: Wallet },
    { path: '/login', access: true, exact: true, title: 'login', layout: layout4, component: Wallet },
    { path: '/contact', access: true, exact: true, title: 'Contact', layout: layout1, component: Contact },
    { path: '/cms/:slug', access: true, exact: true, title: 'CMS', layout: layout1, component: CMS },
    { path: '/how-it-works', access: true, exact: true, title: 'How It Works', layout: layout1, component: HowItWorks },
    { path: '/privacy-and-terms', access: true, exact: true, title: 'Privacy & Terms', layout: layout1, component: PrivacyTerms },
    { path: '/integration', access: true, exact: true, title: 'Integration', layout: layout1, component: Integration },
    { path: '/category/:slug', access: true, exact: true, title: 'Explore Category', layout: layout1, component: ExploreCategory },
    { path: '/my-favourites', access: true, exact: true, title: 'My Favourites', layout: layout2, component: MyFavourites },
    { path: '/*', access: true, exact: true, name: 'Not Found', layout: layout2, component: NotFound }
];

export default routes;