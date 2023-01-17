import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import { connectMetamask, signRequest } from '../../utils/web3'
import { beforeWallet, setWalletAddress } from '../wallet/wallet.action';
import { login, signup } from '../user/user.action';
import { useParams } from "react-router-dom";
import { generateRandomString } from '../../utils/functions';
import { ENV } from '../../config/config'
import Gamification from '../gamification/gamification';
const { cdnBaseUrl } = ENV
const metaMask = `${cdnBaseUrl}v1652166289/hex-nft/assets/metamask2_ym4nhu.png`;

const Wallet = (props) => {
    const [connectedAddress, setConnectedAddress] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    // const [eventType, setEventType] = useState('')
    let { referrer } = useParams();
    referrer = referrer ? referrer.replace('referrer=', '') : ''
    const navigate = useNavigate();

    const connectMetamaskCall = async () => {
        const connectedAddress = await connectMetamask();
        if (connectedAddress) {
            localStorage.setItem('connectedAddress', connectedAddress);
            setConnectedAddress(connectedAddress);
            props.setWalletAddress(connectedAddress);
        }
    }

    useEffect(() => {
        if (localStorage.getItem('encuse')) {
            navigate('/profile')
        }
    }, [])

    useEffect(() => {
        if (props.error) {
            setErrorMessage(props.error.message);
        }
    }, [props.error]);

    const login = async () => {
        let sign = await signRequest();
        if (!sign)
            return setErrorMessage('Please connect to MetaMask Wallet in order to use all features of Marketplace ')

        let referralId = generateRandomString(10)
        let payload = {
            address: connectedAddress,
            password: sign,
            referralId
        }

        let referredBy = localStorage.getItem('referralId')
        if (referredBy && referredBy !== null && referredBy !== '')
            payload.referredBy = referredBy

        props.login(payload);
    }

    useEffect(() => {
        if (props.user.userAuth) {
            let redirectTo = ''
            if (referrer !== '') {
                redirectTo = `/${referrer}`
            }
            else {
                redirectTo = `/explore-all`
            }
            if (props.user.userData?.newUser) {
                // setEventType('sign up')
                redirectTo = '/profile'
            }
            navigate(redirectTo)
        }
    }, [props.user.userAuth])

    // useEffect(() => {
    //     console.log('sign up event type', eventType)
    // },[eventType])

    return (
        <section className='wallet-connect-area'>
            {/* <Gamification eventType={eventType} /> */}
            {
                localStorage.getItem('encuse') ? '' :
                    <div className="container">
                        {
                            connectedAddress ?
                                <>
                                    <div className="row justify-content-center">
                                        <div className="col-12 col-md-8 col-lg-7">
                                            {/* Intro */}
                                            <div className="intro text-center text-white">
                                                <h3 className="my-4">Sign in to your account</h3>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row justify-content-center items">
                                        <div className="col-12 col-md-6 item">
                                            <div className="card single-wallet">
                                                <span className="meta-tag d-block text-center" href="/login">
                                                    <h4 className="mb-0">Address</h4>
                                                    <p id="connected-address" className="mb-4">{connectedAddress}</p>
                                                    {
                                                        errorMessage && <p className="text-white">{errorMessage}</p>
                                                    }
                                                    <button className="btn w-100 btn-filled transition no-border fw-bold" type="button" onClick={() => login()}><span className="d-block transition">Sign In</span></button>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </>
                                :
                                <>
                                    <div className="row justify-content-center">
                                        <div className="col-12 col-md-8 col-lg-7">
                                            {/* Intro */}
                                            <div className="intro text-center text-white">
                                                {/* <span>Wallet Connect</span> */}
                                                <h3 className="my-4">Connect your Wallet</h3>
                                                <p className="mb-0">Please select the wallet you want to connect to.</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row justify-content-center items">
                                        <div className="col-12 col-md-9 col-lg-6 item" onClick={() => connectMetamaskCall()}>
                                            {
                                                errorMessage && <p className="text-white text-center">{errorMessage}</p>
                                            }
                                            {/* Single Wallet */}
                                            <div className="card single-wallet whole-hover">
                                                <span className="meta-tag d-block text-center" href="/login">
                                                    <img className="avatar-lg" src={metaMask} alt="" />
                                                    <h4 className="mb-0">MetaMask</h4>
                                                    <p>A browser extension with great flexibility. The web's most popular wallet</p>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </>
                        }
                    </div>
            }
        </section>
    );
}

const mapStateToProps = state => ({
    wallet: state.wallet,
    user: state.user,
    error: state.error
});

export default connect(mapStateToProps, { beforeWallet, setWalletAddress, login, signup })(Wallet);