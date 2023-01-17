import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { ENV } from './../../config/config';
import { getTopSellers, beforeUser } from './../user/user.action';
const { cdnBaseUrl } = ENV
const ProfileImg = `${cdnBaseUrl}v1652166289/hex-nft/assets/image-placeholder_qva6dx.png`;
const TopSeller = (props) => {
    const [pagination, setPagination] = useState(null)
    const [sellers, setSellers] = useState([])
    const [loadMoreBtn, setLoadMoreBtn] = useState(false)

    useEffect(() => {
        window.scroll(0, 0)
        // get top sellers
        getTopSellers()
    }, [])

    // set top sellers & pagination
    useEffect(() => {
        if (props.user.topSellersAuth) {
            const sellersData = props.user.sellers
            if (sellersData) {
                setSellers(sellers.concat(sellersData.sellers))
                setPagination(sellersData.pagination)
                props.beforeUser()
            }
        }
    }, [props.user.topSellersAuth])

    // handle show load more button state when pagination is set
    useEffect(() => {
        if (pagination)
            setLoadMoreBtn((sellers && pagination.total > 0 && pagination.total > sellers.length && sellers.length > 0))
    }, [pagination])

    const loadMore = () => {
        const { page } = pagination

        // get more sellers
        getTopSellers(page + 1)
    }

    const getTopSellers = (page = 1, limit = 12) => {
        let creatorQS = { page, limit }
        const qs = ENV.objectToQueryString(creatorQS)
        props.getTopSellers(qs)
    }

    return (
        <section className="top-seller-area aurthor-section-area">
            {/* {loader && <FullPageLoader />} */}
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <div className="intro d-flex justify-content-between align-items-end m-0">
                            <div className="intro text-center flex-fill">
                                <h3 className="my-4">Top Sellers</h3>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row items">
                    {
                        sellers && sellers.length ?
                            sellers.map((author, idx) => {
                                return (
                                    <div key={`ts_${idx}`} className="col-12 col-sm-6 col-lg-4 item">
                                        {/* Single Seller */}
                                        <div className="card no-hover">
                                            <div className="single-seller d-flex align-items-center">
                                                <Link to={`/author/${author._id}`}>
                                                    <img className="avatar-md rounded-border" src={author.profileImage ? author.profileImage : ProfileImg} alt="Top Seller Img" />
                                                </Link>
                                                {/* Seller Info */}
                                                <div className="seller-info ms-4">
                                                    <Link className="seller mb-2" to={`/author/${author._id}`}>@{author.username}</Link>
                                                    <span>{author.price}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            }) :
                            <div className="no-data border"><p className="text-center">Top Sellers Not Available</p></div>
                    }
                </div>
                {
                    loadMoreBtn &&
                    <div className="row">
                        <div className="col-12 text-center">
                            <a id="load-btn" className="btn btn-bordered-white mt-5" onClick={() => loadMore()}>Load More</a>
                        </div>
                    </div>
                }
            </div>
        </section>
    )
}

const mapStateToProps = state => ({
    user: state.user
});

export default connect(mapStateToProps, { beforeUser, getTopSellers })(TopSeller);