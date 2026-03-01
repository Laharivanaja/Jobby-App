import {Link} from 'react-router-dom'
import './index.css'

const JobsList = props => {
  const {jobs} = props

  if (jobs.length === 0) {
    return (
      <div className="no-jobs">
        <img
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
          alt="no jobs"
        />
        <h1>No Jobs Found</h1>
        <p>We could not find any jobs. Try other filters.</p>
      </div>
    )
  }

  return (
    <ul className="jobs-list">
      {jobs.map(each => (
        <li key={each.id} className="job-item">
          <Link to={`/jobs/${each.id}`}>
            <div className="logo-title-container">
              <img src={each.companyLogoUrl} alt="company logo" />
              <div>
                <h1>{each.title}</h1>
                <p>{each.rating}</p>
              </div>
            </div>
            <div className="location-type-package">
              <p>{each.location}</p>
              <p>{each.employmentType}</p>
              <p>{each.packagePerAnnum}</p>
            </div>
            <hr />
            <h1>Description</h1>
            <p>{each.jobDescription}</p>
          </Link>
        </li>
      ))}
    </ul>
  )
}

export default JobsList
