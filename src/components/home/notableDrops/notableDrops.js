import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleRight } from '@fortawesome/free-solid-svg-icons'
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons'
import Slider from "react-slick";
import './notableDrops.css';
import { getNotableDrops, beforeNotableDrops } from '../../collections/collections.actions'
import { useSelector, useDispatch } from 'react-redux';
import Tilt from 'react-tilt';
const dropsClasses = [
	// for 1 item in a slide
	{
		parentClass: 'notable-slide-4',
		childClasses: [
			'single-drop notable-landscape'
		]
	},
	// for 2 items in a slide
	{
		parentClass: 'notable-slide-1',
		childClasses: [
			'single-drop notable-landscape',
			'double-drop notable-landscape'
		]
	},
	// for 3 items in a slide
	{
		parentClass: 'notable-slide-2 ',
		childClasses: [
			'triple-drop-1 notable-landscape',
			'triple-drop-2 notable-landscape',
			'triple-drop-3 notable-portrait-1'
		]
	},
	// for 4 items in a slide
	{
		parentClass: 'notable-slide-3',
		childClasses: [
			'forth-drop-1 notable-landscape-1',
			'forth-drop-2 notable-landscape-1',
			'forth-drop-3 notable-landscape-1',
			'forth-drop-4 notable-landscape-1'
		]
	},
	// for 5 items in a slide
	{
		parentClass: 'notable-slide',
		childClasses: [
			'notable-item-01 notable-landscape',
			'notable-item-02 notable-portrait',
			'notable-item-03 notable-portrait',
			'notable-item-04 notable-square',
			'notable-item-05 notable-landscape'
		]
	},
]
const maxItems = 5

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

function NotableDrops(props) {
	const settings = {
		dots: true,
		infinite: true,
		speed: 500,
		slidesToShow: 1,
		slidesToScroll: 1,
		nextArrow: <SampleNextArrow />,
		prevArrow: <SamplePrevArrow />
	};
	const navigate = useNavigate()
	const dispatch = useDispatch()
	const collectionRes = useSelector((state) => state.collection)
	const [notableDrops, setNotableDrops] = useState([])
	const [itemsToShow, setItemsToShow] = useState([]) // no. of items to show in a single slide
	const [slidesToShow, setSlidesToShow] = useState([]) // no. slides to show in a slider

	useEffect(() => {
		dispatch(getNotableDrops())
	}, [])

	useEffect(() => {
		if (collectionRes.notableDropsAuth) {
			let data = collectionRes?.notableDrops?.notableDrops.length ? collectionRes.notableDrops.notableDrops : []
			setNotableDrops(data)
		}
	}, [collectionRes.notableDropsAuth])

	// set no. of slides to show in a slider & no. of items to show in a slide
	useEffect(() => {
		if (notableDrops?.length) {
			const q = Math.floor(notableDrops.length / maxItems) // quotient
			const r = (notableDrops.length % maxItems) // remiander

			let itemsToShow = []

			if (q)
				itemsToShow = new Array(q).fill(maxItems) // each index of this array would represent the total number of items to show in a slider

			if (r)
				itemsToShow.push(r)

			setItemsToShow(itemsToShow)

			let slides = new Array(itemsToShow.length).fill('S')
			setSlidesToShow(slides)
		}
	}, [notableDrops?.length])

	const navigateToUrl = (url) => {
		navigate(`/collection/${url}`)
	}

	let notableDropsIdx = - 1
	return (
		<section className="notable-drops position-relative">
			<Container>
				<div className="heading-section text-center">
					<h2 className="mb-0 ff-poppins fw-bold text-white">Notable Drops</h2>
				</div>
				{
					slidesToShow?.length > 0 ?
						<Slider {...settings} className={`notable-drops-slider ${slidesToShow.length > 1 ? 'notable-slide-height' : ''}`}>
							{
								slidesToShow.map((slide, slideIndex) => {
									const dropsClassIndex = itemsToShow[slideIndex] - 1
									return (
										<div key={`notable_drop_slide_${slideIndex}`} className={`${dropsClasses[dropsClassIndex].parentClass} position-relative`}>
											{
												dropsClasses[dropsClassIndex].childClasses.map((childClass, itemsIndex) => {
													notableDropsIdx++

													return (
														<div key={`${itemsIndex}_items_for_slide_${slideIndex}`} className={`notable-item ${childClass}`}>
															<Tilt className="Tilt" options={{ max: 10 }} >
																<img className="cursor-pointer" src={notableDrops[notableDropsIdx].featuredImg} alt="Notable Drops Image" onClick={() => navigateToUrl(notableDrops[notableDropsIdx].url)} />
															</Tilt>
															<div className="item-detail text-center text-white">
																<strong className="item-name cursor-pointer" onClick={() => navigateToUrl(notableDrops[notableDropsIdx].url)}>{notableDrops[notableDropsIdx].name}</strong>
																<p className="mb-2">{notableDrops[notableDropsIdx].description}</p>
															</div>
														</div>
													)
												})
											}
										</div>
									)
								})
							}
						</Slider>
						:
						<div className="no-data border mb-4"><p className='text-center'>No data found for notable drops</p></div>
				}
			</Container>
		</section>
	);
}
export default NotableDrops;