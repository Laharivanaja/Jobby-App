import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import './index.css'

const apiConstants = {
  success: 'SUCCESS',
  failure: 'FAILURE',
  loading: 'IN-PRoGRESS',
}

class Profiles extends Component {
  state = {profileDetails: {}, status: apiConstants.loading}

  componentDidMount() {
    this.getProfileList()
  }

  getProfileList = async () => {
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = 'https://apis.ccbp.in/profile'
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    const data = await response.json()
    if (response.ok === true) {
      const fetchedData = {
        name: data.profile_details.name,
        profileImageUrl: data.profile_details.profile_image_url,
        shortBio: data.profile_details.short_bio,
      }
      console.log(data)
      this.setState({profileDetails: fetchedData, status: apiConstants.success})
    } else {
      this.setState({status: apiConstants.failure})
    }
  }

  loadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  successView = () => {
    const {profileDetails} = this.state
    return (
      <div className="container">
        <h1>{profileDetails.name}</h1>
        <img src={profileDetails.profileImageUrl} alt="profile" />
        <p>{profileDetails.shortBio}</p>
      </div>
    )
  }

  failureView = () => <button onClick={this.getProfileList}>Retry</button>

  render() {
    const {status} = this.state
    switch (status) {
      case apiConstants.success:
        return this.successView()
      case apiConstants.failure:
        return this.failureView()
      case apiConstants.loading:
        return this.loadingView()
      default:
        return null
    }
  }
}
export default Profiles
