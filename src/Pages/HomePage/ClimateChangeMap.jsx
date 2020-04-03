import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import _ from 'lodash';
import L from 'leaflet';
import { Map, Marker, TileLayer } from 'react-leaflet';
import Control from 'react-leaflet-control';
import LoadingOverlay from 'react-loading-overlay';

import { zoom, center, colors, markerImages, mutedMarkerImages } from '../../config';
import CanvasMarkersLayer from '../../Components/CanvasMarker/CanvasMarkersLayer';
import { setSelectedClusters } from '../../actions';
import { connect } from 'react-redux';

function hexToRgb (hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  } : null;
}

class ClimateChangeMap extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      isLoadingMutedMarkers: false,
      markersMuted: false,
    };
  }

  toggleSelectedCluster = (cluster) => {
    const { selectedClusters } = this.props;
    const updatedSelectedClusters = { ...selectedClusters };

    if (_.has(selectedClusters, cluster)) {
      delete updatedSelectedClusters[cluster];
    } else {
      updatedSelectedClusters[cluster] = cluster;
    }

    this.props.setSelectedClusters(updatedSelectedClusters);
  };

  renderMarkers (markers, images) {
    return _.map(markers, (data) => {
      const { index, latitude, longitude, cluster } = data;

      const markerImage = images[cluster - 1];

      const defaultIcon = L.icon({
        iconUrl: require('../../assets/img/markers/' + markerImage),
        opacity: 0.3,
        iconSize: [10, 10],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        tooltipAnchor: [16, -28],
      });

      return (
        <Marker key={index} position={[latitude, longitude - 360]} icon={defaultIcon} properties={data} />
      );
    });
  }

  render () {
    const { isLoadingMutedMarkers } = this.state;
    const { availableClusters, clusters, selectedClusters } = this.props;

    const fullMarkers = [];
    const mutedMarkers = [];

    _.each(clusters, (data) => {
      const isMuted = !_.has(selectedClusters, data.cluster);

      if (isMuted) {
        mutedMarkers.push(data);
      } else {
        fullMarkers.push(data);
      }
    });

    return (
      <div className="d-flex flex-1">
        <LoadingOverlay className="d-flex flex-1" active={isLoadingMutedMarkers} spinner text="Selecting Cluster...">
          <Map
            maxZoom={20}
            style={{ flex: 1 }}
            zoom={zoom}
            center={center}
            renderer={L.canvas()}
          >
            <Control position="topright">
              <div className="btn-group">
                <button className="btn btn-primary">Descriptive</button>
                <button className="btn btn-light">PCA</button>
              </div>
            </Control>

            <Control position="bottomleft">
              <div className="p-3">
                {
                  _.map(availableClusters, (cluster, i) => {
                    const isSelected = _.has(selectedClusters, cluster);
                    const color = colors[i];
                    const { r, g, b } = hexToRgb(color);
                    return (
                      <button className="btn btn-block btn-secondary" style={{ backgroundColor: isSelected ? `rgba(${r}, ${g}, ${b}, 1)` : `rgba(${r}, ${g}, ${b}, .3` }} onClick={() => this.toggleSelectedCluster(cluster)}>
                        <i className={classnames({ 'fa ': true, 'fa-square-o': !isSelected, 'fa-check-square-o': isSelected })} /> Cluster {cluster}
                      </button>
                    );
                  })
                }
              </div>
            </Control>

            <TileLayer url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png" noWrap />
            <CanvasMarkersLayer dataKey="properties">
              {this.renderMarkers(fullMarkers, markerImages)}
            </CanvasMarkersLayer>
            <CanvasMarkersLayer dataKey="properties">
              {this.renderMarkers(mutedMarkers, mutedMarkerImages)}
            </CanvasMarkersLayer>
          </Map>
        </LoadingOverlay>
      </div>
    );
  }
}

ClimateChangeMap.propTypes = {
  availableClusters: PropTypes.array.isRequired,
  clusters: PropTypes.array.isRequired,
  selectedClusters: PropTypes.object.isRequired,
  setSelectedClusters: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  return {
    availableClusters: state.selectedClusterConfig.clusters,
    selectedClusters: state.selectedClusters,
  };
};

const mapDispatchToProps = {
  setSelectedClusters: setSelectedClusters,
};

export default connect(mapStateToProps, mapDispatchToProps)(ClimateChangeMap);
