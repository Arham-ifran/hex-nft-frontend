import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { beforeAuction, getLiveAuctions, addToFavourite, removeFavourite, beforeFavourite } from "./auctions.action";
import FullPageLoader from "../loaders/full-page-loader";
import BeatsLoader from "../loaders/beat-loader";
import { ENV } from "../../config/config";
import "slick-carousel";
import "../../assets/slick/slick.min.css";
import "../../assets/slick/slick-theme.min.css";
import $ from "jquery";
import Countdown from "react-countdown";
import { ipfsToUrl } from "../../utils/functions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight, faC, faD, faHeart } from "@fortawesome/free-solid-svg-icons";
import { toast } from 'react-toastify';
import Tilt from 'react-tilt';
import ReactTooltip from 'react-tooltip'
const { countDownRenderer } = ENV;

const initData = {
	pre_heading: "Auctions",
	heading: "Live Auctions",
	btnText: "View All",
};

function HomeAuctions(props) {
	const [auctions, setAuctions] = useState(null);
	const [loader, setLoader] = useState(true); // auctions loader
	const [disable, setDisable] = useState(false)
	const favouriteRefs = useRef([]);
	const favouriteColorRefs = useRef([]);
	const userId = ENV.getUserKeys()?._id
	let beatLoaders = useRef([])

	useEffect(() => {
		window.scroll(0, 0);
		// get live auctions
		const qs = ENV.objectToQueryString({ all: true });
		props.getLiveAuctions(qs);
	}, []);

	// set live auctions
	useEffect(() => {
		if (props.auction.getAuth) {
			const { auctions } = props.auction;
			if (auctions) {
				setAuctions(auctions);
				props.beforeAuction();
				setLoader(false);
			}
		}
	}, [props.auction.getAuth]);

	// creating refs equal to length of auctions for each auction element
	useEffect(() => {
		if (auctions && auctions.length) {
			favouriteRefs.current = favouriteRefs.current.slice(0, auctions.length);
			favouriteColorRefs.current = favouriteColorRefs.current.slice(0, auctions.length);
			let loaderArray = []
			for (let i = 0; i < auctions.length; i++) {
				loaderArray.push(false)
			}
			beatLoaders.current = loaderArray
		}
	}, [auctions]);

	// ready slides when auctions data is received
	useEffect(() => {
		if (auctions && auctions.length) {
			$(".swiper-wrapper").slick(ENV.slickSettings);
		}
	}, [auctions]);

	useEffect(() => {
		if (props.addTofavouriteResAuctions && Object.keys(props.addTofavouriteResAuctions).length > 0) {

			let refIndex = props.addTofavouriteResAuctions.refIndex
			beatLoaders.current[refIndex] = false

			if (!props.addTofavouriteResAuctions.alreadyInFavourites) {
				props.beforeFavourite()
				setDisable(false)

				let totalLikesValue = parseInt(favouriteRefs.current[refIndex].innerHTML)
				let likeColorRef = favouriteColorRefs.current[refIndex]
				likeColorRef.style.color = 'red'
				totalLikesValue = totalLikesValue + 1
				favouriteRefs.current[refIndex].innerHTML = totalLikesValue
			}
			else {
				setDisable(false)
				toast.error('This item is already in your Favourites list', 'already-in-fav-list')
			}
		}
	}, [props.addTofavouriteResAuctions])

	useEffect(() => {
		if (props.removeFavouriteResAuctions && Object.keys(props.removeFavouriteResAuctions).length > 0) {

			let refIndex = props.removeFavouriteResAuctions.refIndex
			beatLoaders.current[refIndex] = false

			if (!props.removeFavouriteResAuctions.alreadyRemovedFromFavourites) {
				props.beforeFavourite()
				setDisable(false)
				let totalLikesValue = parseInt(favouriteRefs.current[refIndex].innerHTML)
				let likeColorRef = favouriteColorRefs.current[refIndex]
				likeColorRef.style.color = 'white'
				totalLikesValue = totalLikesValue - 1
				favouriteRefs.current[refIndex].innerHTML = totalLikesValue < 0 ? 0 : totalLikesValue
			}
			else {
				setDisable(false)
				toast.error('You have already removed this item from your Favourites list', 'already-out-fav-list')
			}
		}

	}, [props.removeFavouriteResAuctions])

	const addRemovefavouritesAuction = (nftItem, index) => {
		if (userId) {
			let likeColor = favouriteColorRefs.current[index].style.color
			beatLoaders.current[index] = true

			setDisable(true)
			if (likeColor === 'red') {
				props.removeFavourite({ userId, nftId: nftItem._id, refIndex: index })
			}
			else if (likeColor === 'white') {
				props.addToFavourite({ userId, nftId: nftItem._id, refIndex: index })
			}

		}
	}

	return (
		<section className="live-auctions-area">
			{loader ? (
				<FullPageLoader />
			) : (
				<div className="container">
					<div className="row">
						<div className="col-12">
							<div className="intro d-flex justify-content-between align-items-center m-0">
								<div className="intro-content">
									<h3 className="mt-3 mb-3">{initData.heading}</h3>
								</div>
								{auctions && auctions.length > 0 && (
									<div className="intro-btn">
										<Link className="btn content-btn view-button" to="/auctions">
											{initData.btnText} <FontAwesomeIcon icon={faAngleRight} className="right-arrow ms-2" />
										</Link>
									</div>
								)}
							</div>
						</div>
					</div>
					{auctions && auctions.length > 0 ? (
						<div className="auctions-slides">
							<div className="swiper-container slider-mid items">
								<div className="swiper-wrapper item-auction-wrapper">
									{auctions.map((item, idx) => {
										return (
											<div key={`auc_${idx}`} id={`#auc-${idx}`} className="card">
												<div className="image-over">
													<Tilt className="Tilt" options={{ max: 10 }} >
														<Link to={`/item-details/${window.btoa(item._id)}`}>
															<img className="card-img-top" src={ipfsToUrl(item.image)} alt={item.name} />
														</Link>
													</Tilt>
													<div className="seller d-flex align-items-center justify-content-between">
														<span>Owned By</span>
														<Link style={{ textAlign: 'right' }} to={`/author/${item.owner._id}`}>
															<h6 className="mb-0" data-effect="float" data-tip={item.owner.username}>{item.owner.username}</h6>
														</Link>
													</div>
													{
														item.type === 2 ?
															<>
																{
																	item.isStaked ?
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
															item.isStaked &&
															<span className="commission-icon-d cursor-pointer" data-tip="NFTD">
																<FontAwesomeIcon icon={faD} className="commission-in" />
															</span>
													}
												</div>

												<ReactTooltip />

												<div className="card-caption col-12">
													<div className="card-body">
														<div className="mb-2">
															<Countdown
																date={Date.parse(item.auctionEndDate) + 10000}
																renderer={countDownRenderer}
															/>
														</div>
														<Link to={`/item-details/${window.btoa(item._id)}`}>
															<h5 className="mb-0">{item.name}</h5>
														</Link>
														<div className="seller d-flex align-items-center justify-content-between">
															<span>Owned By</span>
															<Link style={{ textAlign: 'right' }} to={`/author/${item.owner._id}`}>
																<h6 className="mb-0" data-effect="float" data-tip={item.owner.username}>{item.owner.username}</h6>
															</Link>
														</div>
														<div className="card-bottom">
															<span className="nft-price">{item.currentPrice} {item.currency}</span>
														</div>
													</div>
												</div>
												<div className="card-footer d-flex justify-content-end align-items-center">
													<div style={{ pointerEvents: disable ? 'none' : 'auto' }} className="like-count d-flex justify-content-end align-items-center w-50">
														<span id={`favourite-check-${idx}`} ref={el => favouriteColorRefs.current[idx] = el} style={{ color: item.userFavourite?.length ? 'red' : 'white' }} onClick={() => addRemovefavouritesAuction(item, idx)} className="cursor-pointer">
															{beatLoaders.current && beatLoaders.current[idx] ? <BeatsLoader /> : <FontAwesomeIcon icon={faHeart} />}
														</span>
														<span id={`fav-likes-${idx}`} style={{ display: beatLoaders.current && beatLoaders.current[idx] ? 'none' : 'block' }} className="text-white ms-2" ref={el => favouriteRefs.current[idx] = el}>{item.favourite ? item.favourite.length : ''}</span>
													</div>
												</div>
											</div>
										);
									})}
								</div>
							</div>
						</div>
					) : (
						<div className="no-data border"><p className="text-center ml-3">No Live Auctions Found</p></div>
					)}
				</div>
			)}
		</section>
	);
}

const mapStateToProps = (state) => ({
	auction: state.auction,
	addTofavouriteResAuctions: state.auction.addTofavouriteResAuctions,
	removeFavouriteResAuctions: state.auction.removeFavouriteResAuctions

});

export default connect(mapStateToProps, { beforeAuction, getLiveAuctions, addToFavourite, removeFavourite, beforeFavourite })(HomeAuctions);
