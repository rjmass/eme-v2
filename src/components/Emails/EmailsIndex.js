import { emailsLoadThunk, getEmails, emailsFilter, emailsSort } from 'redux/modules/emails';
import EmailCreateDialog from './EmailCreateDialog';
import EmailLabelDialog from './EmailLabelDialog';
import { Row, Col, Button } from 'react-bootstrap';
import React, { Component, PropTypes } from 'react';
import { Spinner } from 'components/Spinner';
import listSorter from 'helpers/listSorter';
import { createSelector } from 'reselect';
import { push } from 'react-router-redux';
import EmailsList from './EmailsList';
import { connect } from 'react-redux';
import { dialogs } from 'decorators';
import config from 'config';
import omit from 'lodash/omit';

const PER_PAGE = 20;

@dialogs()
export class EmailsIndex extends Component {
  static propTypes = {
    emails: PropTypes.shape({
      list: PropTypes.array.isRequired
    }).isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      checkedBoxes: { }
    };
  }

  componentDidMount() {
    this.fetchEmails();
  }

  componentWillReceiveProps(nextProps) {
    const { params: { page = 1 } } = this.props;
    const { params: { page: newPage = 1 } } = nextProps;
    if (page !== newPage) {
      this.fetchEmails();
    }
  }

  getEmailsPage() {
    const { emails, params: { page = 1 } } = this.props;
    return emails.list.slice(PER_PAGE * (page - 1), PER_PAGE * page);
  }

  fetchEmails() {
    const { dispatch } = this.props;
    dispatch(emailsLoadThunk());
  }

  handleFilter(filter) {
    const { dispatch } = this.props;
    dispatch(push(`${config.urlInfix}/emails`));
    dispatch(emailsFilter(filter));
  }

  handleSort(key) {
    const { dispatch } = this.props;
    dispatch(emailsSort({ sortFunc: listSorter, key }));
  }

  render() {
    const { emails } = this.props;
    const page = parseInt(this.props.params.page, 10) || 1;
    const totalCount = emails.list.length;
    const isSpinning = !totalCount && emails.listLoading;
    return (
      <div>
        <EmailCreateDialog
          show={this.state.dialogs.new}
          onHide={() => this.closeDialog('new')}
        />
        <EmailLabelDialog
          show={this.state.dialogs.relabel}
          onHide={() => this.closeDialog('relabel')}
          emailIds={Object.keys(this.state.checkedBoxes)}
          onRelabel={() => this.setState({ checkedBoxes: { } })}
        />
        <Spinner text={"Loading emails..."} isVisible={isSpinning} />
        <div className="help-block"></div>
        <Row>
          <Col xs={12} className={!isSpinning ? 'show' : 'hidden'}>
            <Button
              bsStyle="success"
              bsSize="small"
              onClick={() => this.openDialog('new')}
            >
              <i className="fa fa-plus" /> New
            </Button>
            &nbsp;
            <Button
              bsStyle="info"
              bsSize="small"
              onClick={() => this.openDialog('relabel')}
            >
              <i className="glyphicon glyphicon-tags" /> Relabel
            </Button>

            <EmailsList
              list={this.getEmailsPage()}
              sort={emails.sort}
              filter={emails.filter}
              onFilter={(filter) => this.handleFilter(filter)}
              onSort={(key) => this.handleSort(key)}
              totalCount={totalCount}
              handleChecked={(emailId) => {
                const checked = this.state.checkedBoxes[emailId];
                checked ?
                  this.setState({ checkedBoxes: omit(this.state.checkedBoxes, emailId) }) :
                  this.setState({ checkedBoxes: { ...this.state.checkedBoxes, [emailId]: true } });
              }}
              checkedBoxes={this.state.checkedBoxes}
              page={page}
              perPage={PER_PAGE}
            />
          </Col>
        </Row>
      </div>
    );
  }
}

const emails = state => state.emails;
const campaignsList = state => state.campaigns.list;
const list = createSelector(emails, campaignsList, getEmails);

@connect(state => ({ emails: { ...state.emails, list: list(state) } }))
export default class EmailsIndexConnected extends EmailsIndex { }
