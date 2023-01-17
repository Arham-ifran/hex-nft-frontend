import React, { useState, useEffect } from 'react';
import { Container, Form } from 'react-bootstrap';
import Lottie from 'react-lottie';
import animationData from './floating-bubbles.json';
import { addUserSubscription, beforeSubscription } from './stayInLoop.actions'
import { useSelector, useDispatch } from 'react-redux';
import './stayInLoop.css';
import validator from 'validator';

function StayInLoop(props) {
	const defaultOptions = {
		loop: true,
		autoplay: true,
		animationData: animationData,
		rendererSettings: {
			preserveAspectRatio: 'xMidYMid slice',
		},
	};
	const dispatch = useDispatch()
	// const addSubscription = useSelector((state) => state.subscriptions.addSubscription)
	const [email, setEmail] = useState('')
	const [msg, setMsg] = useState('')

	const subscribe = () => {
		let check = true
		if(validator.isEmpty(email)){
			setMsg('Email is required')
			check = false
		}
		else {
			if(!validator.isEmail(email)){
				setMsg('Invalid Email')
				check = false
			}
		}
		if(check){
			setMsg('')
			dispatch(addUserSubscription({ email }))
			dispatch(beforeSubscription())
			setEmail('')
		}
	}

	// useEffect(() =>{
	// 	if(addSubscription && addSubscription.success)
	// 		setEmail('')
	// },[addSubscription])

	return (
		<section className="stay-in-loop">
			<Container>
				<div className="stay-in-loop-holder d-flex flex-column flex-md-row justify-content-between align-items-center">
					<div className="signup-form-holder text-white mb-5 mb-md-0">
						<h2 className="fw-bold mb-4">Stay in the Loop</h2>
						<p>Lor	em Ipsum is simply dummy text of printing and typesetting industry. Lorem Ipsum has</p>
						<Form className="signup-form position-relative">
							<Form.Control type="email" value={email} placeholder="Enter Email Address" onChange={(e) => setEmail(e.target.value)} />
							<button className="btn-submit fw-bold cursor-pointer transition" type="button" onClick={subscribe}>Submit</button>
						</Form>
						<label className={`text-white pl-1 ${msg ? `` : `d-none`}`}>{msg}</label>
					</div>
					<div className="lottie-animation-holder position-relative">
						<Lottie
							options={defaultOptions}
						// height={344}
						// width={344}
						/>
					</div>
				</div>
			</Container>
		</section>
	);
}
export default StayInLoop;