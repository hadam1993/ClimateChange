import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import { colors } from '../../config';

class ClusterTimeSeriesLineChart extends React.Component {
  render () {
    const { climateVariables, series } = this.props;

    return (
      <ResponsiveContainer>
        <LineChart
          data={climateVariables}
          margin={{
            top: 10, right: 30, left: 20, bottom: 10,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="t" />
          <YAxis scale="linear" domain={['dataMin', 'dataMax']} />
          <Tooltip />
          <Legend />
          {
            _.map(series, ({ dataKey, cluster }) => {
              const color = colors[cluster - 1];
              return (
                <Line type="monotone" dataKey={dataKey} stroke={color} dot={false} />
              );
            })
          }
        </LineChart>
      </ResponsiveContainer>
    );
  }
}

ClusterTimeSeriesLineChart.propTypes = {
  climateVariables: PropTypes.array.isRequired,
  series: PropTypes.array.isRequired,
};

export default ClusterTimeSeriesLineChart;
