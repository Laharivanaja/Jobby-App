import {Redirect} from 'react-router-dom'
import {Component} from 'react'
import Cookies from 'js-cookie'
import Header from '../Header'
import Profiles from '../Profiles'
import JobsList from '../JobsList'
import './index.css'

const employmentTypesList = [
  {label: 'Full Time', employmentTypeId: 'FULLTIME'},
  {label: 'Part Time', employmentTypeId: 'PARTTIME'},
  {label: 'Freelance', employmentTypeId: 'FREELANCE'},
  {label: 'Internship', employmentTypeId: 'INTERNSHIP'},
]

const salaryRangesList = [
  {salaryRangeId: '1000000', label: '10 LPA and above'},
  {salaryRangeId: '2000000', label: '20 LPA and above'},
  {salaryRangeId: '3000000', label: '30 LPA and above'},
  {salaryRangeId: '4000000', label: '40 LPA and above'},
]

class Jobs extends Component {
  state = {
    employmentTypes: [],
    salaryRange: '',
    jobsList: [],
    searchInput: '',
  }

  componentDidMount() {
    this.getJobsList()
  }

  getJobsList = async () => {
    const {employmentTypes, salaryRange, searchInput} = this.state
    const jwtToken = Cookies.get('jwt_token')

    const employmentQuery = employmentTypes.join(',')
    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${employmentQuery}&minimum_package=${salaryRange}&search=${searchInput}`

    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const data = await response.json()
      const formattedData = data.jobs.map(job => ({
        id: job.id,
        title: job.title,
        rating: job.rating,
        companyLogoUrl: job.company_logo_url,
        employmentType: job.employment_type,
        location: job.location,
        packagePerAnnum: job.package_per_annum,
        jobDescription: job.job_description,
      }))
      this.setState({jobsList: formattedData})
    }
  }

  onChangeEmploymentType = event => {
    const {value, checked} = event.target
    this.setState(prevState => {
      const updatedList = checked
        ? [...prevState.employmentTypes, value]
        : prevState.employmentTypes.filter(item => item !== value)
      return {employmentTypes: updatedList}
    }, this.getJobsList)
  }

  onChangeSalaryType = event => {
    this.setState({salaryRange: event.target.value}, this.getJobsList)
  }

  onChangeSearch = event => {
    this.setState({searchInput: event.target.value})
  }

  onClickSearch = () => {
    this.getJobsList()
  }

  render() {
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken === undefined) {
      return <Redirect to="/login" />
    }

    const {employmentTypes, salaryRange, jobsList, searchInput} = this.state

    return (
      <>
        <Header />
        <div className="container">
          <div className="filters-section">
            <Profiles />
            <h1>Type of Employment</h1>
            <ul>
              {employmentTypesList.map(eachOption => (
                <li key={eachOption.employmentTypeId}>
                  <input
                    type="checkbox"
                    id={eachOption.employmentTypeId}
                    value={eachOption.employmentTypeId}
                    onChange={this.onChangeEmploymentType}
                    checked={employmentTypes.includes(
                      eachOption.employmentTypeId,
                    )}
                  />
                  <label htmlFor={eachOption.employmentTypeId}>
                    {eachOption.label}
                  </label>
                </li>
              ))}
            </ul>

            <h1>Salary Range</h1>
            <ul>
              {salaryRangesList.map(eachOption => (
                <li key={eachOption.salaryRangeId}>
                  <input
                    type="radio"
                    name="salary"
                    id={eachOption.salaryRangeId}
                    value={eachOption.salaryRangeId}
                    onChange={this.onChangeSalaryType}
                    checked={salaryRange === eachOption.salaryRangeId}
                  />
                  <label htmlFor={eachOption.salaryRangeId}>
                    {eachOption.label}
                  </label>
                </li>
              ))}
            </ul>
          </div>

          <div className="jobs-section">
            <div className="search-bar">
              <input
                type="search"
                placeholder="Search"
                value={searchInput}
                onChange={this.onChangeSearch}
              />
              <button
                type="button"
                data-testid="searchButton"
                onClick={this.onClickSearch}
              >
                Search
              </button>
            </div>

            <JobsList jobs={jobsList} />
          </div>
        </div>
      </>
    )
  }
}

export default Jobs
