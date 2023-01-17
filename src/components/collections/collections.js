import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { connect } from 'react-redux';
import { ENV } from '../../config/config';
import { beforeCollection, getCollections } from './collections.actions';
import ReactTooltip from 'react-tooltip'
const { collectionFeaturedImg, cdnBaseUrl } = ENV
const ProfileImg = `${cdnBaseUrl}v1652166289/hex-nft/assets/logo-placeholder_jsvyst.jpg`;

const Collections = forwardRef((props, ref) => {
    const [searchParams] = useSearchParams();
    const [collections, setCollections] = useState([])
    const [category, setCategory] = useState(null)
    const [appendData, setAppendData] = useState(false) // falg to append data or not
    const [source, setSource] = useState(1) // 1 for my collections, 2 for popular collections
    const [loadMoreBtn, setLoadMoreBtn] = useState(true);
    const [pagination, setPagination] = useState(null);
    const userId = searchParams.get('userId') || null // this is added for gamification users

    useEffect(() => {
        window.scroll(0, 0)
        if (props.source)
            setSource(props.source)

        if (props.setLoader)
            props.setLoader(true)

        const categoryId = props.exploreCat || null
        getCollections(categoryId)
    }, [])

    const loadMore = () => {
        const { page, limit } = pagination
        props.setLoader(true)
        // get more collections
        getCollections(category, page + 1, limit)
    }

    useEffect(() => {
        if (props.collection.getAuth) {
            const colsData = props.collection
            props.beforeCollection()

            if (!props.all) {
                setCollections(appendData ? collections.concat(colsData.collections) : (colsData.collections || []))
                setPagination(colsData.pagination)

                if (!(colsData.collections?.length) || colsData.pagination && colsData.pagination.page === colsData.pagination.pages)
                    setLoadMoreBtn(false)
                else
                    setLoadMoreBtn(true)
            }
            else
                setCollections(colsData.collections)

            if (props.setLoader)
                props.setLoader(false)
        }
    }, [props.collection.getAuth])

    const getCollections = (categoryId = null, page = 1, limit = 8) => {
        setCategory(categoryId)
        setAppendData(categoryId === category)

        const filter = {
            page
        }

        if (categoryId)
            filter.categoryId = categoryId

        if (props.userId)
            filter.userId = props.userId
        else if (userId)
            filter.userId = userId

        if (props.popular)
            filter.popular = true

        // if not all then apply limit 
        if (!props.all)
            filter.limit = props.limit || limit
        else
            filter.all = true

        const qs = ENV.objectToQueryString(filter)
        props.getCollections(qs)
    }

    useImperativeHandle(ref, () => ({
        getCatCollections: (catId) => {
            if (props.setLoader)
                props.setLoader(true)

            getCollections(catId)
        },
        colCount: collections?.length || 0
    }))

    return (
        <div className="popular-collections-area">
            <div className="container">
                <div className={`items ${!collections && 'justify-content-center'}`}>
                    <>
                        <div className="d-flex align-items-center flex-wrap collection-card-wrapper">
                            {
                                collections && collections.length ?
                                    collections.map((item, idx) => {
                                        return (
                                            <div key={`cd_${idx}`} className="card no-hover text-center">
                                                <div className="image-over">
                                                    <Link to={`/collection/${item.url}`}>
                                                        <img className="card-img-top" src={item.featuredImg ? item.featuredImg : collectionFeaturedImg} alt="img" />
                                                    </Link>
                                                    <Link className="seller" to={source === 1 ? `/collection/${item.url}` : `/author/${item.user._id}`}>
                                                        <div className="seller-thumb avatar-lg">
                                                            <img className="rounded-circle" src={source === 1 ? item.logo ? item.logo : ProfileImg : (item.user.profilePhoto ? item.user.profilePhoto : ProfileImg)} alt={source === 1 ? 'Collection Logo' : 'User Avatar'} />
                                                        </div>
                                                    </Link>
                                                </div>
                                                <div className="card-caption col-12">
                                                    <div className="card-body mt-4">
                                                        <Link to={`/collection/${item.url}`} data-effect="float" data-tip={item.name}>
                                                            <h5 className="mb-4">{item.name}</h5>
                                                        </Link>
                                                        <ReactTooltip />
                                                        <span className="mt-3 category-name">{item.category ? item.category.name : 'Category: N/A'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                    :
                                    <div className="no-data border mb-4"><p className="text-center">No Collection Found</p></div>
                            }
                        </div>
                    </>
                </div>
                {loadMoreBtn && !props.all && (collections && collections.length) ?
                    <div className="row">
                        <div className="col-12 text-center mb-4">
                            <a id="load-btn" className="btn btn-filled no-border transition mt-4" onClick={() => loadMore()}>
                                <span className="d-block transition">Load More</span>
                            </a>
                        </div>
                    </div>
                    : ''
                }
            </div>
        </div>
    );
})

const mapStateToProps = state => ({
    collection: state.collection,
    error: state.error
});

export default connect(mapStateToProps, { beforeCollection, getCollections }, null, { forwardRef: true })(Collections)