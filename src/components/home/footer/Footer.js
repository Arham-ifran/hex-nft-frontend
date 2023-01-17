import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebookF } from '@fortawesome/free-brands-svg-icons'
import { faLinkedinIn } from '@fortawesome/free-brands-svg-icons'
import { faYoutube } from '@fortawesome/free-brands-svg-icons'
import { faTwitter, faGithub, faReddit, faTelegram, faDiscord, faMedium, faInstagram } from '@fortawesome/free-brands-svg-icons'
import { Images } from '../../../assets/asset';
import { beforeSettings, getSettings } from './footer.action'
import { getCategories, beforeCategory } from '../../categories/categories.action';
import { getContentPages, beforeContent } from '../../content-management/cms.actions';
import { ENV } from '../../../config/config'
import { connect } from 'react-redux';
import './footer.css';
const { gamification } = ENV

function Footer(props) {
	const [settings, setSettings] = useState(null);
	const [categories, setCategories] = useState()
	const [contentPages, setContentPages] = useState()
	const [encryptedUser, setUser] = useState()

	useEffect(() => {
		setUser(localStorage.getItem('encuse') ? localStorage.getItem('encuse') : null)
		props.getSettings()
		props.getCategories()
		props.getContentPages()
	}, [])

	useEffect(() => {
		if (props.settings.settingsAuth) {
			const { settings } = props.settings
			props.beforeSettings()
			setSettings(settings)
		}
	}, [props.settings.settingsAuth])

	useEffect(() => {
		if (props.categories.getAuth) {
			setCategories(props.categories.categories)
			props.beforeCategory()
		}
	}, [props.categories.getAuth])

	useEffect(() => {
		if (props.content.cmsAuth) {
			setContentPages(props.content.contentPages.contentPages)
			props.beforeContent()
		}
	}, [props.content.cmsAuth])

	return (
		<footer id="footer" className="position-relative">
			<div className="top-footer">
				<Container>
					<Row>
						<Col lg={4}>
							<strong className="footer-logo mb-4 d-inline-block align-top">
								<Link className="d-inline-block align-top" to="/">
									<img src={Images.siteLogo} alt="Site Logo" />
								</Link>
							</strong>
							<div className="about-hex text-white">
								<p>{settings && settings.desc ? settings.desc : ''}</p>
							</div>
							<div className="footer-widget">
								<h3 className="fw-bold text-white mb-4">Join the Community</h3>
								{
									settings &&
									<ul className="list-unstyled social-links d-flex">
										{
											settings.facebook ?
												<li className="facebook">
													<a className="d-flex justify-content-center align-items-center rounded-circle transition" href={settings.facebook} target="_blank"><FontAwesomeIcon icon={faFacebookF} /></a>
												</li> : null
										}
										{
											settings.medium ?
												<li className="medium">
													<a className="d-flex justify-content-center align-items-center rounded-circle transition" href={settings.medium} target="_blank"><FontAwesomeIcon icon={faMedium} /></a>
												</li> : null
										}
										{
											settings.linkedIn ?
												<li className="linkedin">
													<a className="d-flex justify-content-center align-items-center rounded-circle transition" href={settings.linkedIn} target="_blank"><FontAwesomeIcon icon={faLinkedinIn} /></a>
												</li> : null
										}
										{
											settings.instagram ?
												<li className="instagram">
													<a className="d-flex justify-content-center align-items-center rounded-circle transition" href={settings.instagram} target="_blank"><FontAwesomeIcon icon={faInstagram} /></a>
												</li> : null
										}
										{
											settings.youtube ?
												<li className="youtube">
													<a className="d-flex justify-content-center align-items-center rounded-circle transition" href={settings.youtube} target="_blank"><FontAwesomeIcon icon={faYoutube} /></a>
												</li> : null
										}
										{
											settings.twitter ?
												<li className="twitter">
													<a className="d-flex justify-content-center align-items-center rounded-circle transition" href={settings.twitter} target="_blank"><FontAwesomeIcon icon={faTwitter} /></a>
												</li> : null
										}
										{
											settings.discord ?
												<li className="discord">
													<a className="d-flex justify-content-center align-items-center rounded-circle transition" href={settings.discord} target="_blank"><FontAwesomeIcon icon={faDiscord} /></a>
												</li> : null
										}
										{
											settings.reddit ?
												<li className="reddit">
													<a className="d-flex justify-content-center align-items-center rounded-circle transition" href={settings.reddit} target="_blank"><FontAwesomeIcon icon={faReddit} /></a>
												</li> : null
										}
										{
											settings.github ?
												<li className="github">
													<a className="d-flex justify-content-center align-items-center rounded-circle transition" href={settings.github} target="_blank"><FontAwesomeIcon icon={faGithub} /></a>
												</li> : null
										}
										{
											settings.telegram ?
												<li className="telegram">
													<a className="d-flex justify-content-center align-items-center rounded-circle transition" href={settings.telegram} target="_blank"><FontAwesomeIcon icon={faTelegram} /></a>
												</li> : null
										}
									</ul>
								}
							</div>
							<div className="web-owner-link">
								<h3 className="fw-bold text-white mb-4">Explore other Platforms</h3>
								<a target="_blank" href={gamification.domainUrl} className=" d-inline-flex align-items-center">
									<span className="gaming-img"><img className="img-fluid" src={Images.gamingIcon} /> </span>
									<span className="gaming-head ms-2">Gamification</span>
								</a>
							</div>
						</Col>
						<Col lg={8}>
							<Row>
								<Col sm={6} lg={3}>
									<div className="footer-nav-holder">
										<h3 className="fw-bold text-white">Marketplace</h3>
										<ul className="list-unstyled footer-nav">
											<li><Link className="position-relative transition" to="/explore-all">All NFTs</Link></li>
											{
												categories && categories.length ?
													categories.map((category, index) => {
														return <li key={index}><Link className="position-relative transition" to={`/category/${category.slug}`}>{category.name}</Link></li>
													}) : null

											}
										</ul>
									</div>
								</Col>
								<Col sm={6} lg={3}>
									<div className="footer-nav-holder">
										<h3 className="fw-bold text-white">My Account</h3>
										<ul className="list-unstyled footer-nav">
											<li><Link className="position-relative transition" to={encryptedUser && encryptedUser !== null ? '/profile' : '/login/referrer=profile'} >Profile</Link></li>
											<li><Link className="position-relative transition" to={encryptedUser && encryptedUser !== null ? '/my-favourites' : '/login/referrer=my-favourites'} >Favourites</Link></li>
											{/* <li><Link className="position-relative transition" to={encryptedUser && encryptedUser !== null ? '/my-watchlist' : '/login/referrer=my-watchlist'} >Watchlist</Link></li> */}
											<li><Link className="position-relative transition" to={encryptedUser && encryptedUser !== null ? '/my-collections' : '/login/referrer=my-collections'} >My Collections</Link></li>
										</ul>
									</div>
								</Col>
								<Col sm={6} lg={3}>
									<div className="footer-nav-holder">
										<h3 className="fw-bold text-white">Resources</h3>
										<ul className="list-unstyled footer-nav">
											<li><Link className="position-relative transition" to='/faq'>Help Center</Link></li>
											{
												contentPages && contentPages.length ?
													contentPages.map((contentPage, index) => {
														return <li key={index} ><Link className="position-relative transition" to={`/cms/${contentPage.slug}`} >{contentPage.title}</Link></li>
													}) : null
											}
										</ul>
									</div>
								</Col>
								<Col sm={6} lg={3}>
									<div className="footer-nav-holder">
										<h3 className="fw-bold text-white">Company</h3>
										<ul className="list-unstyled footer-nav">
											<li><Link className="position-relative transition" to='/contact'>Contact Us</Link></li>
											<li><Link className="position-relative transition" to='/privacy-and-terms'>Privacy Policy</Link></li>
											<li><Link className="position-relative transition" to='/how-it-works'>How It Works</Link></li>
										</ul>
									</div>
								</Col>
								<Col sm={6} lg={3}>
									<div className="footer-nav-holder">
										<h3 className="fw-bold text-white">Get Listed</h3>
										<ul className="list-unstyled footer-nav">
											<li><Link className="position-relative transition" to={encryptedUser && encryptedUser !== null ? '/integration' : '/login/referrer=integration'}>Integration</Link></li>
										</ul>
									</div>
								</Col>
								<Col sm={6} lg={3}>
									<div className="footer-nav-holder">
										<h3 className="fw-bold text-white">Stats</h3>
										<ul className="list-unstyled footer-nav">
											<li><Link className="position-relative transition" to='/rankings'>Rankings</Link></li>
											<li><Link className="position-relative transition" to='/activity'>Activity</Link></li>
										</ul>
									</div>
								</Col>
								<Col sm={6} lg={3}>
									<div className="footer-nav-holder">
										<h3 className="fw-bold text-white">Explore</h3>
										<ul className="list-unstyled footer-nav">
											<li><Link className="position-relative transition" to='/authors'>Authors</Link></li>
											<li><Link className="position-relative transition" to='/gift-cards'>Gift Cards</Link></li>
										</ul>
									</div>
								</Col>
							</Row>
						</Col>
					</Row>
				</Container>
			</div>
			<div className="bottom-footer position-relative">
				<Container>
					<div className="copyright-text text-center text-white">
						<p className="mb-0">All Rights Reserved by HEX Company</p>
					</div>
				</Container>
			</div>
		</footer>
	);
}

const mapStateToProps = state => ({
	error: state.error,
	settings: state.settings,
	categories: state.category,
	content: state.cms
});

export default connect(mapStateToProps, { beforeSettings, getSettings, getCategories, beforeCategory, getContentPages, beforeContent })(Footer);