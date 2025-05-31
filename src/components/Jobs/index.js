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
    const locationQuery = selectedLocations.join(',')

    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${employmentQuery}&minimum_package=${salaryRange}&search=${searchInput}&location=${locationQuery}`

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
        const updatedJobs = data.jobs.map(job => ({
          id: job.id,
          title: job.title,
          rating: job.rating,
          companyLogoUrl: job.company_logo_url,
          employmentType: job.employment_type,
          location: job.location,
          packagePerAnnum: job.package_per_annum,
          jobDescription: job.job_description,
        }))
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
      () => this.getJobsList(),
    )
  }

  onChangeSearch = event => {
    this.setState({searchInput: event.target.value})
  }

  onClickSearch = () => {
    this.getJobsList()
  }

  onRetry = () => {
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

    const noJobsImageUrl =
      'https://assets.ccbp.in/frontend/react-js/no-jobs-img.png'

    return (
      <>
        <Header />
        <div className="container">
          <div className="filters-section sticky-sidebar">
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

            <h1>Location</h1>
            <ul>
              {locationsList.map(location => (
                <li key={location.locationId}>
                  <input
                    type="checkbox"
                    id={location.locationId}
                    value={location.locationId}
                    onChange={this.onChangeLocation}
                    checked={selectedLocations.includes(location.locationId)}
                  />
                  <label htmlFor={location.locationId}>{location.label}</label>
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

            {isLoading && <p>Loading...</p>}
            {error && (
              <div>
                <p>Failed to load jobs. Please try again.</p>
                <button onClick={this.onRetry}>Retry</button>
              </div>
            )}
            {jobsList.length === 0 && !isLoading && !error && (
              <div className="no-jobs-container">
                <img src={noJobsImageUrl} alt="no jobs" />
                <h1>No Jobs Found</h1>
                <p>We could not find any jobs. Try other filters</p>
              </div>
            )}
            {jobsList.length > 0 && <JobsList jobs={jobsList} />}
          </div>
        </div>
      </>
    )
  }
}

export default Jobs

/* import {Redirect} from 'react-router-dom'
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

    const {employmentTypes, salaryRange, searchInput} = this.state
    const jwtToken = Cookies.get('jwt_token')

    const employmentQuery = employmentTypes.join(',')
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

  onChangeLocation = event => {
    const {value, checked} = event.target
    this.setState(prevState => {
      const updatedLocations = checked
        ? [...prevState.selectedLocations, value]
        : prevState.selectedLocations.filter(loc => loc !== value)
      return {selectedLocations: updatedLocations}
    })
    // NOTE: not calling getJobsList because location is not a valid filter
  }

  onChangeSearch = event => {
    this.setState({searchInput: event.target.value})
  }

  onClickSearch = () => {
    this.getJobsList()
  }

  onRetry = () => {
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

    const noJobsImageUrl =
      'https://assets.ccbp.in/frontend/react-js/no-jobs-img.png'

    return (
      <>
        <Header />
        <div className="container">
          <div className="filters-section sticky-sidebar">
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

            <h1>Location</h1>
            <ul>
              {locationsList.map(location => (
                <li key={location.locationId}>
                  <input
                    type="checkbox"
                    id={location.locationId}
                    value={location.locationId}
                    onChange={this.onChangeLocation}
                    checked={selectedLocations.includes(location.locationId)}
                  />
                  <label htmlFor={location.locationId}>{location.label}</label>
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

            {isLoading && <p>Loading...</p>}
            {error && (
              <div>
                <p>Failed to load jobs. Please try again.</p>
                <button onClick={this.onRetry}>Retry</button>
              </div>
            )}
            {jobsList.length === 0 && !isLoading && !error && (
              <div className="no-jobs-container">
                <img src={noJobsImageUrl} alt="no jobs" />
                <h1>No Jobs Found</h1>
                <p>We could not find any jobs. Try other filters</p>
              </div>
            )}

            <JobsList jobs={jobsList} />
          </div>
        </div>
      </>
    )
  }
}

export default Jobs */
