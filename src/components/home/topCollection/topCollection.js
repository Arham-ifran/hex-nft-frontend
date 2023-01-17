import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleRight } from '@fortawesome/free-solid-svg-icons'
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons'
import Slider from "react-slick";
import TopCollectionItem from '../topCollectionItem/topCollectionItem';
import './topCollection.css';
import { useSelector, useDispatch } from 'react-redux';
import { getTopCollections, beforeTopCollection } from '../../rankings/rankings.action'

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
function TopCollection(props) {
	const settings = {
		dots: true,
		infinite: true,
		speed: 500,
		slidesToShow: 1,
		slidesToScroll: 1,
		nextArrow: <SampleNextArrow />,
		prevArrow: <SamplePrevArrow />
	};
	const [topCollections, setTopCollections] = useState([])
	const dispatch = useDispatch()
	const topCollectionRes = useSelector((state) => state.rankings)

	useEffect(() => {
		dispatch(getTopCollections())
	}, [])

	useEffect(() => {
		if (topCollectionRes.topCollectionsAuth) {
			let topCollections = topCollectionRes?.topCollectionsRes?.topCollections?.length ? topCollectionRes.topCollectionsRes.topCollections : []
			setTopCollections(topCollections)
			dispatch(beforeTopCollection())
		}

	}, [topCollectionRes.topCollectionsAuth])

	useEffect(() => {
	}, [topCollections])

	const cardsInSlide = [1, 2, 3, 4, 5, 6, 7, 8, 9]

	return (
		<section className="top-collections">
			<Container>
				<div className="heading-section text-center">
					<h2 className="mb-0 ff-poppins fw-bold text-white">Top Collection Over Last 7 Days</h2>
				</div>
				{
					topCollections?.length > 0 ?
						<Slider {...settings} className="top-collections-slider">
							{
								topCollections?.map((collection, parentIndex) => {
									if (parentIndex % 9 === 0)
										return (
											<div className="slide-holder" key={parentIndex}>
												<div className="top-collection-items">
													{
														cardsInSlide.map((card, cardIndex) => {
															let data = topCollections[parentIndex++]
															if (data)
																return (
																	<TopCollectionItem key={`card_${parentIndex}_${cardIndex}`} collectionCount={parentIndex} collection={data.collection} initialPrice={data.floorPrice ? data.floorPrice : 0} finalPrice={data.volume ? data.volume : 0} collectionValue={data.p7d} currency={data.currency} />
																)
														})
													}

												</div>
											</div>
										)
								})
							}
						</Slider>
						:
						<div className="no-data border mb-4"><p className='text-center'>No data found for top collection over last 7 days</p></div>
				}
			</Container>
		</section>
	);
}
export default TopCollection;