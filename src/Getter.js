import { useEffect } from 'react'
import { connect } from "react-redux";
import { beforeApp, setBNBRate, setWBNBRate, setMYNTRate, setMYNTToBNB, setBNBToWBNB } from './App.action';
import { beforeWallet } from './components/wallet/wallet.action';
import { useNavigate } from 'react-router-dom';

const Getter = (props) => {
    const navigate = useNavigate();

    useEffect(() => {
        if (props.wallet.redirectW) {
            props.beforeWallet()
            navigate('/login')
        }
    }, [props.wallet.redirectW])

    useEffect(() => {
        props.setBNBRate()
        props.setWBNBRate()
        props.setMYNTRate()
        props.setMYNTToBNB()
        props.setBNBToWBNB()
    }, [])

    useEffect(() => {
        // when an error is received
        if (props.error) {
            // if user is not found, clear storage and redirect to connect wallet screen
            if (props.error.user404) {
                localStorage.clear()
                navigate('/login')
            }
        }
    }, [props.error])

    return (
        <>
        </>
    )
}

const mapStateToProps = (state) => ({
    app: state.app,
    wallet: state.wallet,
    error: state.error
});

export default connect(mapStateToProps, { beforeApp, setBNBRate, setWBNBRate, setMYNTRate, setMYNTToBNB, setBNBToWBNB, beforeWallet })(Getter);
