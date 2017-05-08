import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import pick from 'lodash/pick';
import { FormGroup, Button, Tooltip, OverlayTrigger } from 'react-bootstrap';
import NewsQueryDialog from './NewsQueryDialog';
import { dialogs } from 'decorators';
import convertSparkpostSyntax from 'helpers/convertSparkpostSyntax';
import { articlesQueryThunk, getArticles } from 'redux/modules/newsfeed';

import './NewsPicker.css';

@dialogs()
class NewsPicker extends Component {
  static propTypes = {
    onInsert: PropTypes.func,
    snippet: PropTypes.object,
    cards: PropTypes.array
  }

  async insertDefaultNews() {
    const { dispatch, snippet, onInsert } = this.props;
    const newsfeedRes = await dispatch(articlesQueryThunk(''));
    const articles = getArticles({ list: newsfeedRes });
    const selected = articles.map(art => {
      return pick(art, ['id', 'title', 'summary', 'url', 'images']);
    });
    const body = convertSparkpostSyntax(snippet.body, { newsfeed_result: selected });
    onInsert(body, selected, snippet);
  }

  render() {
    const { onInsert } = this.props;
    const { insert } = this.state.dialogs;

    const tooltip = (
      <Tooltip id="tooltip">
        Insert FT Articles..
      </Tooltip>
    );
    return (
      <div>
        <FormGroup className="list-group-item list-group-item-info newspicker-header">
          {insert && <NewsQueryDialog
            show={insert}
            onHide={() => this.closeDialog('insert')}
            onSubmit={onInsert}
          />}
          <Button onClick={() => onInsert('', [], {})}>
            Remove all
          </Button>
          <Button
            className="pull-right"
            onClick={() => this.insertDefaultNews()}
          >
            Default News
          </Button>
          <OverlayTrigger placement="top" overlay={tooltip}>
            <Button
              className="pull-right"
              onClick={() => this.openDialog('insert')}
            >
              <i className="fa fa-list" />
            </Button>
          </OverlayTrigger>
        </FormGroup>
      </div>
    );
  }
}

@connect()
export default class NewsPickerConnected extends NewsPicker { }
