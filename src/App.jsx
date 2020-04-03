import './assets/app.scss';

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import HomePage from './Pages/HomePage/HomePage';
import { getPlotData } from './actions';

class App extends React.Component {
  componentDidMount () {
    const { selectedClusterConfig } = this.props;
    const { plotDataFile } = selectedClusterConfig;
    this.props.getPlotData(plotDataFile);
  }

  render () {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', width: '100vw', height: '100vh' }}>
        <HomePage />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    selectedClusterConfig: state.selectedClusterConfig,
  };
};

const mapDispatchToProps = {
  getPlotData: getPlotData,
};

App.propTypes = {
  selectedClusterConfig: PropTypes.object.isRequired,
  getPlotData: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
