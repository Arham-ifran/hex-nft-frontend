import React from 'react';
import { ipfsToUrl } from '../../utils/functions'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faC, faD, faCircleInfo } from '@fortawesome/free-solid-svg-icons'
import ReactTooltip from 'react-tooltip'
import { ENV } from '../../config/config'
const { cdnBaseUrl } = ENV
const nftPlaceholder = `${cdnBaseUrl}v1652166290/hex-nft/assets/transparent-placeholder_wrydvd.png`

const NFTPreview = (props) => {
    return (
        <div className="text-center create-nft sell-nft-section">
            <div id="nft-img-preview-div" className="image-over position-relative">
                {
                    props.image && props.from === 'sell-nft' ?
                        <img id="nft-file" className="card-img-top" src={ipfsToUrl(props.image)} alt="NFT Image on List NFT for Sale" />
                        :
                        <>
                            {
                                props.dataURI && props.dataURI !== '' ?
                                    <img id="nft-file-tif" className="card-img-top" src={props.dataURI || nftPlaceholder} alt="NFT Image" />
                                    :
                                    <>
                                        <img id="nft-file" className="card-img-top" src={nftPlaceholder} alt="img" /> :
                                    </>
                            }
                        </>
                }
                {
                    props.type === 2 ?
                        <>
                            {
                                props.isStaked ?
                                    <span className="commission-icon-cd cursor-pointer d-flex justify-content-center align-items-center" data-tip="NFTCD">
                                        <FontAwesomeIcon icon={faC} className="commission-in" />
                                        <FontAwesomeIcon icon={faD} className="commission-in" />
                                    </span>
                                    :
                                    <span className="commission-icon cursor-pointer" data-tip="NFTC">
                                        <FontAwesomeIcon icon={faC} className="commission-in" />
                                    </span>
                            }
                        </>
                        :
                        props.isStaked &&
                        <span className="commission-icon-d cursor-pointer" data-tip="NFTD">
                            <FontAwesomeIcon icon={faD} className="commission-in" />
                        </span>
                }
            </div>

            <ReactTooltip />
            <div className="card-caption col-12 p-0">
                <div className="card-body">
                    <h5 className="mb-3">{props.name}</h5>
                </div>
            </div>
        </div>
    );
}

export default NFTPreview;