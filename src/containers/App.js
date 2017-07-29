import React from 'react'
import PropTypes from 'prop-types'
import { Router, Route, Switch } from 'react-router-dom'
import { Dimmer, Loader } from 'semantic-ui-react'
import { connect } from 'react-redux'
import throttle from 'lodash/throttle'
import routes from '../router/routes'
import Auth from './Auth'
import InitialSetup from './InitialSetup'
import SidebarMenu from './SidebarMenu'
import Header from '../components/Header'
import SyncWarning from './SyncWarning'
import { loadSettings } from '../actions/settings'
import { loadAccounts } from '../actions/accounts'
import { startSync } from '../actions/sync'
import { windowResize } from '../actions/ui/windowResize'
import { toggleSidebar } from '../actions/ui/sidebar'

class App extends React.Component {
  componentWillMount() {
    window.addEventListener('resize', throttle(this.props.windowResize, 500))
  }

  componentDidMount() {
    this.props.loadSettings()
    this.props.loadAccounts()
    this.props.startSync()
  }

  render() {
    if (!this.props.isLoaded) return <Loader active />

    return (
      <Router history={this.props.history}>
        <Switch>
          <Route path="/auth" exact={true} component={Auth} />
          {!this.props.isSetupComplete
            ? <Route component={InitialSetup} />
            : <Route render={this.renderNavigationRoutes} />}
        </Switch>
      </Router>
    )
  }

  /**
   * Navigation routes are the pages associated to navigation menu items,
   * e.g. Dashboard, Transactions, Settings etc.
   * They are rendered with common structure: sidebar menu and sticky header.
   */
  renderNavigationRoutes = () => {
    const wrapperClassName = this.props.isSidebarOpen || !this.props.isMobile
      ? 'openSidebar'
      : 'closedSidebar'
    return (
      <div className={wrapperClassName}>
        <SidebarMenu />
        <Dimmer.Dimmable className="container">
          {routes.map(route => (
            <Route
              key={route.path}
              path={route.path}
              exact={route.exact}
              render={props => (
                <div>
                  <Dimmer
                    active={this.props.isMobile && this.props.isSidebarOpen}
                    onClick={this.props.toggleSidebar}
                  />
                  <Header label={route.label} />
                  <SyncWarning />
                  <route.component {...props} />
                </div>
              )}
            />
          ))}
        </Dimmer.Dimmable>
      </div>
    )
  }
}

App.propTypes = {
  history: PropTypes.object.isRequired,
  isLoaded: PropTypes.bool,
  isSetupComplete: PropTypes.bool,
  isMobile: PropTypes.bool,
  isSidebarOpen: PropTypes.bool,
  loadSettings: PropTypes.func,
  loadAccounts: PropTypes.func,
  startSync: PropTypes.func,
  windowResize: PropTypes.func,
  toggleSidebar: PropTypes.func
}

const mapStateToProps = (state, ownProps) => ({
  history: ownProps.history,
  isLoaded: state.settings.isLoaded,
  isSetupComplete: state.settings.isSetupComplete,
  isMobile: state.ui.isMobile,
  isSidebarOpen: state.ui.isSidebarOpen
})

export default connect(mapStateToProps, {
  loadSettings,
  loadAccounts,
  startSync,
  windowResize,
  toggleSidebar
})(App)
