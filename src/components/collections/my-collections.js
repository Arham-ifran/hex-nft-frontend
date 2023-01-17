import React, { useState, useEffect, useRef } from 'react';
import FullPageLoader from '../../components/loaders/full-page-loader';
import { connect } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { beforeCategory, getCategories } from '../categories/categories.action';
import Collections from './collections';
import { ENV } from '../../config/config';
import ReactTooltip from 'react-tooltip';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
const initData = {
    pre_heading: "Collections",
    heading: "My Collections",
    content: "Create, curate, and manage collections of unique NFTs to share and sell.",
    btnText: "Create New"
}

const MyCollections = (props) => {
    const [categories, setCategories] = useState(null)
    const [categoriesLoader, setCatLoader] = useState(true) // categories loader
    const [collectionsLoader, setColLoader] = useState(true) // collections loader
    const collectionsRef = useRef(null)
    const navigate = useNavigate();
    const { _id } = ENV.getUserKeys('_id');

    useEffect(() => {
        toast.dismiss()
        if (_id) {
            window.scroll(0, 0)
            props.getCategories()
        }
        else {
            navigate('/login')
        }
    }, [])

    // when categories data is received
    useEffect(() => {
        if (props.category.getAuth) {
            const { categories } = props.category
            const allCat = { active: true, name: 'all' }
            setCategories([allCat, ...categories])
            props.beforeCategory()
            setCatLoader(false)
        }
    }, [props.category.getAuth])

    const getColLoader = (loader) => {
        setColLoader(loader)
    }

    const getCatCollections = (catId) => {
        collectionsRef.current?.getCatCollections(catId)
    }

    return (
        <>
            {(categoriesLoader || collectionsLoader) && <FullPageLoader />}
            <section className="explore-area">
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <div className="intro d-flex justify-content-between align-items-center m-0">
                                <div className="intro-content">
                                    <h3 className="my-4">{initData.heading}</h3>
                                </div>
                                <div className="intro-btn my-col-btn d-flex align-items-center">
                                    <Link className="btn content-btn text-left" to="/collection/create">{initData.btnText}</Link>
                                    <span className="arrow-icon-right"><FontAwesomeIcon icon={faArrowRight} className="" /></span>
                                </div>
                            </div>
                            <div className="intro my-3">
                                <p>{initData.content} <i className="fas fa-exclamation-circle pink-color cursor-pointer ms-2" data-effect="float" data-tip={`Collections can be created either directly on ${ENV.appName} or importing from an exitsing smart contract.`} />
                                </p>
                                <ReactTooltip />
                            </div>
                        </div>
                    </div>
                    <div className="row justify-content-center text-center">
                        <div className="col-12">
                            {/* Explore Menu */}
                            <div className="explore-menu btn-group-toggle d-flex flex-wrap" data-toggle="buttons">
                                {
                                    categories && categories.length > 0 &&
                                    categories.map((item, index) => {
                                        return (
                                            <label onClick={() => getCatCollections(item._id)} key={`cat_${index}`} className={`btn ${item.active ? 'active' : ''} text-uppercase p-2 d-flex align-items-center`}>
                                                <input type="radio" defaultValue={item.name} defaultChecked className="explore-btn collection-tabs-radio" />
                                                <span>{item.name}</span>
                                            </label>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <Collections userId={_id} setLoader={getColLoader} ref={collectionsRef} />
            </section>
        </>
    );
}

const mapStateToProps = state => ({
    error: state.error,
    category: state.category
});

export default connect(mapStateToProps, { beforeCategory, getCategories })(MyCollections);
