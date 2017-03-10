import React from 'react';
import { ListGroupItem } from 'react-bootstrap';

export default (props) => {
  const { article, onSelect } = props;
  return (
    <ListGroupItem onClick={() => onSelect(article)}>
      {article.selected
        ? <i className="fa fa-check-square-o" />
        : <i className="fa fa-square-o" />}
      &nbsp;
      {article.title}
    </ListGroupItem>
  );
};
