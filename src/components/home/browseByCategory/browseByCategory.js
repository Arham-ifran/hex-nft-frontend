import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import Slider from "react-slick";
import { useNavigate } from 'react-router-dom';
import './browseByCategory.css';

function BrowseByCategory(props) {
	const navigate = useNavigate()
	const [categories, setCategories] = useState([])
	const [itemsInSlider, setItemsInSlider] = useState([]) // no. items to show in a single slider
	const [sliders, setSliders] = useState(0) // no. of sliders to create at runtime
	const maxSlidesInRow = 8 // max. no. of items / slides to show in a row (i.e. divisor)
	const slidesToShow = 4.1 // no. of slides to show at a time on screen

	// for sliders at even index
	const settingsA = {
		dots: false,
		infinite: true,
		autoplay: true,
		autoplaySpeed: 2800,
		speed: 2800,
		arrows: false,
		slidesToShow,
		slidesToScroll: 1,
		pauseOnHover: false,
		pauseOnFocus: false,
		responsive: [
			{
				breakpoint: 1024,
				settings: {
					slidesToShow: 3,
				}
			},
			{
				breakpoint: 600,
				settings: {
					slidesToShow: 2,
				}
			},
			{
				breakpoint: 480,
				settings: {
					slidesToShow: 1,
				}
			}
		]
	}

	// for sliders at odd index
	const settingsB = {
		dots: false,
		infinite: true,
		autoplay: true,
		autoplaySpeed: 2500,
		speed: 2500,
		arrows: false,
		slidesToShow,
		slidesToScroll: 1,
		pauseOnHover: false,
		pauseOnFocus: false,
		responsive: [
			{
				breakpoint: 1024,
				settings: {
					slidesToShow: 3,
				}
			},
			{
				breakpoint: 600,
				settings: {
					slidesToShow: 2,
				}
			},
			{
				breakpoint: 480,
				settings: {
					slidesToShow: 1,
				}
			}
		]
	}

	// set categories
	useEffect(() => {
		if (props.categories)
			setCategories(props.categories)
	}, [props.categories])

	// set no. of sliders to show & no. of items / slides to show in a slider
	useEffect(() => {
		if (categories?.length) {
			let slides = [] // each index of this array would represent the total number of slides to show in a single slider

			const q = Math.floor(categories.length / maxSlidesInRow) // quotient
			const r = (categories.length % maxSlidesInRow) // remiander
			slides.push(q * maxSlidesInRow)

			if (r)
				slides.push(r)

			setItemsInSlider(slides)

			let sliders = new Array(slides.length).fill('S')
			setSliders(sliders)
		}
	}, [categories?.length])

	let catIdx = -1 // categories index for loop

	return (
		<section className="browse-by-category">
			<div className="heading-section text-center">
				<h2 className="mb-0 ff-poppins fw-bold text-white">Browse by Category</h2>
			</div>
			{
				sliders?.length > 0 ?
					sliders.map((slider, sliderIndex) => {
						const slides = new Array(itemsInSlider[sliderIndex]).fill('item') // total slides to show in a slider
						let settings = sliderIndex % 2 === 0 ? { ...settingsA } : { ...settingsB }
						settings = { ...settings, slidesToShow: slides.length < slidesToShow ? slides.length : slidesToShow }

						return (
							<Slider key={`slider_${sliderIndex}`} {...settings} className="category-slider-one mb-5">
								{
									slides?.length > 0 &&
									slides.map((slide, slideIndex) => {
										catIdx++

										return (
											<div key={`cat_slider_${sliderIndex}_slide_${slideIndex}`}>
												<div className="category-slide position-relative cursor-pointer" onClick={() => navigate(`/category/${categories[catIdx]?.slug}`)}>
													<img src={categories[catIdx]?.image} alt="Category Image" />
													<strong className="category-name text-white">{categories[catIdx]?.name}</strong>
												</div>
											</div>
										)
									})
								}
							</Slider>
						)
					})
					:
					<Container>
						<div className="no-data border my-4"><p className='text-center'>No data found for browse by category</p></div>
					</Container>
			}
		</section >
	);
}
export default BrowseByCategory;