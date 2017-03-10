import React from 'react';
import { ListGroup, Button } from 'react-bootstrap';
import Article from './Article';
import { Spinner } from 'components/Spinner';

export default (props) => {
  const articles = props.list
    .map((article, idx) =>
      <Article onSelect={(a) => props.onSelect(a)} key={idx} article={article} />);

  const disableButtons = !articles.length || props.loading;

  return (
    <div className="article-list-wrapper">
      <Button
        bsSize="xsmall"
        bsStyle="warning"
        onClick={props.onAll}
        disabled={disableButtons}
      >All</Button>
      &nbsp;
      <Button
        bsSize="xsmall"
        bsStyle="info"
        disabled={disableButtons}
        onClick={props.onNone}
      >None</Button>
      <span className="pull-right">
        Selected: {props.list.filter(x => x.selected).length}
      </span>
      <ListGroup className="article-list">
        <Spinner
          text={"Loading articles..."}
          isVisible={props.loading}
        />
        {articles}
      </ListGroup>
    </div>
  );
};
