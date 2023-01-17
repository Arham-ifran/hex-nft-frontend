/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { ENV } from './../../config/config';
import { toast } from 'react-toastify';
import ReactTooltip from 'react-tooltip'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-solid-svg-icons';
import { CopyToClipboard } from 'react-copy-to-clipboard';

const { cdnBaseUrl } = ENV
const ProfileImg = `${cdnBaseUrl}v1652166289/hex-nft/assets/image-placeholder_qva6dx.png`;
const AuthorProfile = (props) => {
    const showInExplorer = async () => {
        const { address } = props
        const url = ENV.explorerURL
        window.open(`${url}/address/${address}`, '_blank')
        return null
    }

    return (
        <div className="card-wrapper">
            <div className="main-profile-img text-center">
                <div className="profile-img-in">
                    <div className="image-over mb-5">
                        <img id="nft-image" className="card-img-top" src={props.profileImage ? props.profileImage : ProfileImg} alt="User Profile" />
                    </div>
                    <h5 className="mb-3 text-white">{props.username}</h5>
                </div>
                <div className="card-caption col-12 p-0">
                    <div className="card-body mt-4">
                        <p className="my-3">{props.description}</p>
                        <div className="input-group">
                            <input type="text" className="form-control cursor-pointer" id="profile-add-field" data-effect="float" data-for='path' data-tip={props.address} placeholder="0x000000000000000000" readOnly value={props.address} onClick={showInExplorer} />
                            <div className="input-group-append">
                                <CopyToClipboard text={props.address}
                                    onCopy={() => toast.success('Address copied to clipboard.', { toastId: '' })}>
                                    <button><FontAwesomeIcon className="copy-icon cursor-pointer" icon={faCopy} data-effect="float" data-tip="Copy" /> </button>
                                </CopyToClipboard>
                            </div>
                        </div>
                        <div className="social-icons d-flex justify-content-center my-3">
                            {
                                props.facebookLink && <a className="facebook" href={props.facebookLink} target="_blank" rel="noreferrer" data-effect="float" data-tip="Facebook">
                                    <i className="fab fa-facebook-f" />
                                </a>
                            }
                            {
                                props.twitterLink && <a className="twitter" href={props.twitterLink} target="_blank" rel="noreferrer" data-effect="float" data-tip="Twitter">
                                    <i className="fab fa-twitter" />
                                </a>
                            }
                            {
                                props.gPlusLink && <a className="google-plus" href={props.gPlusLink} target="_blank" rel="noreferrer" data-effect="float" data-tip="Google Plus">
                                    <i className="fab fa-google-plus-g" />
                                </a>
                            }
                            {
                                props.vineLink && <a className="vine" href={props.vineLink} target="_blank" rel="noreferrer" data-effect="float" data-tip="Vine">
                                    <i className="fab fa-vine" />
                                </a>
                            }
                        </div>
                        {
                            props.followText &&
                            <a className="btn btn-bordered-white btn-smaller">{props.followText}</a>
                        }
                    </div>
                </div>
            </div>
            <ReactTooltip id='path' multiline={true} html={true} className="react-tooltip" />
        </div>

    );
}
export default AuthorProfile;