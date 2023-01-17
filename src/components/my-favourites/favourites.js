import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ENV } from '../../config/config';
import ReactTooltip from 'react-tooltip'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart, faC, faD } from '@fortawesome/free-solid-svg-icons'
import { getUserFavourites, removeFavourite, beforeFavourite } from './favourites.action';
import { ipfsToUrl } from '../../utils/functions'
import FullPageLoader from '../loaders/full-page-loader';
import Tilt from 'react-tilt';

const Favourites = () => {
    const dispatch = useDispatch()
    const favouritesRes = useSelector(state => state.favourites)
    const removeFavouriteRes = useSelector(state => state.favourites.removeFavouriteRes)
    const [loader, setLoader] = useState(true)
    const [favourites, setFavourites] = useState(null)
    const [loadMoreBtn, setLoadMoreBtn] = useState(false);
    const [pagination, setPagination] = useState(null);
    const [isMoreClicked, setMoreClicked] = useState(false); // flag to check if load more button clicked

    const userId = ENV.getUserKeys()?._id

    useEffect(() => {
        window.scroll(0, 0)
        dispatch(getUserFavourites(userId))
    }, [])

    useEffect(() => {
        if (favouritesRes.getFavouritesAuth && Object.keys(favouritesRes.getFavouritesRes).length > 0) {
            let data = favouritesRes.getFavouritesRes.favourites
            setFavourites(isMoreClicked ? favourites.concat(data) : data)
            let pagination = favouritesRes.getFavouritesRes.pagination
            setPagination(pagination)
            if (data?.length) {
                setLoadMoreBtn(true)
            }
            if (pagination && pagination.page === pagination.pages) {
                setLoadMoreBtn(false)
            }
            setLoader(false)
            setMoreClicked(false)
            dispatch(beforeFavourite())
        }

    }, [favouritesRes.getFavouritesAuth])

    useEffect(() => {
        if (removeFavouriteRes && removeFavouriteRes.success) {
            dispatch(getUserFavourites(userId))
        }

    }, [removeFavouriteRes])

    const loadMore = () => {
        const { page, limit } = pagination
        setMoreClicked(true)
        dispatch(getUserFavourites(userId, null, page + 1, limit))
    }

    const removeFromFavourites = (item) => {
        dispatch(removeFavourite({ userId: userId, nftId: item.nft._id }))
        setLoader(true)

    }




    return (
        loader ? <FullPageLoader /> :
            <div className=" favourite-section">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-12 col-md-8 col-lg-7">
                            <div className="intro text-center">
                                <h3 className="my-4">Favourite NFTs</h3>
                                <p>The Favourite NFTs on {ENV.appName}</p>
                            </div>
                        </div>
                    </div>
                    <div className={`items ${!favourites && 'justify-content-center'}`}>
                        <>
                            <div className="favourite-collection d-flex align-items-center flex-wrap">
                                {
                                    favourites && favourites.length ?
                                        favourites.map((item, idx) => {
                                            return (
                                                <div key={`cd_${idx}`} className="card">
                                                    <ReactTooltip />
                                                    <div className="image-over">
                                                        <Tilt className="Tilt" options={{ max: 10 }} >
                                                            <Link to={`/item-details/${window.btoa(item.nft._id)}`}>
                                                                {
                                                                    item.nft.type === 2 ?
                                                                        <>
                                                                            {
                                                                                item.nft.isStaked ?
                                                                                    <img className="card-img-top cd-scale" src={ipfsToUrl(item.nft.image)} alt={item.nft.name} />
                                                                                    :
                                                                                    <img className="card-img-top c-scale" src={ipfsToUrl(item.nft.image)} alt={item.nft.name} />
                                                                            }
                                                                        </>
                                                                        :
                                                                        item.nft.isStaked ?
                                                                            <img className="card-img-top d-scale" src={ipfsToUrl(item.nft.image)} alt={item.nft.name} />
                                                                            :
                                                                            <img className="card-img-top" src={ipfsToUrl(item.nft.image)} alt={item.nft.name} />
                                                                }
                                                            </Link>
                                                        </Tilt>
                                                        {
                                                            item.nft.type === 2 ?
                                                                <>
                                                                    {
                                                                        item.nft.isStaked ?
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
                                                                item.nft.isStaked &&
                                                                <span className="commission-icon-d cursor-pointer" data-tip="NFTD">
                                                                    <FontAwesomeIcon icon={faD} className="commission-in" />
                                                                </span>
                                                        }
                                                    </div>
                                                    <div className="card-caption col-12">
                                                        <div className="card-body">
                                                            <Link to={`/item-details/${window.btoa(item.nft._id)}`}>
                                                                <h5 className="mb-2">{item.nft.name}</h5>
                                                            </Link>
                                                            <div className="seller d-flex align-items-center justify-content-between">
                                                                <span>Owned By</span>
                                                                <Link style={{ textAlign: 'right' }} to={`/author/${item.nft.owner._id}`}>
                                                                    <h6 className="mb-0" data-effect="float" data-tip={item.nft.owner.username}>{item.nft.owner.username}</h6>
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
                                                        <div className="like-count d-flex justify-content-end align-items-center w-50">
                                                            <span onClick={() => removeFromFavourites(item)} className='text-red cursor-pointer' ><FontAwesomeIcon icon={faHeart} /></span>
                                                            &nbsp;<span className="text-white">{item.totalLikes.length}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                        :
                                        <div className="col-12">
                                            <div className="no-data border mb-4"><p className="text-center">No Favourite Items</p></div>
                                        </div>

                                }
                            </div>
                        </>
                    </div>
                    {loadMoreBtn /* && !props.all */ ?
                        <div className="row">
                            <div className="col-12 text-center mb-4">
                                <a id="load-btn" className="btn btn-filled transition no-border mt-4" onClick={() => loadMore()}><span className="d-block transition">Load More</span></a>
                            </div>
                        </div>
                        : ''
                    }
                </div>
            </div>
    );
}


export default Favourites