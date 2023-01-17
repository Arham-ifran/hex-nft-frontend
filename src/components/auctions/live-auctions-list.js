import React, { useState, useEffect, useRef } from 'react';
import FullPageLoader from '../../components/loaders/full-page-loader';
import BeatsLoader from '../../components/loaders/beat-loader';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { beforeAuction, getLiveAuctions } from './auctions.action';
import { ENV } from '../../config/config';
import Countdown from 'react-countdown';
import ReactTooltip from 'react-tooltip'
import { ipfsToUrl } from "../../utils/functions";
import Tilt from 'react-tilt';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart, faC, faD } from '@fortawesome/free-solid-svg-icons'
import { addToFavourite, removeFavourite, beforeFavourite } from '../my-favourites/favourites.action';
import { toast } from 'react-toastify';

const { countDownRenderer, globalPlaceholderImage } = ENV

const initData = {
    pre_heading: "Auctions",
    heading: "Live Auctions",
    content: "NFT art is sold, and buyers can purchase it using cryptocurrency such as BNB or MYNT",
    btn_1: "Load More"
}

const LiveAuctions = (props) => {
    const [pagination, setPagination] = useState(null);
    const [auctions, setAuctions] = useState(null)
    const [loader, setLoader] = useState(true) // auctions loader
    const [loadMoreBtn, setLoadMoreBtn] = useState(false);
    const [change, setChange] = useState(false);
    const [disable, setDisable] = useState(false)
    const favouriteRefs = useRef([]);
    const favouriteColorRefs = useRef([]);
    const userId = ENV.getUserKeys()?._id
    let beatLoaders = useRef([])

    useEffect(() => {
        if (auctions && auctions.length) {
            favouriteRefs.current = favouriteRefs.current.slice(0, auctions.length);
            favouriteColorRefs.current = favouriteColorRefs.current.slice(0, auctions.length);
            let loaderArray = []
            for (let i = 0; i < auctions.length; i++) {
                loaderArray.push(false)
            }
            beatLoaders.current = loaderArray
        }
    }, [auctions]);

    useEffect(() => {
        window.scroll(0, 0)

        // get live auctions
        getLiveAuctions()
        setChange(prevState => !prevState)
    }, [])

    // set live auctions
    useEffect(() => {
        if (props.auction.getAuth) {
            const { auctions, pagination } = props.auction
            if (auctions) {
                setAuctions(auctions)
                setPagination(pagination)
                props.beforeAuction()
                setLoader(false)
            }
        }
    }, [props.auction.getAuth, change])

    // handle show load more button state when pagination is set
    useEffect(() => {
        if (pagination)
            setLoadMoreBtn((pagination.total > 0 && pagination.total > auctions.length && auctions.length > 0))
    }, [pagination])

    useEffect(() => {
        if (props.addFavouriteRes && Object.keys(props.addFavouriteRes).length > 0) {

            let refIndex = props.addFavouriteRes.refIndex
            beatLoaders.current[refIndex] = false

            if (!props.addFavouriteRes.alreadyInFavourites) {
                props.beforeFavourite()
                setDisable(false)
                let totalLikesValue = parseInt(favouriteRefs.current[refIndex].innerHTML)
                let likeColorRef = favouriteColorRefs.current[refIndex]
                likeColorRef.style.color = 'red'
                totalLikesValue = totalLikesValue + 1
                favouriteRefs.current[refIndex].innerHTML = totalLikesValue
            }
            else {
                setDisable(false)
                toast.error('This item is already in your Favourites list', 'already-in-fav-list')
            }
        }
    }, [props.addFavouriteRes])

    useEffect(() => {
        if (props.removeFavouriteRes && Object.keys(props.removeFavouriteRes).length > 0) {

            let refIndex = props.removeFavouriteRes.refIndex
            beatLoaders.current[refIndex] = false

            if (!props.removeFavouriteRes.alreadyRemovedFromFavourites) {
                props.beforeFavourite()
                setDisable(false)
                let totalLikesValue = parseInt(favouriteRefs.current[refIndex].innerHTML)
                let likeColorRef = favouriteColorRefs.current[refIndex]
                likeColorRef.style.color = 'white'
                totalLikesValue = totalLikesValue - 1
                favouriteRefs.current[refIndex].innerHTML = totalLikesValue < 0 ? 0 : totalLikesValue
            }
            else {
                setDisable(false)
                toast.error('You have already removed this item from your Favourites list', 'already-out-fav-list')
            }
        }
    }, [props.removeFavouriteRes])

    const loadMore = () => {
        const { page, limit } = pagination
        setLoader(true)

        // get more live auctions
        getLiveAuctions(1, limit * (page + 1))
    }

    const getLiveAuctions = (page = 1, limit = 12) => {
        const qs = ENV.objectToQueryString({ page, limit })
        props.getLiveAuctions(qs)
    }

    const addRemovefavourites = (nftItem, index) => {
        if (userId) {
            let likeColor = favouriteColorRefs.current[index].style.color
            beatLoaders.current[index] = true

            setDisable(true)
            if (likeColor === 'red') {
                props.removeFavourite({ userId, nftId: nftItem._id, refIndex: index })
            }
            else if (likeColor === 'white') {
                props.addToFavourite({ userId, nftId: nftItem._id, refIndex: index })
            }
        }
    }

    return (
        <section className="live-auctions-area load-more">
            {
                loader ?
                    <FullPageLoader /> :
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-12 col-md-8 col-lg-7">
                                {/* Intro */}
                                <div className="intro text-center">
                                    <h3 className="my-4">{initData.heading}</h3>
                                    <p>{initData.content}</p>
                                </div>
                            </div>
                        </div>
                        <div className="items">
                            <div className="d-flex align-items-center flex-wrap live-auctions-wrapper" >
                                {props.auction.auctions && props.auction.auctions.length > 0 ?
                                    props.auction.auctions.map((item, idx) => {
                                        return (
                                            <div key={`auc_${idx}`} id={`#auc-${idx}`} className="card">
                                                <div className="image-over">
                                                    <Tilt className="Tilt" options={{ max: 10 }} >
                                                        <Link to={`/item-details/${window.btoa(item._id)}`}>
                                                            <img className="card-img-top" src={ipfsToUrl(item.image)} alt={item.name} />
                                                        </Link>
                                                    </Tilt>
                                                    <div className="seller d-flex align-items-center justify-content-between">
                                                        <span>Owned By</span>
                                                        <Link style={{ textAlign: 'right' }} to={`/author/${item.owner._id}`}>
                                                            <h6 className="mb-0" data-effect="float" data-tip={item.owner.username}>{item.owner.username}</h6>
                                                        </Link>
                                                    </div>
                                                    {
                                                        item.type === 2 ?
                                                            <>
                                                                {
                                                                    item.isStaked ?
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
                                                            item.isStaked &&
                                                            <span className="commission-icon-d cursor-pointer" data-tip="NFTD">
                                                                <FontAwesomeIcon icon={faD} className="commission-in" />
                                                            </span>
                                                    }
                                                </div>

                                                <ReactTooltip />

                                                <div className="card-caption col-12">
                                                    <div className="card-body">
                                                        <div className="mb-2">
                                                            <Countdown
                                                                date={Date.parse(item.auctionEndDate) + 10000}
                                                                renderer={countDownRenderer}
                                                            />
                                                        </div>
                                                        <Link to={`/item-details/${window.btoa(item._id)}`}>
                                                            <h5 className="mb-3">{item.name}</h5>
                                                        </Link>
                                                        <div className="seller d-flex align-items-center justify-content-between">
                                                            <span>Owned By</span>
                                                            <Link style={{ textAlign: 'right' }} to={`/author/${item.owner._id}`}>
                                                                <h6 className="mb-0" data-effect="float" data-tip={item.owner.username}>{item.owner.username}</h6>
                                                            </Link>
                                                        </div>
                                                        <div className="card-bottom">
                                                            <span className="nft-price">{item.currentPrice} {item.currency}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="card-footer d-flex justify-content-end align-items-center">
                                                    <div style={{ pointerEvents: disable ? 'none' : 'auto' }} className="like-count d-flex justify-content-end align-items-center w-50">
                                                        <span id={`favourite-check-${idx}`} ref={el => favouriteColorRefs.current[idx] = el} style={{ color: item.userFavourite?.length ? 'red' : 'white' }} onClick={() => addRemovefavourites(item, idx)} className="cursor-pointer" >
                                                            {beatLoaders.current && beatLoaders.current[idx] ? <BeatsLoader /> : <FontAwesomeIcon icon={faHeart} />}
                                                        </span>
                                                        <span id={`fav-likes-${idx}`} style={{ display: beatLoaders.current && beatLoaders.current[idx] ? 'none' : 'block' }} className="text-white ms-2" ref={el => favouriteRefs.current[idx] = el}  >{item.favourite ? item.favourite.length : ''}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                    : <div className="no-data border"><p className="text-center ml-3">No Live Auctions Found</p></div>
                                }
                            </div>
                        </div>
                        {
                            loadMoreBtn &&
                            <div className="row">
                                <div className="col-12 text-center">
                                    <a id="load-btn" className="btn btn-bordered-white mt-5" onClick={() => loadMore()}>{initData.btn_1}</a>
                                </div>
                            </div>
                        }
                    </div>
            }
        </section>
    );
}

const mapStateToProps = state => ({
    auction: state.auction,
    error: state.error,
    addFavouriteRes: state.favourites.addTofavouriteRes,
    removeFavouriteRes: state.favourites.removeFavouriteRes
});

export default connect(mapStateToProps, { beforeAuction, getLiveAuctions, addToFavourite, removeFavourite, beforeFavourite })(LiveAuctions);