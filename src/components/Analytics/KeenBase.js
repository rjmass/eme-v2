import React, { PropTypes } from 'react';
import Keen from 'keen-analysis';
import 'keen-dataviz';
import 'c3';
import 'd3';
import 'keen-dataviz/dist/keen-dataviz.css';

export default class KeenBase extends React.Component {

  static propTypes: {
    queryType: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }

  constructor(props) {
    super(props);
    this.client = this.prepareKeenRequest();
  }

  componentDidMount() {
    this.chart = new Keen.Dataviz()
      .el(this.refs.container)
      .type('areachart')
      .colors([this.props.color])
      .title(this.props.title)
      .height(this.height)
      .prepare();
    this.renderChart();
  }

  prepareKeenRequest() {
    const { queryType } = this.props;
    const client = new Keen();
    const { KEEN_PROJECT_ID, KEEN_READ_KEY } = process.env;

    return client
      .get(`https://api.keen.io/3.0/projects/${KEEN_PROJECT_ID}/queries/${queryType}`)
      .auth(KEEN_READ_KEY);
  }

  get baseQuery() {
    return {
      event_collection: 'events',
      interval: 'hourly',
      max_age: 1 * 60, // 1 minute of server-side caching, seconds,
      timezone: 'UTC'
    };
  }

  get height() {
    return '200';
  }

  renderChart() {
    const { chart, queryParams } = this;

    return this.client.send(queryParams)
      .then((data) => chart.data(data).render())
      .catch((err) => chart.message(err.message));
  }

  render() {
    return (
      <div
        className="keen-graph"
        ref="container"
      />
    );
  }
}
