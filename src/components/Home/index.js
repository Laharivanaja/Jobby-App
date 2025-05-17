import {Redirect, Link} from 'react-router-dom'

import Cookies from 'js-cookie'
import Header from '../Header'

import './index.css'

const Home = () => {
  const jwtToken = Cookies.get('jwt_token')
  if (jwtToken === undefined) {
    return <Redirect to="/login" />
  }
  return (
    <>
      <Header />
      <div className="home-container">
        <div className="home-content">
          <h1 className="home-heading">Find The Job That Fits Your Life</h1>
          <img
            src="https://assets.ccbp.in/frontend/react-js/home-sm-bg.png"
            className="home-mobile-img"
          />
          <p className="home-description">
            Millions of people are searching for jobs, salary information,
            Company reviews. Find the job that fits your ability and potential.
          </p>
          <Link to="/jobs">
            <button type="button" className="shop-now-button">
              Find Jobs
            </button>
          </Link>
        </div>
        <img
          src="https://assets.ccbp.in/frontend/react-js/home-lg-bg.png"
          className="home-desktop-img"
        />
      </div>
    </>
  )
}

export default Home
