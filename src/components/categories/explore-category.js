import React, { useState, useEffect, useRef } from "react"
import FullPageLoader from "../../components/loaders/full-page-loader"
import { connect } from "react-redux"
import { beforeCategory, getCategory } from "./categories.action"
import { ENV } from "../../config/config"
import Collections from '../collections/collections'
import { useParams, useNavigate } from "react-router-dom"
const { globalPlaceholderImage, cdnBaseUrl } = ENV
const ProfileImg = `${cdnBaseUrl}v1652166290/hex-nft/assets/transparent-placeholder_wrydvd.png`;
const ExploreCategory = (props) => {
    const { slug } = useParams()
    const navigate = useNavigate();
    const [category, setCategory] = useState(null)
    const [collectionsLoader, setColLoader] = useState(true) // collections loader
    const collectionsRef = useRef(null)

    useEffect(() => {
        window.scroll(0, 0)
        if (slug)
            props.getCategory(slug)
        else
            navigate("/collections")
    }, [slug])

    // when category data is received
    useEffect(() => {
        if (props.category.getCategory) {
            const { category } = props.category?.category
            setCategory(category)
            props.beforeCategory()
            getCatCollections(category._id)
        }
    }, [props.category.getCategory])

    useEffect(() => {
        // when an error is received
        if (props.error && props.error.invalidCat)
            navigate("/collections")
    }, [props.error && props.error.invalidCat])

    const getColLoader = (loader) => {
        setColLoader(loader)
    }

    const getCatCollections = (catId) => {
        collectionsRef.current?.getCatCollections(catId)
    }

    return (
        <section className="explore-area popular-collections-area pt-0">
            {collectionsLoader && <FullPageLoader />}
            {category && (
                <div>
                    <div className="d-flex collection-detail-container">
                        <div className="collection-preview collection-card">
                            <div className="seller">
                                <div className="seller-thumb avatar-lg-collection-details">
                                    <img
                                        className="rounded-circle"
                                        src={category?.image || ProfileImg}
                                        alt="Category Image"
                                        style={{ height: "110px" }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="card-caption p-0 text-center mb-3">
                            <div className="card-body pt-0 pb-0">
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}>
                                    <h5 className="mt-3 mb-3 text-break">Explore {category?.name}</h5>
                                    <p className="">
                                        {category?.description || "- no description found -"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {category?._id && <Collections setLoader={getColLoader} ref={collectionsRef} exploreCat={category?._id} />}
        </section>
    )
}

const mapStateToProps = (state) => ({
    error: state.error,
    category: state.category,
})

export default connect(mapStateToProps, { beforeCategory, getCategory })(ExploreCategory)