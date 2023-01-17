import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Images } from '../../../assets/asset';

// 
// 
import './createSellNft.css';
function CreateSellNft(props) {
	return (
		<section className="create-sell-nft position-relative">
			<Container className="position-relative">
				<div className="heading-section text-center">
					<h2 className="mb-0 ff-poppins fw-bold text-white">Create and Sell Your NFTs</h2>
				</div>
				<Row>
					<Col lg={4}>
						<div className="step-holder text-center position-relative mb-4 mb-lg-0">
							<div className="icon-holder mb-4 d-flex justify-content-center">
								<img className="transition" src={Images.iconCreateWallet} alt="Create Wallet Icon" />
							</div>
							<h3 className="fw-bold mb-3 text-white">Set Up Your Wallet</h3>
							<p>Lorem Ipsum is simply dummy text of printing and typesetting industry. Lorem Ipsum has been the industry's standar dummy text ever since the 1500s</p>
						</div>
					</Col>
					<Col lg={4}>
						<div className="step-holder text-center position-relative mb-4 mb-lg-0">
							<div className="icon-holder mb-4 d-flex justify-content-center">
								<img className="transition" src={Images.iconAddNft} alt="Create Wallet Icon" />
							</div>
							<h3 className="fw-bold mb-3 text-white">Add Your NFTs</h3>
							<p>Lorem Ipsum is simply dummy text of printing and typesetting industry. Lorem Ipsum has been the industry's standar dummy text ever since the 1500s</p>
						</div>
					</Col>
					<Col lg={4}>
						<div className="step-holder text-center position-relative mb-4 mb-lg-0">
							<div className="icon-holder mb-4 d-flex justify-content-center">
								<img className="transition" src={Images.iconCreateNft} alt="Create Wallet Icon" />
							</div>
							<h3 className="fw-bold mb-3 text-white">Sell Your NFTs</h3>
							<p>Lorem Ipsum is simply dummy text of printing and typesetting industry. Lorem Ipsum has been the industry's standar dummy text ever since the 1500s</p>
						</div>
					</Col>
				</Row>
			</Container>
		</section>
	);
}
export default CreateSellNft;