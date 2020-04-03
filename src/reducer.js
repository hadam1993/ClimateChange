import clusterConfig from './data/clusters';
import { actions } from './actions';

const initialState = {
  clusterConfig: clusterConfig,
  selectedClusterConfig: clusterConfig.three,
  clusters: [],
  climateVariables: [],
  selectedClusters: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case actions.SET_SELECTED_CLUSTERS: {
      const { selectedClusters } = action.payload;
      return {
        ...state,
        selectedClusters: selectedClusters,
      };
    }
    case actions.GET_PLOT_DATA_SUCCESS: {
      const { plotData } = action.payload;
      return {
        ...state,
        clusters: plotData,
      };
    }
    case actions.GET_CLIMATE_VARIABLES_SUCCESS: {
      const { climateVariables } = action.payload;
      return {
        ...state,
        climateVariables: climateVariables,
      };
    }
    default:
      return state;
  }
};
