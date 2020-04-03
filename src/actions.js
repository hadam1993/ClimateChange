import _ from 'lodash';

export const actions = {
  SET_SELECTED_CLUSTERS: 'ScottRupprecht/climate-change/SetSelectedClusters',

  GET_PLOT_DATA_REQUEST: 'ScottRupprecht/climate-change/GetPlotDataRequest',
  GET_PLOT_DATA_SUCCESS: 'ScottRupprecht/climate-change/GetPlotDataSuccess',
  GET_PLOT_DATA_FAILURE: 'ScottRupprecht/climate-change/GetPlotDataFailure',

  GET_CLIMATE_VARIABLES_REQUEST: 'ScottRupprecht/climate-change/GetClimateVariablesRequest',
  GET_CLIMATE_VARIABLES_SUCCESS: 'ScottRupprecht/climate-change/GetClimateVariablesSuccess',
  GET_CLIMATE_VARIABLES_FAILURE: 'ScottRupprecht/climate-change/GetClimateVariablesFailure',
};

export const setSelectedClusters = (selectedClusters) => (dispatch, getState) => {
  const { climateVariables } = getState();

  if (_.isEmpty(climateVariables)) {
    const { selectedClusterConfig } = getState();
    const { climateVariablesDataFile } = selectedClusterConfig;
    getClimateVariables(climateVariablesDataFile)(dispatch, getState);
  }

  dispatch({
    type: actions.SET_SELECTED_CLUSTERS,
    payload: {
      selectedClusters: selectedClusters,
    },
  });
};

export const getClimateVariables = (dataFilePath) => (dispatch) => {
  dispatch({
    type: actions.GET_CLIMATE_VARIABLES_REQUEST,
  });

  window.fetch(dataFilePath)
    .then(res => res.json())
    .then((data) => {
      dispatch({
        type: actions.GET_CLIMATE_VARIABLES_SUCCESS,
        payload: {
          climateVariables: data,
        },
      });
    })
    .catch((error) => {
      dispatch({
        type: actions.GET_CLIMATE_VARIABLES_FAILURE,
        payload: {
          error: error,
        },
      });
    });
};

export const getPlotData = (dataFilePath) => (dispatch) => {
  dispatch({
    type: actions.GET_PLOT_DATA_REQUEST,
  });

  window.fetch(dataFilePath)
    .then(res => res.json())
    .then((data) => {
      dispatch({
        type: actions.GET_PLOT_DATA_SUCCESS,
        payload: {
          plotData: data,
        },
      });
    })
    .catch((error) => {
      dispatch({
        type: actions.GET_PLOT_DATA_SUCCESS,
        payload: {
          error: error,
        },
      });
    });
};
