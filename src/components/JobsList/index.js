import {Component} from 'react'
import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import './index.css'

const apiConstants = {
  success: 'SUCCESS',
  failure: 'FAILURE',
  loading: 'IN-PRoGRESS',
}

class JobsList extends Component {
  state = {jobsDetails: [], status: apiConstants.loading}

  componentDidMount() {
    this.getjobsList()
  }

  getjobsList = async () => {
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = 'https://apis.ccbp.in/jobs'
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    const data = await response.json()
    if (response.ok === true) {
      const fetchedData = data.jobs.map(each => ({
        companyLogoUrl: each.company_logo_url,
        employmentType: each.employment_type,
        id: each.id,
        jobDescription: each.job_description,
        location: each.location,
        packagePerAnnum: each.package_per_annum,
        rating: each.rating,
        title: each.title,
      }))
      console.log(data)
      this.setState({jobsDetails: fetchedData, status: apiConstants.success})
    } else {
      this.setState({status: apiConstants.failure})
    }
  }

  loadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  failureView = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>
      <button onClick={this.getjobsList}>Retry</button>
    </div>
  )

  successView = () => {
    const {jobsDetails} = this.state
    return (
      <div className="background-container">
        <ul>
          {jobsDetails.map(each => (
            <li key={each.id}>
              <Link to={`/jobs/${each.id}`}>
                <img src={each.companyLogoUrl} alt="company logo" />
                <h1>{each.title}</h1>
                <p>{each.employmentType}</p>
                <h1>Description</h1>
                <p>{each.jobDescription}</p>
                <p>{each.location}</p>
                <p>{each.packagePerAnnum}</p>
                <p>{each.rating}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    )
  }

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
export default JobsList
