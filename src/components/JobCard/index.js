import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import './index.css'

const apiConstants = {
  success: 'SUCCESS',
  failure: 'FAILURE',
  loading: 'IN_PROGRESS',
}

class JobCard extends Component {
  state = {
    eachJobDetails: null,
    similarJobs: [],
    status: apiConstants.loading,
  }

  componentDidMount() {
    this.getAllDetails()
  }

  getAllDetails = async () => {
    this.setState({status: apiConstants.loading})

    const jwtToken = Cookies.get('jwt_token')
    const {match} = this.props
    const {params} = match
    const {id} = params
    const apiUrl = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(apiUrl, options)

    if (response.ok) {
      const data = await response.json()

      const fetchedData = {
        companyLogoUrl: data.job_details.company_logo_url,
        companyWebsiteUrl: data.job_details.company_website_url,
        employmentType: data.job_details.employment_type,
        id: data.job_details.id,
        title: data.job_details.title,
        jobDescription: data.job_details.job_description,
        skills: data.job_details.skills.map(each => ({
          imageUrl: each.image_url,
          name: each.name,
        })),
        lifeAtCompany: {
          description: data.job_details.life_at_company.description,
          imageUrl: data.job_details.life_at_company.image_url,
        },
        location: data.job_details.location,
        packagePerAnnum: data.job_details.package_per_annum,
        rating: data.job_details.rating,
      }

      const similarData = data.similar_jobs.map(each => ({
        companyLogoUrl: each.company_logo_url,
        employmentType: each.employment_type,
        id: each.id,
        jobDescription: each.job_description,
        location: each.location,
        rating: each.rating,
        title: each.title,
      }))

      this.setState({
        eachJobDetails: fetchedData,
        similarJobs: similarData,
        status: apiConstants.success,
      })
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
    <div className="failure-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="failure-image"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>
      <button type="button" onClick={this.getAllDetails}>
        Retry
      </button>
    </div>
  )

  successView = () => {
    const {eachJobDetails, similarJobs} = this.state

    return (
      <div className="job-details-container">
        <div className="job-header">
          <img
            src={eachJobDetails.companyLogoUrl}
            alt="job details company logo"
            className="company-logo"
          />
          <div>
            <h1>{eachJobDetails.title}</h1>
            <p>Rating: {eachJobDetails.rating}</p>
          </div>
        </div>

        <div className="job-info">
          <p>{eachJobDetails.location}</p>
          <p>{eachJobDetails.employmentType}</p>
          <p>{eachJobDetails.packagePerAnnum}</p>
        </div>

        <div className="job-description">
          <ul>
            <h1>Description</h1>
            <a
              href={eachJobDetails.companyWebsiteUrl}
              target="_blank"
              rel="noreferrer"
              alt="website logo"
            >
              Visit
            </a>
            <p>{eachJobDetails.jobDescription}</p>
          </ul>
        </div>

        <div className="skills-section">
          <h2>Skills</h2>
          <ul className="skills-list">
            {eachJobDetails.skills.map(each => (
              <li key={each.name} className="skill-item">
                <img
                  src={each.imageUrl}
                  alt={each.name}
                  className="skill-icon"
                />
                <p>{each.name}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="life-at-company">
          <h1>Life at Company</h1>
          <p>{eachJobDetails.lifeAtCompany.description}</p>
          <img
            src={eachJobDetails.lifeAtCompany.imageUrl}
            alt="life at company"
            className="life-image"
          />
        </div>

        <div className="similar-jobs">
          <h1>Similar Jobs</h1>
          <ul className="similar-jobs-list">
            {similarJobs.map(job => (
              <li key={job.id} className="similar-job-item">
                <img
                  src={job.companyLogoUrl}
                  alt="similar job company logo"
                  className="company-logo"
                />
                <h1>{job.title}</h1>
                <h2>Description</h2>
                <p>{job.jobDescription}</p>
                <p>{job.location}</p>
                <p>{job.employmentType}</p>
                <p>Rating: {job.rating}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  }

  render() {
    const {status} = this.state
    const jwtToken = Cookies.get('jwt_token')

    if (jwtToken === undefined) {
      return <Redirect to="/login" />
    }

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

export default JobCard
