import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { campaignsLoadThunk,
  getCampaigns,
  campaignsFilter,
  campaignsSort
} from 'redux/modules/campaigns';
import { Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router';
import { Spinner } from 'components/Spinner';
import CampaignsList from './CampaignsList';
import { createSelector } from 'reselect';
import { push } from 'react-router-redux';
import listSorter from 'helpers/listSorter';
import config from 'config';

const PER_PAGE = 20;

export class CampaignsIndex extends Component {
  static propTypes = {
    campaigns: PropTypes.shape({
      list: PropTypes.array.isRequired
    }).isRequired
  }

  componentDidMount() {
    this.fetchCampaigns();
  }

  componentWillReceiveProps(nextProps) {
    const { params: { page = 1 } } = this.props;
    const { params: { page: newPage = 1 } } = nextProps;
    if (page !== newPage) {
      this.fetchCampaigns();
    }
  }

  getCampaignsPage() {
    const { campaigns, params: { page = 1 } } = this.props;
    return campaigns.list.slice(PER_PAGE * (page - 1), PER_PAGE * page);
  }

  fetchCampaigns() {
    const { dispatch } = this.props;
    dispatch(campaignsLoadThunk());
  }

  handleFilter(filter) {
    const { dispatch } = this.props;
    dispatch(push(`${config.urlInfix}/campaigns`));
    dispatch(campaignsFilter(filter));
  }

  handleSort(key) {
    const { dispatch } = this.props;
    dispatch(campaignsSort({ sortFunc: listSorter, key }));
  }

  render() {
    const { campaigns } = this.props;
    const page = Number(this.props.params.page) ? Number(this.props.params.page) : 1;
    const totalCount = campaigns.list.length;
    const isSpinning = !totalCount && campaigns.listLoading;
    return (
      <div>
        <Spinner text={"Loading campaigns..."} isVisible={isSpinning} />
        <div className="help-block"></div>
        <Row>
          <Col xs={12} className={!isSpinning ? 'show' : 'hidden'}>
            <Link to={`${config.urlInfix}/campaigns/new`}>
              <Button bsStyle="success" bsSize="small"><i className="fa fa-plus" /> New</Button>
            </Link>
            <CampaignsList
              list={this.getCampaignsPage()}
              sort={campaigns.sort}
              totalCount={totalCount}
              filter={campaigns.filter}
              onFilter={(filter) => this.handleFilter(filter)}
              onSort={(key) => this.handleSort(key)}
              page={page}
              perPage={PER_PAGE}
            />
          </Col>
        </Row>
      </div>
    );
  }
}

const campaigns = state => state.campaigns;
const list = createSelector(campaigns, getCampaigns);

@connect(state => ({ campaigns: { ...state.campaigns, list: list(state) } }))
export default class CampaignsIndexConnected extends CampaignsIndex { }
