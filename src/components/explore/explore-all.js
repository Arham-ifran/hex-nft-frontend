import React, { useEffect, useState, useRef } from 'react';
import { connect } from 'react-redux';
import { beforeNFT, getNFTs } from '../nfts/nfts.action';
import { ENV } from '../../config/config';
import FullPageLoader from '../loaders/full-page-loader'
import BeatsLoader from '../loaders/beat-loader'
import { Link, useLocation } from 'react-router-dom';
import FilterSearch from "../filter-search/filtersearch";
import { ipfsToUrl } from '../../utils/functions';
import Tilt from 'react-tilt';
import { Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart, faC, faD } from '@fortawesome/free-solid-svg-icons'
import { addToFavourite, removeFavourite, beforeFavourite } from '../my-favourites/favourites.action';
import ReactTooltip from 'react-tooltip'
import { toast } from 'react-toastify';
const { cdnBaseUrl } = ENV

const userId = ENV.getUserKeys()?._id
const initData = {
    pre_heading: "Explore",
    heading: "Exclusive Digital Assets",
    content: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Laborum obcaecati dignissimos quae quo ad iste ipsum officiis.",
    btn_1: "Load More"
}

function ExploreAll(props) {
    const [nftPagination, setNFTPagination] = useState(null);
    const [nfts, setNFTs] = useState([]); // NFTs for explore section
    const [loader, setLoader] = useState(true);
    const [loadMoreBtn, setLoadMoreBtn] = useState(false);
    const [isMoreClicked, setLoadMore] = useState(false); // flag to check if load more button clicked
    const [intro, setIntro] = useState(false);
    const [searchAndFilters, setSearchAndFilters] = useState(false);
    const [nftFilter, setNftFitler] = useState(null);
    const [disable, setDisable] = useState(false)
    const { pathname } = useLocation();
    const [Filter, setFilter] = useState(false);  // flag for responsive view only
    const favouriteRefs = useRef([]);
    const favouriteColorRefs = useRef([]);
    let beatLoaders = useRef([])

    useEffect(() => {
        if (nfts && nfts.length) {
            favouriteRefs.current = favouriteRefs.current.slice(0, nfts.length);
            favouriteColorRefs.current = favouriteColorRefs.current.slice(0, nfts.length);
            let loaderArray = []
            for (let i = 0; i < nfts.length; i++) {
                loaderArray.push(false)
            }
            beatLoaders.current = loaderArray
        }
    }, [nfts]);

    useEffect(() => {
        toast.dismiss()
        window.scroll(0, 0)
        // set intro section
        if (pathname === '/explore-all') {
            setIntro(true)
            setSearchAndFilters(true)
        }

        // get NFTs for explore section
        getNFTs()
    }, [])

    // set NFTs for explore section
    useEffect(() => {
        if (props.nft.nftsAuth) {
            const { nftsData } = props.nft
            if (nftsData) {
                setNFTs(isMoreClicked ? nfts.concat(nftsData.nfts) : nftsData.nfts)
                setNFTPagination(nftsData.pagination)
                if (nftsData.nfts?.length) {
                    setLoadMoreBtn(true)
                }
                if (nftsData.pagination && nftsData.pagination.page === nftsData.pagination.pages) {
                    setLoadMoreBtn(false)
                    if (props.setCollectedNfts) {
                        props.setCollectedNfts(nftsData.pagination.total)
                        props.setCreatedNfts(nftsData.createdNfts)
                    } else if (props.setCreatedNfts)
                        props.setCreatedNfts(nftsData.pagination.total)
                }
                props.beforeNFT()
                setLoader(false)
                setLoadMore(false)
                if (props.setLoader)
                    props.setLoader(false)
            }
        }
    }, [props.nft.nftsAuth])

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
        const { page } = nftPagination
        setLoader(true)
        setLoadMore(true)
        // get more NFTs for explore section
        getNFTs(page + 1, 40, nftFilter)
    }

    const getNFTs = (page = 1, limit = 40, filter = null) => {
        let nftQS = { page, limit, explore: true }

        if (filter)
            nftQS = { ...nftQS, ...filter }

        if (props.collectionId)
            nftQS.collectionId = props.collectionId

        if (props.authorId)
            nftQS.authorId = props.authorId

        if (props.creatorId)
            nftQS.creatorId = props.creatorId

        if (props.ownerId)
            nftQS.ownerId = props.ownerId

        if (props.collectorId)
            nftQS.collectorId = props.collectorId

        if (userId) {
            nftQS.userId = userId
        }

        const qs = ENV.objectToQueryString(nftQS)
        props.getNFTs(qs)
    }

    // apply search & filters
    useEffect(() => {
        if (props.filter)
            applyFilters(props.filter)
    }, [props.filter])

    const applyFilters = (filter) => {
        if (filter) {
            setLoader(true)
            setNftFitler(filter)
            getNFTs(1, 40, filter)
        }
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
        <section className="explore-area p-0">
            {loader && <FullPageLoader />}
            <div className="container-fluid">
                <Row>
                    <Col md={12} className="ps-0">
                        <div className={`${Filter ? 'active' : ''} d-flex collection-wrapper`}>
                            {
                                (!props.hideFilters) &&
                                <>
                                    <button className="side-toggle-btn" onClick={() => setFilter(!Filter)}><i className="fas fa-sort-amount-down-alt" /></button>
                                    {
                                        searchAndFilters &&
                                        <div className="search-filters">
                                            <FilterSearch applyFilters={applyFilters} showColFilters={true} showCatFilters={true} showAuthorFilters={true} />
                                        </div>
                                    }
                                </>
                            }
                            <div className="nfts-collection-wrapper w-100">
                                <div className="items explore-items">
                                    <div className="nft-collection d-flex align-items-center flex-wrap">
                                        {nfts && nfts.length > 0 ?
                                            nfts.map((item, idx) => {
                                                return (
                                                    <div key={`edth_${idx}`} className="card">
                                                        <ReactTooltip />

                                                        <div className="image-over">
                                                            <Tilt className="Tilt" options={{ max: 10 }} >
                                                                <Link to={`/item-details/${window.btoa(item._id)}`}>
                                                                    {
                                                                        item.type === 2 ?
                                                                            <>
                                                                                {
                                                                                    item.isStaked ?
                                                                                        <img className="card-img-top cd-scale" src={ipfsToUrl(item.image)} alt={item.name} />
                                                                                        :
                                                                                        <img className="card-img-top c-scale" src={ipfsToUrl(item.image)} alt={item.name} />
                                                                                }
                                                                            </>
                                                                            :
                                                                            item.isStaked ? 
                                                                            <img className="card-img-top d-scale" src={ipfsToUrl(item.image)} alt={item.name} />
                                                                            :
                                                                            <img className="card-img-top" src={ipfsToUrl(item.image)} alt={item.name} />
                                                                    }
                                                                </Link>
                                                            </Tilt>
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

                                                        <div className="card-caption col-12">
                                                            <div className="card-body">
                                                                <Link to={`/item-details/${window.btoa(item._id)}`}>
                                                                    <h5 className="mb-0">{item.name}</h5>
                                                                </Link>
                                                                <div className="seller d-flex align-items-center justify-content-between">
                                                                    <span className="card-owner">Owned By</span>
                                                                    <Link style={{ textAlign: 'right' }} to={`/author/${item.owner?._id}`}>
                                                                        <h6 className="mb-0" data-effect="float" data-tip={item.owner?.username}>{item.owner?.username}</h6>
                                                                    </Link>
                                                                </div>
                                                                <div className="card-bottom">
                                                                    <span>{item.currentPrice} {item.currency}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="card-footer d-flex justify-content-between align-items-center">
                                                            <div className="buy-button w-50">
                                                                {
                                                                    item.sellingMethod === 1 && item.status === 2 &&
                                                                    <Link to={`/item-details/${window.btoa(item._id)}`} className="buy-btn">Buy Now</Link>
                                                                }
                                                            </div>
                                                            <div style={{ pointerEvents: disable ? 'none' : '' }} className="like-count d-flex justify-content-end align-items-center w-50">
                                                                <span id={`favourite-check-${idx}`} ref={el => favouriteColorRefs.current[idx] = el} style={{ color: item.userFavourite?.length ? 'red' : 'white' }} onClick={() => addRemovefavourites(item, idx)} className="cursor-pointer">
                                                                    {beatLoaders.current && beatLoaders.current[idx] ? <BeatsLoader /> : <FontAwesomeIcon icon={faHeart} />}
                                                                </span>
                                                                <span id={`fav-likes-${idx}`} style={{ display: beatLoaders.current && beatLoaders.current[idx] ? 'none' : 'block' }} className="text-white ms-2" ref={el => favouriteRefs.current[idx] = el}>{item.favourite ? item.favourite.length : ''}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                            : <div className="no-data border"><p className="text-center">No Items Found to Explore</p></div>
                                        }
                                    </div>
                                </div>
                                {
                                    loadMoreBtn ?
                                        <div className="row">
                                            <div className="col-12 text-center mb-3">
                                                <a id="load-btn" className="btn btn-filled no-border transition mt-4" onClick={() => loadMore()}>
                                                    <span className="d-block transition">{initData.btn_1}</span>
                                                </a>
                                            </div>
                                        </div>
                                        : ''
                                }
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        </section>
    )
}

const mapStateToProps = state => ({
    nft: state.nft,
    addFavouriteRes: state.favourites.addTofavouriteRes,
    removeFavouriteRes: state.favourites.removeFavouriteRes
});

export default connect(mapStateToProps, { beforeNFT, getNFTs, addToFavourite, removeFavourite, beforeFavourite })(ExploreAll);