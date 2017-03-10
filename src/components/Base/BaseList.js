import React, { PropTypes } from 'react';
import { InputGroup, Row, Col, Pagination, FormControl, Button, Table } from 'react-bootstrap';
import BaseComponent from './BaseComponent';

const MAX_BUTTONS = 5;

export default class BaseList extends BaseComponent {
  static propTypes = {
    list: PropTypes.array.isRequired,
    filter: PropTypes.object.isRequired,
    onFilter: PropTypes.func.isRequired,
    onSort: PropTypes.func.isRequired,
    totalCount: PropTypes.number.isRequired,
    page: PropTypes.number.isRequired,
    perPage: PropTypes.number
  }

  static defaultProps = {
    filter: { },
    onFilter: () => { },
    onSort: () => { }
  }

  handleNameFilter(event) {
    const { onFilter } = this.props;
    onFilter({ name: event.target.value });
  }

  handleHeaderClick(event) {
    const { onSort } = this.props;
    onSort(event.target.dataset.key);
  }

  get pagingButton() {
    const { onPageChange, page, paginButtonSize = 'small' } = this.props;
    return ({ eventKey, children, disabled }) => {
      return (
        <Button
          bsSize={paginButtonSize}
          bsStyle={page === eventKey ? 'primary' : 'default'}
          onClick={() => onPageChange(eventKey)}
          disabled={disabled}
        >
          {children}
        </Button>
      );
    };
  }

  get renderItem() {
    const { renderItem } = this.props;
    return renderItem;
  }

  get filters() {
    return [this.nameFilter];
  }

  get nameFilter() {
    const { filter: { name } } = this.props;
    return (
      <InputGroup>
        <InputGroup.Addon>
          <i className="fa fa-search" />
        </InputGroup.Addon>
        <FormControl
          type="text"
          defaultValue={name}
          placeholder="Find.."
          onChange={(event) => this.handleNameFilter(event)}
        />
      </InputGroup>
    );
  }

  get pagination() {
    const { totalCount, page, perPage = 20, paginButtonSize = 'small' } = this.props;
    const pages = Math.ceil(totalCount / perPage);
    const { pagingButton } = this;

    return (pages > 1) ? (
      <Pagination
        ellipsis
        maxButtons={3}
        boundaryLinks
        bsSize={paginButtonSize}
        items={pages}
        activePage={page}
        buttonComponentClass={pagingButton}
        maxButtons={MAX_BUTTONS}
      />) : null;
  }

  render() {
    const { list, sort = {} } = this.props;
    const { renderItem, pagination, filters, headers = [] } = this;
    const items = list.map(renderItem);
    const columnClass = sort.dir === 'DESC' ? 'fa fa-caret-down' : 'fa fa-caret-up';
    const columnHeaders = headers.map((header, index) => {
      const isSortColumn = header.toLowerCase() === sort.key;
      const className = isSortColumn ? columnClass : '';
      return (
        <th
          data-key={header}
          key={index}
          onClick={(e) => this.handleHeaderClick(e)}
        >
        {header}&nbsp;
          <i className={className} />
        </th>
      );
    });

    return (
      <div>
        <Row>
          <Col xs={4}>
            {pagination}
          </Col>
          <Col xs={8}>
            {filters.length ?
              <Row className="filter-list-search">
                {filters.map((filter, index) => {
                  const xs = Math.floor(12 / filters.length);
                  return (
                    <Col xs={xs} key={index}>
                      {filter}
                    </Col>
                  );
                })}
              </Row> : null
            }
          </Col>
        </Row>
        <div className="help-block" />
        <Table responsive>
          <thead>
            <tr>
              {columnHeaders}
            </tr>
          </thead>
          <tbody>
            {items}
          </tbody>
        </Table>
      </div>
    );
  }
}
