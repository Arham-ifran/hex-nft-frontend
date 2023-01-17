import React, { useState, useEffect } from "react";
import Explore from "../explore/explore-all";
import FullPageLoader from "../../components/loaders/full-page-loader";
import { connect } from "react-redux";
import { beforeCollection, getCollection } from "../collections/collections.actions";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ENV } from "../../config/config";
import FilterSearch from "../filter-search/filtersearch";
import { toast } from 'react-toastify';
import ReactTooltip from 'react-tooltip';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
const { userDefaultImg, categoryDefaultImg, cdnBaseUrl } = ENV;
const ColLogoPlaceholder = `${cdnBaseUrl}v1652166289/hex-nft/assets/logo-placeholder_jsvyst.jpg`;

const CollectionDetails = (props) => {
  const navigate = useNavigate()
  const { collectionId } = useParams();
  const [collection, setCollection] = useState(null);
  const [collectionLoader, setColLoader] = useState(true); // collections loader
  const [nftsLoader, setNftsLoader] = useState(true); // NFTs loader
  const [nftFilter, setNftFitler] = useState(null);
  const [Filter, setFilter] = useState(false);
  const { _id } = ENV.getUserKeys('_id');

  useEffect(() => {
    window.scroll(0, 0);
    if (collectionId)
      props.getCollection(collectionId)
    else
      navigate("/collections")
  }, [])

  // when collection data is received
  useEffect(() => {
    if (props.collection.getAuth) {
      const { collection } = props.collection;
      setCollection(collection);
      props.beforeCollection();
      setColLoader(false);
    }
  }, [props.collection.getAuth]);

  useEffect(() => {
    // when an error is received
    if (props.error && props.error.invalidCol)
      navigate("/collections")
  }, [props.error && props.error.invalidCol])

  const getNftsLoader = (loader) => {
    setNftsLoader(loader);
  };

  const applyFilters = (filter) => {
    if (filter) {
      setNftsLoader(true)
      setNftFitler(filter)
    }
  }

  const copy = () => {
    var copyText = document.getElementById("collection-det-add");
    navigator.clipboard.writeText(copyText.innerHTML);
    toast.success("Address copied to clipboard.")
  }

  return (
    <section
      className="author-area explore-area  popular-collections-area"
      style={{ padding: "0px" }}
    >
      {(collectionLoader || nftsLoader) && <FullPageLoader />}
      <div className="">
        <ReactTooltip className="custom-theme" id="custom-theme" />
        {collection && (
          <div className="d-flex collection-detail-container">
            <div className="collection-preview collection-card">
              <div className="seller">
                <div className="seller-thumb avatar-lg-collection-details">
                  <img className="rounded-circle collection-logo" src={collection.logo ? collection.logo : ColLogoPlaceholder} alt="Collection Logo" />
                </div>
              </div>
            </div>
            <div className="card-caption p-0 text-center">
              <div className="card-body pt-0 pb-0">
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                  <h5 className="my-3 text-break">{collection.name}</h5>
                  <div className="my-3 position-relative">
                    {collection.url ? (
                      <div className="input-group dont-copy-text" style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '100px',
                        backgroundColor: 'transparent',
                        border: '2px solid #ffffff',
                        height: 'auto',
                        padding: '0rem 0rem 0rem 1rem',
                        boxShadow: 'none',
                        outline: 'none',
                      }}>
                        <div id="collection-det-add" data-effect="float" data-tip={`${ENV.domainUrl}collection/${collection.url}`}
                          style={{
                            backgroundColor: "transparent",
                            border: "0px solid",
                            height: "auto",
                            padding: "0rem",
                            outline: "none",
                            color: '#fff',
                            textAlign: 'start',
                            cursor: 'pointer',
                          }}
                        >{`${ENV.domainUrl}collection/${collection.url}`}</div>
                        <div className="input-group-append"
                          style={{
                            // position: "absolute",
                            height: "100%",
                            top: "0",
                            right: "0",
                            borderRadius: "100px",
                            overflow: "hidden",
                          }}
                        >
                          <button style={{
                            marginRight: "5px",
                            padding: "12px 16px",
                            backgroundColor: "transparent",
                            color: "#fff",
                            border: "0",
                            outline: "none",
                          }}
                            onClick={copy}
                          >
                            <FontAwesomeIcon icon={faCopy} className="copy-icon cursor-pointer" data-effect="float" data-tip="Copy" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      "- no URL found -"
                    )}
                  </div>
                  <p className="mt-3 mb-3 collection-p">
                    {collection.description ? collection.description : "- no description found -"}
                  </p>
                </div>
              </div>
            </div>

            <div className="items four-box-column text-white">
              <div className="px-0 mt-3 mx-3 flex-fill">
                <div className="card no-hover">
                  <div className="single-seller d-flex align-items-center">
                    <img className="avatar-md rounded-border" src={collection.category?.image || categoryDefaultImg} alt="img" />
                    <div className="collection-boxes">
                      <Link className="" to={`/category/${collection.category?.slug}`} data-effect="float" data-tip={collection.category?.name}>
                        {collection.category?.name}
                      </Link>
                      <div className="collection-box-name">Category</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-0 my-3 mx-3 flex-fill">
                <div className="card no-hover">
                  <div className="single-seller d-flex align-items-center">
                    <img className="avatar-md rounded-border" src={collection.user?.profileImage || userDefaultImg} alt="User Avatar" />
                    <div className="collection-boxes">
                      <Link className="" to={`/author/${collection.user?._id}`} data-effect="float" data-tip={collection.user?.username}>
                        {collection.user?.username}
                      </Link>
                      <div className="collection-box-name">Creator</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-0 mt-3 mx-3 flex-fill">
                <div className="card no-hover">
                  <div className="single-seller d-flex align-items-center">
                    <div className="avatar-md rounded-border">
                      <i className="fas fa-clone" />
                    </div>
                    <div className="collection-boxes">
                      <div className="item-values" data-effect="float" data-tip={collection.items || 0}>{collection.items || 0}</div>
                      <div className="collection-box-name">Items</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-0 mt-3 mx-3 flex-fill">
                <div className="card no-hover">
                  <div className="single-seller d-flex align-items-center">
                    <Link to="/authors">
                      <div className="avatar-md rounded-border">
                        <i className="fas fa-users" />
                      </div>
                    </Link>
                    <div className="collection-boxes">
                      <div className="item-values" data-effect="float" data-tip={collection.owners || 0}>{collection.owners || 0}</div>
                      <div className="collection-box-name">Owners</div>
                    </div>
                  </div>
                </div>
                <ReactTooltip />
              </div>

              {/* Edit  */}
              {
                _id && (collection?.user?._id === _id) &&
                <div className="collection-action-btns text-center">
                  <Link className="edit seller" to={`/collection/edit/${collection?.url}`}><span className="edit-icon fa fa-edit"></span>Edit Collection</Link>
                  {(collection.hasOwnProperty('address') === false) && <Link className="edit seller" to={`/create?collection=${window.btoa(collection?._id)}`}><span className="edit-icon fa fa-plus"></span>Create NFT</Link>}
                </div>
              }
            </div>

            <div className={`${Filter ? 'active' : ''} d-flex collection-wrapper collection-detail-wrapper`}>
              <button className="side-toggle-btn 123" onClick={() => setFilter(!Filter)}><i className="fas fa-sort-amount-down-alt" /></button>
              <div className="search-filters">
                <FilterSearch applyFilters={applyFilters} />
              </div>
              <div className="w-100 collection-detail-card">
                <Explore collectionId={collection._id} setLoader={getNftsLoader} filter={nftFilter} hideFilters={true} />
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

const mapStateToProps = (state) => ({
  error: state.error,
  collection: state.collection,
});

export default connect(mapStateToProps, { beforeCollection, getCollection })(CollectionDetails);
