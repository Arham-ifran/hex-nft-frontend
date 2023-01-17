import Web3 from "web3";
import randomstring from "randomstring";
import { toast } from 'react-toastify'
import contractAbi from './../utils/abis/token.json';
import myntcontractAbi from './../utils/abis/mynt.json';
import { ENV } from './../config/config';
import store from './../store'
import { axiosSyncPost } from './../utils/functions';
import { SET_WALLET_ERROR, REDIRECT_TO_WALLET } from './../redux/types';

const nftContractAddress = ENV.nftContractAddress;
const myntContractAddress = ENV.myntContractAddress;
const requiredChainIds = ENV.requiredChainIds;
const Contract = require('web3-eth-contract');

const call = (method, params) => {
    return new Promise((resolve, reject) => {
        method(...params)
            .call()
            .then((res) => {
                resolve(res);
            })
            .catch((err) => {
                reject(err);
            });
    });
};

const send = (method, params, from, value = 0) => {
    return new Promise((resolve, reject) => {
        method(...params)
            .send({ from, value })
            .then((res) => {
                resolve(res);
            })
            .catch((err) => {
                reject(err);
            });
    });
};

const methods = {
    call,
    send,
};

export const getWeb3 = () => {
    if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        return web3;
    }
    else {
        return false;
    }
}
// method to check if a user is logged in but wallet is locked
export const isWalletLocked = async () => {
    try {
        if (localStorage.getItem('encuse') && localStorage.getItem('connectedAddress')) {
            const web3 = await getWeb3();
            if (!web3 || !window.ethereum)
                return store.dispatch(setWalletError("Please install MetaMask Wallet in order to use all features of Marketplace"));

            const accounts = await web3.eth.getAccounts();
            if (!accounts?.length) {
                store.dispatch(redirectToWallet())
                localStorage.clear()
                return true
            }
        }
    } catch (e) {
        const eMessage = e.message.split('{')[0] || '';
        return false;
    }
}
export const connectMetamask = async (web3 = null) => {
    try {
        if (!web3) {
            web3 = getWeb3();
        }
        if (!web3 || !window.ethereum) {
            store.dispatch(setWalletError("Please install MetaMask Wallet in order to use all features of Marketplace"));
            return;
        }

        await window.ethereum.enable();
        const accounts = await web3.eth.getAccounts();
        const chainId = await web3.eth.getChainId();
        if (!requiredChainIds.includes(chainId)) {
            store.dispatch(setWalletError(`Please switch to ${ENV.requiredChainName} in order to use all features of Marketplace`));
        }
        return accounts[0];
    } catch (e) {
        const eMessage = e.message.split('{')[0] || '';
        return false;
    }
}
export const signRequest = async () => {
    const isLocked = await isWalletLocked()
    if (isLocked)
        return false

    if (window.ethereum) {
        const web3 = getWeb3();
        const accounts = await web3.eth.getAccounts();
        const address = accounts[0];

        if (address && !localStorage.getItem('connectedAddress'))
            localStorage.setItem('connectedAddress', address);

        const signature = await handleSignMessage(address);
        return signature;
    }
    else {
        toast.error("Please install MetaMask in order to use all features of Marketplace");
    }
}
export const mint = async () => {
    const web3 = getWeb3();
    if (!web3) {
        toast.error("No web3 instance found");
        return false;
    }
    try {
        const isLocked = await isWalletLocked()
        if (isLocked)
            return false

        const connectedAddress = await connectMetamask(web3);
        const price = 0;
        const { hash } = await createHash(connectedAddress, price);
        const signature = await handleSignMessageWithHash(hash, connectedAddress);
        return signature
    } catch (e) {
        const eMessage = e.message.split('{')[0] || '';
        toast.error(eMessage);
        return false;
    }
}
export const getStakingPercentWeb3 = async (stakePercentData) => {
    const web3 = getWeb3();
    if (!web3) {
        toast.error("No web3 instance found");
        return false;
    }
    try {
        const tokenContract = new web3.eth.Contract(
            myntcontractAbi,
            myntContractAddress
        )

        const stakingPercent = await methods.call(tokenContract.methods.getStakeSharePercent, [stakePercentData.user, stakePercentData.stakeId, stakePercentData.dayToFind])

        return stakingPercent
    } catch (e) {
        const eMessage = e.message.split('{')[0] || '';
        toast.error(eMessage);
        return false;
    }
}
export const stakeWeb3 = async (_nftData, _id) => {
    const web3 = getWeb3();
    if (!web3) {
        toast.error("No web3 instance found");
        return false;
    }
    try {
        const isLocked = await isWalletLocked()
        if (isLocked)
            return false

        const connectedAddress = await connectMetamask(web3);
        const tokenAddress = _nftData.nft;

        if (_nftData.tokenId) {
            const validOwner = await isValidOwner(connectedAddress, tokenAddress, _nftData.tokenId);
            if (!validOwner) {
                toast.error('Unable to stake the NFT, you don\'t seem to be the owner. Metadata will be refreshed for this NFT');
                let payloadData = {
                    nftId: _id,
                    tokenId: _nftData.tokenId,
                    address: _nftData.nft,
                }
                axiosSyncPost('nfts/update-metadata', payloadData);
                return false;
            }
        }

        const tokenContract = new web3.eth.Contract(
            myntcontractAbi,
            myntContractAddress,
        );

        const weiPrice = String((parseFloat((_nftData.price * ENV.myntMaxDecimals).toFixed(10))))

        const { hash } = await createHash(connectedAddress, weiPrice)
        const stakeSign = await handleSignMessageWithHash(hash, connectedAddress)

        const stakeData = {
            _stake: parseInt(weiPrice),
            day: Number(_nftData.stakingDays),
            stakeName: _nftData.name
        }

        const txDetails = await methods.send(
            tokenContract.methods.createStake,
            [stakeData._stake, stakeData.day, stakeData.stakeName],
            connectedAddress,
        );

        if (!txDetails.status)
            return false

        const stakeTxHash = txDetails.transactionHash;
        const stakeId = txDetails?.events?.CreateStake?.returnValues?.id

        return { stakeSign, stakeTxHash, stakeId };
    } catch (e) {
        const eMessage = e.message.split('{')[0] || '';
        toast.error(eMessage);
        return false;
    }
}
export const unstakeWeb3 = async (stakeId) => {
    const web3 = getWeb3();
    if (!web3) {
        toast.error("No web3 instance found");
        return false;
    }
    try {
        const isLocked = await isWalletLocked()
        if (isLocked)
            return false

        const connectedAddress = await connectMetamask(web3);
        const tokenContract = new web3.eth.Contract(
            myntcontractAbi,
            myntContractAddress,
        );

        const { hash } = await createHash(connectedAddress, 0)
        const unstakeSign = await handleSignMessageWithHash(hash, connectedAddress)

        const txDetails = await methods.send(
            tokenContract.methods.claimStakeReward,
            [stakeId],
            connectedAddress,
        );

        if (!txDetails.status)
            return false

        const unstakeTxHash = txDetails.transactionHash;

        return { unstakeSign, unstakeTxHash };
    } catch (e) {
        const eMessage = e.message.split('{')[0] || '';
        toast.error(eMessage);
        return false;
    }
}
export const cancelSellingWeb3 = async (_nftData, _id) => {
    const web3 = getWeb3();
    if (!web3) {
        toast.error("No web3 instance found");
        return false;
    }
    try {
        const isLocked = await isWalletLocked()
        if (isLocked)
            return false

        const connectedAddress = await connectMetamask(web3);
        const tokenAddress = _nftData.nft;

        if (_nftData.tokenId) {
            const validOwner = await isValidOwner(connectedAddress, tokenAddress, _nftData.tokenId);
            if (!validOwner) {
                toast.error("Unable to cancel the listing, you don't seem to be the owner. Metadata will be refreshed for this NFT");
                let payloadData = {
                    nftId: _id,
                    tokenId: _nftData.tokenId,
                    address: _nftData.nft,
                }
                axiosSyncPost('nfts/update-metadata', payloadData);
                return false;
            }
        }

        let weiPrice = web3.utils.toWei(_nftData.price, 'ether');
        if (_nftData.currency?.toUpperCase() === 'MYNT')
            weiPrice = String((parseFloat((_nftData.price * ENV.myntMaxDecimals).toFixed(10))))
        const { hash } = await createHash(connectedAddress, weiPrice);
        const signature = await handleSignMessageWithHash(hash, connectedAddress);
        return signature;
    } catch (e) {
        const eMessage = e.message.split('{')[0] || '';
        toast.error(eMessage);
        return false;
    }
}
export const changeSellingStatusWeb3 = async (_nftData, _id) => {
    const web3 = getWeb3();
    if (!web3) {
        toast.error("No web3 instance found");
        return false;
    }
    try {
        const isLocked = await isWalletLocked()
        if (isLocked)
            return false

        const connectedAddress = await connectMetamask(web3);
        const tokenAddress = _nftData.nft;
        let isApprovedForAll = await isApprovedForAllWeb3(connectedAddress, nftContractAddress, tokenAddress);
        if (!isApprovedForAll) {
            isApprovedForAll = await setApprovalForAllWeb3(connectedAddress, nftContractAddress, true, tokenAddress);
            if (!isApprovedForAll) {
                toast.error("Unable to complete the listing");
                return false;
            }
        }
        let weiPrice = web3.utils.toWei(_nftData.price, 'ether');
        if (_nftData.currency?.toUpperCase() === 'MYNT')
            weiPrice = String((parseFloat((_nftData.price * ENV.myntMaxDecimals).toFixed(10))))
        const { hash } = await createHash(connectedAddress, weiPrice);
        const signature = await handleSignMessageWithHash(hash, connectedAddress);
        return signature;
    } catch (e) {
        const eMessage = e.message.split('{')[0] || '';
        toast.error(eMessage);
        return false;
    }
}
export const offerBidWeb3 = async (_nftData) => {
    const web3 = getWeb3();
    if (!web3) {
        toast.error("No web3 instance found");
        return false;
    }
    try {
        const isLocked = await isWalletLocked()
        if (isLocked)
            return false

        const connectedAddress = await connectMetamask(web3);
        const cabi = JSON.parse(_nftData.cabi);
        const cAddress = _nftData.cAddress;
        const approvedAmount = await isApproved(nftContractAddress, connectedAddress, cAddress, cabi);
        let weiPrice = web3.utils.toWei(`${_nftData.price}`, 'ether');
        if (_nftData.currency?.toUpperCase() === 'MYNT')
            weiPrice = String((parseFloat((_nftData.price * ENV.myntMaxDecimals).toFixed(10))))

        if (parseInt(weiPrice) > parseInt(approvedAmount)) {
            const gotApproval = await getApproval(nftContractAddress, ENV.amountToApprove, _nftData.currency, cAddress, cabi)
            if (!gotApproval) {
                return false;
            }
        }

        const { hash } = await createHash(connectedAddress, weiPrice);
        const signature = await handleSignMessageWithHash(hash, connectedAddress);
        return signature
    } catch (e) {
        const eMessage = e.message.split('{')[0] || '';
        toast.error(eMessage);
        return false;
    }
}
export const cancelOfferBidWeb3 = async () => {
    const web3 = getWeb3();
    if (!web3) {
        toast.error("No web3 instance found");
        return false;
    }
    try {
        const isLocked = await isWalletLocked()
        if (isLocked)
            return false

        const connectedAddress = await connectMetamask(web3);
        const price = 0;
        const { hash } = await createHash(connectedAddress, price);
        const signature = await handleSignMessageWithHash(hash, connectedAddress);
        return signature;
    } catch (e) {
        const eMessage = e.message.split('{')[0] || '';
        toast.error(eMessage);
        return false;
    }
}
export const acceptOfferBidWeb3 = async (_nftData, buyerAddress, payThrough, _id, collectionId, acceptType, platformSharePercent, royaltySplitPercent) => {
    const web3 = getWeb3();
    if (!web3) {
        toast.error("No web3 instance found");
        return false;
    }
    try {
        const isLocked = await isWalletLocked()
        if (isLocked)
            return false

        const connectedAddress = await connectMetamask(web3);
        // check owner only if NFT is on chain
        if (Number.isInteger(_nftData.tokenId)) {
            const validOwner = await isValidOwner(connectedAddress, _nftData.nft, _nftData.tokenId);
            if (!validOwner) {
                toast.error("Unable to complete the listing, you don't seem to be the owner. Metadata will be refreshed for this NFT");
                let payloadData = {
                    nftId: _id,
                    tokenId: _nftData.tokenId,
                    address: _nftData.nft,
                }
                axiosSyncPost('nfts/update-metadata', payloadData);
                return false;
            }
        }
        const tokenContract = new web3.eth.Contract(
            contractAbi,
            nftContractAddress,
        );
        let weiPrice = web3.utils.toWei(`${_nftData.price}`, 'ether');
        if (Number(payThrough) === 1)
            weiPrice = String((parseFloat((_nftData.price * ENV.myntMaxDecimals).toFixed(10))))

        const weiOwnerShare = percentageOf(weiPrice, 100 - royaltySplitPercent);
        const weiRoyaltyShare = percentageOf(weiPrice, royaltySplitPercent);
        const { hash, nonce, encodeKey } = await createHash(connectedAddress, weiPrice);
        let nftRoyalty = [];
        let platformShareAmount = 0;
        for (let x = 0; x < _nftData.nftRoyalty.length; x++) {
            let royaltyShareVal = percentageOf(weiRoyaltyShare, _nftData.nftRoyalty[x].percent)
            nftRoyalty.push({
                amount: String(royaltyShareVal),
                wallet: _nftData.nftRoyalty[x].wallet
            })
        }
        platformShareAmount = percentageOf(weiPrice, platformSharePercent)
        const signature = await handleSignMessageWithHash(hash, connectedAddress);
        const transferData = {
            acceptType, // 1 = offer, 2 = bid
            metadata: _nftData.metaData || '',
            tokenId: _nftData.tokenId || 0,
            nftId: _nftData.nftId,
            newOwner: buyerAddress,
            nft: _nftData.nft,
            signature,
            payThrough,
            amount: weiPrice,
            percent: _nftData.percent,
            collectionId,
            encodeKey,
            nonce,
            nftRoyalty,
            platformShareAmount: String(platformShareAmount),
            ownerShare: String(weiOwnerShare)
        }
        const txDetails = await methods.send(
            tokenContract.methods.acceptOfferBid,
            [transferData],
            connectedAddress,
        );
        const txHash = txDetails.transactionHash;
        const { tokenId } = txDetails?.events?.BidOfferAccepted?.returnValues
        return {
            tokenId, txHash,
            // royalties: nftRoyalty,
            acceptSign: signature
        };
    } catch (e) {
        const eMessage = e.message.split('{')[0] || '';
        toast.error(eMessage);
        return false;
    }
}
export const buyNow = async (_nftData, payThrough, royaltySplitPercent, cabi, cAddress) => {
    const web3 = await getWeb3();
    if (!web3) {
        toast.error("No web3 instance found");
        return false;
    }
    try {
        const isLocked = await isWalletLocked()
        if (isLocked)
            return false

        const connectedAddress = await connectMetamask(web3);
        const tokenContract = new web3.eth.Contract(contractAbi, nftContractAddress);

        let weiPrice = web3.utils.toWei(`${_nftData.price}`, 'ether');
        if (_nftData.currency?.toUpperCase() === 'MYNT')
            weiPrice = String((parseFloat((_nftData.price * ENV.myntMaxDecimals).toFixed(10))))

        if (cabi && cAddress) {
            const approvedAmount = await isApproved(nftContractAddress, connectedAddress, cAddress, cabi);

            if (parseInt(weiPrice) > parseInt(approvedAmount)) {
                const gotApproval = await getApproval(nftContractAddress, ENV.amountToApprove, _nftData.currency, cAddress, cabi)
                if (!gotApproval) {
                    return false;
                }
            }
        }

        const weiOwnerShare = percentageOf(weiPrice, 100 - royaltySplitPercent);
        const weiRoyaltyShare = percentageOf(weiPrice, royaltySplitPercent);
        const { hash, nonce, encodeKey } = await createHash(connectedAddress, weiPrice);
        const signature = await handleSignMessageWithHash(hash, connectedAddress);
        delete _nftData.price;

        // currency vallues: 0 = Buy with PayPal, 1 = Buy Now With BNB, 2 = Buy Now With MYNT
        _nftData.currency = payThrough === 1 ? (_nftData.currency.toUpperCase() === 'BNB' ? 1 : _nftData.currency.toUpperCase() === 'MYNT' ? 2 : 0) : 0

        let nftRoyalty = [];
        for (let x = 0; x < _nftData.nftRoyalty.length; x++) {
            let royaltyShareVal = percentageOf(weiRoyaltyShare, _nftData.nftRoyalty[x].percent)
            nftRoyalty.push({
                amount: String(royaltyShareVal),
                wallet: _nftData.nftRoyalty[x].wallet
            })
        }
        const buyNFTData = {
            ..._nftData,
            signature, payThrough, amount: weiPrice, encodeKey, nonce, nftRoyalty, ownerShare: String(weiOwnerShare)
        }

        const txDetails = await methods.send(
            tokenContract.methods.buyNFT,
            [buyNFTData],
            connectedAddress,
            payThrough === 1 ? 0 : buyNFTData.amount // value
        );

        if (!txDetails.status)
            return false;

        const txHash = txDetails.transactionHash;
        return {
            txHash, signature
        };
    } catch (e) {
        let eMessage = e.message.split('{')[0] || '';
        toast.error(eMessage);
        return false;
    }
}
export const getApproval = async (guy, amount, currency, contractAddress, contractABI) => {
    const web3 = getWeb3();
    if (!web3) {
        toast.error("No web3 instance found");
        return false;
    }
    try {
        const connectedAddress = await connectMetamask(web3);
        const tokenContract = new web3.eth.Contract(
            contractABI,
            contractAddress,
        );
        let weiPrice = web3.utils.toWei(`${amount}`, 'ether');
        if (currency?.toUpperCase() === 'MYNT')
            weiPrice = String((parseFloat((amount * ENV.myntMaxDecimals).toFixed(10))))
        await methods.send(
            tokenContract.methods.approve,
            [guy, weiPrice],
            connectedAddress,
        );

        return true;
    } catch (e) {
        let eMessage = e.message.split('{')[0] || '';
        toast.error(eMessage);
        return false;
    }
}
export const isApproved = async (guy, connectedAddress, contractAddress, contractABI) => {
    const web3 = getWeb3();
    if (!web3) {
        toast.error("No web3 instance found");
        return false;
    }
    try {
        const tokenContract = new web3.eth.Contract(
            contractABI,
            contractAddress,
        );
        const myNewData = await methods.call(tokenContract.methods.allowance, [connectedAddress, guy])

        return myNewData;
    } catch (e) {
        return 0;
    }
}
export const checkBalance = async (_nftData) => {
    const web3 = getWeb3();
    if (!web3) {
        toast.error("No web3 instance found");
        return false;
    }
    try {
        const isLocked = await isWalletLocked()
        if (isLocked)
            return false

        const connectedAddress = await connectMetamask(web3);
        const cabi = JSON.parse(_nftData.cabi);
        const cAddress = _nftData.cAddress;
        const tokenContract = new web3.eth.Contract(
            cabi,
            cAddress,
        );
        let userBalance = await methods.call(tokenContract.methods.balanceOf, [connectedAddress])
        if (userBalance)
            if (_nftData.currency?.toUpperCase() === 'MYNT')
                userBalance = parseFloat((userBalance / ENV.myntMaxDecimals).toFixed(10))
            else
                userBalance = web3.utils.fromWei(userBalance, 'ether')
        return userBalance;
    } catch (e) {
        toast.error("Error while checking balance");
        return 0;
    }
}
export const isValidOwner = async (owner, contractAddress, tokenId) => {
    const web3 = getWeb3();
    if (!web3) {
        toast.error("No web3 instance found");
        return false;
    }
    try {
        const tokenContract = new web3.eth.Contract(
            contractAbi,
            contractAddress,
        );
        const nftOwner = await methods.call(tokenContract.methods.ownerOf, [tokenId])
        return nftOwner === owner;
    } catch (e) {
        return false;
    }
}
export const isApprovedForAllWeb3 = async (owner, operator, contractAddress) => {
    const web3 = getWeb3();
    if (!web3) {
        toast.error("No web3 instance found");
        return false;
    }
    try {
        const tokenContract = new web3.eth.Contract(
            contractAbi,
            contractAddress,
        );
        const isApprovedForAll = await methods.call(tokenContract.methods.isApprovedForAll, [owner, operator])

        return isApprovedForAll;
    } catch (e) {
        return 0;
    }
}
export const setApprovalForAllWeb3 = async (connectedAddress, operator, value, contractAddress) => {
    const web3 = getWeb3();
    if (!web3) {
        toast.error("No web3 instance found");
        return false;
    }
    try {
        const tokenContract = new web3.eth.Contract(
            contractAbi,
            contractAddress,
        );
        await methods.send(
            tokenContract.methods.setApprovalForAll,
            [operator, value],
            connectedAddress,
        );

        return true;
    } catch (e) {
        return 0;
    }
}
const percentageOf = (num, per) => {
    return parseFloat(((num / 100) * per).toFixed(10));
}
const handleSignMessage = (address) => {
    if (!address) return

    return new Promise((resolve, reject) => {
        const web3 = getWeb3();
        web3.eth.personal.sign(
            web3.utils.fromUtf8(`${ENV.appName} uses this cryptographic signature in place of a password, verifying that you are the owner of this address.`),
            address,
            (err, signature) => {
                if (err) return reject(err);
                return resolve(signature);
            }
        )
    });
};
const handleSignMessageWithHash = async (hash, wallet) => {
    const signature = await window.ethereum.request({ method: "personal_sign", params: [wallet, hash] });
    return signature;
}
const createHash = async (wallet, _amount) => {
    const encodeKey = getEncodeKey();
    const nonce = Date.now();
    const web3 = getWeb3();
    const hash = await web3.utils.soliditySha3(wallet, _amount, encodeKey, nonce);
    return { hash, nonce, encodeKey };
}
const getEncodeKey = () => {
    return randomstring.generate({
        length: 20,
        charset: 'alphabetic'
    });
}
const accountsChangedHandler = () => {
    if (window.ethereum) {
        window.ethereum.on('accountsChanged', function (accounts) {
            localStorage.clear()
            store.dispatch(redirectToWallet())
        })
        window.ethereum.on('chainChanged', function (_chainId) {
            const chaindId = parseInt(_chainId, 16);
            if (requiredChainIds.includes(chaindId)) {
                store.dispatch(setWalletError(""));
            }
            else {
                store.dispatch(setWalletError(`Please switch to ${ENV.requiredChainName} in order to use all features of Marketplace`));
            }
        })
    }
}
const setWalletError = (message) => {
    return {
        type: SET_WALLET_ERROR,
        payload: message
    }
}
// redirect user to connect wallet
const redirectToWallet = () => {
    return {
        type: REDIRECT_TO_WALLET,
        payload: true
    }
}
accountsChangedHandler();