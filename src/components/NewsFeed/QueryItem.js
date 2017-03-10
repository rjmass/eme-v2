import React from 'react';
import { ListGroupItem, Button } from 'react-bootstrap';

export default (props) => {
  const { query, onClick, onDelete } = props;
  const handleDelete = (event) => {
    event.stopPropagation();
    onDelete();
  };

  return (
    <ListGroupItem>
      <a onClick={onClick} className="pointer">
        <i className="fa fa-cogs" />
        &nbsp; {query.name} &nbsp; <span className="text-muted">({query.query}) </span>
      </a>
      <Button
        onClick={handleDelete}
        bsSize="xsmall"
        className="pull-right"
      > &times;
      </Button>
    </ListGroupItem>
  );
};
