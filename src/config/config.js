import myntContractAbi from './../utils/abis/mynt.json';
import wbnbContractAbi from './../utils/abis/wbnb.json';
require('dotenv').config();
const dataEncryptionKey = process.env.REACT_APP_DATA_ENCRYPTION_KEY;
const CryptoJS = require("crypto-js");
const moment = require('moment');
const cdnBaseUrl = process.env.REACT_APP_CDN_BASE_URL

export const ENV = {
    cdnBaseUrl,
    domainUrl: process.env.REACT_APP_DOMAIN_URL,
    explorerURL: process.env.REACT_APP_BSC_URL,

    // gamification API urls
    gamification: {
        domainUrl: process.env.REACT_APP_GAMIFICATION_DOMAIN_URL,

        // get points / events data
        ponits: {
            url: process.env.REACT_APP_GAMIFICATION_POINTS,
            method: 'get'
        },
        // create stats on every action
        stats: {
            url: process.env.REACT_APP_GAMIFICATION_STATS,
            method: 'post'
        },
        // get contest list
        contests: {
            url: process.env.REACT_APP_GAMIFICATION_CONTEST,
            method: 'get'
        },
        // get gift cards list
        giftCards: {
            url: process.env.REACT_APP_GAMIFICATION_GIFT_CARDS,
            method: 'get'
        },
        // verify gift card
        giftCardVerification: {
            url: process.env.REACT_APP_GAMIFICATION_CARD_VERIFICATION,
            method: 'post'

        },
        // save redeemed gift cards
        redeemedGiftCard: {
            url: process.env.REACT_APP_GAMIFICATION_REDEEMED_CARD,
            method: 'post'
        }
        
    },

    bnb: process.env.REACT_APP_BNB_TO_USD,
    wbnb: process.env.REACT_APP_WBNB_TO_USD,
    mynt: process.env.REACT_APP_MYNT_TO_USD,
    myntToBnb: process.env.REACT_APP_MYNT_TO_BNB,
    bnbToWbnb: process.env.REACT_APP_BNB_TO_WBNB,

    // blockchain variables
    nftContractAddress: process.env.REACT_APP_NFT_CONTRACT_ADDRESS,
    myntContractAddress: process.env.REACT_APP_MYNT_TOKEN,
    web3ProviderAddress: process.env.REACT_APP_WEB3_PROVIDER_ADDRESS,

    // process variables
    url: process.env.REACT_APP_BASE_URL,
    assetUrl: process.env.REACT_APP_BASE_URL,
    nftItemBaseUrl: process.env.REACT_APP_NFT_BASE_URL,
    currency: process.env.REACT_APP_CURRENCY,
    appName: process.env.REACT_APP_NAME,
    requiredChainName: process.env.REACT_APP_REQUIRED_CHAIN_NAME,
    requiredChainIds: [97, 56],
    amountToApprove: 20000,
    myntMaxDecimals: 100000000,
    currencies: [
        {
            label: 'Binance (BNB)',
            symbol: 'BNB',
            value: 'BNB',
            icon: `${cdnBaseUrl}v1652166662/hex-nft/assets/binance_r40wgm.svg`,
            showInFilters: true, // show in search & filters section
        },
        {
            label: 'Wrapped Binance (WBNB)',
            symbol: 'WBNB',
            value: 'WBNB',
            icon: `${cdnBaseUrl}v1652166662/hex-nft/assets/binance_r40wgm.svg`,
            showInBuy: true, // show in make an offer / place a bid modal
            address: process.env.REACT_APP_WBNB_TOKEN,
            abi: wbnbContractAbi
        },
        {
            label: 'Myntist Token (MYNT)',
            symbol: 'MYNT',
            value: 'MYNT',
            icon: `${cdnBaseUrl}v1652181693/hex-nft/assets/myntist_c8kphm.png`,
            showInBuy: true, // show in make an offer / place a bid modal
            showInFilters: false, // show in search & filters section
            address: process.env.REACT_APP_MYNT_TOKEN,
            abi: myntContractAbi
        },
        {
            label: 'United States Dollar (USD)',
            symbol: 'USD',
            value: 'USD',
            icon: `${cdnBaseUrl}v1652166290/hex-nft/assets/ethereum_qyghpg.svg`,
            showInFilters: true // show in search & filters section
        }
    ],
    tokenNameToValue: {
        'MYNT': 1,
        'WBNB': 2
    },

    dataEncryptionKey,

    // Headers
    Authorization: `Bearer ${process.env.REACT_APP_AUTHORIZATION}`,
    x_auth_token: process.env.REACT_APP_X_AUTH_TOKEN,

    uploadedImgPath: `${process.env.REACT_APP_ASSETS_BASE_URL}images/`,

    // default images placeholders
    globalPlaceholderImage: `${cdnBaseUrl}v1652166290/hex-nft/assets/transparent-placeholder_wrydvd.png`,
    collectionFeaturedImg: `${cdnBaseUrl}v1652166289/hex-nft/assets/feature-placeholder_xqd6qk.svg`,
    userDefaultImg: `${cdnBaseUrl}v1652166289/hex-nft/assets/image-placeholder_qva6dx.png`,
    categoryDefaultImg: `${cdnBaseUrl}v1652166290/hex-nft/assets/transparent-placeholder_wrydvd.png`,

    //set user in local storage
    encryptUserData: function (data) {
        let userData = localStorage.getItem('encuse');
        if (userData && !data.accessToken) {
            let bytes = CryptoJS.AES.decrypt(userData, dataEncryptionKey);
            let originalData = bytes.toString(CryptoJS.enc.Utf8);
            originalData = JSON.parse(originalData);
            if (originalData && originalData.accessToken) {
                data.accessToken = originalData.accessToken;
            }
        }
        data = JSON.stringify(data);
        let encryptedUser = CryptoJS.AES.encrypt(data, dataEncryptionKey).toString();
        localStorage.setItem('encuse', encryptedUser);
        return true;
    },

    //return required keys
    getUserKeys: function (keys = null) {
        let userData = localStorage.getItem('encuse');
        if (userData) {
            var bytes = CryptoJS.AES.decrypt(userData, dataEncryptionKey);
            var originalData = bytes.toString(CryptoJS.enc.Utf8);
            originalData = JSON.parse(originalData);
            let user = {};
            if (keys) {
                keys = keys.split(" ");
                for (let key in keys) {
                    let keyV = keys[key];
                    user[keyV] = originalData[keyV];
                }
            }
            else {
                user = originalData;
            }
            return user;
        }
        return {};
    },

    //Object to query string
    objectToQueryString: function (body) {
        const qs = Object.keys(body).map(key => `${key}=${body[key]}`).join('&');
        return qs;
    },

    //validate image types
    isValidImageType: function (file) {
        if (file && file.type) {
            const acceptableTypes = ['image/png', 'image/x-png', 'image/jpeg', 'image/jpg']
            return (acceptableTypes.includes(file.type.toLowerCase()))
        }
    },

    //slick configurations
    slickSettings: {
        infinite: true,
        autoplay: true,
        autoplaySpeed: 3000,
        slidesToShow: 5,
        slidesToScroll: 1,
        dots: true,
        arrows: false,
        responsive: [
            {
                breakpoint: 1600,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                }
            }
        ]
    },

    dateRangeInitialSettings: {
        startDate: moment(),
        endDate: moment().add(6, 'months').toDate(),
        minDate: moment(),
        maxDate: moment().add(6, 'months').toDate(),
        ranges: {
            '1 Day': [
                moment().toDate(),
                moment().add(1, 'days').toDate(),
            ],
            '3 Days': [
                moment().toDate(),
                moment().add(3, 'days').toDate(),
            ],
            '1 Week': [
                moment().toDate(),
                moment().add(6, 'days').toDate(),
            ],
        }
    },

    countDownRenderer: ({ days, hours, minutes, seconds }) => {
        return (
            <div className="countdown-container d-flex" style={{ justifyContent: "space-between", width: "85%" }}>
                <div className="countdown-wrapper m-1">
                    <div>Days</div>
                    <div>{days}</div>
                </div>
                <div className="countdown-wrapper m-1">
                    <div>Hours</div>
                    <div>{hours}</div>
                </div>
                <div className="countdown-wrapper m-1">
                    <div>Minutes</div>
                    <div>{minutes}</div>
                </div>
                <div className="countdown-wrapper m-1">
                    <div>Seconds</div>
                    <div>{seconds}</div>
                </div>
            </div>
        )
    },

    decimalNumberValidator: function (e) {
        // Allow: backspace, delete, tab, escape, enter and .
        let specialKeys = [46, 8, 9, 27, 13, 110, 190]

        if (e.target.value.includes('.')) {
            specialKeys = [46, 8, 9, 27, 13]
        }
        else {
            specialKeys = [46, 8, 9, 27, 13, 110, 190]
        }

        // Allow: Ctrl+A,Ctrl+C,Ctrl+V, Command+A
        if (specialKeys.includes(e.keyCode) ||
            // Allow: Ctrl+A,Ctrl+C,Ctrl+Z,Ctrl+X Command+A
            ((e.keyCode === 65 || e.keyCode === 67 || e.keyCode === 90 || e.keyCode === 88) && (e.ctrlKey === true || e.metaKey === true)) ||
            // Allow: home, end, left, right, down, up
            (e.keyCode >= 35 && e.keyCode <= 40) ||
            // Allow F1 to F12 keys 
            (e.keyCode >= 112 && e.keyCode <= 123)
        ) {
            // let it happen, don't do anything
            return;
        }
        // Ensure that it is a number and stop the keypress
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }

    },

    integerNumberValidator: function (e) {
        // Allow: backspace, delete, tab, escape, enter and .
        const specialKeys = [46, 8, 9, 27, 13, 110]

        // Allow: Ctrl+A,Ctrl+C,Ctrl+V, Command+A
        if (specialKeys.includes(e.keyCode) ||
            // Allow: Ctrl+A,Ctrl+C,Ctrl+Z,Ctrl+X Command+A
            ((e.keyCode === 65 || e.keyCode === 67 || e.keyCode === 90 || e.keyCode === 88) && (e.ctrlKey === true || e.metaKey === true)) ||
            // Allow: home, end, left, right, down, up
            (e.keyCode >= 35 && e.keyCode <= 40)) {
            // let it happen, don't do anything
            return;
        }
        // Ensure that it is a number and stop the keypress
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
    },

    convertBnbToUsd: (value, bnbUnit) => {
        return (value * bnbUnit).toFixed(7);
    },

    convertBnbToWbnb: (value, bnbUnit) => {
        return (value * bnbUnit).toFixed(7);
    },

    convertUsdToBnb: (value, bnbUnit) => {
        if (bnbUnit !== 0)
            return (value / (bnbUnit)).toFixed(7);
    },

    convertMyntToUsd: (value, myntUnit) => {
        return (value * myntUnit).toFixed(7)
    },

    convertAnnToUsd: (value, annUnit) => {
        return (value * annUnit).toFixed(5)
    },

    convertMyntToBnb: (value, myntToBnbUnit) => {
        return value ? (value * myntToBnbUnit).toFixed(7) : 0;
    },

    convertBnbToMynt: (value, bnbToMyntUnit) => {
        return value ? (value * bnbToMyntUnit).toFixed(7) : 0;
    },

    convertWbnbToUsd: (value, wbnbToUsdUnit) => {
        return value ? (value * wbnbToUsdUnit).toFixed(7) : 0;
    },

    nftFileTypes: [
        /* 
            fileType: STRING, // image, audio, spreadSheet etc.
            mediaType: 1, // 1 = image, 2 = audio, ..., n
            hasImage: BOOLEAN, // to check if nft image or thumbnail is present
            hasFile: BOOLEAN, // to check if this file type has file other than image (i.e. for PDF, AUDIO, PPT etc.)
            supportedExtensions: ['.ai', '.bmp', '.gif', '.ico', ...],
            btnText: STRING, // e.g. 'View PDF file'
        */
        {
            fileType: 'disc',
            mediaType: 4,
            hasImage: true,
            hasFile: true,
            supportedExtensions: ['bin', 'dmg', 'iso', 'toast', 'vcd'],
            btnText: 'View Disc Image File',
        },
        {
            fileType: 'font',
            mediaType: 10,
            hasImage: true,
            hasFile: true,
            supportedExtensions: ['fnt', 'fon', 'otf', 'ttf'],
            btnText: 'View Font File',
        },
        {
            fileType: 'web',
            mediaType: 8,
            hasImage: true,
            hasFile: true,
            supportedExtensions: ['asp', 'aspx', 'cer', 'crt', 'cfm', 'css', 'html', 'htm', 'jsp', 'part', 'rss', 'xhtml'],
            btnText: 'View Web File',
        },
        {
            fileType: 'text',
            mediaType: 15,
            hasImage: true,
            hasFile: true,
            supportedExtensions: ['doc', 'docx', 'odt', 'pdf', 'rtf', 'tex', 'txt', 'wpd'],
            btnText: 'View Text File',
        },

        {
            fileType: 'image',
            mediaType: 1,
            hasImage: true,
            hasFile: false,
            supportedExtensions: ['bmp', 'gif', 'ico', 'jpeg', 'jpg', 'png', 'svg'/* , 'tif', 'tiff' */],
            btnText: '',
        },
        {
            fileType: 'audio',
            mediaType: 2,
            hasImage: true,
            hasFile: true,
            supportedExtensions: ['mp3', 'ogg', 'wav'],
            btnText: '',
        },
        {
            fileType: 'database',
            mediaType: 5,
            hasImage: true,
            hasFile: true,
            supportedExtensions: ['csv', 'dat', 'db', 'dbf', 'log', 'mdb', 'sav', 'sql', 'xml'],
            btnText: 'View Database File',
        },
        ,
        {
            fileType: 'email',
            mediaType: 6,
            hasImage: true,
            hasFile: true,
            supportedExtensions: ['email', 'eml', 'emlx', 'msg', 'oft', 'ost', 'pst', 'vcf'],
            btnText: 'View Email',
        },
        {
            fileType: 'executable',
            mediaType: 7,
            hasImage: true,
            hasFile: true,
            supportedExtensions: ['apk', 'bat', 'com', 'exe', 'gadget', 'jar', 'wsf'],
            btnText: 'View Executable File',
        },
        {
            fileType: 'presentaion',
            mediaType: 9,
            hasImage: true,
            hasFile: true,
            supportedExtensions: ['key', 'odp', 'pps', 'ppt', 'pptx'],
            btnText: 'View Presentation',
        },
        {
            fileType: 'system',
            mediaType: 13,
            hasImage: true,
            hasFile: true,
            supportedExtensions: ['bak', 'cab', 'cfg', 'cpl', 'cur', 'dll', 'dmp', 'drv', 'icns', 'ini', 'lnk', 'msi', 'sys', 'tmp'],
            btnText: 'View System File',
        },
        {
            fileType: 'video',
            mediaType: 14,
            hasImage: true,
            hasFile: true,
            supportedExtensions: ['3g2', '3gp', 'm4v', 'mkv', 'mov', 'mp4'],
            btnText: '',
        },
        {
            fileType: 'compressed',
            mediaType: 3,
            hasImage: true,
            hasFile: true,
            supportedExtensions: ['arj', '7z', 'deb', 'pkg', 'rar', 'rpm', 'tar.gz', 'tar', 'z', 'zip'],
            btnText: 'Download Compressed File',
        },
        {
            fileType: 'programming',
            mediaType: 11,
            hasImage: true,
            hasFile: true,
            supportedExtensions: ['c', 'cgi', 'pl', 'class', 'cpp', 'cs', 'h', 'java', 'php', 'py', 'sh', 'swift', 'vb', 'js'],
            btnText: 'View Programming File',
        },
        {
            fileType: 'spreadsheet',
            mediaType: 12,
            hasImage: true,
            hasFile: true,
            supportedExtensions: ['ods', 'xls', 'xlsm', 'xlsx'],
            btnText: 'View SpreadSheet',
        },
        {
            fileType: 'other',
            mediaType: 16,
            hasImage: true,
            hasFile: true,
            supportedExtensions: ['psd', 'ai', 'ps'],
            btnText: 'Download File',
        },
    ],

    rightsManagementOptions: [
        {
            value: 1,
            label: 'Contribution -  A buyer can download and sell'
        },
        {
            value: 2,
            label: 'Exclusivity - A buyer can sell it, and it’s non downloadable'
        },
        {
            value: 3,
            label: 'Non Exclusive - A buyer can read only'
        }
    ]
}
