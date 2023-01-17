import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { getCreators, beforeUser } from './../user/user.action';
import { ENV } from './../../config/config';
import FullPageLoader from '../loaders/full-page-loader'
import ReactTooltip from 'react-tooltip'
import Tilt from 'react-tilt';
const { cdnBaseUrl } = ENV
const ProfileImg = `${cdnBaseUrl}v1652166289/hex-nft/assets/image-placeholder_qva6dx.png`;
const Authors = (props) => {
    const [pagination, setPagination] = useState(null)
    const [creators, setCreators] = useState([])
    const [loader, setLoader] = useState(true)
    const [loadMoreBtn, setLoadMoreBtn] = useState(false)

    useEffect(() => {
        window.scroll(0, 0)
        // get creators
        getCreators()
    }, [])

    // set creators & pagination
    useEffect(() => {
        if (props.user.creatorsAuth) {
            const creatorsData = props.user.creators
            if (creatorsData) {
                setCreators(creators.concat(creatorsData.creators))
                setPagination(creatorsData.pagination)
                props.beforeUser()
                setLoader(false)
            }
        }
    }, [props.user.creatorsAuth])

    // handle show load more button state when pagination is set
    useEffect(() => {
        if (pagination)
            setLoadMoreBtn((creators && pagination.total > 0 && pagination.total > creators.length && creators.length > 0))
    }, [pagination])

    const loadMore = () => {
        const { page } = pagination
        setLoader(true)

        // get more creators
        getCreators(page + 1)
    }

    const getCreators = (page = 1, limit = 12) => {
        let creatorQS = { page, limit }
        const qs = ENV.objectToQueryString(creatorQS)
        props.getCreators(qs)
    }

    return (
        <section className="popular-collections-area aurthor-section-area">
            {loader && <FullPageLoader />}
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-12 col-md-8 col-lg-7">
                        {/* Intro */}
                        <div className="intro text-center">
                            <h3 className="my-4">Our Creators</h3>
                        </div>
                    </div>
                </div>
                <div className="items">
                    <div className="d-flex align-items-center flex-wrap collection-card-wrapper">
                        {
                            creators && creators.length ?
                                creators.map((author, key) => {
                                    return (
                                        <div key={`author_${key}`} className="card no-hover text-center our-creator-card">
                                            <div className="image-over creator-image-over">
                                                <Tilt className="Tilt" options={{ max: 10 }} >
                                                    <Link to={`/author/${author._id}`}>
                                                        <img className="card-img-top" src={author.profileImage ? author.profileImage : ProfileImg} alt="Author profile" />
                                                    </Link>
                                                </Tilt>
                                            </div>
                                            <div className="card-caption col-12 p-0">
                                                <div className="card-body mt-3 pt-0">
                                                    <Link to={`/author/${author._id}`}>
                                                        <h5>{author.username ? author.username : author.address} </h5>
                                                    </Link>
                                                    <div className="social-icons d-flex justify-content-center my-3">
                                                        {
                                                            author.facebookLink && <a className="facebook" href={author.facebookLink} target="_blank" rel="noreferrer" data-effect="float" data-tip="Facebook">
                                                                <i className="fab fa-facebook-f" />
                                                            </a>
                                                        }
                                                        {
                                                            author.twitterLink && <a className="twitter" href={author.twitterLink} target="_blank" rel="noreferrer" data-effect="float" data-tip="Twitter">
                                                                <i className="fab fa-twitter" />
                                                            </a>
                                                        }
                                                        {
                                                            author.gPlusLink && <a className="google-plus" href={author.gPlusLink} target="_blank" rel="noreferrer" data-effect="float" data-tip="Google Plus">
                                                                <i className="fab fa-google-plus-g" />
                                                            </a>
                                                        }
                                                        {
                                                            author.vineLink && <a className="vine" href={author.vineLink} target="_blank" rel="noreferrer" data-effect="float" data-tip="Vine">
                                                                <i className="fab fa-vine" />
                                                            </a>
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                                :
                                <div className="no-data border"><p className="text-center">No Creators Found</p></div>
                        }
                    </div>
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
            <ReactTooltip />
        </section>
    );
}

const mapStateToProps = state => ({
    user: state.user
});

export default connect(mapStateToProps, { beforeUser, getCreators })(Authors);