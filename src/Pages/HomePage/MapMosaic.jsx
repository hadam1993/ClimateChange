import React from 'react';
import _ from 'lodash';
import Delay from 'react-delay';
import PropTypes from 'prop-types';
import { Mosaic, MosaicWindow, MosaicContext } from 'react-mosaic-component';
import ClimateChangeMap from './ClimateChangeMap';
import ClusterTimeSeriesLineChart from './ClusterTimeSeriesLineChart';
import { setSelectedClusters } from '../../actions';
import { connect } from 'react-redux';

const MosaicIds = {
  Map: 'map',
  Precip: 'precip',
  Min: 'min',
  Max: 'max',
};

const MOSAIC_FULL_MAP = MosaicIds.Map;

const MOSAIC_SPLIT = {
  direction: 'row',
  first: MosaicIds.Map,
  second: {
    direction: 'column',
    first: MosaicIds.Precip,
    second: {
      direction: 'column',
      first: MosaicIds.Min,
      second: MosaicIds.Max,
      splitPercentage: 50,
    },
    splitPercentage: 20,
  },
  splitPercentage: 80,
};

class MapMosaic extends React.Component {
  onMosaicChange = (mosaic) => {
    const { selectedClusters } = this.props;
    if (selectedClusters && mosaic === MosaicIds.Map) {
      this.props.setSelectedClusters({});
    }
  };

  renderToolbar = (id) => ({ title, path }) => {
    switch (id) {
      case MosaicIds.Map: {
        return (
          /* div should be as wide as parent container for dnd to work properly */
          <div className="d-flex w-100 align-items-center justify-content-between">
            <div>
              {title}
            </div>

            <div />
          </div>
        );
      }
      default: {
        return (
          /* div should be as wide as parent container for dnd to work properly */
          <div className="d-flex w-100 align-items-center justify-content-between">
            <div>
              {title}
            </div>

            <div>
              <MosaicContext.Consumer>
                {({ mosaicActions }) => (
                  <button className="btn btn-sm btn-link" onClick={() => mosaicActions.remove(path)}><i className="fa fa-times" /></button>
                )}
              </MosaicContext.Consumer>
            </div>
          </div>
        );
      }
    }
  };

  renderTile = () => (id, path) => {
    switch (id) {
      case MosaicIds.Map: {
        const { clusters } = this.props;

        return (
          <MosaicWindow title="Map" path={path} renderToolbar={this.renderToolbar(id)}>
            <ClimateChangeMap clusters={clusters} />
          </MosaicWindow>
        );
      }
      case MosaicIds.Precip: {
        const { selectedClusters, climateVariables } = this.props;

        const series = _.map(selectedClusters, (selectedCluster) => ({ dataKey: `c${selectedCluster}precip`, cluster: selectedCluster }));

        return (
          <MosaicWindow title="Cluster Precipitation" path={path} renderToolbar={this.renderToolbar(id)}>
            <Delay
              wait={250}
            >
              <ClusterTimeSeriesLineChart climateVariables={climateVariables} series={series} />
            </Delay>
          </MosaicWindow>
        );
      }
      case MosaicIds.Min: {
        const { selectedClusters, climateVariables } = this.props;
        const series = _.map(selectedClusters, (selectedCluster) => ({ dataKey: `c${selectedCluster}mint`, cluster: selectedCluster }));

        return (
          <MosaicWindow title="Cluster Min" path={path} renderToolbar={this.renderToolbar(id)}>
            <Delay
              wait={1500}
            >
              <ClusterTimeSeriesLineChart climateVariables={climateVariables} series={series} />
            </Delay>
          </MosaicWindow>
        );
      }
      case MosaicIds.Max: {
        const { selectedClusters, climateVariables } = this.props;

        const series = _.map(selectedClusters, (selectedCluster) => ({ dataKey: `c${selectedCluster}maxt`, cluster: selectedCluster }));

        return (
          <MosaicWindow title="Cluster Max" path={path} renderToolbar={this.renderToolbar(id)}>
            <Delay
              wait={2500}
            >
              <ClusterTimeSeriesLineChart climateVariables={climateVariables} series={series} />
            </Delay>
          </MosaicWindow>
        );
      }
      default: {
        return (
          <MosaicWindow title="Details" path={path} renderToolbar={this.renderToolbar(id)}>
            test
          </MosaicWindow>
        );
      }
    }
  };

  render () {
    const { selectedClusters } = this.props;

    return (
      <Mosaic
        onChange={this.onMosaicChange}
        renderTile={this.renderTile()}
        initialValue={_.size(selectedClusters) > 0 ? MOSAIC_SPLIT : MOSAIC_FULL_MAP}
      />
    );
  }
}

MapMosaic.propTypes = {
  clusters: PropTypes.array.isRequired,
  climateVariables: PropTypes.array.isRequired,
  selectedClusters: PropTypes.object.isRequired,
  setSelectedClusters: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  return {
    clusters: state.clusters,
    climateVariables: state.climateVariables,
    selectedClusters: state.selectedClusters,
  };
};

const mapDispatchToProps = {
  setSelectedClusters: setSelectedClusters,
};

export default connect(mapStateToProps, mapDispatchToProps)(MapMosaic);
