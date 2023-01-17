import { useEffect } from 'react'
import { ENV } from '../../config/config'
const { appName } = ENV
const HowItWorks = () => {

    useEffect(() => {
        window.scroll(0, 0)
    }, [])

    return (
        <div className="explore-area popular-collections-area h-it-w text-white">
            <div className="container">
                <div className="hiw-content  p-3 pt-5">
                    <h5>Set up your wallet</h5> Once you’ve set up your wallet via MetaMask, connect it to {appName} by clicking the NFT Marketplace in the top right corner. Note. We support only MetaMask for now.
                </div>
                <div className="hiw-content  p-3">
                    <h5>Create your collection</h5>
                    <p>Click Create New and set up your collection. Add social links, a description, profile &amp; banner images, and set a secondary sales fee.</p>
                </div>
                <div className="hiw-content  p-3">
                    <h5>Add your NFTs</h5>
                    <p>Upload your work (image), add a title and description, and customize your NFTs with properties, stats, and unlockable content.</p>
                </div>
                <div className="hiw-content  p-3 pb-5">
                    <h5>List them for sale</h5>
                    <p>Choose between auctions, fixed-price listings, and declining-price listings. You choose how you want to sell your NFTs!</p>
                </div>
            </div>
        </div>
    )
}

export default HowItWorks
