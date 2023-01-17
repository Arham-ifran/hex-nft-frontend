import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Images } from '../../../assets/asset';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleRight } from '@fortawesome/free-solid-svg-icons'
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons'
import TrendingCategoryItem from '../trendingCategoryItem/trendingCategoryItem';
import Slider from "react-slick";
import './trendingCategories.css';
import { getTrendingCollections, beforeTrending } from '../../rankings/rankings.action'
import { useSelector, useDispatch } from 'react-redux';

function SampleNextArrow(props) {
	const { onClick } = props;
	return (
		<button className="slick-arrow slick-next" onClick={onClick}>
			<FontAwesomeIcon icon={faAngleRight} />
		</button>
	);
}

function SamplePrevArrow(props) {
	const { onClick } = props;
	return (
		<button className="slick-arrow slick-prev" onClick={onClick}>
			<FontAwesomeIcon icon={faAngleLeft} />
		</button>
	);
}

function TrendingCategories(props) {
	const settings = {
		dots: false,
		infinite: true,
		autoplay: false,
		autoplaySpeed: 5000,
		speed: 500,
		arrows: true,
		slidesToShow: 1,
		slidesToScroll: 1,
		nextArrow: <SampleNextArrow />,
		prevArrow: <SamplePrevArrow />
	};
	const [trendingCollections, setTrendingCollections] = useState([])
	const dispatch = useDispatch()
	const trendingRes = useSelector((state) => state.rankings)

	useEffect(() => {
		dispatch(getTrendingCollections())
	}, [])

	useEffect(() => {
		if (trendingRes.trendingsAuth) {
			let trendings = trendingRes?.trendingsRes?.trendingCollections?.length > 0 ? trendingRes?.trendingsRes?.trendingCollections : []
			setTrendingCollections(trendings)
			dispatch(beforeTrending())
		}
	}, [trendingRes.trendingsAuth])

	useEffect(() => {
	}, [trendingCollections])

	return (
		<section className="trending-categories-section">
			<Container>
				<div className="heading-section text-center">
					<h2 className="mb-0 ff-poppins fw-bold text-white">Trending in All Categories</h2>
				</div>
				<div className="trending-categories-block">
					{
						trendingCollections?.length > 0 ?
							<Slider {...settings} className="trending-categories-slider">
								{
									trendingCollections?.map((collection, index) => {
										const r1 = (trendingCollections.length - 3) % 3 // last slide no. of items

										if (index % 3 === 0)
											return (
												<div className="slide-holder" key={index}>
													{
														(trendingCollections.length < 3 || index + r1 === trendingCollections.length) ?
															<Row>
																<Col lg={6} xxl={8} className={`offset-xxl-2 offset-lg-3 d-flex justify-content-center align-items-center flex-column`}>
																	{
																		trendingCollections[index] && <TrendingCategoryItem item={trendingCollections[index].collection} owner={trendingCollections[index].owner} isLandscape={true} />
																	}
																	{
																		trendingCollections[index + 1] && <TrendingCategoryItem item={trendingCollections[index + 1].collection} owner={trendingCollections[index + 1].owner} isLandscape={true} />
																	}
																</Col>
															</Row>
															:
															<Row>
																<Col lg={6} xxl={8}>
																	{
																		trendingCollections[index] && <TrendingCategoryItem item={trendingCollections[index].collection} owner={trendingCollections[index].owner} isLandscape={true} />
																	}
																	{
																		trendingCollections[index + 1] && <TrendingCategoryItem item={trendingCollections[index + 1].collection} owner={trendingCollections[index + 1].owner} isLandscape={true} />
																	}
																</Col>
																<Col lg={6} xxl={4}>
																	{
																		trendingCollections[index + 2] && <TrendingCategoryItem item={trendingCollections[index + 2].collection} owner={trendingCollections[index + 2].owner} />
																	}
																</Col>
															</Row>
													}
												</div>
											)
									})
								}
							</Slider>
							:
							<div className="no-data border mb-4"><p className='text-center'>No data found for trending in all categories</p></div>
					}
				</div>
			</Container>
		</section>
	);
}
export default TrendingCategories;