import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

const Header = props => {
  const {history} = props
  const onClickLogout = () => {
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  return (
    <nav className="nav-header">
      <div className="nav-content">
        <div className="nav-bar-mobile-logo-container">
          <img
            className="website-logo"
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
          />

          <button
            type="button"
            className="nav-mobile-btn"
            onClick={onClickLogout}
            data-testid="logout-button"
          >
            <img
              src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-log-out-img.png"
              alt="nav logout"
              className="nav-bar-img"
            />
          </button>
        </div>

        <div className="nav-content nav-bar-large-container">
          <Link to="/">
            <img
              className="website-logo"
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              alt="website logo"
            />
          </Link>
          <ul className="nav-menu">
            <Link to="/">
              <li className="nav-menu-item">Home</li>
            </Link>
            <Link to="/jobs">
              <li className="nav-menu-item">Jobs</li>
            </Link>

            <button
              type="button"
              className="logout-desktop-btn"
              onClick={onClickLogout}
              data-testid="logout-button"
            >
              Logout
            </button>
          </ul>
        </div>
      </div>
      <div className="nav-menu-mobile">
        <ul className="nav-menu-list-mobile">
          <li className="nav-menu-item-mobile">
            <img
              src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-home-icon.png"
              alt="nav home"
              className="nav-bar-img"
            />
          </li>
        </ul>
      </div>
    </nav>
  )
}
export default withRouter(Header)
