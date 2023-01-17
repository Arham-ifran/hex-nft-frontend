import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import FullPageLoader from '../loaders/full-page-loader';
import Pagination from 'rc-pagination';
import localeInfo from 'rc-pagination/lib/locale/en_US';
import { Images } from '../../assets/asset';
import { ENV } from "../../config/config";
import Select from 'react-select';
import { useWindowSize } from '../../hooks/useWindowSize'
import { useSelector, useDispatch } from 'react-redux';
import { getGiftCards, beforeGiftCards } from '../gamification/gamifications.action';
const { cdnBaseUrl } = ENV
const GiftCards = (props) => {
    const dispatch = useDispatch()
    const gamification = useSelector((state) => state.gamification)
    const [loader, setLoader] = useState(true)
    const [vouchers, setVouchers] = useState([])
    const [pagination, setPagination] = useState({ page: 1, limit: 2, pages: 0, total: 0 })
    const [isTableHorizontal, setIsTableHorizontal] = useState(true)
    const { width } = useWindowSize() || {};

    useEffect(() => {
        if (width <= 1100) {
            setIsTableHorizontal(false);
        } else {
            setIsTableHorizontal(true);
        }
    }, [width]);

    useEffect(() => {
        window.scroll(0, 0)
        dispatch(getGiftCards())
    }, [])

    useEffect(() => {
        if (gamification.giftCardsAuth) {
            setLoader(false)
            let total = gamification.giftCardsList.length
            let limit = 2
            let pages = Math.ceil(total / limit) <= 0 ? 1 : Math.ceil(total / limit)
            let paginationData = {
                ...pagination,
                total, pages
            }
            setVouchers(gamification.giftCardsList)
            setPagination(paginationData)
            dispatch(beforeGiftCards())
        }
    }, [gamification.giftCardsAuth])

    return (
        <section className="activity-area load-more">
            {loader && <FullPageLoader />}
            <div className="container">
                {/* intro */}
                <div className="row justify-content-center">
                    <div className="col-12 col-md-8 col-lg-7">
                        <div className="intro text-center">
                            {/* <span>Rankings</span> */}
                            <h3 className="my-4">Gift Cards</h3>
                            <p>All vouchers to avail discount on your purchases</p>
                        </div>
                    </div>
                </div>
                {/* gift cards */}
                <div className="gift-items">
                    {
                        vouchers && vouchers.length ?
                            vouchers.map((item, index) =>
                                <div className="card-wrapper" >
                                    <div className="d-flex align-items-center">
                                        <div className="gift-bg">
                                            <img src={Images.siteLogo} className="img-fluid" alt="" />
                                        </div>
                                        <div className="discount-section">
                                            <div className="discount-image">
                                                <img src={Images.goldenBg} className="img-fluid" />
                                                <div className="discount-circle">
                                                    <span className="discount-percent">{item.price}<span className="discount-text">%</span></span>
                                                    <span className="discount-text">DISCOUNT</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="token-no">
                                            <span>{item.token}</span>
                                        </div>
                                        <div className="gift-content">
                                            <h2>{item.name}</h2>
                                            <p>{item.description}</p>
                                        </div>
                                    </div>
                                </div>
                            )
                            :
                            <div className="no-data border"><p className="text-center">No Gift Cards Available</p></div>
                    }
                </div>
            </div>
        </section>
    );
}

export default GiftCards;