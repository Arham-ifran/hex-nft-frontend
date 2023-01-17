import React, { useState, useEffect, useRef } from 'react';
import FullPageLoader from '../loaders/full-page-loader';
import { connect } from 'react-redux';
import { beforeCategory, getCategories } from '../categories/categories.action';
import Collections from './collections';

const initData = {
    pre_heading: "Collections",
    heading: "Collections",
    content: "Create, curate, and manage collections of unique NFTs to share and sell."
}

const AllColections = (props) => {
    const [categories, setCategories] = useState(null)
    const [categoriesLoader, setCatLoader] = useState(true) // categories loader
    const [collectionsLoader, setColLoader] = useState(true) // collections loader
    const collectionsRef = useRef(null)

    useEffect(() => {
        window.scroll(0, 0)
        props.getCategories()
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
                            <div className="intro d-flex justify-content-between align-items-end m-0">
                                <div className="intro-content flex-fill text-center">
                                    <h3 className="my-4">{initData.heading}</h3>
                                    <p>{initData.content}</p>
                                </div>
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
                <Collections guestCollections={true} setLoader={getColLoader} ref={collectionsRef} />
            </section>
        </>
    );
}

const mapStateToProps = state => ({
    error: state.error,
    category: state.category
});

export default connect(mapStateToProps, { beforeCategory, getCategories })(AllColections);
