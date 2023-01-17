import { useState, useEffect } from 'react';
import HorizontalScroll from 'react-scroll-horizontal';
import Select from 'react-select';
import searchIconDark from '../../../assets/images/search-icon-dark.svg';
import searchIconLight from '../../../assets/images/search-icon-light.svg';
import iconSettings from '../../../assets/images/icon-settings.svg';
import { Link } from "react-router-dom";
import siteLogoDarkMode from '../../../assets/images/logo-dark-mode.svg';
import siteLogoLightMode from '../../../assets/images/logo-light-mode.svg';
import { beforeNavbar, getNavbar } from './navBar.action'
import { setCatId, setAll } from '../ImagibleItems/ImagibleItems.action'
import { connect } from 'react-redux';


const child = { height: `100%` }


const NavBar = (props) => {

    const [selectedOption, setSelectedOption] = useState({ value: 'chocolate', label: 'Chocolate' })

    const handleChange = e => {
        setSelectedOption(e)
    };

    const options = [
        { value: 'chocolate', label: 'Chocolate' },
        { value: 'strawberry', label: 'Strawberry' },
        { value: 'vanilla', label: 'Vanilla' },
    ];

    const [cat, setCat] = useState(null)

    useEffect(() => {
        props.getNavbar()
    }, [])

    useEffect(() => {
        if (props.navBar.navBarAuth) {
            setCat(props.navBar.navBar)
        }
    }, [props.navBar.navBarAuth])

    const activeCat = (id) =>{
        document.querySelectorAll('.nav-lnk').forEach(element => {
            element.classList.remove('active')
        });
        document.querySelector(`#lnk-${id}`).classList.add('active');
    }

    return (
        <header id="header" className="main-header home-header">
            {/* Navbar */}
            <nav data-aos="zoom-out" data-aos-delay={800} className="navbar navbar-expand">
                <div className="container header">
                    <div className="nav-container">
                        <div className="left-menu-logo">
                            <strong className="text-center d-block">
                                <Link className="d-inline-block align-top" to="/">
                                    <img className="navbar-brand-sticky logo-dark-mode" src={siteLogoDarkMode} alt="sticky brand-logo" />
                                    <img className="navbar-brand-sticky logo-light-mode" src={siteLogoLightMode} alt="sticky brand-logo" />
                                </Link>
                            </strong>
                        </div>
                        <h3 className="nav-heading">
                            <span className="top-menu-text">Explore</span>
                            <span className="left-menu-text d-none">Explore by Categories</span>
                        </h3>
                        {/* Navbar */}
                        <div className="topmenu-nav-holder">
                            <HorizontalScroll reverseScroll>
                                <div className="parentDiv" style={child}>
                                    <ul className="navbar-nav items xxv">
                                        <li id={`lnk-idOfAll`} className={'nav-lnk active'}><Link to="" onClick={(e) => {
                                            props.setAll();
                                            activeCat('idOfAll');
                                        }}>All</Link></li>
                                        {
                                            cat ? cat.map((item, key) => {
                                                return (
                                                    <li id={`lnk-${item._id}`} className={'nav-lnk'}>
                                                        <Link to="" key={key} onClick={(e) => {
                                                            props.setCatId(item._id);
                                                            activeCat(item._id);
                                                        }}>{item.name}</Link>
                                                    </li>
                                                )
                                            }) : ''
                                        }
                                    </ul>
                                </div>
                            </HorizontalScroll>
                        </div>
                        <div className="leftmenu-nav-holder">
                            <ul className="navbar-nav items xxb">
                                {/* {
                                    cat ? cat.map((item) => {
                                        return (
                                            <li><Link to="#">{item.name}</Link></li>
                                        )
                                    }) : ''
                                } */}
                            </ul>
                        </div>
                        <ul className="list-unstyled top-menu-filter">
                            <li><Link to=""><i className="fas fa-sliders-h mr-3"></i>Filters &amp; Sort</Link></li>
                        </ul>
                        {/* Navbar Icons */}
                        {/* <ul className="navbar-nav icons">
							<li className="nav-item">
								<Link to="#" className="nav-link" data-toggle="modal" data-target="#search">
									<i className="fas fa-search" />
								</Link>
							</li>
						</ul> */}
                        {/* Navbar Toggler */}
                        <ul className="navbar-nav toggle d-block d-xl-none">
                            <li className="nav-item">
                                <Link to="#" className="nav-link" data-toggle="modal" data-target="#menu">
                                    <i className="fas fa-bars toggle-icon m-0" />
                                </Link>
                            </li>
                        </ul>
                        {/* Navbar Action Button */}
                    </div>
                </div>
            </nav>
            <div className="mobile-filter-row">
                <ul className="list-unstyled">
                    <li><Link to=""><i className="fas fa-sliders-h mr-3"></i>Filters &amp; Sort</Link></li>
                </ul>
                <ul className="navbar-nav toggle">
                    <li className="nav-item">
                        <Link to="#" className="nav-link" data-toggle="modal" data-target="#menu">
                            <i className="fas fa-bars toggle-icon m-0" />
                        </Link>
                    </li>
                </ul>
            </div>
            <div className="filter-row">
                <span className="filter-result-text mb-3 mb-lg-0">11.354 results</span>
                <div className="select-holder mb-3 mb-lg-0">
                    <Select
                        value={selectedOption}
                        onChange={(e) => handleChange(e)}
                        options={options}
                        classNamePrefix="react_select"
                    />
                </div>
                <div className="select-holder">
                    <Select
                        value={selectedOption}
                        onChange={(e) => handleChange(e)}
                        options={options}
                        classNamePrefix="react_select"
                    />
                </div>
            </div>
        </header>
    )
}

const mapStateToProps = state => ({
    error: state.error,
    navBar: state.navBar,
    explore: state.explore
});

export default connect(mapStateToProps, { beforeNavbar, getNavbar, setCatId, setAll })(NavBar)
