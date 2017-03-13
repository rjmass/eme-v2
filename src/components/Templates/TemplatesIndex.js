import React, { Component, PropTypes } from 'react';
import TemplatesList from './TemplatesList';
import { Link } from 'react-router';
import {
  templatesLoadThunk,
  getTemplates,
  templatesFilter,
  templatesSort
} from 'redux/modules/templates';
import { connect } from 'react-redux';
import { Button, Row, Col } from 'react-bootstrap';
import { Spinner } from 'components/Spinner';
import { createSelector } from 'reselect';
import { push } from 'react-router-redux';
import listSorter from 'helpers/listSorter';
import config from 'config';

const PER_PAGE = 20;

export class TemplatesIndex extends Component {

  static propTypes = {
    templates: PropTypes.shape({
      list: PropTypes.array.isRequired
    }).isRequired
  }

  componentDidMount() {
    this.fetchTemplates();
  }

  componentWillReceiveProps(nextProps) {
    const { page = 1 } = this.props.params;
    const { page: newPage = 1 } = nextProps.params;
    if (page !== newPage) {
      this.fetchTemplates();
    }
  }

  getTemplatesPage() {
    const { templates, params: { page = 1 } } = this.props;
    return templates.list.slice(PER_PAGE * (page - 1), PER_PAGE * page);
  }

  fetchTemplates() {
    const { dispatch } = this.props;
    dispatch(templatesLoadThunk());
  }

  handleFilter(filter) {
    const { dispatch } = this.props;
    dispatch(push(`${config.urlInfix}/templates`));
    dispatch(templatesFilter(filter));
  }

  handleSort(key) {
    const { dispatch } = this.props;
    dispatch(templatesSort({ sortFunc: listSorter, key }));
  }

  render() {
    const { templates } = this.props;
    const page = Number(this.props.params.page) ? Number(this.props.params.page) : 1;
    const totalCount = templates.list.length;
    const isSpinning = !totalCount && templates.listLoading;
    return (
      <div>
        <Spinner text={"Loading templates..."} isVisible={isSpinning} />
        <div className="help-block"></div>
        <Row>
          <Col xs={12} className={!isSpinning ? 'show' : 'hidden'}>
            <Link to={`${config.urlInfix}/templates/new`}>
              <Button bsStyle="success" bsSize="small">
                <i className="fa fa-plus" /> New
              </Button>
            </Link>
            <TemplatesList
              list={this.getTemplatesPage()}
              totalCount={totalCount}
              sort={templates.sort}
              filter={templates.filter}
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

const templates = state => state.templates;
const campaignsList = state => state.campaigns.list;
const list = createSelector(templates, campaignsList, getTemplates);

@connect((state) => ({ templates: { ...state.templates, list: list(state) } }))
export default class TemplatesIndexConnected extends TemplatesIndex { }
