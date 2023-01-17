import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Row, Col, Navbar, Form, ListGroup } from 'react-bootstrap';
import { Images } from '../../../assets/asset';
import { connect } from 'react-redux';
import { searchNft, beforeNFT } from '../../nfts/nfts.action'
import { setWalletAddress } from '../../wallet/wallet.action'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRightToBracket, faSearch, faWallet } from '@fortawesome/free-solid-svg-icons'
import { Dropdown } from 'react-bootstrap';
import './header.css';
import { ENV } from '../../../config/config';
import { toast } from 'react-toastify';
import $ from 'jquery';
var CryptoJS = require("crypto-js");
const { gamification } = ENV

function Header(props) {
	const navigate = useNavigate();
	const { pathname } = useLocation();
	const [nftData, setNftData] = useState(null);
	const [collectionData, setCollectionData] = useState(null)
	const [listCheck, setListCheck] = useState(false)
	const [userData, setUserData] = useState()
	const [dropCheck, setDropCheck] = useState(true)
	const [spinnerCheck, setSpinnerCheck] = useState(false)
	const [showNav, setShowNav] = useState(false)
	const userId = ENV.getUserKeys('_id')?._id

	useEffect(() => {
		const user = localStorage.getItem('encuse')
		if (user) {
			const userDecrypted = JSON.parse(CryptoJS.AES.decrypt(user, ENV.dataEncryptionKey).toString(CryptoJS.enc.Utf8));
			setUserData(userDecrypted)
		}
	}, [])

	useEffect(() => {
		let searchBarElem = document.querySelector('#site-search')
		if(searchBarElem && searchBarElem !== null && searchBarElem.value !== ''){
			searchBarElem.value = ''

		}

	},[window.location.pathname])

	const formatAddress = (address) => {
		return address ? address.substr(0, 6) + '...' + address.substr(-4) : null;
	}

	const search = (e) => {
		e.preventDefault()
		if (e.target[0].value) {
			const qs = ENV.objectToQueryString({ name: window.btoa(e.target[0].value) })
			props.searchNft(null, qs)
			setListCheck(false)
		}
	}

	useEffect(() => {
		if (props.nft.searchAuth) {
			const { nfts, collections } = props.nft.searchData
			if (nfts.length) {
				setNftData(nfts)
				setCollectionData(collections)
				props.beforeNFT()
				setSpinnerCheck(false)

			}
			else {
				setSpinnerCheck(false)
				setListCheck(true)
				props.beforeNFT()
				toast.error('No items found for this search!', { toastId: 'nft-not-found' })
			}
		}
	}, [props.nft.searchAuth])

	const rendList = () => {
		if (!listCheck) {
			return (
				<ListGroup className={listCheck ? `d-none` : ''} id="headerSearchList">
					{
						collectionData && collectionData.length ?
							<ListGroup.Item active>Collections</ListGroup.Item>
							: ''
					}
					{
						collectionData && collectionData.length ?
							collectionData.map((item, index) => {
								return (
									<Link to={`/collection/${item.url}`} key={index}><ListGroup.Item key={index}>{item.name}</ListGroup.Item></Link>
								)
							}) : ''
					}
					{
						nftData && nftData.length && !listCheck?
							<ListGroup.Item active>Items</ListGroup.Item>
							: ''
					}
					{
						nftData && nftData.length && !listCheck ? nftData.map((item, index) => {
							return (
								<Link to={`/item-details/${window.btoa(item._id)}`} key={index}><ListGroup.Item onClick={() => setListCheck(true)} key={index}>{item.name}</ListGroup.Item></Link>
							)
						}) : ''
					}
				</ListGroup>
			)
		}
	}

	const logoutHandler = () => {
		localStorage.clear()
		setDropCheck(false)
		navigate('/')
	}

	const [isActive, setActive] = useState(false);
	const toggleClass = () => {
		setActive(!isActive);

	};

	useEffect(() => {
		if (isActive) {
			$('#basic-navbar-nav').hide()
			// $('#basic-navbar-nav').removeClass('show')
			setShowNav(false)
		}
	}, [isActive])

	useEffect(() => {
		if (showNav) {
			// $('#basic-navbar-nav').addClass('show')
			$('#basic-navbar-nav').show()
		}
		else {
			$('#basic-navbar-nav').removeClass('show')
			$('#basic-navbar-nav').hide()
		}
	}, [showNav])

	const hideNavBar = () => {
		$('#basic-navbar-nav').hide()
		$('#basic-navbar-nav').removeClass('show')
	}

	return (
		<>
			<header id="header" className={`header d-flex justify-content-between align-items-center position-relative ${isActive ? "search-open" : ""}`}>
				<div className="d-flex align-items-center">
					<strong className="logo d-inline-block align-top">
						<Link to="/" className="d-inline-block align-top">
							<img className="img-fluid" src={Images.siteLogo} alt="Site Logo" />
						</Link>
					</strong>
					<form onSubmit={(e) => { search(e) }} className="header-search-form position-relative d-none d-lg-block">
						<input type="search" id="site-search" placeholder="Enter to Search" aria-label="Search through site content"
							onChange={(e) => {
								if (!e.target.value) {
									setListCheck(true)
									setNftData(null)
								}
							}}
						/>
						<span className="search-icon">
							<img src={Images.iconSearch} alt="Icon Search" />
						</span>
						{
							!spinnerCheck ?
								<span onClick={() => {
									if (document.querySelector('#site-search').value) {
										props.searchNft(null,ENV.objectToQueryString({ name: window.btoa(document.querySelector('#site-search').value) }))
										setListCheck(false)
										setSpinnerCheck(true)
									}
								}}>
									<span className="search-icon">
										<img src={Images.iconSearch} alt="Icon Search" />
									</span>
								</span>
								:
								<div className="spiner-loader">
									<div className={'spinner-border'} role="status">
										<span className="sr-only">Loading...</span>
									</div>
								</div>
						}
						{
							rendList()
						}
					</form>

				</div>
				<div className="d-flex justify-content-end">
					<Navbar expand="lg" className="pos-stat justify-content-end p-0" onClick={() => { setActive(false); setShowNav(!showNav) }}>
						<Navbar.Toggle aria-controls="basic-navbar-nav" />
						<Navbar.Collapse id="basic-navbar-nav" className={"justify-content-end"}>
							<ul className="navbar-nav align-items-lg-center">
								<li className={`nav-item ${pathname?.toLowerCase() === '/explore-all' ? 'active' : ''}`} onClick={hideNavBar}><Link className="nav-link transition position-relative" to="/explore-all" spy={"true"} smooth={"true"} offset={-70} duration={100} activeclass="active">Marketplace</Link></li>
								<li className={`nav-item ${pathname?.toLowerCase() === '/collections' ? 'active' : ''}`} onClick={hideNavBar}><Link className="nav-link transition position-relative" to="/collections" spy={"true"} smooth={"true"} offset={-70} duration={100} activeclass="active">Collections</Link></li>
								<li className={`nav-item ${pathname?.toLowerCase() === '/auctions' ? 'active' : ''}`} onClick={hideNavBar}><Link className="nav-link transition position-relative" to="/auctions" spy={"true"} smooth={"true"} offset={-70} duration={100} activeclass="active">Live Auctions</Link></li>
								<li className={`nav-item ${pathname?.toLowerCase() === '/rankings' ? 'active' : ''}`} onClick={hideNavBar}><Link className="nav-link transition position-relative" to="/rankings" spy={"true"} smooth={"true"} offset={-70} duration={100} activeclass="active">Rankings</Link></li>
								<li className={`nav-item ${pathname?.toLowerCase() === '/activity' ? 'active' : ''}`} onClick={hideNavBar}><Link className="nav-link transition position-relative" to="/activity" spy={"true"} smooth={"true"} offset={-70} duration={100} activeclass="active">Activity</Link></li>
								{(localStorage.getItem('encuse') && localStorage.getItem('encuse') !== 'null' && localStorage.getItem('encuse') !== null) && dropCheck
									?
									<li className={`nav-item ${pathname?.toLowerCase() === '/login' ? 'active' : ''} d-none d-lg-block`}>
										<Dropdown>
											<Dropdown.Toggle id="dropdown-basic" className="btn ml-lg-auto btn-filled d-flex align-items-center">
												<FontAwesomeIcon icon={faWallet} className="wallet-icon me-2" /><span className="wallet-address">{formatAddress(localStorage.getItem('connectedAddress'))}</span>
											</Dropdown.Toggle>
											<Dropdown.Menu>
												<Dropdown.Item id="wallet-item-color" className={pathname?.toLowerCase() === '/profile' ? 'active-status' : ''} onClick={() => { navigate('/profile') }}>My Profile</Dropdown.Item>
												<Dropdown.Item id="wallet-item-color" className={pathname?.toLowerCase() === '/create' ? 'active-status' : ''} onClick={() => { navigate('/create') }}>Create</Dropdown.Item>
												<Dropdown.Item id="wallet-item-color" className={pathname?.toLowerCase() === '/my-collections' ? 'active-status' : ''} onClick={() => { navigate('/my-collections') }}>My Collections</Dropdown.Item>
												<Dropdown.Item id="wallet-item-color" className={pathname?.toLowerCase() === `/author/${userId}` ? 'active-status' : ''} onClick={() => { navigate(`/author/${userId}`) }}>My Items</Dropdown.Item>
												<Dropdown.Item id="wallet-item-color" className={pathname?.toLowerCase() === '/earnings' ? 'active-status' : ''} onClick={() => { navigate('/earnings') }}>My Earnings</Dropdown.Item>
												<Dropdown.Item id="wallet-item-color" className={pathname?.toLowerCase() === '/my-favourites' ? 'active-status' : ''} onClick={() => { navigate('/my-favourites') }}>My Favourites</Dropdown.Item>
												<Dropdown.Item id="wallet-item-color" className={pathname?.toLowerCase() === '/trading-history' ? 'active-status' : ''} onClick={() => { navigate('/trading-history') }}>Trading History</Dropdown.Item>
												<Dropdown.Item id="wallet-item-color" className={pathname?.toLowerCase() === '/nft-reports' ? 'active-status' : ''} onClick={() => { navigate('/nft-reports') }}>NFTs Reporting</Dropdown.Item>
												<Dropdown.Item target="_blank" href={gamification.domainUrl} className="">Gamification</Dropdown.Item>
												<Dropdown.Item id="wallet-item-color" onClick={logoutHandler}>Logout</Dropdown.Item>
											</Dropdown.Menu>
										</Dropdown>
									</li>
									:
									<li>
										<Link className="btn-login transition btn-gradiant-bg ff-poppins fw-bold d-inline-block align-top d-none d-lg-block" to="/login">
											<span className="outer">
												<span className="inner">Login</span>
											</span>
										</Link>
									</li>

								}

							</ul>
						</Navbar.Collapse>
					</Navbar>
				</div>
				<div className="mobile-search-block d-block d-lg-none">
					<span className="search-icon cursor-pointer" onClick={toggleClass}>
						<img src={Images.iconSearch} alt="Icon Search" />
					</span>
					{((localStorage.getItem('encuse') && localStorage.getItem('encuse') !== 'null' && localStorage.getItem('encuse') !== null) && dropCheck) &&
						<span className="header-dropdown">
							<Dropdown>
								<Dropdown.Toggle id="dropdown-basic" className="btn ml-lg-auto btn-filled d-flex align-items-center">
									<FontAwesomeIcon icon={faWallet} className="wallet-icon me-2" /><span className="wallet-address">{formatAddress(localStorage.getItem('connectedAddress'))}</span>
								</Dropdown.Toggle>
								<Dropdown.Menu>
									<Dropdown.Item id="wallet-item-color" className={pathname?.toLowerCase() === '/profile' ? 'active-status' : ''} onClick={() => { navigate('/profile') }}>My Profile</Dropdown.Item>
									<Dropdown.Item id="wallet-item-color" className={pathname?.toLowerCase() === '/create' ? 'active-status' : ''} onClick={() => { navigate('/create') }}>Create</Dropdown.Item>
									<Dropdown.Item id="wallet-item-color" className={pathname?.toLowerCase() === '/my-collections' ? 'active-status' : ''} onClick={() => { navigate('/my-collections') }}>My Collections</Dropdown.Item>
									<Dropdown.Item id="wallet-item-color" className={pathname?.toLowerCase() === `/author/${userId}` ? 'active-status' : ''} onClick={() => { navigate(`/author/${userId}`) }}>My Items</Dropdown.Item>
									<Dropdown.Item id="wallet-item-color" className={pathname?.toLowerCase() === '/earnings' ? 'active-status' : ''} onClick={() => { navigate('/earnings') }}>My Earnings</Dropdown.Item>
									<Dropdown.Item id="wallet-item-color" className={pathname?.toLowerCase() === '/my-favourites' ? 'active-status' : ''} onClick={() => { navigate('/my-favourites') }}>My Favourites</Dropdown.Item>
									<Dropdown.Item id="wallet-item-color" className={pathname?.toLowerCase() === '/trading-history' ? 'active-status' : ''} onClick={() => { navigate('/trading-history') }}>Trading History</Dropdown.Item>
									<Dropdown.Item id="wallet-item-color" className={pathname?.toLowerCase() === '/nft-reports' ? 'active-status' : ''} onClick={() => { navigate('/nft-reports') }}>NFTs Reporting</Dropdown.Item>
									<Dropdown.Item target="_blank" href={gamification.domainUrl} className="gamification-url">Gamification</Dropdown.Item>
									<Dropdown.Item id="wallet-item-color" onClick={logoutHandler}>Logout</Dropdown.Item>
								</Dropdown.Menu>
							</Dropdown>
						</span>

					}
					{
						(!localStorage.getItem('encuse')) &&
						<Link to="/login" className="login-icon cursor-pointer">
							<FontAwesomeIcon icon={faRightToBracket} />
						</Link>
					}
					<Form className="search-form transition">
						<Form.Control className="transition" type="text" placeholder="Enter to Search"
						// onChange={(e) => {
						// 	if (!e.target.value) {
						// 		setListCheck(true)
						// 	}
						// }}
						/>
					</Form>
					<form onSubmit={(e) => { search(e) }} className="search-form transition">
						<input type="text" id="site-search" placeholder="Enter to Search" className="transition" aria-label="Search through site content"
							onChange={(e) => {
								if (!e.target.value) {
									setListCheck(true)
									setNftData(null)
								}
							}}
						/>
						{
							!spinnerCheck ?
								<span onClick={() => {
									if (document.querySelector('#site-search').value) {
										props.searchNft(null,ENV.objectToQueryString({ name: window.btoa(document.querySelector('#site-search').value )}))
										setListCheck(false)
										setSpinnerCheck(true)
									}
								}}>
									<span className="search-icon-inner">
										<FontAwesomeIcon icon={faSearch} className="search-icon-i" />
									</span>
								</span>
								:
								<div className="spiner-loader">
									<div className={'spinner-border'} role="status">
										<span className="sr-only">Loading...</span>
									</div>
								</div>
						}
					</form>
				</div>
			</header>
			{props.wallet && props.wallet.walletError ? <Row>
				<Col md={12} className='p-0'>
					<div id="global-warning" className="global-warning">
						<div className="warning-text position-relative">
							<div className="close-icon p-3 text-center">
								<p className="mb-0 text-white">{props.wallet.walletError}</p>
							</div>
						</div>
					</div>
				</Col>
			</Row> : ''}
		</>
	);
}

const mapStateToProps = state => ({
	wallet: state.wallet,
	nft: state.nft
});

export default connect(mapStateToProps, { setWalletAddress, searchNft, beforeNFT })(Header);