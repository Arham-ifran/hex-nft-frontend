import React, { useState, useEffect } from "react";
import { Row, Col, Nav } from "react-bootstrap";
import Tab from "react-bootstrap/Tab";
import { connect } from "react-redux";
import { beforeNFT, getNFT, upsertNFT } from "./nfts.action";
import { beforeSettings, getSettings } from '../home/footer/footer.action'
import FullPageLoader from "../../components/loaders/full-page-loader";
import NFTPreview from "../nft-preview/nft-preview";
import DateRangePicker from "react-bootstrap-daterangepicker";
import "bootstrap-daterangepicker/daterangepicker.css";
import moment from "moment";
import validator from 'validator';
import { changeSellingStatusWeb3 } from './../../utils/web3'
import { ENV } from "../../config/config";
import { useNavigate, useParams } from "react-router-dom";
// import ReactTooltip from 'react-tooltip'
import Gamification from '../gamification/gamification';
const { decimalNumberValidator, dateRangeInitialSettings, rightsManagementOptions, objectToQueryString } = ENV

const config1 = {
	price: {
		currency: "",
		amount: "",
	},
	listingSchedule: {
		startDate: moment(),
		endDate: moment().add(6, "months"),
		startTime: moment(new Date()).add(10, 'minutes').format("HH:mm"),
		endTime: "23:59",
	},
	reserveFor: "", // if user selects reserve buyer
};
const config2 = {
	method: 1, // 1 = Sell to the highest bidder or 2 = Sell with the declining price
	startPrice: {
		currency: "",
		amount: "",
	},
	endPrice: {
		currency: "",
		amount: "",
	},
	duration: {
		startDate: moment(),
		endDate: moment().add(6, "months"),
		startTime: moment(new Date()).add(10, 'minutes').format("HH:mm"),
		endTime: "23:59",
	},
	// if user includes reserve price
	reservePrice: {
		currency: "",
		amount: "",
	},
};

const SellNFT = (props) => {
	const navigate = useNavigate()
	const [sharePercentages, setSharePercentages] = useState({})
	const [sellingMethod, setSellingMethod] = useState(1); // 1 = Fixed Price, 2 = Timed Auction
	const [fixedPriceConfig, setFixedPriceConfig] = useState(config1);
	const [timedAuctionConfig, setTimedAuctionConfig] = useState(config2);
	const [nft, setNft] = useState(null);
	const [loader, setLoader] = useState(true); // NFT loader
	const reserveBuyer = false
	const [reservePrice, setReservePrice] = useState(false)
	const [submitCheck, setSubmitCheck] = useState(false)
	const [paymentTokens, setPaymentTokens] = useState([])
	const [rights, setRights] = useState(1)
	const [rightsOptions, setRightsOptions] = useState(rightsManagementOptions)
	// const [eventType, setEventType] = useState('')
	const { _id } = ENV.getUserKeys('_id')
	const { itemId } = useParams();

	const [priceMsg, setPriceMsg] = useState({
		currency: '',
		amount: '',
		reserveFor: '',
		startTimeMsg: '',
		endTimeMsg: ''
	})
	const [auctionMsg, setAuctionMsg] = useState({
		currency: '',
		amount: '',
		price: '',

		ecurrency: '',
		eamount: '',
		eprice: '',

		rcurrency: '',
		ramount: '',
		rprice: '',

		startTimeMsg: '',
		endTimeMsg: ''
	})

	useEffect(() => {
		if (localStorage.getItem('encuse')) {
			window.scroll(0, 0);
			if (itemId) {
				const qs = objectToQueryString({ page: 'sell' })
				props.getNFT(window.atob(itemId), qs)
				props.getSettings()
			}
			else navigate("/explore-all");
		}
		else {
			navigate("/login")
		}
	}, [])

	// when settings are retrieved
	useEffect(() => {
		if (props.settings?.settingsAuth) {
			const { settings } = props.settings

			if (!settings || !settings.paymentTokens || (settings.paymentTokens && !(settings.paymentTokens.length))) {
				let fPConfig = { ...fixedPriceConfig }
				fPConfig.price.currency = ''
				setFixedPriceConfig({ ...fPConfig })

				let tAConfig = { ...timedAuctionConfig }
				tAConfig.startPrice.currency = ''
				tAConfig.endPrice.currency = ''
				tAConfig.reservePrice.currency = ''
				setTimedAuctionConfig({ ...tAConfig })
			}
			else if (settings.paymentTokens && settings.paymentTokens.length) {
				setPaymentTokens(settings.paymentTokens)

				let fPConfig = { ...fixedPriceConfig }
				fPConfig.price.currency = settings.paymentTokens[settings.paymentTokens.length - 1]
				setFixedPriceConfig({ ...fPConfig })

				let tAConfig = { ...timedAuctionConfig }
				tAConfig.startPrice.currency = settings.paymentTokens[settings.paymentTokens.length - 1]
				tAConfig.endPrice.currency = settings.paymentTokens[settings.paymentTokens.length - 1]
				tAConfig.reservePrice.currency = settings.paymentTokens[settings.paymentTokens.length - 1]
				setTimedAuctionConfig({ ...tAConfig })
			}
			props.beforeSettings()
		}
	}, [props.settings.settingsAuth])

	// when NFT data is received
	useEffect(() => {
		if (props.nft.nftsAuth) {
			const nft = props.nft.nftsData;
			setNft(nft);
			setRights(nft.rights)
			props.beforeNFT();
			if (!nft) navigate("/explore-all")
			setLoader(false);
		}
	}, [props.nft.nftsAuth])

	// when NFT data is updated
	useEffect(() => {
		if (props.nft.upsertAuth) {
			// setEventType('selling')
			const { nft } = props.nft.nftsData;
			const pathname = nft.sellingMethod === 1 ? '/explore-all' : '/auctions'
			setLoader(false);
			props.beforeNFT();
			navigate(pathname);
		}
	}, [props.nft.upsertAuth]);

	// when an error is received
	useEffect(() => {
		if (props.error) {
			setLoader(false);
		}
	}, [props.error]);

	const onChange = (e) => {
		const { name, value } = e.target;
		let data = null;
		if (sellingMethod === 1)
			data = fixedPriceConfig;
		else data = timedAuctionConfig;

		const keys = name.split("."); // fixedPriceConfig, price, currency
		if (keys && keys[2])
			data[keys[1]][keys[2]] = value;
		else if (keys && keys[1])
			data[keys[1]] = value;

		if (sellingMethod === 1) {
			const startTime = moment(data.listingSchedule.startTime, 'HH:mm')
			const endTime = moment(data.listingSchedule.endTime, 'HH:mm')
			let isEndDateBeforeOrSame = moment(data.listingSchedule.endDate.format('YYYY-MM-DD')).isSameOrBefore(moment(new Date()).format('YYYY-MM-DD'))
			let validCheck = true

			if (submitCheck) {
				let startTimeMsg = '', endTimeMsg = ''

				if (startTime.isBefore(moment(new Date(), "HH:mm"))) {
					startTimeMsg = 'Please provide valid Start Time'
					validCheck = false
				}

				if ((isEndDateBeforeOrSame && endTime.isBefore(moment(new Date(), "HH:mm")) && submitCheck)) {
					endTimeMsg = 'Please provide valid End Time'
					validCheck = false
				}

				setPriceMsg({ ...priceMsg, startTimeMsg, endTimeMsg })
			}
			if (validCheck) {
				data.listingSchedule.startDate.set({
					hour: startTime.get('hour'),
					minute: startTime.get('minute'),
					second: startTime.get('second')
				});
				data.listingSchedule.endDate.set({
					hour: endTime.get('hour'),
					minute: endTime.get('minute'),
					second: endTime.get('second')
				});
				setFixedPriceConfig({ ...data });

			}
		}
		else {
			const startTime = moment(data.duration.startTime, 'HH:mm')
			const endTime = moment(data.duration.endTime, 'HH:mm')
			let validCheck = true
			let isEndDateBeforeOrSame = moment(data.duration.endDate.format('YYYY-MM-DD')).isSameOrBefore(moment(new Date()).format('YYYY-MM-DD'))
			let startTimeMsg = '', endTimeMsg = ''

			if (submitCheck) {
				if (startTime.isBefore(moment(new Date(), "HH:mm")) && submitCheck) {
					startTimeMsg = 'Please provide valid Start Time'
					validCheck = false
				}

				if (isEndDateBeforeOrSame && endTime.isBefore(moment(new Date(), "HH:mm")) && submitCheck) {
					endTimeMsg = 'Please provide valid End Time'
					validCheck = false
				}

				setAuctionMsg({ ...auctionMsg, startTimeMsg, endTimeMsg })
			}
			if (validCheck) {
				data.duration.startDate.set({
					hour: startTime.get('hour'),
					minute: startTime.get('minute'),
					second: startTime.get('second')
				});
				data.duration.endDate.set({
					hour: endTime.get('hour'),
					minute: endTime.get('minute'),
					second: endTime.get('second')
				});

				if (parseInt((timedAuctionConfig.method)) === 1) {
					timedAuctionConfig.reservePrice.currency = timedAuctionConfig.startPrice.currency
					timedAuctionConfig.endPrice = {
						currency: "",
						amount: "",
					}
				}
				else if (parseInt((timedAuctionConfig.method)) === 2) {
					timedAuctionConfig.endPrice.currency = timedAuctionConfig.startPrice.currency
					timedAuctionConfig.reservePrice = {
						currency: "",
						amount: "",
					}
					setReservePrice(false)
				}

				setTimedAuctionConfig({ ...data });
			}
		}
	};

	const handleDateChange = (e, picker) => {
		const { name } = e.target;
		const { startDate, endDate } = picker;

		// set start date
		onChange({
			target: {
				name: `${name}.startDate`,
				value: startDate,
			},
		});

		// set end date
		onChange({
			target: {
				name: `${name}.endDate`,
				value: endDate,
			},
		});
	};

	const manageRights = (e) => {
		const { value } = e.target
		setRights(value)
	}

	const submit = async () => {
		setSubmitCheck(true)
		if (sellingMethod === 1) {
			let currency = ''
			let amount = ''
			let reserveFor = ''
			let startTimeMsg = ''
			let endTimeMsg = ''
			if (validator.isEmpty(fixedPriceConfig.price.currency)) {
				currency = 'Currency Is Required.'
			}
			if (validator.isEmpty(fixedPriceConfig.price.amount)) {
				amount = 'Amount Is Required.'
			}
			if (reserveBuyer) {
				if (validator.isEmpty(fixedPriceConfig.reserveFor)) {
					reserveFor = 'Address Is Required.'
				}
			}

			const startTime = moment(fixedPriceConfig.listingSchedule.startTime, 'HH:mm')
			const endTime = moment(fixedPriceConfig.listingSchedule.endTime, 'HH:mm')
			let isEndDateBeforeOrSame = moment(fixedPriceConfig.listingSchedule.endDate.format('YYYY-MM-DD')).isSameOrBefore(moment(new Date()).format('YYYY-MM-DD'))

			if (startTime.isBefore(moment(new Date(), "HH:mm"))) {
				startTimeMsg = 'Please provide valid Start time'
			}
			if (isEndDateBeforeOrSame && endTime.isBefore(moment(new Date(), "HH:mm"))) {
				endTimeMsg = 'Please provide valid End time'
			}

			setPriceMsg({ currency, amount, reserveFor, startTimeMsg, endTimeMsg })
			if (currency || amount || reserveFor || startTimeMsg || endTimeMsg) {
				return
			}
		}
		else {
			let currency = ''
			let amount = ''
			let price = ''
			let ecurrency = ''
			let eamount = ''
			let eprice = ''
			let rcurrency = ''
			let ramount = ''
			let rprice = ''
			let startTimeMsg = ''
			let endTimeMsg = ''

			const startTime = moment(timedAuctionConfig.duration.startTime, 'HH:mm')
			const endTime = moment(timedAuctionConfig.duration.endTime, 'HH:mm')
			let isEndDateBeforeOrSame = moment(timedAuctionConfig.duration.endDate.format('YYYY-MM-DD')).isSameOrBefore(moment(new Date()).format('YYYY-MM-DD'))

			if (startTime.isBefore(moment(new Date(), "HH:mm"))) {
				startTimeMsg = 'Please provide valid Start time'
			}
			if (isEndDateBeforeOrSame && endTime.isBefore(moment(new Date(), "HH:mm"))) {
				endTimeMsg = 'Please provide valid End time'
			}

			if (validator.isEmpty(timedAuctionConfig.startPrice.amount)) {
				amount = 'Amount Is Required.'
			}
			if (validator.isEmpty(timedAuctionConfig.startPrice.currency)) {
				currency = 'Currency Is Required.'
			}
			if (parseInt(timedAuctionConfig.method) === 2) {
				if (validator.isEmpty(timedAuctionConfig.endPrice.amount)) {
					eamount = 'Amount Is Required.'
				}
				if (validator.isEmpty(timedAuctionConfig.endPrice.currency)) {
					ecurrency = 'Currency Is Required.'
				}
			}
			if (reservePrice) {
				if (validator.isEmpty(timedAuctionConfig.reservePrice.amount)) {
					ramount = 'Amount Is Required.'
				}
				else if (timedAuctionConfig.reservePrice.amount) {
					const MYNTtoBNB = props.app.myntToBnbRate || 0

					const reqAmount = (timedAuctionConfig.reservePrice.currency === 'BNB') && parseFloat(timedAuctionConfig.reservePrice.amount) >= 1
						? true
						: (timedAuctionConfig.reservePrice.currency === 'MYNT' && (parseFloat(timedAuctionConfig.reservePrice.amount) * MYNTtoBNB) >= 1
							? true
							: false)

					if (!reqAmount)
						if (timedAuctionConfig.reservePrice.currency === 'BNB')
							ramount = `Auctions can't have a reserve price lower than 1 ${timedAuctionConfig.reservePrice.currency}`
						else if (timedAuctionConfig.reservePrice.currency === 'MYNT')
							ramount = `Auctions can't have a reserve price lower than ${(1 / MYNTtoBNB).toFixed(7)} ${timedAuctionConfig.reservePrice.currency} (i.e. ≡ 1 ${ENV.currency})`
				}
				if (validator.isEmpty(timedAuctionConfig.reservePrice.currency)) {
					rcurrency = 'Currency Is Required.'
				}
			}
			setAuctionMsg({ currency, amount, price, ecurrency, eamount, eprice, rcurrency, ramount, rprice, startTimeMsg, endTimeMsg })
			if (currency || amount || price || ecurrency || eamount || eprice || rcurrency || ramount || rprice || startTimeMsg || endTimeMsg) {
				return
			}
		}
		const payload = {
			_id: nft._id,
			collectionId: nft.collection?._id,
			sellingMethod,
			sellingConfig: JSON.stringify(
				sellingMethod === 1
					? fixedPriceConfig
					: timedAuctionConfig
			),
		};
		setFixedPriceConfig(config1)
		setTimedAuctionConfig(config2)
		setLoader(true);
		let sellingPrice = 0;
		if (sellingMethod === 1) {
			let sellingConfig = JSON.parse(payload.sellingConfig);
			sellingPrice = sellingConfig.price.amount;
		} else {
			let sellingConfig = JSON.parse(payload.sellingConfig);
			sellingPrice = sellingConfig.startPrice.amount;
		}
		const _nftData = {
			price: sellingPrice,
			nft: nft.address,
		}
		const signature = await changeSellingStatusWeb3(_nftData, nft._id);
		if (signature) {
			var formData = new FormData();
			for (const key in payload) {
				formData.append(key, payload[key]);
			}

			formData.append('sellingSign', signature)

			props.upsertNFT("edit", formData, "PUT");
		}
		else {
			setLoader(false);
			return false;
		}
	};

	return (
		<div className="padding-wrapper sell-nft">
			{loader && <FullPageLoader />}
			<div className="container">
				{/* <Gamification eventType={eventType} /> */}
				<div className="card">
					<div className="row justify-content-between">
						<div className="col-12 col-md-4 mb-md-0 mb-5">
							<div className="summary-container">
								{nft && <NFTPreview {...nft} from={'sell-nft'} />}
							</div>
						</div>
						<div className="d-none d-md-block col-1">
							<div className="divider text-center">
								<span className="divider-in"></span>
							</div>
						</div>
						<div className="col-12 col-md-7">
							<div className="tabs-container">
								<span className="head-wrapper py-4">
									List NFT for Sale
								</span>
								<div className="market-tabs-wrapper">
									<Tab.Container id="marketplace-tabs" defaultActiveKey="fixedPrice">
										<Row>
											<Col lg="12" md="12" sm="12" xs="12">
												<Nav variant="pills" className="flex-row justify-content-between flex-column mb-4 mb-sm-0">
													<div className="d-flex justify-content-between text-white">
														<div className="mb-2 text-white"><b>Type</b></div>
														<div className="d-flex align-items-center cursor-pointer" data-effect="float" data-tip="We offer two types of listing options: Fixed Price and Timed Auction.">
															<i className="fas fa-exclamation-circle ml-2 text-white" />
														</div>
													</div>
													<div className="d-flex flex-column flex-sm-row justify-content-between">
														<Nav.Item className="nav-item-wrapper mb-3">
															<Nav.Link eventKey="fixedPrice" onClick={() => setSellingMethod(1)}>
																<i className="fas fa-dollar-sign" />
																<div>Fixed Price</div>
															</Nav.Link>
														</Nav.Item>
														<Nav.Item className="nav-item-wrapper">
															<Nav.Link eventKey="timedAuction" onClick={() => setSellingMethod(2)}>
																<i className="fas fa-clock" />
																<div>Timed Auction</div>
															</Nav.Link>
														</Nav.Item>
													</div>
												</Nav>
											</Col>
										</Row>
										<div className="market-tab-content">
											<Tab.Content>
												<Tab.Pane eventKey="fixedPrice">
													<div className="price-wrapper pt-0">
														<div className="price-text position-relative mb-3">
															<div className="d-flex justify-content-between">
																<div className="mb-2 text-white"><b>Price</b></div>
																<div className="d-flex align-items-center cursor-pointer" data-effect="float" data-tip="List price and listing schedule cannot be edited once the item is listed. You will need to cancel your listing and relist the item with the updated price and dates.">
																	<i className="fas fa-exclamation-circle ml-2 text-white" />
																</div>
															</div>
															<div className="d-flex justify-content-between nft-select flex-column flex-sm-row">
																<select className="form-control" id="currency" name="fixedPriceConfig.price.currency" value={fixedPriceConfig.price.currency} onChange={(e) => onChange(e)}>
																	<option className="" value="">Select Currency</option>
																	{
																		paymentTokens && paymentTokens.map((token, index) => {
																			return (
																				<option key={index} value={token}>{token}</option>
																			)
																		})
																	}
																</select>
																<div className="ethereum-input">
																	<span className="input-wrap">
																		<input
																			type="text"
																			name="fixedPriceConfig.price.amount"
																			placeholder="Amount"
																			className="amount-btn flex-fill"
																			style={{ borderRadius: "4px", }}
																			onChange={(e) => {
																				onChange(e)
																				if (submitCheck) {
																					if (e.target.value) {
																						setPriceMsg({ ...priceMsg, amount: '' })
																					}
																					else {
																						setPriceMsg({ ...priceMsg, amount: 'Amount Is Required.' })
																					}
																				}
																			}
																			}
																			onKeyDown={(e) => decimalNumberValidator(e)}
																			defaultValue={fixedPriceConfig.price.amount}
																			required
																		/>
																	</span>
																	<div className="text-right dollar-wrapper text-white">
																		$ {
																			props.app.rateAuth && fixedPriceConfig.price.currency === 'BNB' && Number(fixedPriceConfig.price.amount) ?
																				ENV.convertBnbToUsd(fixedPriceConfig.price.amount, props.app.rate)
																				:
																				props.app.myntRateAuth && fixedPriceConfig.price.currency === 'MYNT' && Number(fixedPriceConfig.price.amount) ?
																					ENV.convertMyntToUsd(fixedPriceConfig.price.amount, props.app.myntRate)
																					: '0.00'
																		}
																	</div>
																</div>
															</div>
															<div>
																<label className={`text-danger pl-1 ${priceMsg.amount ? `` : `d-none`}`}>{priceMsg.amount}</label>
															</div>
															{
																submitCheck && priceMsg?.currency && fixedPriceConfig.price.amount &&
																<div>
																	<label className={`text-danger pl-1 ${priceMsg.currency ? `` : `d-none`}`}>{priceMsg.currency}</label>
																</div>
															}
														</div>
													</div>
													<div className="price-wrapper mb-3">
														<div className="price-text">
															<div className="text-white mb-2">
																<b>
																	Schedule Listing
																</b>
															</div>
															<div className="date-picker mb-3">
																<DateRangePicker
																	initialSettings={
																		dateRangeInitialSettings
																	}
																	onApply={
																		handleDateChange
																	}
																>
																	<button
																		name="fixedPriceConfig.listingSchedule"
																		className="calender-btn"
																	>

																		{fixedPriceConfig.listingSchedule.startDate.format(
																			"MMMM D, YYYY"
																		)}{" "}
																		-{" "}
																		{fixedPriceConfig.listingSchedule.endDate.format(
																			"MMMM D, YYYY"
																		)}
																		&nbsp;&nbsp;&nbsp;
																		<i className="fas fa-calendar-week" />
																	</button>
																</DateRangePicker>
															</div>
															<div className="d-flex auction-time-handlers justify-content-between">
																<div className="budle-wrapper">
																	<input type="time" name="fixedPriceConfig.listingSchedule.startTime" placeholder="Start Time" onChange={(e) => onChange(e)}
																		defaultValue={
																			fixedPriceConfig
																				.listingSchedule
																				.startTime
																		}
																		required
																	/>
																</div>
																<div className="budle-wrapper">
																	<input type="time" name="fixedPriceConfig.listingSchedule.endTime" placeholder="End Time" onChange={(e) => onChange(e)}
																		defaultValue={
																			fixedPriceConfig
																				.listingSchedule
																				.endTime
																		}
																		required
																	/>
																</div>

															</div>
															<div className="d-flex justify-content-between">
																<div>
																	<label className={`text-danger pl-1 ${priceMsg.startTimeMsg ? `` : `d-none`}`}>{priceMsg.startTimeMsg}</label>
																</div>
																<div>
																	<label className={`text-danger pl-1 ${priceMsg.endTimeMsg ? `` : `d-none`}`}>{priceMsg.endTimeMsg}</label>
																</div>
															</div>

														</div>
													</div>
													{/* CODE COMMENTED TEMPORARILY */}
													{/* <div className="price-wrapper d-flex">
						<div className="price-text">
							<div className="text-white">
							<b>
								Reserve for
								specific buyer
							</b>
							</div>
						</div>
						<div>
							<label className="switch">
							<input
								type="checkbox"
								checked={
								reserveBuyer
								}
								onChange={() =>
								setReserveBuyer(
									!reserveBuyer
								)
								}
							/>
							<span className="slider round"></span>
							</label>
						</div>
						</div> */}
													{reserveBuyer && (
														<div
															className="mb-3 budle-wrapper"
															style={{
																borderBottom:
																	"1px solid",
																paddingBottom:
																	"2rem",
															}}
														>
															<span>
																<input
																	type="text"
																	placeholder="0xf45a189..."
																	required
																	defaultValue={
																		fixedPriceConfig.reserveFor
																	}
																	onChange={(e) => {
																		onChange(e)
																		if (submitCheck) {
																			if (e.target.value) {
																				setPriceMsg({ ...priceMsg, reserveFor: '' })
																			}
																			else {
																				setPriceMsg({ ...priceMsg, reserveFor: 'Address Is Required.' })
																			}
																		}
																	}
																	}
																	name="fixedPriceConfig.reserveFor"
																/>
															</span>
															<div>
																<label className={`text-danger pl-1 ${priceMsg.reserveFor ? `` : `d-none`}`}>{priceMsg.reserveFor}</label>
															</div>
														</div>
													)}
												</Tab.Pane>
												<Tab.Pane eventKey="timedAuction">
													<div className="form-group nft-select mb-3">
														<div className="d-flex justify-content-between">
															<div className="mb-2 text-white"><b>Method</b></div>
															<div className="d-flex align-items-center cursor-pointer" data-effect="float" data-tip="Sell to the highest bidder or sell with the declining price, which allows the listing to reduce the price until a buyer is found.">
																<i className="fas fa-exclamation-circle ml-2 text-white" />
															</div>
														</div>
														<select className="form-control" id="timed-auction-method" name="timedAuctionConfig.method" value={timedAuctionConfig.method} onChange={(e) => onChange(e)}>
															<option value={1}>Sell to the highest bidder</option>
															<option value={2}>Sell with the declining price</option>
														</select>
													</div>

													<div className="price-wrapper d-flex mb-3">
														<div className="price-text position-relative">
															<div className="d-flex justify-content-between">
																<div className="mb-2 text-white"><b>Starting Price</b></div>
															</div>
															<div className="d-flex justify-content-between nft-select flex-column flex-sm-row">
																<select className="form-control" id="currency" name="timedAuctionConfig.startPrice.currency" value={timedAuctionConfig.startPrice.currency} onChange={(e) => onChange(e)}>
																	<option className="" value="">Select Currency</option>
																	{
																		paymentTokens && paymentTokens.map((token, index) => {
																			return (
																				<option key={index} value={token}>{token}</option>
																			)
																		})
																	}
																</select>
																<div className="ethereum-input">
																	<span className="input-wrap">
																		<input
																			type="text"
																			name="timedAuctionConfig.startPrice.amount"
																			placeholder="Amount"
																			className="amount-btn ml-3"
																			style={{
																				borderRadius:
																					"4px",
																			}}
																			onChange={(e) => {
																				onChange(e)
																				if (submitCheck) {
																					if (e.target.value) {
																						setAuctionMsg({ ...auctionMsg, amount: '' })
																					}
																					else {
																						setAuctionMsg({ ...auctionMsg, amount: 'Amount Is Required.' })
																					}
																				}
																			}
																			}
																			onKeyDown={(e) =>
																				decimalNumberValidator(
																					e
																				)
																			}
																			value={
																				timedAuctionConfig
																					.startPrice
																					.amount
																			}
																			required
																		/>
																	</span>
																	<div className="text-right dollar-wrapper text-white">
																		$ {
																			props.app.rateAuth && (timedAuctionConfig.startPrice.currency === 'BNB') && Number(timedAuctionConfig.startPrice.amount) ?
																				ENV.convertBnbToUsd(timedAuctionConfig.startPrice.amount, props.app.rate)
																				:
																				props.app.myntRateAuth && timedAuctionConfig.startPrice.currency === 'MYNT' && Number(timedAuctionConfig.startPrice.amount) ?
																					ENV.convertMyntToUsd(timedAuctionConfig.startPrice.amount, props.app.myntRate)
																					: '0.00'
																		}
																	</div>
																</div>
															</div>
															<div>
																<label className={`text-danger pl-1 ${auctionMsg.amount ? `` : `d-none`}`}>{auctionMsg.amount}</label>
															</div>
															{
																submitCheck && auctionMsg?.currency && timedAuctionConfig.startPrice.amount &&
																<div>
																	<label className={`text-danger pl-1 ${auctionMsg?.currency ? `` : `d-none`}`}>{auctionMsg.currency}</label>
																</div>
															}
														</div>
													</div>
													<div className="price-wrapper mb-3">
														<div className="price-text">
															<div className="text-white mb-2">
																<b>Duration</b>
															</div>
															<div className="date-picker mb-3">
																<DateRangePicker
																	initialSettings={
																		dateRangeInitialSettings
																	}
																	onApply={
																		handleDateChange
																	}
																>
																	<button
																		name="timedAuctionConfig.duration"
																		className="calender-btn"
																	>
																		<i className="fas fa-calendar-week" />
																		&nbsp;&nbsp;&nbsp;
																		{timedAuctionConfig.duration.startDate.format(
																			"MMMM D, YYYY"
																		)}{" "}
																		-{" "}
																		{timedAuctionConfig.duration.endDate.format(
																			"MMMM D, YYYY"
																		)}
																	</button>
																</DateRangePicker>
															</div>

															<div className="d-flex auction-time-handlers justify-content-between">
																<div className="budle-wrapper">
																	<input
																		type="time"
																		name="timedAuctionConfig.duration.startTime"
																		placeholder="Start Time"
																		onChange={(e) =>
																			onChange(e)
																		}
																		defaultValue={
																			timedAuctionConfig
																				.duration
																				.startTime
																		}
																		required
																	/>
																</div>

																<div className=" budle-wrapper">
																	<input
																		type="time"
																		name="timedAuctionConfig.duration.endTime"
																		placeholder="End Time"
																		onChange={(e) =>
																			onChange(e)
																		}
																		defaultValue={
																			timedAuctionConfig
																				.duration
																				.endTime
																		}
																		required
																	/>
																</div>

															</div>
															<div className="d-flex justify-content-between mt-2">
																<div>
																	<label className={`text-danger pl-1 ${auctionMsg.startTimeMsg ? `` : `d-none`}`}>{auctionMsg.startTimeMsg}</label>
																</div>
																<div>
																	<label className={`text-danger pl-1 ${auctionMsg.endTimeMsg ? `` : `d-none`}`}>{auctionMsg.endTimeMsg}</label>
																</div>
															</div>

														</div>
													</div>
													{
														parseInt(timedAuctionConfig.method) === 2 &&
														<div className="price-wrapper d-flex mb-3">
															<div className="price-text position-relative">
																<div className="text-white mb-3 absolute-wrapper">
																	<b>
																		Ending Price
																	</b>
																</div>
																<div className="d-flex last-sell-nft">
																	<button type="button" className="ethereum-btn mb-3 mb-sm-0"><span className="ml-2">{timedAuctionConfig.endPrice.currency}</span></button>
																	<div className="ethereum-input">
																		<input
																			type="text"
																			name="timedAuctionConfig.endPrice.amount"
																			placeholder="Amount"
																			className="amount-btn"
																			style={{
																				borderRadius:
																					"4px",
																			}}
																			onChange={(e) => {
																				onChange(e)
																				if (submitCheck) {
																					if (e.target.value) {
																						setAuctionMsg({ ...auctionMsg, eamount: '' })
																					}
																					else {
																						setAuctionMsg({ ...auctionMsg, eamount: 'Amount Is Required.' })
																					}
																				}
																			}
																			}
																			onKeyDown={(e) =>
																				decimalNumberValidator(
																					e
																				)
																			}
																			value={
																				timedAuctionConfig
																					.endPrice
																					.amount
																			}
																			required
																		/>

																	</div>
																	<div className="text-end mt-2 mb-2 text-white dollar-wrapper">
																		$ {
																			props.app.rateAuth && timedAuctionConfig.endPrice.currency === 'BNB' && Number(timedAuctionConfig.endPrice.amount) ?
																				ENV.convertBnbToUsd(timedAuctionConfig.endPrice.amount, props.app.rate)
																				:
																				props.app.myntRateAuth && timedAuctionConfig.endPrice.currency === 'MYNT' && Number(timedAuctionConfig.endPrice.amount) ?
																					ENV.convertMyntToUsd(timedAuctionConfig.endPrice.amount, props.app.myntRate)
																					: '0.00'
																		}
																	</div>
																</div>
																<div>
																	<label className={`text-danger pl-1 ${auctionMsg.eamount ? `` : `d-none`}`}>{auctionMsg.eamount}</label>
																</div>
																{
																	submitCheck && auctionMsg?.ecurrency && timedAuctionConfig.endPrice.amount &&
																	<div>
																		<label className={`text-danger pl-1 ${auctionMsg?.ecurrency ? `` : `d-none`}`}>{auctionMsg.ecurrency}</label>
																	</div>
																}
															</div>
														</div>
													}
													<div className="price-wrapper d-flex mb-3">
														<div className="price-text position-relative">
															{
																parseInt(timedAuctionConfig.method) === 1 &&
																<div className="reverse-price d-flex mb-2">
																	<div className="price-text">
																		<div className="text-white">
																			<b>
																				Include reserve price
																			</b>
																		</div>
																	</div>
																	<div>
																		<span className="text-right mb-2 cursor-pointer mr-3" data-effect="float" data-tip="If you do not receive any bids equal to or greater than your reserve, the auction will end without a sale.">
																			<i className="fas fa-exclamation-circle me-2" />
																		</span>
																		<label className="switch">
																			<input
																				type="checkbox"
																				checked={
																					reservePrice
																				}
																				onChange={() =>
																					setReservePrice(
																						!reservePrice
																					)
																				}
																			/>
																			<span className="slider round"></span>
																		</label>
																	</div>
																</div>
															}
															{reservePrice && (
																<>
																	<div className="d-flex last-sell-nft">
																		<button type="button" className="ethereum-btn mb-3 mb-sm-0"><span className="ml-2">{timedAuctionConfig.reservePrice.currency}</span></button>
																		<div className="ethereum-input">
																			<span className="input-wrap">
																				<input
																					type="text"
																					name="timedAuctionConfig.reservePrice.amount"
																					placeholder="Amount"
																					className="amount-btn"
																					style={{
																						borderRadius:
																							"4px",
																					}}
																					onChange={(e) => {
																						onChange(e)
																						if (submitCheck) {
																							if (e.target.value) {
																								setAuctionMsg({ ...auctionMsg, ramount: '' })
																							}
																							else {
																								setAuctionMsg({ ...auctionMsg, ramount: 'Amount Is Required.' })
																							}
																						}
																					}
																					}
																					onKeyDown={(e) =>
																						decimalNumberValidator(
																							e
																						)
																					}
																					defaultValue={
																						timedAuctionConfig
																							.reservePrice
																							.amount
																					}
																					required
																				/>
																			</span>
																			<div className="align-right text-white">
																				$ {
																					props.app.rateAuth && timedAuctionConfig.reservePrice.currency === 'BNB' && Number(timedAuctionConfig.reservePrice.amount) ?
																						ENV.convertBnbToUsd(timedAuctionConfig.reservePrice.amount, props.app.rate)
																						:
																						props.app.myntRateAuth && timedAuctionConfig.reservePrice.currency === 'MYNT' && Number(timedAuctionConfig.reservePrice.amount) ?
																							ENV.convertMyntToUsd(timedAuctionConfig.reservePrice.amount, props.app.myntRate)
																							: '0.00'
																				}
																			</div>
																		</div>
																	</div>


																	<div>
																		<label className={`text-danger pl-1 ${auctionMsg.ramount ? `` : `d-none`}`}>{auctionMsg.ramount}</label>
																	</div>
																</>
															)}
															{
																submitCheck && auctionMsg?.rcurrency && timedAuctionConfig.reservePrice.amount &&
																<div>
																	<label className={`text-danger pl-1 ${auctionMsg.rcurrency ? `` : `d-none`}`}>{auctionMsg.rcurrency}</label>
																</div>
															}
														</div>
													</div>
												</Tab.Pane>
											</Tab.Content>

											{/* rights management */}
											{
												<div className="form-group nft-select mb-3">
													<div className="d-flex justify-content-between">
														<div className="mb-2 text-white"><b>Rights Management</b></div>
														<div className="d-flex align-items-center cursor-pointer" data-effect="float" data-tip="Set rights and copyrights. After listing, your selected rights would be applied.">
															<i className="fas fa-exclamation-circle ml-2 text-white" />
														</div>
													</div>
													<select className="form-control" id="rights" name="rights" value={rights} onChange={(e) => manageRights(e)}>
														{
															rightsOptions?.map((right, index) => {
																return (
																	<option key={index} value={right.value}>{right.label}</option>
																)
															})}
													</select>
												</div>
											}

											{
												nft?.type === 1 ?
													<>
														<div className="d-flex justify-content-between mb-2 text-white">
															{/* <ReactTooltip /> */}
															<div>
																<b>Shares</b>
															</div>
															<div className="d-flex align-items-center cursor-pointer" data-effect="float" data-tip="Listing is free. Once sold, the following shares will be delivered.">
																<i className="fas fa-exclamation-circle ml-2 text-white" />
															</div>
														</div>
														<div className="d-flex justify-content-between mb-3 text-white">
															<div>Your Share</div>
															<div>{nft.initialSellerPercent}%</div>
														</div>
														<div className="d-flex justify-content-between mb-3 text-white">
															<div>Platform Share</div>
															<div>{nft.platformShare}%</div>
														</div>
													</>
													:
													''
											}

											<button
												className="complete-listing-btn btn-filled transition mt-5 text-white"
												onClick={() => submit()}
											>
												<span className="d-block transition">Complete Listing</span>
											</button>
										</div>
									</Tab.Container>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

const mapStateToProps = (state) => ({
	nft: state.nft,
	error: state.error,
	app: state.app,
	settings: state.settings
});

export default connect(mapStateToProps, {
	beforeNFT,
	getNFT,
	upsertNFT,
	beforeSettings,
	getSettings
})(SellNFT);