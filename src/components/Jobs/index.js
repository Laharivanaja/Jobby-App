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

const locationsList = [
  {locationId: 'Hyderabad', label: 'Hyderabad'},
  {locationId: 'Bangalore', label: 'Bangalore'},
  {locationId: 'Chennai', label: 'Chennai'},
  {locationId: 'Delhi', label: 'Delhi'},
  {locationId: 'Mumbai', label: 'Mumbai'},
]

class Jobs extends Component {
  state = {
    employmentTypes: [],
    salaryRange: '',
    jobsList: [],
    searchInput: '',
    selectedLocations: [],
    isLoading: false,
    error: false,
  }

  componentDidMount() {
    this.getJobsList()
  }

  getJobsList = async () => {
    this.setState({isLoading: true, error: false})

    const {
      employmentTypes,
      salaryRange,
      searchInput,
      selectedLocations,
    } = this.state
    const jwtToken = Cookies.get('jwt_token')

    const employmentQuery = employmentTypes.join(',')
    // Note: The API does NOT support a location query parameter, so we fetch base data here
    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${employmentQuery}&minimum_package=${salaryRange}&search=${searchInput}`

    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    try {
      const response = await fetch(apiUrl, options)
      if (response.ok) {
        const data = await response.json()
        let updatedJobs = data.jobs.map(job => ({
          id: job.id,
          title: job.title,
          rating: job.rating,
          companyLogoUrl: job.company_logo_url,
          employmentType: job.employment_type,
          location: job.location,
          packagePerAnnum: job.package_per_annum,
          jobDescription: job.job_description,
        }))

        // MANUALLY FILTER BY LOCATION IN CODE
        if (selectedLocations.length > 0) {
          updatedJobs = updatedJobs.filter(job =>
            selectedLocations.includes(job.location),
          )
        }

        this.setState({jobsList: updatedJobs})
      } else {
        this.setState({error: true})
      }
    } catch {
      this.setState({error: true})
    } finally {
      this.setState({isLoading: false})
    }
  }

  onChangeEmploymentType = event => {
    const {value, checked} = event.target
    this.setState(
      prevState => {
        const updated = checked
          ? [...prevState.employmentTypes, value]
          : prevState.employmentTypes.filter(item => item !== value)
        return {employmentTypes: updated}
      },
      () => this.getJobsList(),
    )
  }

  onChangeSalaryType = event => {
    this.setState({salaryRange: event.target.value}, this.getJobsList)
  }

  onChangeLocation = event => {
    const {value, checked} = event.target
    this.setState(
      prevState => {
        const updated = checked
          ? [...prevState.selectedLocations, value]
          : prevState.selectedLocations.filter(loc => loc !== value)
        return {selectedLocations: updated}
      },
      () => this.getJobsList(), // Trigger re-fetch and re-filter
    )
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

    const {
      employmentTypes,
      salaryRange,
      jobsList,
      searchInput,
      selectedLocations,
      isLoading,
      error,
    } = this.state

    return (
      <>
        <Header />
        <div className="container">
          <div className="filters-section">
            <Profiles />
            <hr />
            <h1>Type of Employment</h1>
            <ul>
              {employmentTypesList.map(each => (
                <li key={each.employmentTypeId}>
                  <input
                    type="checkbox"
                    id={each.employmentTypeId}
                    value={each.employmentTypeId}
                    onChange={this.onChangeEmploymentType}
                  />
                  <label htmlFor={each.employmentTypeId}>{each.label}</label>
                </li>
              ))}
            </ul>
            <hr />
            <h1>Salary Range</h1>
            <ul>
              {salaryRangesList.map(each => (
                <li key={each.salaryRangeId}>
                  <input
                    type="radio"
                    name="salary"
                    id={each.salaryRangeId}
                    value={each.salaryRangeId}
                    onChange={this.onChangeSalaryType}
                  />
                  <label htmlFor={each.salaryRangeId}>{each.label}</label>
                </li>
              ))}
            </ul>
            <hr />
            <h1>Location</h1>
            <ul>
              {locationsList.map(loc => (
                <li key={loc.locationId}>
                  <input
                    type="checkbox"
                    id={loc.locationId}
                    value={loc.locationId}
                    onChange={this.onChangeLocation}
                  />
                  <label htmlFor={loc.locationId}>{loc.label}</label>
                </li>
              ))}
            </ul>
          </div>
          <div className="jobs-section">
            <div className="search-bar">
              <input
                type="search"
                value={searchInput}
                onChange={this.onChangeSearch}
              />
              <button onClick={this.onClickSearch}>Search</button>
            </div>
            {isLoading ? <p>Loading...</p> : <JobsList jobs={jobsList} />}
            {error && <p>Something went wrong!</p>}
          </div>
        </div>
      </>
    )
  }
}

export default Jobs
