import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { beforeActivity, getActivities } from './activity.action'
import FullPageLoader from '../loaders/full-page-loader'
import moment from 'moment';
import InfiniteScroll from 'react-infinite-scroll-component';
import { ENV } from "../../config/config";
import { ipfsToUrl } from '../../utils/functions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faC, faD } from '@fortawesome/free-solid-svg-icons'
import ReactTooltip from 'react-tooltip'
const { globalPlaceholderImage } = ENV

const Activity = (props) => {

    const [activity, setActivity] = useState([])
    const [loader, setLoader] = useState(true)
    const [page, setPage] = useState(2)
    const [moreCheck, setMoreCheck] = useState(true)
    const [type, setType] = useState(null)
    const [searchVal, setSearchVal] = useState('')

    useEffect(() => {
        window.scroll(0, 0)
    }, [])

    useEffect(() => {
        if (props.activities.activitiesAuth) {
            const { activities } = props.activities.activities
            if (activities.length) {
                setActivity([...activity, ...activities])
            }
            else {
                setMoreCheck(false)
            }
            props.beforeActivity()
        }
    }, [props.activities.activitiesAuth])

    useEffect(() => {
        if (activity) {
            setLoader(false)
        }
    }, [activity])

    useEffect(() => {
        setLoader(true)
        setActivity([])
        setMoreCheck(true)
        setPage(2)
        props.getActivities(type);
    }, [type])

    const fetchData = () => {
        let qs
        if (searchVal)
            qs = ENV.objectToQueryString({ page, search: window.btoa(searchVal) })
        else
            qs = ENV.objectToQueryString({ page, search: window.btoa(searchVal) })
        props.getActivities(type, qs)
        setPage(page + 1)
    }

    const search = (e) => {
        e.preventDefault()
        if (e.target[0].value) {
            setLoader(true)
            setActivity([])
            setMoreCheck(true)
            const qs = ENV.objectToQueryString({ page, search: window.btoa(e.target[0].value) })
            props.getActivities(type, qs)
            setPage(page + 1)
        }
        else if (e.target[0].value === '') {
            setLoader(true)
            setActivity([])
            props.getActivities()
        }
    }

    return (
        loader ?
            <FullPageLoader />
            :
            <section className="activity-area load-more">
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <div className="intro mb-4">
                                <div className="intro-content">
                                    <h3 className="my-4">{"List Of Activities"}</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row items">
                        <div className="col-12 col-lg-8 p-2 p-sm-3 order-2 order-lg-1">
                            <ul className="netstorm-tab nav nav-tabs" id="nav-tab">
                                <li onClick={() => { setType(null); setSearchVal(''); }}>
                                    <Link to="#" className={!type ? `active` : ''} data-toggle="pill">
                                        <h5 className="m-0">{"All"}</h5>
                                    </Link>
                                </li>
                                <li onClick={() => { setType(1); setSearchVal(''); }}>
                                    <Link to="#" className={type === 1 ? `active` : ''} data-toggle="pill">
                                        <h5 className="m-0">{"Created"}</h5>
                                    </Link>
                                </li>
                                <li onClick={() => { setType(6); setSearchVal(''); }}>
                                    <Link to="#" className={type === 6 ? `active` : ''} data-toggle="pill">
                                        <h5 className="m-0">{"Listings"}</h5>
                                    </Link>
                                </li>
                                <li onClick={() => { setType(2); setSearchVal(''); }}>
                                    <Link to="#" className={type === 2 ? `active` : ''} data-toggle="pill">
                                        <h5 className="m-0">{"Offers"}</h5>
                                    </Link>
                                </li>
                                <li onClick={() => { setType(3); setSearchVal(''); }}>
                                    <Link to="#" className={type === 3 ? `active` : ''} data-toggle="pill">
                                        <h5 className="m-0">{"Bids"}</h5>
                                    </Link>
                                </li>
                                <li onClick={() => { setType('t'); setSearchVal(''); }}>
                                    <Link to="#" className={type === 't' ? `active` : ''} data-toggle="pill">
                                        <h5 className="m-0">{"Transfers"}</h5>
                                    </Link>
                                </li>
                                <li onClick={() => { setType(8); setSearchVal(''); }}>
                                    <Link to="#" className={type === 8 ? `active` : ''} data-toggle="pill">
                                        <h5 className="m-0">{"Stakes"}</h5>
                                    </Link>
                                </li>
                            </ul>
                            {/* Tab Content */}
                            <div className="tab-content" id="nav-tabContent">
                                <div className="tab-pane fade show active" id="nav-home">
                                    <ul className="list-unstyled">
                                        {/* Single Tab List */}
                                        <InfiniteScroll
                                            dataLength={activity.length} //This is important field to render the next data
                                            next={fetchData}
                                            hasMore={moreCheck}
                                            loader={<h4>Loading...</h4>}
                                        >
                                            {
                                                activity && activity.length ? activity.map((item, idx) => {
                                                    return (
                                                        <li key={`ato_${idx}`} className="single-tab-list d-flex flex-column flex-sm-row">
                                                            <div className="position-relative activity-logo-section">
                                                                <Link to={`/item-details/${window.btoa(item.nft._id)}`}>
                                                                    {
                                                                        item.nft.type === 2 ?
                                                                            <>
                                                                                {
                                                                                    item.nft.isStaked ?
                                                                                        <img className="avatar-lg cd-scale" src={item.nft && item.nft.image ? ipfsToUrl(item.nft.image) : globalPlaceholderImage} alt={`activity_nft_${idx}`} />
                                                                                        :
                                                                                        <img className="avatar-lg c-scale" src={item.nft && item.nft.image ? ipfsToUrl(item.nft.image) : globalPlaceholderImage} alt={`activity_nft_${idx}`} />
                                                                                }
                                                                            </>
                                                                            :
                                                                            item.nft.isStaked ?
                                                                                <img className="avatar-lg d-scale" src={item.nft && item.nft.image ? ipfsToUrl(item.nft.image) : globalPlaceholderImage} alt={`activity_nft_${idx}`} />
                                                                                :
                                                                                <img className="avatar-lg" src={item.nft && item.nft.image ? ipfsToUrl(item.nft.image) : globalPlaceholderImage} alt={`activity_nft_${idx}`} />
                                                                    }
                                                                </Link>
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
                                                            <ReactTooltip />
                                                            {/* Activity Content */}
                                                            <div className="activity-content ms-4">
                                                                <Link to={`/item-details/${window.btoa(item.nft._id)}`}>
                                                                    <h5 className="mt-0 mb-2">{item.nft.name}</h5>
                                                                </Link>
                                                                {
                                                                    item.type === 1 ?
                                                                        (
                                                                            item.nft.type === 1 ?
                                                                                <p className="m-0">NFT created {moment(item.createdAt).fromNow()} by <Link to={`/author/${item.user._id}`} className="d-inline">{item.user.username}</Link></p>
                                                                                :
                                                                                item.nft.type === 2 ?
                                                                                    <p className="m-0">NFTC created {moment(item.createdAt).fromNow()} for <Link to={`/author/${item.user._id}`} className="d-inline">{item.user.username}</Link></p>
                                                                                    :
                                                                                    ''
                                                                        )
                                                                        :
                                                                        item.type === 2 ? <p className="m-0">Offer made {moment(item.createdAt).fromNow()} by <Link to={`/author/${item.user._id}`} className="d-inline">{item.user.username}</Link>{item.price ? ", " : ''} {item.price ? "having price " : ''}<strong>{item.price ? item.price : ''}{item.price ? ' ' + item.currency : ''}</strong></p> :
                                                                            item.type === 3 ? <p className="m-0">Bid placed {moment(item.createdAt).fromNow()} by <Link to={`/author/${item.user._id}`} className="d-inline">{item.user.username}</Link>{item.price ? ", " : ''} {item.price ? "having price " : ''}<strong>{item.price ? item.price : ''}{item.price ? ' ' + item.currency : ''}</strong></p> :
                                                                                item.type === 4 ? <p className="m-0">Item transferred {moment(item.createdAt).fromNow()} from <Link to={`/author/${item.user._id}`} className="d-inline-block align-top">{item.user.username}</Link> to <Link className="d-inline-block align-top" to={item.toUserId ? `/author/${item.toUserId}` : '#'}>{item.toUserName ? item.toUserName : '----'}</Link>{item.price ? ", " : ''} {item.price ? "having price " : ''}<strong>{item.price ? item.price : ''}{item.price ? ' ' + item.currency : ''}</strong></p> :
                                                                                    item.type === 5 ? <p className="m-0">Item transferred {moment(item.createdAt).fromNow()} from <Link to={`/author/${item.user._id}`} className="d-inline-block align-top">{item.user.username}</Link> to <Link className="d-inline-block align-top" to={item.toUserId ? `/author/${item.toUserId}` : '#'}>{item.toUserName ? item.toUserName : '----'}</Link>{item.price ? ", " : ''} {item.price ? "having price " : ''}<strong>{item.price ? item.price : ''}{item.price ? ' ' + item.currency : ''}</strong></p> :
                                                                                        item.type === 6 ? <p className="m-0">Item listed {moment(item.createdAt).fromNow()} by <Link to={`/author/${item.user._id}`} className="d-inline">{item.user.username}</Link>{item.price ? " " : ''} {item.price ? "for price " : ''}<strong>{item.price ? item.price : ''}{item.price ? ' ' + item.currency : ''}</strong></p> :
                                                                                            item.type === 7 ? <p className="m-0">Item sold {moment(item.createdAt).fromNow()} to <Link to={`/author/${item.user._id}`} className="d-inline">{item.user.username}</Link>{item.price ? ", " : ''} {item.price ? "for price " : ''}<strong>{item.price ? item.price : ''}{item.price ? ' ' + item.currency : ''}</strong></p> :
                                                                                                item.type === 8 ? <p className="m-0">NFT staked {moment(item.createdAt).fromNow()} by <Link to={`/author/${item.user._id}`} className="d-inline">{item.user.username}</Link>{item.price ? " for " : ''}<strong>{item.price ? item.price : ''}{item.price ? ' ' + item.currency : ''}</strong></p> : ''
                                                                }
                                                            </div>
                                                        </li>
                                                    );
                                                }) :
                                                    <li>
                                                        <div className="no-data border"><p className="text-center ml-3">{'No Activity To Show.'}</p></div>
                                                    </li>
                                            }
                                        </InfiniteScroll>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="col-12 col-lg-4 order-1 order-lg-2">
                            <div className="activity-content mt-5 mt-lg-0">
                                <div className="single-widget">
                                    <div className="widget-content search-widget">
                                        <form onSubmit={(e) => { search(e); }}>
                                            <input type="text" placeholder="Search" value={searchVal} onChange={(e) => { setPage(1); setSearchVal(e.target.value) }} />
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
    );
}

const mapStateToProps = state => ({
    activities: state.activities
});

export default connect(mapStateToProps, { beforeActivity, getActivities })(Activity);