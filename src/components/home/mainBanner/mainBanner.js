import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import './mainBanner.css';
import Slider from "react-slick";
import { getHomepageNfts, beforeHomepageNfts } from '../../nfts/nfts.action';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import Countdown from 'react-countdown';

function MainBanner(props) {
	const navigate = useNavigate()
	const dispatch = useDispatch()
	const [encryptedUser, setUser] = useState()
	const [homepageNfts, setHomepagNfts] = useState([])
	const nfts = useSelector((state) => state.nft)

	useEffect(async () => {
		setUser(localStorage.getItem('encuse') ? localStorage.getItem('encuse') : null)
		dispatch(getHomepageNfts())
	}, []);

	useEffect(() => {
		if (nfts.homepageNftsAuth) {
			let data = nfts?.homepageNfts?.homepageNfts.length ? nfts.homepageNfts.homepageNfts : []
			setHomepagNfts(data)
			dispatch(beforeHomepageNfts())
		}
	}, [nfts.homepageNftsAuth])

	const settings = {
		dots: true,
		infinite: true,
		speed: 3000,
		slidesToShow: 1,
		slidesToScroll: 1,
		autoplay: true,
		autoplaySpeed: 4000,
		fade: true,
		cssEase: "ease-in-out",
		pauseOnHover: true
	};

	const countDownRenderer = ({ days, hours, minutes, seconds }) => {
		return (
			<div className="countdown-container d-flex justify-content-center">
				<div className="countdown-wrapper m-1 text-center">
					<strong>D</strong>
					<div>{days}</div>
				</div>
				<div className="countdown-wrapper m-1 text-center">
					<strong>H</strong>
					<div>{hours}</div>
				</div>
				<div className="countdown-wrapper m-1 text-center">
					<strong>M</strong>
					<div>{minutes}</div>
				</div>
				<div className="countdown-wrapper m-1 text-center">
					<strong>S</strong>
					<div>{seconds}</div>
				</div>
			</div>
		)
	}

	return (
		<section id="main-banner">
			<Container className="h-100">
				<Row className="h-100 align-items-center">
					<Col md={6}>
						<div className="banner-content ff-poppins text-white mb-4 mb-sm-5 mb-md-0">
							<h1 className="fw-bold mb-3">Discover, Collect, and Sell extraordinary NFTs</h1>
							<p>HEX is the world's first and Largest NFT marketplace</p>
							<div className="btns-holder d-flex">
								<Link to="/explore-all" className="btn-filled transition fw-bold me-4"><span className="d-block transition">Explore</span></Link>
								<Link to={encryptedUser && encryptedUser !== null ? '/create' : '/login/referrer=create'} className="btn-outlined transition fw-bold me-4"><span className="d-block transition">Create</span></Link>
							</div>
						</div>
					</Col>
					<Col md={6}>
						<div className={` main-banner-fixed-width ${homepageNfts && homepageNfts.length ? "banner-content-img position-relative" : ''}`}>

							<Slider {...settings}>
								{
									homepageNfts && homepageNfts.length ?
										homepageNfts.map((nft, index) => {
											return (
												<div key={index} className="slider-main">
													<div className="image-holder position-relative">
														<img className="img-fluid banner-img cursor-pointer" src={nft.image} alt="" onClick={() => navigate(`/item-details/${window.btoa(nft._id)}`)} />
														<div className="item-price-details ff-poppins d-flex justify-content-center flex-column flex-sm-row">
															{
																nft.latestBid ?
																	<div className="detail-col d-flex flex-column">
																		<span className="detail-label mb-2">Current Bid</span>
																		<strong className="detail-value">{`${nft.latestBid.price.amount} ${nft.latestBid.price.currency}`}</strong>
																	</div> :
																	nft.latestOffer ?
																		<div className="detail-col d-flex flex-column">
																			<span className="detail-label mb-2">Current Offer</span>
																			<strong className="detail-value">{`${nft.latestOffer.price.amount} ${nft.latestOffer.price.currency}`}</strong>
																		</div> : null
															}
															{
																nft.auctionEndDate ?
																	<div className="detail-col d-flex flex-column">
																		<span className="detail-label mb-2">Remaining Time</span>
																		<strong className="detail-value">

																			<Countdown
																				date={Date.parse(nft.auctionEndDate) + 10000}
																				renderer={countDownRenderer}
																			/>
																		</strong>
																		{/* <strong className="detail-value">2h:38m</strong> */}
																	</div> :
																	null
															}

														</div>
													</div>
													<div className="nft-details d-flex align-items-center">
														<div className="image-holder cursor-pointer" onClick={() => navigate(`/author/${nft.owner._id}`)}>
															<img src={nft.owner.profileImage} alt="Author Image" />
														</div>
														<div className="details-holder d-flex flex-column">
															<span className="nft-name mb-0 cursor-pointer" onClick={() => navigate(`/item-details/${window.btoa(nft._id)}`)}>{nft.name}</span>
															<span className="author-name cursor-pointer" onClick={() => navigate(`/author/${nft.owner._id}`)}>{`by ${nft.owner.name}`}</span>
														</div>
													</div>
												</div>
											)
										})
										: null
								}
							</Slider>
						</div>
					</Col>
				</Row>
			</Container>
		</section>
	);
}
export default MainBanner;