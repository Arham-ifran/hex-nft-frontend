/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { connect } from "react-redux";
import Explore from "../explore/explore-all";
import { getUserById, beforeUser } from "./../user/user.action";
import FilterSearch from "../filter-search/filtersearch";
import { ENV } from "./../../config/config";
import FullPageLoader from "../../components/loaders/full-page-loader";
import { toast } from 'react-toastify';
import ReactTooltip from 'react-tooltip'
import { Tabs, Tab } from 'react-bootstrap'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
const { cdnBaseUrl } = ENV
const ProfileImg = `${cdnBaseUrl}v1652166289/hex-nft/assets/image-placeholder_qva6dx.png`;
const Author = (props) => {
  const params = useParams();
  const navigate = useNavigate();
  const [authorProfile, setAuthorProfile] = useState(null);
  const [authorLoader, setAuthorLoader] = useState(true); // collections loader
  const [nftsLoader, setNftsLoader] = useState(true); // NFTs loader
  const [nftFilter, setNftFitler] = useState(null);
  const [Filter, setFilter] = useState(false);
  const [key, setKey] = useState('collected');
  const [authorId, setAuthorId] = useState('');
  const [collectedNfts, setCollectedNfts] = useState(0); // count for collected NFTs
  const [createdNfts, setCreatedNfts] = useState(0); // count for created NFTs

  useEffect(() => {
    if (params) {
      if (params.authorId) {
        if (authorId !== params.authorId) {
          window.scroll(0, 0)
          const { authorId } = params
          setAuthorId(authorId)

          // get default states
          reset()

          // get author details
          props.getUserById(authorId);
        }
      }
      else
        navigate("/authors")
    }
  }, [params])

  useEffect(() => {
    // when an error is received
    if (props.error && props.error.invalidAuthor)
      navigate("/authors")
  }, [props.error && props.error.invalidAuthor])

  const reset = () => {
    setAuthorProfile(null);
    setAuthorLoader(true);
    setNftsLoader(true);
    setNftFitler(null);
    setFilter(false);
    setKey('collected');
    setCollectedNfts(0);
    setCreatedNfts(0);
  }

  useEffect(() => {
    if (props.user.individualUserAuth) {
      setAuthorProfile(props.user.individualUser);
      props.beforeUser();
      setAuthorLoader(false);
    }
  }, [props.user.individualUserAuth]);

  const getNftsLoader = (loader) => {
    setNftsLoader(loader);
  };

  const getCollectedNfts = (count) => {
    setCollectedNfts(count);
  };

  const getCreatedNfts = (count) => {
    setCreatedNfts(count);
  };

  const applyFilters = (filter) => {
    if (filter) {
      setNftsLoader(true)
      setNftFitler(filter)
    }
  }

  const copy = () => {
    var copyText = document.getElementById("author-add-field");
    // copyText.select();
    // copyText.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(copyText.value);
    toast.success("Address copied to clipboard.")
  }

  const showInExplorer = async () => {
    const url = ENV.explorerURL
    window.open(`${url}/address/${authorProfile.address}`, '_blank')
    return null
  }


  return (
    <section
      className="author-area explore-area  popular-collections-area"
      style={{ padding: "0px" }}
    >
      {(authorLoader || nftsLoader) && <FullPageLoader />}
      {
        authorProfile &&
        <div>
          <div className="d-flex author-detail-container">
            <div className="author-preview author-card">
              <div className="seller">
                <div className="seller-thumb avatar-lg-author-container">
                  <img
                    className="rounded-circle"
                    src={authorProfile.profileImage ? authorProfile.profileImage : ProfileImg}
                    alt="User Profile"
                  />
                </div>
              </div>
            </div>
            <div className="card-caption p-0 text-center">
              <div className="card-body">
                <h5 className="mb-3">{authorProfile.username}</h5>
                <p className="my-3">{authorProfile.description}</p>
                <div className="input-group aurthor-wallet-address" style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '100px',
                  backgroundColor: 'transparent',
                  border: '2px solid #ffffff',
                  height: 'auto',
                  padding: '0rem 0rem 0rem 0rem',
                  boxShadow: 'none',
                  outline: 'none',
                }}>
                  <input type="text" className="p-0 dont-copy-text" id="author-add-field" placeholder="0x000000000000000000" readOnly value={authorProfile.address} data-effect="float" data-for="enrich" data-tip={authorProfile.address}
                    onClick={showInExplorer}
                    style={{
                      backgroundColor: "transparent",
                      border: "0px solid",
                      height: "50px",
                      padding: "0px 20px",
                      boxShadow: "none",
                      outline: "none",
                      color: "#fff",

                    }}
                  />
                  <div className="input-group-append copy-div"
                    style={{
                      position: "absolute",
                      height: "100%",
                      top: "0",
                      right: "0",
                      borderRadius: "100px",
                      overflow: "hidden",
                    }}
                    onClick={copy}
                  >
                    <button className="cursor-pointer" style={{
                      marginRight: "5px",
                      padding: "12px 16px",
                      backgroundColor: "transparent",
                      color: "#fff",
                      border: "0",
                      outline: "none",
                    }}>
                      <FontAwesomeIcon icon={faCopy} className="copy-icon" data-effect="float" data-tip="Copy" />
                    </button>
                  </div>
                </div>
                <ReactTooltip id='enrich' getContent={(dataTip) => `${authorProfile.address}`} />

                <div className="social-icons d-flex justify-content-center my-3">
                  {
                    authorProfile.facebookLink && <a className="facebook" href={authorProfile.facebookLink} target="_blank" rel="noreferrer" data-effect="float" data-tip="Facebook">
                      <i className="fab fa-facebook-f" />
                    </a>
                  }
                  {
                    authorProfile.twitterLink && <a className="twitter" href={authorProfile.twitterLink} target="_blank" rel="noreferrer" data-effect="float" data-tip="Twitter">
                      <i className="fab fa-twitter" />
                    </a>
                  }
                  {
                    authorProfile.gPlusLink && <a className="google-plus" href={authorProfile.gPlusLink} target="_blank" rel="noreferrer" data-effect="float" data-tip="Google Plus">
                      <i className="fab fa-google-plus-g" />
                    </a>
                  }
                  {
                    authorProfile.vineLink && <a className="vine" href={authorProfile.vineLink} target="_blank" rel="noreferrer" data-effect="float" data-tip="Vine">
                      <i className="fab fa-vine" />
                    </a>
                  }
                </div>
                {
                  props.followText &&
                  <a className="btn btn-bordered-white btn-smaller">{props.followText}</a>
                }
              </div>
            </div>
            <div className={`d-flex collection-wrapper collection-detail-wrapper ${Filter ? 'active' : ''}`}>
              <button className="side-toggle-btn" onClick={() => setFilter(!Filter)}><i className="fas fa-sort-amount-down-alt" /></button>
              <div className="search-filters">
                <FilterSearch applyFilters={applyFilters} showColFilters={true} showCatFilters={true} />
              </div>
              <div className="w-100 me-3 ms-3 ms-md-0">
                {/* tabs */}
                <Tabs
                  id="controlled-tab"
                  activeKey={key}
                  onSelect={(k) => setKey(k)}
                  className="mb-3"
                >
                  <Tab eventKey="collected" title={`Collected ${collectedNfts}`}>
                    {key === 'collected' && <Explore collectorId={authorProfile._id} setLoader={getNftsLoader} setCollectedNfts={getCollectedNfts} setCreatedNfts={getCreatedNfts} filter={nftFilter} hideFilters={true} />}
                  </Tab>
                  <Tab eventKey="created" title={`Created ${createdNfts}`}>
                    {key === 'created' && <Explore creatorId={authorProfile._id} setLoader={getNftsLoader} setCreatedNfts={getCreatedNfts} filter={nftFilter} hideFilters={true} />}
                  </Tab>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      }
    </section>
  );
};

const mapStateToProps = (state) => ({
  error: state.error,
  user: state.user,
});

export default connect(mapStateToProps, { getUserById, beforeUser })(Author);
