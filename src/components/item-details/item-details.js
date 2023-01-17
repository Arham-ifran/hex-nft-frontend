import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import $ from 'jquery'
import {
    beforeNFT,
    getNFT,
    upsertNFT,
    refreshMetadata,
    beforeMetadata,
    cancelListing,
    beforeListing,
    beforeBuy,
    buyNFT,
    buyWithPayPal,
    fetchFile,
    beforeStakingPercent,
    getStakingPercent
} from '../nfts/nfts.action'
// import { beforeSettings, getSettings } from '../home/footer/footer.action'
import FullPageLoader from '../loaders/full-page-loader'
import BeatsLoader from '../loaders/beat-loader'
import { ENV } from '../../config/config'
import {
    offerBidWeb3,
    cancelOfferBidWeb3,
    acceptOfferBidWeb3,
    checkBalance,
    cancelSellingWeb3,
    buyNow,
    stakeWeb3,
    unstakeWeb3
} from './../../utils/web3'
import moment from 'moment'
import Countdown from 'react-countdown'
import SimpleReactValidator from 'simple-react-validator'
import { Modal, Dropdown, Form } from 'react-bootstrap'
import {
    beforeOffer,
    makeOffer,
    getOffers,
    deleteOffer,
    acceptOffer,
} from '../offers/offers.action'
import {
    beforeBid,
    placeBid,
    getBids,
    deleteBid,
    acceptBid,
} from '../bids/bids.action'
import { beforeHistory, getHistory } from '../history/history.action'
import { addReport, getUserNftReports, beforeUserNftReports, beforeReports } from '../nftReportings/nftReportings.action'
import { toast } from 'react-toastify'
import InfiniteScroll from 'react-infinite-scroll-component'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUndo, faBan, faShareAlt, faCopy, faHeart, faC, faD, faPlay, faMusic, faStop, faCoins } from '@fortawesome/free-solid-svg-icons'
import ReactTooltip from 'react-tooltip'
import { ipfsToUrl } from '../../utils/functions'
import { confirmAlert } from 'react-confirm-alert' // Import
import 'react-confirm-alert/src/react-confirm-alert.css' // Import css
import { faTwitter, faFacebookF } from '@fortawesome/free-brands-svg-icons';
import { FacebookShareButton, TwitterShareButton } from 'react-share';
import { addToFavourite, removeFavourite, beforeFavourite, getUserFavourites } from '../my-favourites/favourites.action'
import ReactJkMusicPlayer from 'react-jinke-music-player'
import 'react-jinke-music-player/assets/index.css'
import { CopyToClipboard } from 'react-copy-to-clipboard';
import 'video-react/dist/video-react.css'; // import css
import { DefaultPlayer as Video } from 'react-html5video';
import 'react-html5video/dist/styles.css';
import Gamification from '../gamification/gamification';
import { giftCardVerification, beforeVerifyDiscount, redeemedGiftCardLog } from '../gamification/gamifications.action'
const Tiff = require('tiff.js');

const {
    globalPlaceholderImage,
    countDownRenderer,
    decimalNumberValidator,
    explorerURL,
    convertBnbToUsd,
    convertBnbToMynt,
    convertBnbToWbnb,
    convertMyntToBnb,
    convertWbnbToUsd,
    integerNumberValidator,
    cdnBaseUrl
} = ENV
const ProfileImg = `${cdnBaseUrl}v1652166289/hex-nft/assets/image-placeholder_qva6dx.png`;
const currencies = ENV.currencies.filter((elem) => elem.showInBuy === true)

const initData = {
    bidBtn: 'Place a Bid',
    offerBtn: 'Make Offer',
    sellBtn: 'Sell',
}

// expiry options
const expiryOptions = [
    { label: '5 Days', value: moment().add(5, 'days').format('DD/MM/YYYY') },
    { label: '7 Days', value: moment().add(7, 'days').format('DD/MM/YYYY') },
    { label: 'A Month', value: moment().add(1, 'months').format('DD/MM/YYYY') },
    { label: 'Custom Date', value: -1 },
]

// make an offer / bid config.
const config1 = {
    price: {
        currency: currencies && currencies.length ? currencies[0].value : 'WBNB',
        amount: '',
        hasDiscount: false
    },
    expiry: {
        date: expiryOptions[0].value,
        time: moment(new Date()).format('HH:mm'),
        type: 1, // 1 for time & 2 for datetime-local
        datetime: '', // for payload
    },
    cabi: JSON.stringify(
        currencies && currencies.length ? currencies[0].abi : [],
    ),
    cAddress: currencies && currencies.length ? currencies[0].address : '',
}

const MYNTConfig = ENV.currencies?.length ? ENV.currencies.find(elem => elem.value === 'MYNT') : ''
class ItemDetails extends Component {
    constructor(props) {
        super(props)
        this.state = {
            paymentTokens: [],
            userId: ENV.getUserKeys()?._id,
            userAddress: ENV.getUserKeys('address')?.address, // user wallet address
            offers: [],
            offersPagination: null,
            moreCheck: true,
            bids: [],
            bidsPagination: null,
            page: 2,
            nftHistory: [],
            nftHistoryPagination: null,
            rendType: 1,
            errors: '',
            isSubmitted: false,
            formValid: true,
            loader: true,
            nft: null,
            isOpen: false,
            nftConfig: config1, // make an offer / bid config.
            nftId: null,
            minPriceError: '',
            reportNftModal: false,
            stakeNftModal: false,
            reportDescription: '',
            hasNftAlreadyReported: false,
            stakingPrice: '',
            stakingCurrency: MYNTConfig.value,
            stakingDays: '',
            isStaking: false, // flag to enable disable stake icon and to know either if stake NFT response is received or not
            copied: false,
            nftUrl: ENV.nftItemBaseUrl,
            favouriteCheck: false,
            isUserFavourite: false,
            totalLikes: 0,
            disable: false,
            audioList: [],
            options: {},
            hasOptionsSet: false,
            toggleMusicPlayer: false,
            showVideoPlayer: false,
            showHideIcon: false,
            referralId: '',
            item: '',
            isImgTypeTiff: false,
            videoSrc: '',
            showBeatLoader: false,
            eventType: '',
            applyDiscount: false,
            applyDiscountCode: false,
            discountCode: '',
            discountedPriceInBnb: null,
            discountedPriceInMynt: null,
            discountedPriceInWbnb: null,
            discountPercentage: 0,
            showPriceCard: false,
            showSmallLoader: false,
            discountErr: '',
            stakingPercent: 0
        }
        this.audioInstance = null
        this.favRef = React.createRef();
        this.musicPlayerBtnRef = React.createRef();

        this.validator = new SimpleReactValidator({
            autoForceUpdate: this,
            messages: {
                required: 'This field is required.', // will override all messages
            },
        })
    }

    componentDidMount() {
        // window.onscroll = function () {
        //     let scrolledValue = document.documentElement.scrollTop;
        //     let element = document.getElementById('scroll-to-top')
        //     if (scrolledValue >= 1000){
        //         if (element && element !== null)
        //             element.style.display = 'flex'
        //     }
        //     else{
        //         if (element && element !== null)
        //             element.style.display = 'none'
        //     }
        // }
        this.init(this.props.params)
    }

    componentDidUpdate(prevProps, prevState) {
        if (
            prevProps.params.item &&
            this.props.params.item &&
            prevProps.params.item !== this.props.params.item
        ) {
            this.setState({ loader: true })
            this.init(this.props.params)
        }

        if (this.props.error && this.props.error.cancelListingFailed) {
            this.setState({ loader: false }, () => {
                toast.error('Failed to cancel the listing')
                this.props.beforeListing()
            })
        }
        else if (this.props.error && this.props.error.buyNFTFailed) {
            this.setState({ loader: false }, () => {
                this.props.beforeBuy()
            })
        }

        if (this.props.nft.cancelListingAuth) {
            toast.success('Your listing has been cancelled successfully')
            this.props.beforeListing()
            this.props.navigate('/explore-all')
        }

        if (this.props.nft.buyAuth) {
            // this.setState({ eventType: 'buying' })
            let responseData = this.props.nft.buyNFTData
            if (responseData.isGiftCardLogCreated) {
                let payload = {
                    userId: this.state.userAddress,
                    type: 'giftcard',
                    token: this.state.discountCode,
                    platform: 'NFT marketplace'
                }
                this.props.redeemedGiftCardLog(payload)
            }
            this.props.beforeBuy()
            return this.props.navigate(`/collection/${this.state.nft.collection.url}`)
        }

        if (this.props.nft.refreshAuth) {
            this.setState(
                {
                    loader: false,
                },
                () => {
                    this.props.beforeMetadata()
                },
            )
        }

        if (this.props.nft.nftsAuth) {
            const nft = this.props.nft.nftsData
            this.props.beforeNFT()
            let nftUrl = `${this.state.nftUrl}${this.state.item}`
            const query = new URLSearchParams(window.location.search);
            const paymentId = query?.get('paymentId')
            const paymentToken = query?.get('token')
            const payerId = query?.get('PayerID')

            if (nft?.owner?.referralId) {
                // localStorage.setItem('referralId', nft.owner.referralId)
                nftUrl = `${nftUrl}/${nft.owner.referralId}`
            }

            if (nft?.image) {
                let fileExt = nft.image.split('.').pop() // ?.match(/\.([^\.]+)$/)[1]
                if (fileExt === 'tif' || fileExt === 'tiff') {

                    this.setState({ isImgTypeTiff: true })

                    let file = nft.image
                    this.props.fetchFile(file)
                    // var reader = new FileReader()
                    // let result = ''
                    // reader.onload = function (e) {
                    //     result = e.target.result

                    //     let tiff = new Tiff({ buffer: result });
                    //     let dataURI = tiff.toDataURL()
                    //     let element = $(`#nft-item-image`)

                    //     if (element && element !== null) {
                    //         thisHere.setState({ dataURI }, () => {
                    //             element.attr('src', dataURI)
                    //         })
                    //     }

                    // }
                    // reader.readAsArrayBuffer(nft.image)

                    // fetch(file, {
                    //     method: 'GET',
                    //     headers: {
                    //       'Authorization': ENV.Authorization,
                    //       'x-auth-token': ENV.x_auth_token,
                    //     },
                    //   })
                    //     // .then((res) => res.json())
                    //     .then((data) => {
                    //     }).catch((err) => console.log('err',err))
                    // var xhr = new XMLHttpRequest();
                    // xhr.responseType = 'arraybuffer';
                    // xhr.open('GET', file);
                    // xhr.setRequestHeader("Authorization", ENV.Authorization);
                    // xhr.setRequestHeader("x-auth-token", ENV.x_auth_token);
                    // xhr.onload = function (e) {
                    //     Tiff.initialize({ TOTAL_MEMORY: 16777216 * 10 })
                    //     var tiff = new Tiff({ buffer: xhr.response });
                    //     let dataURI = tiff.toDataURL()
                    //     let element = document.getElementById('nft-item-image')
                    //     if (element && element !== null)
                    //         element.src = dataURI
                    // };
                    // xhr.send()
                    // let reader = new FileReader()
                    // let result = ''
                    // reader.onload = function (e) {
                    //     let tiff = new Tiff({ buffer: file });        
                    //     let canvas = tiff.toCanvas();
                    //     let element =  document.getElementById("item-detail")  
                    //     if(element && element !== null)              
                    //         element.append(canvas);
                    // }
                    // reader.readAsArrayBuffer(file)
                }
            }

            // get staking percentage
            this.getStakingPercent(nft)

            let thisHere = this
            this.setState({ nft, nftUrl }, () => {
                if (this.state.nft?.mediaType === 2) {
                    const audioList = [
                        {
                            name: this.state.nft.name,
                            musicSrc: this.state.nft.fileLocal
                        },
                    ]
                    const options = {
                        audioLists: audioList,
                        defaultPosition: {
                            left: 80,
                            top: 150,
                        },
                        showPlayMode: false,
                        drag: false,
                        autoPlay: false,
                        spaceBar: true,
                        showDownload: false,
                        responsive: true,

                        onModeChange(mode) {
                            if (mode === 'mini')
                                thisHere.audioInstance.pause()

                            thisHere.setState({
                                toggleMusicPlayer: !thisHere.state.toggleMusicPlayer
                            })
                        }
                    }
                    this.setState({ audioList, options }, () => {
                        this.setState({ hasOptionsSet: true })
                    })
                }
                if (paymentId && paymentToken && payerId)
                    this.buyNFT(2, paymentToken, paymentId, payerId)
            })

            // if w/o buy with PayPal - hide loader
            if (!(paymentId && paymentToken && payerId))
                this.setState(
                    {
                        loader: false,
                    }
                )
        }

        // when NFT data is updated
        if (this.props.nft.upsertAuth) {
            const data = this.props.nft.nftsData.nft;
            this.props.beforeNFT();

            let { nft, paymentTokens } = this.state
            Object.assign(nft, { isStaked: data.isStaked })

            if (data.isStaked) {
                const stackedNFT = {
                    isStaked: data.isStaked,
                    currentPrice: data.currentPrice,
                    currency: data.currency,
                    stakingDays: data.stakingDays,
                    stakingDate: data.stakingDate,
                    stakeId: data.stakeId
                }
                Object.assign(nft, stackedNFT)
            }

            // let stakingCurrency = ''

            // if (paymentTokens?.length)
            //     stakingCurrency = paymentTokens[paymentTokens.length - 1]

            this.setState({
                loader: false,
                nft,
                stakingDays: nft.stackingDays,
                stakingPrice: '',
                // stakingCurrency,
                stakeNftModal: false,
                isStaking: false
            }, () => {
                toast.success(`Your NFT has been ${!nft.isStaked ? 'un' : ''}staked successfully`)
            })
        }

        // when staking percent is received from store
        if (this.props.nft.stakingPercentAuth) {
            const { stakingPercent } = this.props.nft
            this.setState({ stakingPercent }, () => {
                this.props.beforeStakingPercent()
            })
        }

        // when settings are retrieved
        // if (this.props.settings?.settingsAuth) {
        //     const { settings } = this.props.settings
        //     this.props.beforeSettings()

        //     if (!settings || !settings.paymentTokens || (settings.paymentTokens && !(settings.paymentTokens.length))) {
        //         this.setState({
        //             stakingCurrency: '',
        //             loader: false
        //         })
        //     }
        //     else if (settings.paymentTokens && settings.paymentTokens.length) {
        //         this.setState({
        //             stakingCurrency: settings.paymentTokens[settings.paymentTokens.length - 1],
        //             paymentTokens: settings.paymentTokens,
        //             loader: false
        //         })
        //     }
        // }

        if (this.props.offer.createAuth) {
            this.setState(
                {
                    loader: false,
                    isOpen: false,
                },
                () => {
                    this.props.beforeOffer()
                    window.location.reload()
                },
            )
        }

        if (this.props.offer.getAuth) {
            const { offers, pagination } = this.props.offer
            this.props.beforeOffer()

            if (offers.length) {
                this.setState(
                    {
                        loader: false,
                        offers: [...this.state.offers, ...offers],
                        offersPagination: pagination,
                        moreCheck: true,
                    },
                    () => { },
                )
            } else {
                this.setState(
                    { loader: false, offersPagination: pagination, moreCheck: false },
                    () => { },
                )
            }
        }

        if (this.props.offer.deleteAuth) {
            this.props.beforeOffer()
            window.location.reload()
        }

        if (this.props.bid.createAuth) {
            this.setState(
                {
                    loader: false,
                    isOpen: false,
                },
                () => {
                    this.props.beforeBid()
                    window.location.reload()
                },
            )
        }

        if (this.props.bid.getAuth) {
            const { bids, pagination, highestBid } = this.props.bid
            let nft = { ...this.state.nft }
            nft.highestBid = highestBid

            this.props.beforeBid()
            if (bids && bids.length) {
                this.setState(
                    {
                        loader: false,
                        bids: [...this.state.bids, ...bids],
                        bidsPagination: pagination,
                        nft,
                        moreCheck: false,
                    },
                    () => { },
                )
            } else {
                this.setState(
                    { loader: false, bidsPagination: pagination, nft, moreCheck: false },
                    () => { },
                )
            }
        }

        if (this.props.bid.deleteAuth) {
            this.props.beforeBid()
            window.location.reload()
        }

        if (this.props.offer.acceptAuth) {
            let redeemedVoucher = this.props.offer.offer.redeemedVoucher
            if (redeemedVoucher) {
                let payload = {
                    userId: redeemedVoucher.offerByUserAddress,
                    type: 'giftcard',
                    token: redeemedVoucher.token,
                    platform: 'NFT marketplace'
                }
                console.log('payload', payload)
                this.props.redeemedGiftCardLog(payload)
            }
            this.setState({ loader: false, /* eventType: 'buying' */ }, () => {
                this.props.beforeOffer()
                const { nft } = this.state
                return this.props.navigate(`/collection/${nft.collection.url}`)
            })
        }

        if (this.props.bid.acceptAuth) {
            let redeemedVoucher = this.props.bid.bid.redeemedVoucher
            if (redeemedVoucher) {
                let payload = {
                    userId: redeemedVoucher.bidByUserAddress,
                    type: 'giftcard',
                    token: redeemedVoucher.token,
                    platform: 'NFT marketplace'
                }
                console.log('payload', payload)
                this.props.redeemedGiftCardLog(payload)
            }
            this.setState({ loader: false, /* eventType: 'buying' */ }, () => {
                this.props.beforeBid()
                const { nft } = this.state
                return this.props.navigate(`/collection/${nft.collection.url}`)
            })
        }

        if (this.props.nftHistory.getAuth) {
            const { history, pagination } = this.props.nftHistory
            this.props.beforeHistory()

            if (history && history.length) {
                this.setState(
                    {
                        loader: false,
                        nftHistory: [...this.state.nftHistory, ...history],
                        nftHistoryPagination: pagination,
                        moreCheck: true,
                    },
                    () => { },
                )
            } else {
                this.setState(
                    { loader: false, nftHistoryPagination: pagination, moreCheck: false },
                    () => { },
                )
            }
        }

        if (this.props.nftReport.nftReport &&
            Object.keys(this.props.nftReport.nftReport).length > 0) {
            this.props.beforeUserNftReports()
            this.setState({ hasNftAlreadyReported: true })
        }

        if (this.props.addNftReportRes && Object.keys(this.props.addNftReportRes).length > 0) {
            this.props.beforeReports()
            if (this.props.addNftReportRes)
                this.setState({ loader: false })
        }

        if (this.props.getFavouritesRes && Object.keys(this.props.getFavouritesRes).length > 0) {
            if (this.props.getFavouritesRes.total) {
                this.setState({ totalLikes: this.props.getFavouritesRes.total })
            }

            let myFavourites = this.props.getFavouritesRes.favourites
            if (myFavourites && Object.keys(myFavourites).length > 0) {
                this.setState({ isUserFavourite: true })
            }
            this.props.beforeFavourite()
        }

        if (this.props.addFavouriteRes && Object.keys(this.props.addFavouriteRes).length > 0) {
            this.setState({ showBeatLoader: false })
            if (!this.props.addFavouriteRes.alreadyInFavourites) {
                this.setState({ favouriteCheck: true, totalLikes: this.state.totalLikes + 1, disable: false })
            }
            else {
                this.setState({ favouriteCheck: false, disable: false })
                toast.error('This item is already in your Favourites list', 'already-in-fav-list')
            }
            this.props.beforeFavourite()
        }

        if (this.props.removeFavouriteRes && Object.keys(this.props.removeFavouriteRes).length > 0) {
            this.setState({ showBeatLoader: false })
            if (!this.props.removeFavouriteRes.alreadyRemovedFromFavourites) {
                this.setState({ isUserFavourite: false })
                this.setState({ favouriteCheck: false, totalLikes: this.state.totalLikes - 1, disable: false })
            }
            else {
                this.setState({ disable: false })
                toast.error('You have already removed this item from your Favourites list', 'already-out-fav-list')
            }
            this.props.beforeFavourite()
        }

        let { showVideoPlayer, toggleMusicPlayer, options } = this.state

        if (toggleMusicPlayer && prevState.toggleMusicPlayer !== toggleMusicPlayer) {
            let options = this.state.options
            this.setState({ options: { ...options, mode: 'full' } })
            let element = document.getElementById('scroll-to-top')
            if (element && element !== null)
                element.style.display = 'none'
        }
        else if (!toggleMusicPlayer && prevState.toggleMusicPlayer !== toggleMusicPlayer) {
            let options = this.state.options
            delete options['mode']
            this.setState({ options })
            let element = document.getElementById('scroll-to-top')

            if (element && element !== null)
                element.style.display = 'flex'
        }

        if (showVideoPlayer && prevState.showVideoPlayer !== showVideoPlayer) {
            this.setState({ showHideIcon: true })
        }
        else if (!showVideoPlayer && prevState.showVideoPlayer !== showVideoPlayer) {
            this.setState({ showHideIcon: false })
        }

        if (this.props.gamification.verifyDiscountAuth) {

            const data = this.props.gamification.verifyDiscount
            const discountPercentage = this.props.gamification.verifyDiscount.amount   // amount in percentage
            // const discountPercentage = 0.1 // amount in percentage

            if (data.sucess) {

                const originalPrice = this.state.nft?.currentPrice
                const currency = this.state.nft?.currency
                const discountedPrice = originalPrice - ((discountPercentage / 100) * originalPrice)
                let discountedPriceInBnb = null
                let discountedPriceInMynt = null


                if (currency === 'BNB') {
                    discountedPriceInBnb = parseFloat(discountedPrice).toFixed(7)
                    discountedPriceInMynt = parseFloat(convertBnbToMynt(discountedPrice, 1 / this.props.app.myntToBnbRate)).toFixed(7)

                }
                if (currency === 'MYNT') {
                    discountedPriceInBnb = parseFloat(convertMyntToBnb(discountedPrice, this.props.app.myntToBnbRate)).toFixed(7)
                    discountedPriceInMynt = parseFloat(discountedPrice).toFixed(7)
                }

                this.setState({ discountedPriceInBnb, discountedPriceInMynt, discountPercentage }, () => this.setState({ showSmallLoader: false, showPriceCard: true }))
                this.props.beforeVerifyDiscount()
            }
            else {
                this.props.beforeVerifyDiscount()
                this.setState({ showSmallLoader: false, discountCode: '', discountErr: 'Please enter a valid code!' })
            }
        }

        ReactTooltip.rebuild()

    }

    init = (params) => {
        window.scroll(0, 0)
        if (params && params.item) {
            const { item, referral } = params
            const nftId = window.atob(item)

            if (this.state.userId) {
                this.props.getUserNftReports({}, this.state.userId, nftId, true)
                this.props.getUserFavourites(this.state.userId, nftId)
            }
            else {
                this.props.getUserFavourites(null, nftId)
            }

            this.setState({ nftId, item })

            if (referral && referral !== '') {
                localStorage.setItem('referralId', referral)
                this.setState({ referralId: referral })
            }

            if (nftId) {
                this.reset()
                this.props.getNFT(nftId)

                const bidQS = ENV.objectToQueryString({ nftId })
                this.props.getBids(bidQS)

                const offerQS = ENV.objectToQueryString({ nftId })
                this.props.getOffers(offerQS)

                const historyQS = ENV.objectToQueryString({ nftId })
                this.props.getHistory(historyQS)

                // this.props.getSettings()
            }
        } else {
            this.props.navigate('/explore-all')
        }
    }

    reset = () => {
        this.setState({
            userId: ENV.getUserKeys()?._id,
            offers: [],
            offersPagination: null,
            moreCheck: true,
            bids: [],
            bidsPagination: null,
            page: 2,
            nftHistory: [],
            nftHistoryPagination: null,
            rendType: 1,
            errors: '',
            isSubmitted: false,
            formValid: true,
            loader: true,
            nft: null,
            isOpen: false,
            nftConfig: config1, // make an offer / bid config.
            nftId: null,
            minPriceError: '',
        })
    }

    getPrice = (currency, amount) => {
        if (currency === 'BNB') {
            if (amount && this.props.app.rateAuth) {
                return ENV.convertBnbToUsd(amount, this.props.app.rate)
            } else {
                return '0.00'
            }
        }
        else if (currency === 'WBNB') {
            if (amount && this.props.app.wbnbRateAuth) {
                return ENV.convertWbnbToUsd(amount, this.props.app.wbnbRate)
            } else {
                return '0.00'
            }
        }
        else if (currency === 'MYNT') {
            if (amount && this.props.app.myntRateAuth) {
                return ENV.convertMyntToUsd(amount, this.props.app.myntRate)
            } else {
                return '0.00'
            }
        }
    }

    openModal = () => {
        if (localStorage.getItem('encuse')) {
            const { nft } = this.state
            let tokenConfig = null

            // pre-populate currency, cabi & cAddress modal input
            if (currencies && currencies.length && nft.currency) {
                tokenConfig = currencies.find(
                    (elem) => elem.value.toUpperCase() === nft.currency.toUpperCase(),
                )

                if (!tokenConfig)
                    tokenConfig = currencies.find(
                        (elem) => elem.value.toUpperCase() === 'WBNB',
                    )
            }

            this.setState({
                isOpen: true,
                isSubmitted: false,
                formValid: true,
                errors: '',
                nftConfig: {
                    price: {
                        currency: tokenConfig?.value || 'WBNB',
                        amount: '',
                    },
                    expiry: {
                        date: expiryOptions[0].value,
                        time: moment(new Date()).format('HH:mm'),
                        type: 1, // 1 for time & 2 for datetime-local
                        datetime: '', // for payload
                    },
                    cabi: JSON.stringify(tokenConfig?.abi || []),
                    cAddress: tokenConfig?.address || '',
                },
            })
        } else {
            this.props.navigate('/login')
        }
    }

    closeModal = () => this.setState({ isOpen: false })

    checkMinimuPrice = () => {
        // const { currency, currentPrice } = this.state.nft;
        const { nftConfig, nft, discountedPriceInBnb, discountedPriceInMynt } = this.state
        // COMMENTED TEMPORARILY
        // let priceInUSD = this.getPrice(nftConfig.price.currency, nftConfig.price.amount)
        // let minimumPrice = this.getPrice(currency, currentPrice)
        let discountedPriceInWbnb = null
        if (nft.currency === 'BNB' && discountedPriceInBnb) {
            discountedPriceInWbnb = parseFloat(convertBnbToWbnb(discountedPriceInBnb, this.props.app.bnbToWbnbRate)).toFixed(7)
            this.setState({ discountedPriceInWbnb })
        }

        let price = nft.currency === 'BNB' && discountedPriceInWbnb ? discountedPriceInWbnb : nft.currency === 'MYNT' && discountedPriceInMynt ? discountedPriceInMynt : nft.currentPrice
        if (parseFloat(nftConfig.price.amount) < parseFloat(price)) {
            this.setState({
                minPriceError: `Atleast enter ${price} ${nftConfig.price.currency}`,
                formValid: false,
            })
            return false
        } else {
            this.setState({
                minPriceError: ``,
                formValid: true,
            })
        }

        // COMMENTED TEMPORARILY
        // if (parseFloat(priceInUSD) < parseFloat(minimumPrice)) {
        //     this.setState({
        //         minPriceError: `At Least Enter ${nftConfig.price.currency === "WBNB" ? (minimumPrice / this.props.app.wbnbRate).toFixed(7) : (minimumPrice / this.props.app.myntRate).toFixed(7)} amount`,
        //         formValid: false
        //     })
        //     return false;
        // }
        // else {
        //     this.setState({
        //         minPriceError: ``,
        //         formValid: true
        //     })
        // }
    }

    onChange = (e) => {
        const { nftConfig } = this.state
        const { name, value } = e.target
        let data = nftConfig
        const keys = name.split('.') // nftConfig, price, currency
        if (keys && keys[2]) data[keys[1]][keys[2]] = value
        else if (keys && keys[1]) data[keys[1]] = value

        if (keys && keys[1] === 'price' && keys[2] === 'amount') {
            data[keys[1]]['amount'] = Number(value)
            this.checkMinimuPrice()
        }

        if (keys && keys[1] === 'expiry' && keys[2] === 'date')
            data[keys[1]]['type'] = Number(value) === -1 ? 2 : 1

        // set datetime for days / months
        if (data.expiry.type === 1)
            data.expiry.datetime = moment(
                data.expiry.date + ' ' + data.expiry.time,
                'DD/MM/YYYY HH:mm',
            )
        // set datetime for custom date
        else if (data.expiry.type === 2) {
            if (Number(value) === -1) {
                data.expiry.time = ''
            } else {
                let dateTime = value.split('T')
                const customDate = dateTime[0]
                    .split('-')
                    .reverse()
                    .join()
                    .replaceAll(',', '/')
                data.expiry.datetime = moment(
                    customDate + ' ' + dateTime[1],
                    'DD/MM/YYYY HH:mm',
                )
            }
        }
        if (e.target.id === 'currency') {
            this.checkMinimuPrice()
            data.cAddress = e.target.selectedOptions[0].getAttribute('caddress')
            data.cabi = e.target.selectedOptions[0].getAttribute('cabi')
        }
        this.setState({
            nftConfig: {
                ...data,
            },
        })
    }

    // submit when a bid is placed or when an offer is made
    submit = async () => {
        let { formValid, discountCode, discountedPriceInWbnb, discountedPriceInMynt, discountPercentage } = this.state
        if (!this.validator.allValid()) formValid = false
        this.setState({ isSubmitted: true, formValid }, () => {
            const { formValid } = this.state
            if (formValid) {
                this.setState(
                    {
                        loader: true,
                    },
                    async () => {
                        const { nft, nftConfig } = this.state

                        const payload = {
                            ownerId: nft.owner._id,
                            expiryDate: nftConfig.expiry.datetime,
                            price: nftConfig.price,
                            nftId: nft._id,
                            collectionId: nft.collection._id,
                        }
                        const _nftData = {
                            price: nftConfig.price.amount,
                            cabi: nftConfig.cabi,
                            cAddress: nftConfig.cAddress,
                            nftId: nft.autoNftId,
                            currency: nftConfig.price.currency,
                        }

                        if (discountedPriceInWbnb || discountedPriceInMynt) {
                            payload.giftCardToken = discountCode
                            payload.originalPrice = nft.currentPrice
                            payload.discountPercentage = discountPercentage
                            payload.hasDiscount = true
                        }

                        console.log('payload', payload)
                        console.log('nft data', _nftData)
                        const balanceOf = await checkBalance(_nftData)
                        if (parseFloat(balanceOf) < nftConfig.price.amount) {
                            return this.setState({ loader: false }, () => {
                                toast.error(
                                    'Your account does not have sufficient amount of the selected token',
                                )
                            })
                        }
                        // if selling method is 2 then go for bid
                        if (nft.sellingMethod === 2) {
                            // place a bid
                            const bidResponse = await offerBidWeb3(_nftData)
                            if (bidResponse) {
                                payload.signature = bidResponse
                                this.props.placeBid(payload)
                            } else {
                                toast.error('Failed to place a bid')
                                return this.setState({ loader: false })
                            }
                        } else if (nft.sellingMethod === 1) {
                            // make an offer
                            const offerResponse = await offerBidWeb3(_nftData)
                            if (offerResponse) {
                                payload.signature = offerResponse
                                this.props.makeOffer(payload)
                            } else {
                                toast.error('Failed to make an offer')
                                return this.setState({ loader: false })
                            }
                        }
                    },
                )
            } else {
                this.validator.showMessages()
                this.validator.purgeFields()
                this.setState(
                    {
                        errors: 'Please fill all required fields in valid format.',
                        formValid: false,
                    },
                    () => {
                        window.scroll(0, 0)
                    },
                )
            }
        })
    }

    deleteOffer = (offerId) => {
        this.setState(
            {
                loader: true,
            },
            async () => {
                const { nft } = this.state
                const cancelResponse = await cancelOfferBidWeb3()
                if (cancelResponse) {
                    toast.success('Your offer has been cancelled successfully')
                    this.props.deleteOffer(offerId)
                } else {
                    toast.error('Failed to cancel the offer')
                    this.setState({ loader: false })
                }
            },
        )
    }

    deleteBid = (bidId) => {
        this.setState(
            {
                loader: true,
            },
            async () => {
                const { nft } = this.state
                const cancelResponse = await cancelOfferBidWeb3()
                if (cancelResponse) {
                    toast.success('Your bid has been cancelled successfully')
                    this.props.deleteBid(bidId)
                } else {
                    toast.error('Failed to cancel the bid')
                    this.setState({ loader: false })
                }
            },
        )
    }

    formatAddress = (address) => {
        return address ? address.substr(0, 6) + '...' + address.substr(-4) : null
    }

    acceptOffer = async (offerId, offerByAddress, price, payThrough) => {
        this.setState(
            {
                loader: true,
            },
            async () => {
                const { nft } = this.state
                let _nftData = {
                    metaData: nft.metaData || '',
                    tokenId: nft.tokenId,
                    nftId: nft.autoNftId,
                    nft: nft.address,
                    price,
                    percent: 0,
                    nftRoyalty: nft.commissions || []
                }
                let acceptOfferResponse = await acceptOfferBidWeb3(
                    _nftData,
                    offerByAddress,
                    payThrough,
                    nft._id,
                    nft.collection.autoColId || 0,
                    1, // acceptType = 1 for offer
                    nft.platformShare,
                    nft.royaltySplit
                )
                if (acceptOfferResponse && acceptOfferResponse.txHash) {
                    this.props.acceptOffer({ offerId, ...acceptOfferResponse, royalties: nft.commissions })
                } else {
                    toast.error('Failed to accept the offer')
                    this.setState({ loader: false })
                }
            },
        )
    }

    acceptBid = async (bidId, bidByAddress, price, payThrough) => {
        this.setState(
            {
                loader: true,
            },
            async () => {
                const { nft } = this.state
                let _nftData = {
                    metaData: nft.metaData || '',
                    tokenId: nft.tokenId,
                    nftId: nft.autoNftId,
                    nft: nft.address,
                    price,
                    percent: 0,
                    nftRoyalty: nft.commissions || []
                }
                let acceptBidResponse = await acceptOfferBidWeb3(
                    _nftData,
                    bidByAddress,
                    payThrough,
                    nft._id,
                    nft.collection.autoColId || 0,
                    2, // acceptType = 2 for bid
                    nft.platformShare,
                    nft.royaltySplit
                )
                if (acceptBidResponse && acceptBidResponse.txHash) {
                    this.props.acceptBid({ bidId, ...acceptBidResponse, royalties: nft.commissions })
                } else {
                    toast.error('Failed to accept the bid')
                    this.setState({ loader: false })
                }
            },
        )
    }

    fetchData = () => {
        if (this.state.nftId) {
            if (this.state.rendType === 1) {
                const bidQS = ENV.objectToQueryString({
                    nftId: this.state.nftId,
                    page: this.state.page,
                })
                this.props.getBids(bidQS)
            } else if (this.state.rendType === 2) {
                const qs = ENV.objectToQueryString({
                    nftId: this.state.nftId,
                    page: this.state.page,
                })
                this.props.getOffers(qs)
            } else if (this.state.rendType === 3) {
                const qs = ENV.objectToQueryString({
                    nftId: this.state.nftId,
                    page: this.state.page,
                })
                this.props.getHistory(qs)
            }
        }
        let page = this.state.page + 1
        this.setState({
            page,
        })
    }

    rendContent() {
        let { bids, offers, nftHistory, moreCheck, userId, nft } = this.state
        if (this.state.rendType === 1) {
            return (
                <div className="tab-pane show active" id="bids">
                    <ul className="list-unstyled">
                        {bids && bids.length > 0 ? (
                            <InfiniteScroll
                                dataLength={bids.length}
                                next={this.fetchData}
                                hasMore={moreCheck}
                                loader={<h4>Loading...</h4>}
                            >
                                {bids.map((item, idx) => {
                                    const today = moment(new Date(), 'YYYY-MM-DD HH:mm:ss:SSS')
                                    const expiryDate = moment(
                                        new Date(item.expiryDate),
                                        'YYYY-MM-DD HH:mm:ss:SSS',
                                    )
                                    const isPast = expiryDate.isBefore(today)

                                    return (
                                        <li
                                            key={`bid_${idx}`}
                                            className="single-tab-list offer-img d-flex justify-content-between align-items-center w-100 mb-4"
                                        >
                                            <Link to={`/author/${item.bidBy._id}`}>
                                                <img
                                                    className="avatar-sm rounded-border m-0 me-3"
                                                    src={item.bidBy.profilePhoto ? item.bidBy.profilePhoto : ProfileImg}
                                                    alt=""
                                                />
                                            </Link>
                                            <div className="d-flex justify-content-between flex-fill offer-listed-section">
                                                <p className="m-0 me-3 flex-fill">
                                                    Bid listed for{' '}
                                                    <strong>
                                                        {item.price.amount} {item.price.currency}
                                                    </strong>{' '}
                                                    {moment(item.createdAt).fromNow()}{' '}
                                                    by{' '}
                                                    <Link to={`/author/${item.bidBy._id}`}>
                                                        @{item.bidBy.username}
                                                    </Link>
                                                </p>
                                                <div className="d-flex">
                                                    {userId === item.bidBy._id && (
                                                        <div
                                                            className="ms-auto"
                                                            onClick={() => this.deleteBid(item._id)}
                                                            data-effect="float"
                                                            data-tip="Delete"
                                                        >
                                                            <i
                                                                className="cursor-pointer fa fa-times text-danger"
                                                                aria-hidden="true"
                                                            />
                                                        </div>
                                                    )}
                                                    {userId === nft.owner?._id && !isPast && (
                                                        <div
                                                            className="ms-auto"
                                                            onClick={() =>
                                                                this.acceptBid(
                                                                    item._id,
                                                                    item.bidBy.address,
                                                                    item.price.amount,
                                                                    ENV.tokenNameToValue[item.price.currency]
                                                                        ? ENV.tokenNameToValue[item.price.currency]
                                                                        : 2,
                                                                )
                                                            }
                                                            data-effect="float"
                                                            data-tip="Accept"
                                                        >
                                                            <i
                                                                className="cursor-pointer fa fa-check text-success"
                                                                aria-hidden="true"
                                                            />
                                                        </div>
                                                    )}
                                                    {item.txHash && (
                                                        <a
                                                            className="ms-auto"
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            href={`${explorerURL}/tx/${item.txHash}`}
                                                            data-effect="float"
                                                            data-tip="Transaction Details"
                                                        >
                                                            <i
                                                                className="cursor-pointer fa fa-info text-info"
                                                                aria-hidden="true"
                                                            />
                                                        </a>
                                                    )}
                                                </div>

                                                <ReactTooltip />
                                            </div>
                                        </li>
                                    )
                                })}
                            </InfiniteScroll>
                        ) : (
                            <div className=" text-white">
                                <span className="no-data-table">No bids found</span>
                            </div>
                        )}
                    </ul>
                </div>
            )
        } else if (this.state.rendType === 2) {
            return (
                <div className="tab-pane show active" id="offers">
                    <ul className="list-unstyled">
                        {offers && offers.length > 0 ? (
                            <InfiniteScroll
                                dataLength={offers.length}
                                next={this.fetchData}
                                hasMore={moreCheck}
                                loader={<h4>Loading...</h4>}
                            >
                                {offers.map((item, idx) => {
                                    const today = moment(new Date(), 'YYYY-MM-DD HH:mm:ss:SSS')
                                    const expiryDate = moment(
                                        new Date(item.expiryDate),
                                        'YYYY-MM-DD HH:mm:ss:SSS',
                                    )
                                    const isPast = expiryDate.isBefore(today)

                                    return (
                                        <li
                                            key={`offer_${idx}`}
                                            className="single-tab-list offer-img d-flex align-items-center w-100 mb-4"
                                        >
                                            <Link to={`/author/${item.offerBy._id}`}>
                                                <img
                                                    className="avatar-sm rounded-border m-0 me-3"
                                                    src={item.offerBy.profilePhoto ? item.offerBy.profilePhoto : ProfileImg}
                                                    alt=""
                                                />
                                            </Link>
                                            <div className="d-flex justify-content-between flex-fill offer-listed-section">
                                                <p className="m-0 me-3 flex-fill">
                                                    Offer listed for{' '}
                                                    <strong>
                                                        {item.price.amount} {item.price.currency}
                                                    </strong>{' '}
                                                    {moment(item.createdAt).fromNow()}{' '}
                                                    by{' '}
                                                    <Link to={`/author/${item.offerBy._id}`}>
                                                        @{item.offerBy.username}
                                                    </Link>
                                                </p>
                                                <div className="d-flex">
                                                    {userId === item.offerBy._id && (
                                                        <div
                                                            className="ms-auto"
                                                            onClick={() => this.deleteOffer(item._id)}
                                                            data-effect="float"
                                                            data-tip="Remove"
                                                        >
                                                            <i
                                                                className="cursor-pointer fa fa-times text-danger"
                                                                aria-hidden="true"
                                                            />
                                                        </div>
                                                    )}
                                                    {userId === nft.owner?._id && !isPast && (
                                                        <div
                                                            className="ms-auto"
                                                            onClick={() =>
                                                                this.acceptOffer(
                                                                    item._id,
                                                                    item.offerBy.address,
                                                                    item.price.amount,
                                                                    ENV.tokenNameToValue[item.price.currency]
                                                                        ? ENV.tokenNameToValue[item.price.currency]
                                                                        : 2,
                                                                )
                                                            }
                                                            data-effect="float"
                                                            data-tip="Accept"
                                                        >
                                                            <i
                                                                className="cursor-pointer fa fa-check text-success"
                                                                aria-hidden="true"
                                                            />
                                                        </div>
                                                    )}
                                                    {item.txHash && (
                                                        <a
                                                            className="ms-auto"
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            href={`${explorerURL}/tx/${item.txHash}`}
                                                            data-effect="float"
                                                            data-tip="Transaction Details"
                                                        >
                                                            <i
                                                                className="cursor-pointer fa fa-info text-info"
                                                                aria-hidden="true"
                                                            />
                                                        </a>
                                                    )}
                                                </div>

                                                <ReactTooltip />
                                            </div>
                                        </li>
                                    )
                                })}
                            </InfiniteScroll>
                        ) : (
                            <div className=" text-white">
                                <span className="no-data-table">No offers found</span>
                            </div>
                        )}
                    </ul>
                </div>
            )
        } else if (this.state.rendType === 3) {
            return (
                <div className="tab-pane show active" id="history">
                    <ul className="list-unstyled">
                        {nftHistory && nftHistory.length > 0 ? (
                            <InfiniteScroll
                                dataLength={nftHistory.length}
                                next={this.fetchData}
                                hasMore={moreCheck}
                                loader={<h4>Loading...</h4>}
                            >
                                {nftHistory.map((item, idx) => {
                                    return (
                                        <li
                                            key={`history_${idx}`}
                                            className="single-tab-list d-flex align-items-start w-100 mb-4"
                                        >
                                            {item.seller && (
                                                <p className="m-0 transaction-detail">
                                                    Ownership transferred from{' '}
                                                    <Link to={`/author/${item.seller._id}`} className="mx-1">
                                                        {item.seller.username}
                                                    </Link>{' '}
                                                    to{' '}
                                                    <Link to={`/author/${item.buyer._id}`} className="mx-1">
                                                        {item.buyer.username}
                                                    </Link>{' '}
                                                    for{' '}
                                                    <strong>
                                                        {item.price.amount} {item.price.currency}
                                                    </strong>
                                                </p>
                                            )}
                                            {item.txHash && (
                                                <a
                                                    className="transaction-button"
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    href={`${explorerURL}/tx/${item.txHash}`}
                                                    data-effect="float"
                                                    data-tip="Transaction Details"
                                                >
                                                    <i
                                                        className="cursor-pointer fa fa-info text-info"
                                                        aria-hidden="true"
                                                    />
                                                </a>
                                            )}

                                            <ReactTooltip />
                                        </li>
                                    )
                                })}
                            </InfiniteScroll>
                        ) : (
                            <div className=" text-white">
                                <span className="no-data-table">No history found</span>
                            </div>
                        )}
                    </ul>
                </div>
            )
        } else if (this.state.rendType === 4) {
            return (
                <div className="tab-pane  show active" id="details">
                    <div className="owner-meta d-flex align-items-center mt-3">
                        <span className="text-white">Owner</span>
                        <Link
                            className="owner d-flex align-items-center ms-2"
                            to={`/author/${nft.owner?._id}`}
                        >
                            <span className="avatar-sm rounded-border overflow-hidden">
                                <img
                                    className=""
                                    src={
                                        nft.owner?.profilePhoto
                                            ? nft.owner.profilePhoto
                                            : globalPlaceholderImage
                                    }
                                    alt="img"
                                />
                            </span>
                            <h6 className="ms-2 mb-0">{nft.owner?.username}</h6>
                        </Link>
                    </div>
                    <p className="mt-2">
                        Created : {moment(nft.createdAt).format('DD MMM YYYY')}
                    </p>

                    <p className="mt-2">
                        Address :{' '}
                        <a
                            target="_blank"
                            rel="noreferrer"
                            href={`${explorerURL}/address/${nft.collection.address
                                ? nft.collection.address
                                : ENV.nftContractAddress
                                }`}
                        >
                            {this.formatAddress(
                                nft.collection.address
                                    ? nft.collection.address
                                    : ENV.nftContractAddress,
                            )}
                        </a>
                    </p>
                    {
                        nft?.tokenId ?
                            <>
                                <p className="mt-2">Blockchain : {ENV.requiredChainName}</p>
                                <p className="mt-2">Token ID : {nft?.tokenId}</p>
                            </>
                            :
                            ''
                    }
                    {nft.txHash && (
                        <a
                            target="_blank"
                            rel="noreferrer"
                            href={`${explorerURL}/tx/${nft.txHash}`}
                        >
                            View Transaction Details
                        </a>
                    )}
                </div>
            )
        } else if (this.state.rendType === 5) {
            return (
                <div className="tab-pane show active properties-tab" id="attr">
                    <div className="d-flex justify-content-between flex-wrap">
                        {nft.attributes.length > 0 ? (
                            nft.attributes.map((attr, index) => {
                                return (
                                    <div key={index} className="m-3 card no-hover">
                                        <div className="single-seller d-flex align-items-center">
                                            <div className="seller-info justify-content-center align-items-center flex-fill">
                                                <h5 className="seller my-0">{attr._id.trait_type}</h5>
                                                <span>{attr._id.value}</span>
                                                <span>
                                                    {parseFloat(
                                                        ((attr.total / nft.totalColNFTs) * 100).toFixed(2)
                                                    )}
                                                    % have this trait
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        ) : (
                            <div className="text-white w-100">
                                <span className="mt-0 no-data-table">No properties found</span>
                            </div>
                        )}
                    </div>
                </div>
            )
        }
    }

    refreshMetadata = () => {
        const { tokenId, address, _id } = this.state.nft
        const payload = {
            tokenId,
            address,
            nftId: _id,
        }
        this.setState(
            {
                loader: true,
            },
            () => {
                this.props.refreshMetadata(payload)
            },
        )
    }

    cancelListing = () => {
        confirmAlert({
            title: 'Are you sure you want to cancel your listing?',
            message: `Cancelling your listing will unpublish this sale from ${ENV.appName}.`,
            buttons: [
                {
                    label: 'Never mind',
                },
                {
                    label: 'Cancel listing',
                    onClick: async () => {
                        this.setState({ loader: true })
                        const { nft } = this.state
                        const _nftData = {
                            tokenId: nft.tokenId,
                            price: nft.currentPrice.toString(),
                            currency: nft.currency,
                            nft: nft.address,
                            nftId: nft.autoNftId,
                        }
                        const cancelResponse = await cancelSellingWeb3(_nftData, nft._id)

                        if (cancelResponse) {
                            this.props.cancelListing(nft._id, nft.sellingMethod, cancelResponse)
                        } else
                            return this.setState({ loader: false })
                    },
                },
            ],
        })
    }

    // handle stake modal states
    stakeModalHandler = () => {
        let { userId, stakeNftModal, stakingPrice, nft } = this.state
        if (userId) {
            if (nft?.status === 2)
                stakingPrice = nft.currency === 'MYNT' ? nft.currentPrice : (nft.currency === 'BNB' ?
                    convertBnbToMynt(nft.currentPrice, 1 / this.props.app.myntToBnbRate) : '')

            this.setState({
                stakeNftModal: !stakeNftModal,
                isSubmitted: false,
                loader: false,
                formValid: true,
                stakingPrice
            })
        }
        else
            this.props.navigate('/login')
    }

    closeStakeModal = () => this.setState({ stakeNftModal: false })

    onTextualChange = (e) => {
        const { name, value } = e.target
        this.setState({
            [name]: value
        })
    }

    // stake / unstake NFT
    stakeNFT = () => {
        let { formValid, stakingDays, nft, stakingPrice, stakingCurrency } = this.state
        const isStaked = !nft.isStaked // update isStaked status

        if (isStaked) {
            if (!stakingDays || (nft.status !== 2 && (!stakingPrice || !stakingCurrency)))
                formValid = false
            else formValid = true
        }

        this.setState({ isSubmitted: true, formValid }, () => {
            const { formValid } = this.state
            if (formValid) {
                this.setState(
                    {
                        loader: true,
                        isStaking: true
                    },
                    async () => {
                        var formData = new FormData();
                        formData.append('_id', nft._id)
                        formData.append('updateStake', true)
                        formData.append('isStaked', isStaked)

                        if (isStaked) {
                            formData.append('stakingDays', stakingDays)
                            formData.append('stakingPrice', stakingPrice)

                            if (nft.status !== 2) {
                                formData.append('stakingCurrency', stakingCurrency)
                            }

                            // check user balance
                            if (!MYNTConfig)
                                return this.setState({ loader: false }, () => {
                                    toast.error(
                                        'Unable to find MYNT token in system',
                                    )
                                })

                            const balData = {
                                price: stakingPrice,
                                cabi: JSON.stringify(MYNTConfig.abi),
                                cAddress: MYNTConfig.address,
                                nftId: nft.autoNftId,
                                currency: stakingCurrency
                            }
                            const balanceOf = await checkBalance(balData)
                            if (parseFloat(balanceOf) < stakingPrice)
                                return this.setState({ loader: false }, () => {
                                    toast.error(
                                        'Your account does not have sufficient amount of the MYNT token',
                                    )
                                })

                            const _nftData = {
                                tokenId: nft.tokenId,
                                price: stakingPrice, // parseInt(stakingPrice), // other platform CreateStake method takes stake in pos. int. only
                                currency: stakingCurrency,
                                nft: nft.address,
                                nftId: nft.autoNftId,
                                stakingDays,
                                name: nft.name
                            }
                            const stakeResponse = await stakeWeb3(_nftData, nft._id)

                            if (stakeResponse) {
                                formData.append('stakeSign', stakeResponse.stakeSign)
                                formData.append('stakeTxHash', stakeResponse.stakeTxHash)
                                formData.append('stakeId', stakeResponse.stakeId)
                                formData.append('stakingDate', moment())
                                this.props.upsertNFT('edit', formData, 'PUT')
                            } else
                                return this.setState({ loader: false, isStaking: false }, () => {
                                    toast.error('Failed to stake your NFT')
                                })
                        }
                        else {
                            // unstake NFT from other platform
                            const unstakeResponse = await unstakeWeb3(nft.stakeId)

                            if (unstakeResponse) {
                                formData.append('unstakeSign', unstakeResponse.unstakeSign)
                                formData.append('unstakeTxHash', unstakeResponse.unstakeTxHash)
                                this.props.upsertNFT('edit', formData, 'PUT')
                            } else
                                return this.setState({ loader: false, isStaking: false }, () => {
                                    toast.error('Failed to unstake your NFT')
                                })
                        }
                    }
                )
            } else {
                this.validator.showMessages()
                this.validator.purgeFields()
                this.setState(
                    {
                        errors: 'Please fill all required fields in valid format.',
                        formValid: false,
                    },
                    () => {
                        window.scroll(0, 0)
                    },
                )
            }
        })
    }

    addReport = () => {
        if (this.validator.fieldValid('reportDescription')) {
            let payload = {
                nftId: this.state.nft._id,
                reportedBy: this.state.userId,
                reportedTo: this.state.nft.owner._id,
                description: this.state.reportDescription,
                status: 1
            }

            this.props.addReport(payload)
            this.setState({ loader: true })
            this.setState({ reportNftModal: !this.state.reportNftModal, hasNftAlreadyReported: true })
        }
        else {

        }
    }

    addRemovefavourite = () => {
        if (this.state.userId) {
            // this.setState({ isUserFavourite : false, disable : true })
            this.setState({ disable: true, showBeatLoader: true })
            let likeClassName = this.favRef.current.className
            if (likeClassName === 'text-red') {
                this.props.removeFavourite({ userId: this.state.userId, nftId: this.state.nft._id })
            }
            else if (likeClassName === 'text-white') {
                this.props.addToFavourite({ userId: this.state.userId, nftId: this.state.nft._id })
            }
        }
        else {
            this.props.navigate('/login')

        }
    }

    showReportModalHandler = () => {
        const { userId, reportNftModal } = this.state
        if (userId)
            this.setState({ reportNftModal: !reportNftModal })
        else
            this.props.navigate('/login')
    }

    buyNFT = (type = 1, paymentToken, paymentId, payerId) => {
        const { userId, nft, discountedPriceInBnb, discountedPriceInMynt, discountPercentage, discountCode } = this.state
        const price = paymentToken === 'BNB' && discountedPriceInBnb ? discountedPriceInBnb : paymentToken === 'MYNT' && discountedPriceInMynt ? discountedPriceInMynt : nft.currentPrice

        if (userId) {
            this.setState({ loader: true }, async () => {
                const _nftData = {
                    metadata: nft.metaData || '',
                    tokenId: nft.tokenId || 0,
                    nftId: nft.autoNftId,
                    owner: nft.owner.address,
                    nft: nft.address,
                    payThrough: type,
                    collectionId: nft.collection.autoColId,
                    price: price || 0,
                    currency: type === 1 && paymentToken ? paymentToken : nft.currency,
                    percent: 0,
                    nftRoyalty: nft.commissions || []
                }

                const tokenConfig = currencies.find(
                    (elem) => elem.value.toUpperCase() === _nftData.currency.toUpperCase(),
                )

                const cabi = tokenConfig?.abi || null
                const cAddress = tokenConfig?.address || ''

                const buy = await buyNow(_nftData, type, nft.royaltySplit, cabi, cAddress)
                if (buy?.txHash && buy?.signature) {
                    let payload = {
                        nftId: nft._id,
                        collectionId: nft.collection._id,
                        newOwnerAddress: nft.owner.address,
                        userId: nft.owner._id, // current owner in db is going to be a seller
                        txHash: buy.txHash,
                        buySign: buy.signature,
                        buyerId: userId,
                        price: {
                            amount: price || 0,
                            currency: type === 1 && paymentToken ? paymentToken : nft.currency,
                        },
                        paymentMethod: 1,
                        royalties: nft.commissions
                    }

                    if (type === 2) { // with PayPal
                        const usdPrice = localStorage.getItem('usdPrice')
                        payload = {
                            ...payload,
                            paymentId, paymentToken, payerId, paymentMethod: 2,
                            price: {
                                amount: parseFloat(usdPrice) || 0,
                                currency: 'USD'
                            }
                        }
                        localStorage.removeItem('usdPrice')
                    }

                    // if user has gained discount
                    if (discountedPriceInBnb || discountedPriceInMynt) {
                        // send data for creating gift card logs
                        payload.giftCardToken = discountCode
                        payload.discountedPrice = price
                        payload.discountPercentage = discountPercentage
                        payload.originalPrice = nft.currentPrice
                        payload.hasDiscount = true
                    }
                    this.props.buyNFT(payload)
                } else {
                    toast.error("Failed to buy NFT");
                    return this.setState({ loader: false });
                }
            });
        } else {
            return this.props.navigate('/login')
        }
    }

    buyWithPayPal = () => {
        const { userId, nft, discountedPriceInBnb, discountedPriceInMynt } = this.state
        if (userId) {
            this.setState({ loader: true }, async () => {
                let usdPrice = nft.currency === 'BNB' ?
                    ENV.convertBnbToUsd(
                        discountedPriceInBnb ? discountedPriceInBnb : nft?.currentPrice,
                        this.props.app.rate
                    ) :
                    nft.currency === 'MYNT' ?
                        ENV.convertMyntToUsd(
                            discountedPriceInMynt ? discountedPriceInMynt : nft?.currentPrice,
                            this.props.app.mynt
                        ) : 0

                usdPrice = parseFloat(usdPrice).toFixed(2)

                const payload = {
                    nftId: nft._id,
                    usdPrice
                }

                localStorage.setItem("usdPrice", usdPrice)
                this.props.buyWithPayPal(payload)
            });
        } else {
            return this.props.navigate('/login')
        }
    }

    verifyDiscount = () => {
        if (this.state.discountCode !== '') {
            let payload = {
                address: this.state.userAddress,
                token: this.state.discountCode
            }
            this.setState({ showSmallLoader: true, showPriceCard: this.state.showPriceCard && false, discountErr: '' })
            this.props.giftCardVerification(payload)
        }
        else {
            this.setState({ discountErr: 'This field is required. ' })
        }
    }

    // get staking percentage through other platform
    getStakingPercent = (nft) => {
        if (nft?.isStaked && nft?.stakeId && nft?.stakingDate) {
            const a = moment(new Date(), 'YYYY-MM-DD')
            const b = moment(new Date(nft.stakingDate), 'YYYY-MM-DD')
            const dayToFind = a.diff(b, 'days')

            if (dayToFind) {
                const stakingPercentData = {
                    user: nft.owner.address,
                    stakeId: nft.stakeId,
                    dayToFind
                }

                this.props.getStakingPercent(stakingPercentData)
            }
        }
    }

    render() {
        const { loader, nft, nftConfig, isSubmitted, errors, userId, reportNftModal, stakeNftModal, stakingDays, stakingCurrency, stakingPrice, stakingPercent, paymentTokens, isStaking, discountedPriceInBnb, discountedPriceInMynt } = this.state
        const fileTypes = ENV.nftFileTypes
        const currentDate = moment(new Date(), 'YYYY-MM-DD HH:mm:ss:SSS')
        const nftStartDate = moment(
            new Date(nft?.auctionStartDate),
            'YYYY-MM-DD HH:mm:ss:SSS',
        )
        const nftEndDate = moment(
            new Date(nft?.auctionEndDate),
            'YYYY-MM-DD HH:mm:ss:SSS',
        )
        const isAuctionStarted = nftStartDate.isBefore(currentDate)
        const isAuctionPast = nftEndDate.isBefore(currentDate)

        // count days passed after NFT is staked
        let daysPassed = 0
        if (nft?.isStaked && nft?.stakingDate) {
            const a = moment(new Date(), 'YYYY-MM-DD')
            const b = moment(new Date(nft.stakingDate), 'YYYY-MM-DD')
            daysPassed = a.diff(b, 'days')
        }

        return (
            <>
                <section className="item-details-area padding-wrapper pb-0">
                    {/* <Gamification eventType={this.state.eventType} /> */}
                    {loader ? (
                        <FullPageLoader />
                    ) : (
                        <>
                            {nft && (
                                <div className="container">
                                    <div className="row justify-content-between">
                                        <div className="col-12 col-lg-5">
                                            <div className="item-info">
                                                <div className="item-thumb align-items-center position-relative">
                                                    {
                                                        !this.state.isImgTypeTiff ?
                                                            <>
                                                                {
                                                                    nft.type === 2 ?
                                                                        <>
                                                                            {
                                                                                nft.isStaked ?
                                                                                    <img id="nft-item-image" className="cd-scale" src={ipfsToUrl(nft?.image)} alt="nft-thumbnail" />
                                                                                    :
                                                                                    <img id="nft-item-image" className="c-scale" src={ipfsToUrl(nft?.image)} alt="nft-thumbnail" />
                                                                            }
                                                                        </>
                                                                        :
                                                                        nft.isStaked ?
                                                                            <img id="nft-item-image" className="d-scale" src={ipfsToUrl(nft?.image)} alt="nft-thumbnail" />
                                                                            :
                                                                            <img id="nft-item-image" src={ipfsToUrl(nft?.image)} alt="nft-thumbnail" />
                                                                }
                                                            </>
                                                            :

                                                            null
                                                    }
                                                    {
                                                        nft.mediaType === 2 && this.state.hasOptionsSet ?
                                                            <span className="react-audio-player"
                                                            >
                                                                <ReactJkMusicPlayer
                                                                    id="nft-music-player"
                                                                    {...this.state.options}
                                                                    getAudioInstance={(instance) => {
                                                                        this.audioInstance = instance
                                                                    }}
                                                                />
                                                            </span>
                                                            :
                                                            nft.mediaType === 14 && this.state.showVideoPlayer ?
                                                                <Video autoPlay
                                                                    className="nft-video-section"
                                                                    controls={['PlayPause', 'Seek', 'Time', 'Volume', 'Fullscreen']}>
                                                                    <source src={nft.fileLocal} />
                                                                </Video>
                                                                :
                                                                fileTypes && fileTypes.length &&
                                                                fileTypes.map((type, index) => {
                                                                    if (type.mediaType === nft.mediaType && type.btnText !== '' && type.hasFile)
                                                                        return <a key={index} href={nft.fileLocal} target="_blank" className='btn no-border btn-filled mt-4 w-100 text-white'>
                                                                            <span className="d-block transition">{type.btnText}</span>
                                                                        </a>

                                                                })
                                                    }
                                                    {
                                                        nft.type === 2 ?
                                                            <>
                                                                {
                                                                    nft.isStaked ?
                                                                        <span className="commission-icon-cd cursor-pointer d-flex justify-content-center align-items-center" data-tip="NFTCD">
                                                                            <FontAwesomeIcon icon={faC} className="commission-in" />
                                                                            <FontAwesomeIcon icon={faD} className="commission-in" />
                                                                        </span>
                                                                        :
                                                                        <span className="commission-icon cursor-pointer" data-tip="NFTC">
                                                                            <FontAwesomeIcon icon={faC} className="commission-in" />
                                                                        </span>
                                                                }
                                                            </>
                                                            :
                                                            nft.isStaked &&
                                                            <span className="commission-icon-d cursor-pointer" data-tip="NFTD">
                                                                <FontAwesomeIcon icon={faD} className="commission-in" />
                                                            </span>
                                                    }
                                                </div>
                                                {nft.auctionEndDate &&
                                                    new Date() <
                                                    Date.parse(nft.auctionEndDate) + 10000 && (
                                                        <div className="card no-hover countdown-times mt-4">
                                                            <Countdown
                                                                date={Date.parse(nft.auctionEndDate) + 10000}
                                                                renderer={countDownRenderer}
                                                            />
                                                        </div>
                                                    )}
                                                {/* Tabs */}
                                                <ul
                                                    className="netstorm-tab nav nav-tabs mt-4"
                                                    id="nav-tab"
                                                >
                                                    <li>
                                                        <a
                                                            className={
                                                                this.state.rendType === 1 ? 'active' : ''
                                                            }
                                                            id="bids-tab"
                                                            data-toggle="pill"
                                                            href="#bids"
                                                            onClick={() => {
                                                                this.setState({
                                                                    rendType: 1,
                                                                    page: 2,
                                                                    moreCheck: true,
                                                                })
                                                            }}
                                                        >
                                                            <h5 className="m-0">Bids</h5>
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a
                                                            className={
                                                                this.state.rendType === 2 ? 'active' : ''
                                                            }
                                                            id="offers-tab"
                                                            data-toggle="pill"
                                                            href="#offers"
                                                            onClick={() => {
                                                                this.setState({
                                                                    rendType: 2,
                                                                    page: 2,
                                                                    moreCheck: true,
                                                                })
                                                            }}
                                                        >
                                                            <h5 className="m-0">Offers</h5>
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a
                                                            className={
                                                                this.state.rendType === 3 ? 'active' : ''
                                                            }
                                                            id="history-tab"
                                                            data-toggle="pill"
                                                            href="#history"
                                                            onClick={() => {
                                                                this.setState({
                                                                    rendType: 3,
                                                                    page: 2,
                                                                    moreCheck: true,
                                                                })
                                                            }}
                                                        >
                                                            <h5 className="m-0">History</h5>
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a
                                                            className={
                                                                this.state.rendType === 5 ? 'active' : ''
                                                            }
                                                            id="attr-tab"
                                                            data-toggle="pill"
                                                            href="#attr"
                                                            onClick={() => {
                                                                this.setState({ rendType: 5 })
                                                            }}
                                                        >
                                                            <h5 className="m-0">Properties</h5>
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a
                                                            className={
                                                                this.state.rendType === 4 ? 'active' : ''
                                                            }
                                                            id="details-tab"
                                                            data-toggle="pill"
                                                            href="#details"
                                                            onClick={() => {
                                                                this.setState({ rendType: 4 })
                                                            }}
                                                        >
                                                            <h5 className="m-0">Details</h5>
                                                        </a>
                                                    </li>
                                                </ul>
                                                {/* Tab Content */}
                                                <div className="tab-content" id="nav-tabContent">
                                                    {this.rendContent()}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-12 col-lg-6">
                                            <div className="content">
                                                {
                                                    nft.type === 2 &&
                                                    <div className="row mb-3">
                                                        <div className="col-12 item px-lg-2">
                                                            <div className="card no-hover text-white">
                                                                <div className="price d-flex justify-content-between align-items-center">
                                                                    <h4 className="mb-0">Commission</h4>
                                                                    <span className="commission-percentage">
                                                                        {nft.commission || 0}%
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                }
                                                <div className="nft-head d-flex justify-content-between align-items-center mb-3">
                                                    <h3 className="m-0">{nft.name}</h3>
                                                    <div className="nft-head-buttons d-flex align-items-center justify-content-end">
                                                        {
                                                            this.state.showBeatLoader ?
                                                                <div className="cursor-pointer btn-like">
                                                                    <BeatsLoader />
                                                                </div>
                                                                :
                                                                <div
                                                                    style={{ pointerEvents: this.state.disable ? 'none' : 'auto' }}
                                                                    className="cursor-pointer btn-like"
                                                                    onClick={() => this.addRemovefavourite()}
                                                                    data-tip={this.state.favouriteCheck ? 'Unlike' : 'Like'}>
                                                                    <span ref={this.favRef} className={this.state.favouriteCheck || this.state.isUserFavourite ? 'text-red' : 'text-white'} >
                                                                        <FontAwesomeIcon id="addRemoveFavourite" icon={faHeart} />
                                                                    </span>
                                                                    <span className="ms-1">{this.state.totalLikes > -1 ? this.state.totalLikes : ''}</span>
                                                                </div>
                                                        }
                                                        {
                                                            nft.owner?._id === userId &&
                                                            <>
                                                                {
                                                                    // this is to disable stake / unstake button only
                                                                    isStaking ?
                                                                        <span
                                                                            className="not-allowed btn-refresh"
                                                                            data-effect="float" data-tip={!nft.isStaked ? <BeatsLoader /> : <BeatsLoader />}
                                                                            disable={true}
                                                                        >
                                                                            <FontAwesomeIcon icon={faCoins} />
                                                                        </span>
                                                                        :
                                                                        // stake / unstake NFT
                                                                        !nft.isStaked ?
                                                                            <span
                                                                                className="cursor-pointer btn-refresh"
                                                                                data-effect="float" data-tip="Stake"
                                                                                onClick={() => this.stakeModalHandler()}
                                                                            >
                                                                                <FontAwesomeIcon icon={faCoins} />
                                                                            </span>
                                                                            :
                                                                            <span
                                                                                className="cursor-pointer btn-refresh"
                                                                                data-effect="float" data-tip="Unstake"
                                                                                onClick={() => this.stakeNFT()}
                                                                            >
                                                                                <FontAwesomeIcon icon={faCoins} />
                                                                            </span>
                                                                }
                                                            </>
                                                        }
                                                        {
                                                            nft.mediaType === 2 &&
                                                            <span className="cursor-pointer btn-refresh" data-effect="float" data-tip="Play Audio" onClick={() => { this.setState({ toggleMusicPlayer: true }); this.audioInstance.load() }}>
                                                                <FontAwesomeIcon icon={faMusic} />
                                                            </span>
                                                        }
                                                        {
                                                            nft.mediaType === 14 && !this.state.showHideIcon &&
                                                            <span className="cursor-pointer btn-refresh" data-effect="float" data-tip="Play Video" onClick={() => { this.setState({ showVideoPlayer: true }) }}>
                                                                <FontAwesomeIcon icon={faPlay} />
                                                            </span>
                                                        }
                                                        {
                                                            nft.mediaType === 14 && this.state.showHideIcon &&
                                                            <span className="cursor-pointer btn-refresh" data-effect="float" data-tip="Close Video" onClick={() => { this.setState({ showVideoPlayer: false }) }}>
                                                                <FontAwesomeIcon icon={faStop} />
                                                            </span>
                                                        }
                                                        {
                                                            nft.isCustom && (
                                                                <span
                                                                    className="btn-refresh cursor-pointer"
                                                                    onClick={() => this.refreshMetadata()}
                                                                    data-effect="float"
                                                                    data-tip="Refresh Metadata"
                                                                >
                                                                    <FontAwesomeIcon icon={faUndo} />
                                                                </span>
                                                            )
                                                        }
                                                        {
                                                            nft.owner?._id !== userId &&
                                                            <span
                                                                className="cursor-pointer btn-report"
                                                                onClick={() => this.showReportModalHandler()}
                                                                data-effect="float"
                                                                data-tip="Report"
                                                            >
                                                                <FontAwesomeIcon icon={faBan} />
                                                            </span>
                                                        }
                                                        <Dropdown>
                                                            <Dropdown.Toggle className="btn-dropdown">
                                                                <span
                                                                    className="cursor-pointer btn-share"
                                                                    data-effect="float"
                                                                    data-tip="Share"
                                                                >
                                                                    <FontAwesomeIcon icon={faShareAlt} />
                                                                </span>
                                                            </Dropdown.Toggle>
                                                            <Dropdown.Menu>
                                                                <CopyToClipboard text={this.state.nftUrl}
                                                                    onCopy={() => toast.success('Link Copied!', { toastId: '' })}>
                                                                    <Dropdown.Item>
                                                                        <FontAwesomeIcon icon={faCopy} />
                                                                        Copy Link
                                                                    </Dropdown.Item>
                                                                </CopyToClipboard>
                                                                <Dropdown.Item>
                                                                    <FacebookShareButton
                                                                        url={this.state.nftUrl}
                                                                        quote={this.state.nft.name}
                                                                    // className={classes.socialMediaButton}
                                                                    >
                                                                        <FontAwesomeIcon icon={faFacebookF} />
                                                                        Share on Facebook
                                                                    </FacebookShareButton>

                                                                </Dropdown.Item>
                                                                <Dropdown.Item>
                                                                    <TwitterShareButton
                                                                        url={this.state.nftUrl}
                                                                        quote={this.state.nft.name}
                                                                    // className={classes.socialMediaButton}
                                                                    >
                                                                        <FontAwesomeIcon icon={faTwitter} />
                                                                        Share on Twitter
                                                                    </TwitterShareButton>
                                                                </Dropdown.Item>
                                                            </Dropdown.Menu>
                                                        </Dropdown>
                                                    </div>
                                                </div>

                                                <ReactTooltip />

                                                <p>{nft.description}</p>

                                                {/* Owner */}
                                                <div className="owner d-flex align-items-center">
                                                    <span className="text-white">Owned By</span>
                                                    <Link
                                                        className="owner-meta d-flex align-items-center ms-3"
                                                        to={`/author/${nft.owner?._id}`}
                                                    >
                                                        <img
                                                            className="avatar-sm rounded-border"
                                                            src={
                                                                nft.owner?.profilePhoto ||
                                                                ProfileImg
                                                            }
                                                            alt="Owner Avatar"
                                                        />
                                                        <h6 className="ms-2 mb-0">{nft.owner?.username}</h6>
                                                    </Link>
                                                </div>
                                                {/* Item Info List */}
                                                <div className="item-info-list mt-4">
                                                    {
                                                        nft.currentPrice &&
                                                        <ul className="list-unstyled">
                                                            <li className="price d-flex justify-content-between">
                                                                <span>
                                                                    Current Price {nft.currentPrice} {nft.currency}
                                                                </span>
                                                                <span>
                                                                    ${' '}
                                                                    {nft.currentPrice
                                                                        ? (nft.currency === 'BNB' || nft.currency === 'CRO') &&
                                                                            this.props.app.rateAuth
                                                                            ? ENV.convertBnbToUsd(
                                                                                nft.currentPrice,
                                                                                this.props.app.rate,
                                                                            )
                                                                            : nft.currency === 'MYNT' &&
                                                                                this.props.app.myntRateAuth
                                                                                ? ENV.convertMyntToUsd(
                                                                                    nft.currentPrice,
                                                                                    this.props.app.myntRate,
                                                                                )
                                                                                : '0.00'
                                                                        : '0.00'}
                                                                </span>
                                                            </li>
                                                        </ul>
                                                    }
                                                </div>
                                                <div className="row items">
                                                    {/* Creator */}
                                                    <div className="col-12 col-md-6 item px-lg-2">
                                                        <div className="card no-hover">
                                                            <div className="single-seller d-flex align-items-center">
                                                                <Link to={`/author/${nft.creator?._id}`}>
                                                                    <img
                                                                        className="avatar-md rounded-border"
                                                                        src={
                                                                            nft.creator?.profilePhoto ||
                                                                            globalPlaceholderImage
                                                                        }
                                                                        alt="Creator Avatar"
                                                                    />
                                                                </Link>
                                                                <div className="seller-info ms-3">
                                                                    <div className="d-flex justify-content-center align-items-start flex-column">
                                                                        <Link
                                                                            className="seller mb-2"
                                                                            to={`/author/${nft.creator?._id}`}
                                                                            data-effect="float"
                                                                            data-tip={nft.creator?.username}
                                                                        >
                                                                            {nft.creator?.username}
                                                                        </Link>
                                                                        <span className="text-white">Creator</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {/* Collection */}
                                                    <div className="col-12 col-md-6 item px-lg-2">
                                                        <div className="card no-hover">
                                                            <div className="single-seller d-flex align-items-center">
                                                                <Link to={`/collection/${nft.collection?.url}`}>
                                                                    <img
                                                                        className="avatar-md rounded-border"
                                                                        src={
                                                                            nft.collection?.image ||
                                                                            globalPlaceholderImage
                                                                        }
                                                                        alt="img"
                                                                    />
                                                                </Link>
                                                                <div className="seller-info ms-3">
                                                                    <div className="d-flex justify-content-center align-items-start flex-column">
                                                                        <Link
                                                                            className="seller mb-2"
                                                                            to={`/collection/${nft.collection?.url}`}
                                                                            data-effect="float"
                                                                            data-tip={nft.collection?.name}
                                                                        >
                                                                            {nft.collection?.name}
                                                                        </Link>
                                                                        <span className="text-white">Collection</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {
                                                        nft.isStaked &&
                                                        <div className="col-12 item px-lg-2">
                                                            <div className="card no-hover text-white">
                                                                <h4 className="mt-0 mb-3">Staking Details</h4>
                                                                <div className="d-flex justify-content-between align-items-center flex-wrap">
                                                                    <div className="staking-parts staking-parts-1">
                                                                        <span className="stacking-head">
                                                                            Staked For:
                                                                        </span>
                                                                        <span className="staking-values">
                                                                            {nft.stakingDays || 0} Day(s)
                                                                        </span>
                                                                    </div>
                                                                    <div className="staking-parts staking-parts-2">
                                                                        <span className="stacking-head">
                                                                            Days Passed Until Now:
                                                                        </span>
                                                                        <span className="staking-values">
                                                                            {daysPassed} Day(s)
                                                                        </span>
                                                                    </div>
                                                                    <div className="staking-parts staking-parts-3">
                                                                        <span className="stacking-head">
                                                                            Staking Percentage:
                                                                        </span>
                                                                        <span className="staking-values">
                                                                            {stakingPercent}%
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    }
                                                    <div className="col-12 item px-lg-2">
                                                        <div className="card no-hover text-white">
                                                            <h4 className="mt-0 mb-3">Highest Bid</h4>
                                                            <div className="price d-flex justify-content-between align-items-center">
                                                                <span>
                                                                    {nft.highestBid
                                                                        ? `${nft.highestBid?.amount} ${nft.highestBid?.currency}`
                                                                        : 'N/A'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                {
                                                    userId &&
                                                    <>
                                                        {nft.owner?._id === userId ? (
                                                            <>
                                                                {nft.status === 2 && (
                                                                    <button
                                                                        className="d-block btn btn-outlined no-border transition mt-4 w-100"
                                                                        onClick={this.cancelListing}
                                                                    >
                                                                        <span className="d-block transition">Cancel Listing</span>
                                                                    </button>
                                                                )}
                                                                {!nft.sellingMethod && nft.rights !== 3 &&
                                                                    (
                                                                        <Link
                                                                            className="d-block btn btn-outlined no-border transition mt-4 w-100"
                                                                            to={`/sell-item/${window.btoa(nft._id)}`}
                                                                        >
                                                                            <span className="d-block transition">{initData.sellBtn}</span>
                                                                        </Link>
                                                                    )}
                                                            </>
                                                        ) : (
                                                            <>
                                                                {nft.sellingMethod && nft.status === 2 && isAuctionStarted && !isAuctionPast && (
                                                                    <>
                                                                        <button className="d-block btn btn-outlined no-border transition mt-4 w-100" onClick={this.openModal}>
                                                                            <span className="d-block transition">
                                                                                {nft.sellingMethod === 2
                                                                                    ? initData.bidBtn
                                                                                    : initData.offerBtn}
                                                                            </span>
                                                                        </button>
                                                                        {nft.sellingMethod === 1 && (
                                                                            <>
                                                                                <button
                                                                                    className="d-block btn btn-filled no-border transition mt-4 w-100"
                                                                                    onClick={() => this.buyWithPayPal()}
                                                                                >
                                                                                    <span className="d-block transition">
                                                                                        Buy with PayPal
                                                                                    </span>
                                                                                </button>

                                                                                <button
                                                                                    className="d-block btn btn-outlined no-border transition mt-4 w-100"
                                                                                    onClick={() => this.buyNFT(1, 'BNB')}
                                                                                >
                                                                                    <span className="d-block transition">
                                                                                        Buy Now  ({discountedPriceInBnb ? discountedPriceInBnb : nft.currency === 'MYNT' ? convertMyntToBnb(nft.currentPrice, this.props.app.myntToBnbRate) : nft.currentPrice} BNB)
                                                                                    </span>
                                                                                </button>

                                                                                <button
                                                                                    className="d-block btn btn-filled no-border transition mt-4 w-100"
                                                                                    onClick={() => this.buyNFT(1, 'MYNT')}
                                                                                >
                                                                                    <span className="d-block transition">
                                                                                        Buy Now  ({discountedPriceInMynt ? discountedPriceInMynt : nft.currency === 'BNB' ? convertBnbToMynt(nft.currentPrice, 1 / this.props.app.myntToBnbRate) : nft.currentPrice} MYNT)
                                                                                    </span>
                                                                                </button>


                                                                            </>
                                                                        )}
                                                                        <>
                                                                            <div className="col-12 item px-lg-2 mt-4">
                                                                                <input className="form-check-input cursor-pointer mt-0 me-2" type="checkbox" name="attributes" id="attributes" checked={this.state.applyDiscount} onChange={(e) => this.setState({ applyDiscount: !this.state.applyDiscount, discountCode: '', showPriceCard: false, discountedPriceInBnb: '', discountedPriceInMynt: '' })} />
                                                                                <label onChange={(e) => this.setState({ applyDiscount: !this.state.applyDiscount })} className="form-check-label text-white" htmlFor="attributes">Apply voucher to get discount?</label>
                                                                            </div>
                                                                            {
                                                                                this.state.applyDiscount &&
                                                                                <div className="col-12 item px-lg-2 mt-4">
                                                                                    <div className="form-group">
                                                                                        <input type="text" className="form-control" name="discountCode" placeholder="Enter your voucher code *" onChange={(e) => this.setState({ discountCode: e.target.value, discountErr: '' })} value={this.state.discountCode} />
                                                                                        {
                                                                                            this.state.discountErr && this.state.discountErr !== '' &&
                                                                                            <p className="text-danger mt-4">{this.state.discountErr}</p>

                                                                                        }
                                                                                        <button disabled={loader} className="btn mt-3 mt-sm-4 btn-filled transition no-border" type="button" onClick={(e) => this.verifyDiscount()}><span className="d-block transition">Submit</span></button>
                                                                                    </div>
                                                                                </div>
                                                                            }
                                                                            {
                                                                                this.state.showSmallLoader &&
                                                                                <BeatsLoader />
                                                                            }
                                                                            {/* </div> */}
                                                                            {
                                                                                this.state.showPriceCard &&

                                                                                <>
                                                                                    <div className="card no-hover mt-4">
                                                                                        <h4 style={{ color: 'rgba(216,23,150,1)' }}>Prices in BNB</h4>
                                                                                        <div className="countdown-container d-flex" style={{ justifyContent: "space-between", width: "85%" }}>
                                                                                            <div className="countdown-wrapper m-1">
                                                                                                <div style={{ color: 'rgba(216,23,150,1)' }}>Original Price</div>
                                                                                                <div className="text-white">{nft.currency === 'MYNT' ? convertMyntToBnb(nft.currentPrice, this.props.app.myntToBnbRate) : nft.currentPrice}</div>
                                                                                            </div>
                                                                                            <div className="countdown-wrapper m-1">
                                                                                                <div style={{ color: 'rgba(216,23,150,1)' }}>Discounted Price</div>
                                                                                                <div className="text-white">{discountedPriceInBnb}</div>
                                                                                            </div>
                                                                                            <div className="countdown-wrapper m-1">
                                                                                                <div style={{ color: 'rgba(216,23,150,1)' }}>Discount</div>
                                                                                                <div className="text-white">{`${this.state.discountPercentage}%`}</div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="card no-hover mt-4">
                                                                                        <h4 style={{ color: 'rgba(216,23,150,1)' }}>Prices in MYNT</h4>
                                                                                        <div className="countdown-container d-flex" style={{ justifyContent: "space-between", width: "85%" }}>

                                                                                            <div className="countdown-wrapper m-1">
                                                                                                <div style={{ color: 'rgba(216,23,150,1)' }}>Original Price</div>
                                                                                                <div className="text-white">{nft.currency === 'BNB' ? convertBnbToMynt(nft.currentPrice, 1 / this.props.app.myntToBnbRate) : nft.currentPrice}</div>
                                                                                            </div>
                                                                                            <div className="countdown-wrapper m-1">
                                                                                                <div style={{ color: 'rgba(216,23,150,1)' }}>Discounted Price</div>
                                                                                                <div className="text-white">{discountedPriceInMynt}</div>
                                                                                            </div>
                                                                                            <div className="countdown-wrapper m-1">
                                                                                                <div style={{ color: 'rgba(216,23,150,1)' }}>Discount</div>
                                                                                                <div className="text-white">{`${this.state.discountPercentage}%`}</div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </>

                                                                                // </div>
                                                                            }
                                                                        </>
                                                                    </>
                                                                )}
                                                            </>
                                                        )}
                                                    </>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </section>
                {/* place a bid / make an offer modal */}
                {
                    nft &&
                    <div className="modal-wrapper">
                        <Modal
                            centered
                            size="lg"
                            className="offer-modal"
                            show={this.state.isOpen}
                            onHide={this.closeModal}
                        >
                            <Modal.Header className="text-center modal-title-wrapper">
                                <Modal.Title>
                                    {nft.sellingMethod === 2 ? 'Place A Bid' : 'Make An Offer'}
                                </Modal.Title>
                            </Modal.Header>
                            {isSubmitted && errors && (
                                <Modal.Body className="row pt-2 pb-0">
                                    <div className="col-12">
                                        <span id="nft-err" className="form-error-msg text-danger">
                                            {errors}
                                        </span>
                                    </div>
                                </Modal.Body>
                            )}
                            <Modal.Body>
                                <div className="price-wrapper d-flex">
                                    <div className="price-text position-relative">
                                        <div className="text-white mb-2 absolute-wrapper">
                                            <b>Price <span className='text-danger'>*</span></b>
                                        </div>
                                        <div className="d-flex bid-main-tag">
                                            <div className="bid-select-1">
                                                <select
                                                    className="form-control"
                                                    id="currency"
                                                    name="nftConfig.price.currency"
                                                    value={nftConfig.price.currency}
                                                    disabled={+true}
                                                >
                                                    {currencies &&
                                                        currencies.map((currency, index) => {
                                                            return (
                                                                <option
                                                                    key={index}
                                                                    value={currency.symbol}
                                                                    caddress={currency.address}
                                                                    cabi={JSON.stringify(currency.abi)}
                                                                >
                                                                    {currency.symbol}
                                                                </option>
                                                            )
                                                        })}
                                                </select>
                                            </div>
                                            <div className="bid-amount">
                                                <input
                                                    type="text"
                                                    placeholder="Amount"
                                                    className="amount-btn double-input"
                                                    name="nftConfig.price.amount"
                                                    style={{ borderRadius: '4px' }}
                                                    onChange={(e) => this.onChange(e)}
                                                    onKeyDown={(e) => decimalNumberValidator(e)}
                                                    defaultValue={nftConfig.price.amount}
                                                    required
                                                />
                                                <div className="text-right my-2 dollar-wrapper">
                                                    ${' '}
                                                    {
                                                        this.getPrice(
                                                            nftConfig.price.currency,
                                                            nftConfig.price.amount,
                                                        )
                                                    }
                                                </div>
                                                <span className="text-danger message d-block mt-2">
                                                    {this.validator.message(
                                                        'amount',
                                                        nftConfig.price.amount,
                                                        'required',
                                                    )}
                                                </span>

                                            </div>
                                        </div>
                                        {this.state.minPriceError && (
                                            <p className="text-danger">{this.state.minPriceError}</p>
                                        )}
                                    </div>
                                </div>
                            </Modal.Body>
                            <Modal.Body
                                className=""
                                style={{
                                    flexDirection: 'column',
                                    display: 'block',
                                    height: 'auto',
                                }}
                            >
                                <div className="offer-expiration-wrapper text-white mb-2">
                                    <b>Expiration <span className='text-danger'>*</span></b>
                                </div>
                                <div>
                                    <div className="d-flex bid-main-tag">
                                        <div className="bid-select">
                                            <select
                                                className="form-control"
                                                id="expiryDate"
                                                name="nftConfig.expiry.date"
                                                onChange={(e) => this.onChange(e)}
                                            >
                                                {expiryOptions &&
                                                    expiryOptions.map((expiry, index) => {
                                                        return (
                                                            <option key={index} value={expiry.value}>
                                                                {expiry.label}
                                                            </option>
                                                        )
                                                    })}
                                            </select>
                                        </div>
                                        <div className="me-auto budle-wrapper bid-amount">
                                            <input
                                                type={
                                                    nftConfig.expiry.type === 1
                                                        ? 'time'
                                                        : 'datetime-local'
                                                }
                                                className="double-input m-0"
                                                name="nftConfig.expiry.time"
                                                value={nftConfig.expiry.time}
                                                onChange={(e) => this.onChange(e)}
                                                required
                                            />
                                            <span className="text-danger message d-block mt-2">
                                                {this.validator.message(
                                                    'expiryTime',
                                                    nftConfig.expiry.time,
                                                    'required',
                                                )}
                                            </span>
                                        </div>

                                    </div>
                                </div>
                            </Modal.Body>
                            <Modal.Body className="justify-content-center align-items-center">
                                <div className="d-flex justify-content-around">
                                    <button
                                        className="btn me-3 mt-5 mb-3 btn-filled transition"
                                        disabled={+loader}
                                        onClick={() => this.submit()}
                                    >
                                        <span className="d-block transition">
                                            {nft.sellingMethod === 2
                                                ? initData.bidBtn
                                                : initData.offerBtn}
                                        </span>
                                    </button>
                                </div>
                            </Modal.Body>
                            <Modal.Footer>
                                <button
                                    className="btn banner-btn btn-danger"
                                    onClick={this.closeModal}
                                >
                                    Close
                                </button>
                            </Modal.Footer>
                        </Modal>
                    </div>
                }
                {/* report NFT modal */}
                {
                    reportNftModal &&
                    <div className="modal-wrapper">
                        <Modal
                            centered
                            size="lg"
                            className="report-modal"
                            show={this.state.reportNftModal}
                            onHide={() => this.setState({ reportNftModal: !this.state.reportNftModal })}
                        >
                            <Modal.Header className="text-center modal-title-wrapper">
                                <Modal.Title>
                                    Report NFT
                                </Modal.Title>
                            </Modal.Header>
                            <Modal.Body className="row pt-2 pb-0">
                                <div className="container">
                                    <div className="row">
                                        {
                                            this.state.hasNftAlreadyReported ?
                                                <div className="col-12">
                                                    <div className="form-group text-center">
                                                        <span>You have already reported this NFT</span>
                                                    </div>
                                                </div> :
                                                <div className="col-12">
                                                    <div className="form-group ">
                                                        <label className="form-check-label mb-3">Report Description <span className='text-danger'>*</span></label>
                                                        <textarea className="form-control mb-2" name="reportDescription" value={this.state.reportDescription} onChange={(e) => this.setState({ reportDescription: e.target.value })} />
                                                        <span className="text-danger message">
                                                            {this.validator.message(
                                                                'reportDescription',
                                                                this.state.reportDescription,
                                                                'required',
                                                            )}
                                                        </span>
                                                    </div>
                                                </div>

                                        }
                                    </div>
                                </div>
                            </Modal.Body>
                            <Modal.Footer>
                                <button
                                    className="btn btn-danger"
                                    onClick={() => this.setState({ reportNftModal: !this.state.reportNftModal })}
                                >
                                    Close
                                </button>
                                {
                                    !this.state.hasNftAlreadyReported ?
                                        <button
                                            className="btn btn-filled transition"
                                            onClick={() => this.addReport()}
                                        >
                                            <span className="d-block transition">Report</span>
                                        </button> : null
                                }

                            </Modal.Footer>
                        </Modal>
                    </div>
                }
                {/* stake NFT modal */}
                {
                    stakeNftModal &&
                    <div className="modal-wrapper">
                        <Modal
                            centered
                            size="lg"
                            className="report-modal"
                            show={stakeNftModal}
                            onHide={this.closeStakeModal}
                        >
                            <Modal.Header className="text-center modal-title-wrapper">
                                <Modal.Title>
                                    Stake NFT
                                </Modal.Title>
                            </Modal.Header>
                            <Modal.Body className="row pt-2 pb-0">
                                <div className="container">
                                    {
                                        isSubmitted && errors && (
                                            <Modal.Body className="row pt-0 px-0">
                                                <div className="col-12">
                                                    <span id="nft-err" className="form-error-msg text-danger">
                                                        {errors}
                                                    </span>
                                                </div>
                                            </Modal.Body>
                                        )
                                    }
                                    <div className="d-flex justify-content-start nft-select flex-column flex-sm-row">
                                        <div className="stake-select">
                                            <select className="form-control stake-select-in" id="stakingCurrency" name="stakingCurrency" value={stakingCurrency} onChange={(e) => this.onTextualChange(e)} disabled={+true}>
                                                <option value={MYNTConfig.value}>{MYNTConfig.value}</option>
                                                {/* <option className="" value="">Select Currency</option>
                                                {
                                                    paymentTokens && paymentTokens.map((token, index) => {
                                                        return (
                                                            <option key={index} value={token}>{token}</option>
                                                        )
                                                    })
                                                } */}
                                            </select>
                                            <span className="text-danger message">
                                                {this.validator.message('stakingCurrency', stakingCurrency, 'required')}
                                            </span>
                                        </div>
                                        <div className="stake-ethereum-input">
                                            <input
                                                type="text"
                                                name="stakingPrice"
                                                placeholder="Amount"
                                                className="amount-btn flex-fill"
                                                style={{ borderRadius: "4px", }}
                                                onChange={(e) => this.onTextualChange(e)}
                                                onKeyDown={(e) => decimalNumberValidator(e)}
                                                value={stakingPrice}
                                                required
                                                disabled={nft.status === 2 ? +true : +false}
                                            />
                                            <div className="srv-validation-message d-flex justify-content-between align-items-center">
                                                <span className="text-danger message">
                                                    {this.validator.message('stakingPrice', stakingPrice, 'required')}
                                                </span>
                                                <div className="text-right dollar-wrapper text-white">
                                                    $ {
                                                        this.props.app.rateAuth && stakingCurrency === 'BNB' ?
                                                            ENV.convertBnbToUsd(stakingPrice, this.props.app.rate)
                                                            :
                                                            this.props.app.myntRateAuth && stakingCurrency === 'MYNT' ?
                                                                ENV.convertMyntToUsd(stakingPrice, this.props.app.myntRate)
                                                                : '0.00'
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-12">
                                            <div className="form-group">
                                                <label className="form-check-label mb-3">Staking Days (in number) <span className='text-danger'>*</span></label>
                                                <input type="text" className="mb-2" name="stakingDays" placeholder="No. of days for staking a NFT" onChange={(e) => this.onTextualChange(e)} value={stakingDays || ''} onKeyDown={(e) => integerNumberValidator(e)} />
                                                <span className="text-danger message">
                                                    {this.validator.message('stakingDays', stakingDays, 'required')}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Modal.Body>
                            <Modal.Footer>
                                <button className="btn btn-danger" onClick={this.closeStakeModal}>
                                    Close
                                </button>
                                <button className="btn btn-filled transition" onClick={() => this.stakeNFT()}>
                                    <span className="d-block transition">Stake</span>
                                </button>
                            </Modal.Footer>
                        </Modal>
                    </div>
                }
            </>
        )
    }
}

const mapStateToProps = (state) => ({
    nft: state.nft,
    error: state.error,
    offer: state.offer,
    bid: state.bid,
    app: state.app,
    nftHistory: state.nftHistory,
    nftReport: state.reports.getUserNftReportsRes,
    addNftReportRes: state.reports.addReportRes,
    getFavouritesRes: state.favourites.getFavouritesRes,
    addFavouriteRes: state.favourites.addTofavouriteRes,
    removeFavouriteRes: state.favourites.removeFavouriteRes,
    gamification: state.gamification
    // settings: state.settings
})

export default connect(mapStateToProps, {
    beforeNFT,
    getNFT,
    beforeOffer,
    makeOffer,
    getOffers,
    deleteOffer,
    beforeBid,
    placeBid,
    getBids,
    deleteBid,
    acceptOffer,
    acceptBid,
    beforeHistory,
    getHistory,
    refreshMetadata,
    beforeMetadata,
    beforeBuy,
    buyNFT,
    cancelListing,
    beforeListing,
    addReport,
    beforeReports,
    getUserNftReports,
    beforeUserNftReports,
    addToFavourite,
    removeFavourite,
    beforeFavourite,
    getUserFavourites,
    buyWithPayPal,
    upsertNFT,
    fetchFile,
    giftCardVerification,
    beforeVerifyDiscount,
    redeemedGiftCardLog,
    beforeStakingPercent,
    getStakingPercent
    // getSettings,
    // beforeSettings
})(ItemDetails)