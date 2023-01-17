import React from 'react';
import { Images } from '../../../assets/asset';
import './trendingCategoryItem.css';
import { useNavigate } from 'react-router-dom';
import Tilt from 'react-tilt';

function TrendingCategoryItem(props) {
	const navigate = useNavigate()
	return (
		<div className="trending-category-item mb-4">
			<div className={`item-holder position-relative ${props.isLandscape === true ? "landscape-image" : 'portrait-image'}`}>
				<div className="main-img">
				<Tilt className="Tilt" options={{ max: 10 }} >
					<img className="img-fluid  cursor-pointer" src={props.item?.featuredImg} alt={props.item?.featuredImg} onClick={() => navigate(`/collection/${props.item.url}`)} />
				</Tilt>
				</div>
				<div className="category-detail-block text-white">
					<div className="d-flex justify-content-center align-items-center mb-4 position-relative">
						<div className="category-image-holder cursor-pointer" onClick={() => navigate(`/collection/${props.item.url}`)}>
							<img src={props.item?.logo} alt={props.item?.logo} />
						</div>
						<div className="category-detail-holder d-flex flex-column">
							<strong className="category-name cursor-pointer" onClick={() => navigate(`/collection/${props.item.url}`)}>{props.item?.name}</strong>
							<span className="author-name cursor-pointer" onClick={() => navigate(`/author/${props.owner._id}`)}>by <span className='owner-name'>{`${props.owner?.name}`}</span></span>
						</div>
					</div>
					<div className="category-desc position-relative text-center">
						<p>{props.item?.description}</p>
					</div>
				</div>
			</div>
		</div>
	);
}
export default TrendingCategoryItem;