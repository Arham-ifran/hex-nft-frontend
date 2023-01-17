import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import Select from 'react-select'
import { beforeCollection, getCollections } from '../collections/collections.actions'
import { beforeCategory, getCategories } from '../categories/categories.action'
import { beforeUser, getCreators } from '../user/user.action'
import { ENV } from '../../config/config'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
const { decimalNumberValidator, globalPlaceholderImage } = ENV
const currencies = (ENV.currencies).filter(elem => elem.showInFilters === true)

function FilterSearch(props) {
  const [statusFilters, setStatusFilters] = useState(false);
  const [priceFilters, setPriceFilters] = useState(false);
  const [colFilters, setColFilters] = useState(false);
  const [catFilters, setCatFilters] = useState(false);
  const [authorFilters, setAuthorFilters] = useState(false);
  const [collections, setCollections] = useState(null);
  const [categories, setCategories] = useState(null);
  const [authors, setAuthors] = useState(null);

  const [status, setStatus] = useState(null); // 1 = on auction, 2 = has offer, 3 = new
  const [currency, setCurrency] = useState(null);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [filter, setFilter] = useState(null);

  useEffect(() => {
    // get collections only if collection filters are visible
    if (props.showColFilters)
      getCollections()
  }, [props.showColFilters])

  useEffect(() => {
    // get categories only if category filters are visible
    if (props.showCatFilters)
      getCategories()
  }, [props.showCatFilters])

  useEffect(() => {
    // get authors only if author filters are visible
    if (props.showAuthorFilters)
      getAuthors()
  }, [props.showAuthorFilters])

  // apply status filter
  const applyStatusFilter = (value) => {
    setStatus(value)

    const filterData = { ...filter, status: value }

    if (!filterData.status)
      delete filterData.status

    setFilter(filterData)
    props.applyFilters(filterData)
  }

  const handleChange = selectedOption => {
    setCurrency(selectedOption?.value || null)
  }

  const onChange = (e) => {
    const { name, value } = e.target
    if (name === 'minPrice')
      setMinPrice(value)
    else if (name === 'maxPrice')
      setMaxPrice(value)
  }

  // apply price filter
  const applyPriceFilter = () => {
    const filterData = { ...filter }
    if (minPrice)
      filterData.minPrice = minPrice
    else
      delete filterData.minPrice

    if (maxPrice)
      filterData.maxPrice = maxPrice
    else
      delete filterData.maxPrice

    if (currency)
      filterData.currency = currency
    else
      delete filterData.currency

    setFilter(filterData)
    props.applyFilters(filterData)
  }

  // clear price filter
  const clearPriceFilter = () => {
    // clear fields
    setCurrency(null)
    setMinPrice('')
    setMaxPrice('')

    const filterData = { ...filter }
    delete filterData.minPrice
    delete filterData.maxPrice
    delete filterData.currency
    setFilter(filterData)
    props.applyFilters(filterData)
  }

  const getCollections = () => {
    const filter = {
      all: true,
    }

    const qs = ENV.objectToQueryString(filter)
    props.getCollections(qs)
  }

  const getCategories = () => {
    const filter = {
      all: true,
    }

    const qs = ENV.objectToQueryString(filter)
    props.getCategories(qs)
  }

  const getAuthors = () => {
    props.getCreators()
  }

  // set authors
  useEffect(() => {
    if (props.user.creatorsAuth) {
      setAuthors(props.user.creators?.creators)
      props.beforeUser()
    }
  }, [props.user.creatorsAuth])

  // set collections
  useEffect(() => {
    if (props.collection.getAuth) {
      const { collections } = props.collection
      setCollections(collections)
      props.beforeCollection()
    }
  }, [props.collection.getAuth])

  // set categories
  useEffect(() => {
    if (props.category.getAuth) {
      const { categories } = props.category
      setCategories(categories)
      props.beforeCategory()
    }
  }, [props.category.getAuth])

  // get collection NFTs
  const getColNFTs = (collectionId) => {
    const filterData = { ...filter }

    if (collectionId)
      filterData.collectionId = collectionId

    if (collectionId === 'all')
      delete filterData.collectionId

    setFilter(filterData)
    props.applyFilters(filterData)
  }

  // get categories NFTs
  const getCatNFTs = (categoryId) => {
    const filterData = { ...filter }

    if (categoryId)
      filterData.categoryId = categoryId

    if (categoryId === 'all')
      delete filterData.categoryId

    setFilter(filterData)
    props.applyFilters(filterData)
  }

  // get author / creators NFTs
  const getAuthorNFTs = (creatorId) => {
    const filterData = { ...filter }

    if (creatorId)
      filterData.creatorId = creatorId

    if (creatorId === 'all')
      delete filterData.creatorId

    setFilter(filterData)
    props.applyFilters(filterData)
  }

  return (
    <React.Fragment>
      <div className="filter-wrapper">
        <div className="filter-div  text-center">
          {/* <i className="fas fa-sort-amount-down-alt" />  */}
          <span className="fw-bold">Narrow the results</span>
        </div>
        <div onClick={() => setStatusFilters(!statusFilters)} className={`${statusFilters ? 'open' : ''} status-wrapper d-flex`}>
          <div className="d-flex align-items-center"><span className="side-box">S</span><span className="label-tag"><b>Status</b></span></div>
          <div className="tab-icon">
            <i className={`angle-down fas fa-chevron-${statusFilters ? 'up' : 'down'}`} />
          </div>
        </div>
        {
          statusFilters &&
          <div className="statuses-boxex" style={{ border: "none" }}>
            <div className={`on-auction ${status === 1 && 'active'}`} onClick={() => applyStatusFilter(status === 1 ? null : 1)}>On Auction</div>
            <div className={`on-auction ${status === 2 && 'active'}`} onClick={() => applyStatusFilter(status === 2 ? null : 2)}>Has Offer</div>
            <div className={`on-auction ${status === 3 && 'active'}`} onClick={() => applyStatusFilter(status === 3 ? null : 3)}>New</div>
          </div>
        }
        <div onClick={() => setPriceFilters(!priceFilters)} className={`${priceFilters ? 'open' : ''} status-wrapper d-flex`}>
          <div className="d-flex align-items-center"><span className="side-box">P</span><span className="label-tag"><b>Price</b></span></div>
          <div className="tab-icon">
            <i className={`angle-down fas fa-chevron-${priceFilters ? 'up' : 'down'}`} />
          </div>
        </div>
        {
          priceFilters &&
          <div className="statuses-boxex2">
            <Select
              options={currencies}
              value={currency ? currencies.filter(option => option.value === currency) : currencies[0]}
              onChange={handleChange}
              className="select-custom-style"
              placeholder="Select Currency"
              classNamePrefix="custom-select"
              styles={{
                menu: (provided, state) => ({
                  ...provided,
                  color: state.isDisabled ? 'grey' : 'hsl(0,0%,20%)',
                  cursor: state.isDisabled ? 'not-allowed' : 'pointer'
                })
              }}
              // isClearable={true}
              isSearchable={false}
            />
            <div className="min-max-number d-flex justify-content-center align-items-center mt-3 mb-3">
              <input type="text" placeholder="min" className="min-max me-2" name="minPrice" onChange={(e) => onChange(e)} onKeyDown={(e) => decimalNumberValidator(e)} value={minPrice} /> to <input type="text" placeholder="max" className="min-max ms-2" name="maxPrice" onChange={(e) => onChange(e)} onKeyDown={(e) => decimalNumberValidator(e)} value={maxPrice} />
            </div>
            <div className="button-wrapper d-flex justify-content-between align-items-center">
              <button className="apply-btn btn-filled" onClick={() => applyPriceFilter()} disabled={!(minPrice || maxPrice)}><span>Apply</span></button>
              <button className="apply-btn grey-btn btn-outlined" onClick={() => clearPriceFilter()}><span>Clear</span></button>
            </div>
          </div>
        }
        {
          props.showColFilters && collections &&
          <>
            <div onClick={() => setColFilters(!colFilters)} className={`${colFilters ? 'open' : ''} status-wrapper d-flex`}>
              <div className="d-flex align-items-center"><span className="side-box">C</span><span className="label-tag"><b>Collection</b></span></div>
              <div className="tab-icon">
                <i className={`angle-down fas fa-chevron-${colFilters ? 'up' : 'down'}`} />
              </div>
            </div>
            {
              colFilters &&
              <>
                <div className="d-flex flex-column justify-content-start statuses-boxex" style={{ border: "none" }}>
                  <div className={`d-flex align-items-center filter-item ${!filter?.collectionId && 'active'}`} onClick={() => getColNFTs('all')}>
                    <div className="collection-img rounded"></div>
                    <span className="ms-2 collection-name">All</span>
                  </div>
                  {
                    collections.map((collection, index) => {
                      return (
                        <div key={index} className={`d-flex align-items-center filter-item ${collection._id === filter?.collectionId && 'active'}`} onClick={() => getColNFTs(collection._id)}>
                          <div className="filter-img"><img className="rounded" src={collection.logo} alt="img" /></div>
                          <span className="ms-2 collection-name">{collection.name}</span>
                        </div>
                      )
                    })
                  }
                </div>
              </>
            }
          </>
        }
        {
          props.showCatFilters && categories &&
          <>
            <div onClick={() => setCatFilters(!catFilters)} className={`${catFilters ? 'open' : ''} status-wrapper d-flex`}>
              <div className="d-flex align-items-center"><span className="side-box">C</span><span className="label-tag"><b>Category</b></span></div>
              <div className="tab-icon">
                <i className={`angle-down fas fa-chevron-${catFilters ? 'up' : 'down'}`} />
              </div>
            </div>
            {
              catFilters &&
              <>
                <div className="d-flex justify-content-start statuses-boxex flex-column" style={{ border: "none" }}>
                  <div className={`d-flex align-items-center filter-item ${!filter?.categoryId && 'active'}`} onClick={() => getCatNFTs('all')}>
                    <div className="collection-img rounded">
                    </div><span className="ms-2 collection-name">All</span>
                  </div>
                  {
                    categories.map((category, index) => {
                      return (
                        <div key={index} className={`d-flex align-items-center filter-item ${category._id === filter?.categoryId && 'active'}`} onClick={() => getCatNFTs(category._id)}>
                          <div className="filter-img"><img className="rounded" src={category.image} alt="img" /></div>
                          <span className="ms-2 collection-name">{category.name}</span>
                        </div>
                      )
                    })
                  }
                </div>
              </>
            }
          </>
        }
        {
          props.showAuthorFilters && authors &&
          <>
            <div onClick={() => setAuthorFilters(!authorFilters)} className={`${authorFilters ? 'open' : ''} status-wrapper d-flex`}>
              <div className="d-flex align-items-center"><span className="side-box">A</span><span className="label-tag"><b>Author</b></span></div>
              <div className="tab-icon">
                <i className={`angle-down fas fa-chevron-${authorFilters ? 'up' : 'down'}`} />
              </div>
            </div>
            {
              authorFilters &&
              <>
                <div className="d-flex flex-column justify-content-start statuses-boxex" style={{ border: "none" }}>
                  <div className={`d-flex align-items-center filter-item ${!filter?.creatorId && 'active'}`} onClick={() => getAuthorNFTs('all')}>
                    <div className="collection-img rounded"></div>
                    <span className="ms-2 collection-name">All</span>
                  </div>
                  {
                    authors.map((author, index) => {
                      return (
                        <div key={index} className={`d-flex align-items-center filter-item ${author._id === filter?.creatorId && 'active'}`} onClick={() => getAuthorNFTs(author._id)}>
                          <div className="filter-img rounded">
                            <img className="rounded" src={author.profileImage ? author.profileImage : globalPlaceholderImage} alt="img" />
                          </div>
                          <span className="ms-2 collection-name">{author.username}</span>
                        </div>
                      )
                    })
                  }
                </div>
              </>
            }
          </>
        }
      </div>
    </React.Fragment>
  );
}

const mapStateToProps = state => ({
  collection: state.collection,
  category: state.category,
  user: state.user,
  error: state.error
});

export default connect(mapStateToProps, { beforeCollection, getCollections, beforeCategory, getCategories, beforeUser, getCreators })(FilterSearch)
