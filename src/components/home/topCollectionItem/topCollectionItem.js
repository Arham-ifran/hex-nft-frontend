import React from 'react';
import './topCollectionItem.css';
import { useNavigate } from 'react-router-dom';
import { ENV } from '../../../config/config';
const { cdnBaseUrl } = ENV
const bnbIcon = `${cdnBaseUrl}v1652166662/hex-nft/assets/binance_r40wgm.svg`
const myntIcon = `${cdnBaseUrl}v1652181693/hex-nft/assets/myntist_c8kphm.png`

function TopCollectionItem(props) {
	const navigate = useNavigate()
	return (
		<div className="top-collection-item position-relative text-white">
			<div className=" d-flex flex-column flex-lg-row align-items-center">
				<div className="collection-logo-holder position-relative order-1 order-lg-2 mb-3 mb-lg-0">
					<img src={props.collection?.logo} alt={props.collection?.name + " Logo"} className="cursor-pointer" onClick={() => navigate(`/collection/${props.collection.url}`)} />
				</div>
				<div className="collection-detail-holder me-lg-2 d-flex flex-column order-2 order-lg-1">
					<div className="main-wrapper d-flex">
						<span className="collection-count me-2">{props.collectionCount}</span>
						<div className="inner-wrapper d-flex flex-fill justify-content-between mb-2 flex-column flex-lg-row align-items-start align-items-lg-center">
							<strong className="collection-name" onClick={() => navigate(`/collection/${props.collection.url}`)}>{props.collection?.name}</strong>
							<span className={`collection-value ${props.isGrowing === true ? "text-success" : props.isGrowing === false ? "text-danger" : "text-white"}`}>{props.collectionValue}</span>
						</div>
					</div>

				</div>
			</div>
			<div className="d-flex collection-price-values align-items-start align-items-lg-center flex-column flex-lg-row">
				<span className="price-value-text me-lg-2">Floor Price:</span>
				<div className="initial-price d-flex align-items-center me-2 me-xxl-4">
					<span className="currency-icon">
						{
							props.currency === 'BNB' ?
								<img className="img-fluid" src={bnbIcon} alt="Bnb Icon" /> :
								props.currency === 'MYNT' ?
									<img className="img-fluid" src={myntIcon} alt="Mynt Icon" /> :
									<img className="img-fluid" src={bnbIcon} alt="Bnb Icon" />
						}
					</span>
					&nbsp;
					<span className="price-value">{props.initialPrice}</span>
				</div>
				<div className="sale-price d-flex d-flex align-items-center">
					<span className="currency-icon">
						<img className="img-fluid" src={bnbIcon} alt="Voulme in BNB" />
					</span>
					&nbsp;
					<span className="price-value">{props.finalPrice}</span>
				</div>
			</div>

		</div>
	);
}
export default TopCollectionItem;