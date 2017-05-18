import React, { Component } from 'react';
import { connect } from 'react-redux';
import { tabs } from 'decorators';
import { Modal, Button, Tabs, Tab, Row, Col, ControlLabel } from 'react-bootstrap';
import Switch from 'react-bootstrap-switch';
import pick from 'lodash/pick';
import QueryManager from './QueryManager';
import { Message } from 'components/Message';
import { HtmlPreview } from 'components/Preview';
import ArticleSearchForm from './ArticleSearchForm';
import ArticleList from './ArticleList';
import { getArticles, articlesQueryThunk, articlesToggleSelection,
  articlesSelectNone, articlesSelectAll, articlesLoaded } from 'redux/modules/newsfeed';
import convertSparkpostSyntax from 'helpers/convertSparkpostSyntax';
import { SnippetPicker } from 'components/Snippets';

import './NewsQueryDialog.css';

@tabs('find')
class NewsQueryDialog extends Component {

  constructor(props) {
    super(props);
    this.state = {
      queryToSave: null,
      snippet: null,
      query: null,
      filterSummary: false,
      limit: 1,
    };
  }

  componentWillMount() {
    this.props.dispatch(articlesLoaded());
  }

  get insertEnabled() {
    const { snippet } = this.state;
    const { selectedArticles } = this.props;
    return selectedArticles.length && snippet;
  }

  get preview() {
    const { snippet } = this.state;
    const { selectedArticles } = this.props;
    if (snippet && selectedArticles.length) {
      try {
        const body = convertSparkpostSyntax(snippet.body, { newsfeed_result: selectedArticles });
        return { body };
      } catch (error) {
        return { error };
      }
    }

    return { error: new Error('Select snippet and some articles') };
  }

  handleItemClick({ query }) {
    this.setState({ query });
    this.handleTabSelect('find');
    const { dispatch } = this.props;
    const { limit } = this.state;
    dispatch(articlesQueryThunk(query, limit));
  }

  handleInsert() {
    const body = this.preview.body;
    const snippet = pick(this.state.snippet, 'body');
    const { onSubmit, onHide, selectedArticles } = this.props;
    const selected = selectedArticles.map(art => {
      return pick(art, ['id', 'title', 'summary', 'url', 'images']);
    });
    onSubmit(body, selected, snippet);
    onHide();
  }

  handleSearch(customQuery = null) {
    const { dispatch } = this.props;
    const { limit, query } = this.state;
    dispatch(articlesQueryThunk((customQuery || query), limit));
  }

  handleSaveCustomQuery(queryToSave) {
    this.setState({ queryToSave });
    this.handleTabSelect('queries');
  }

  handleQuerySelect(query) {
    const { dispatch } = this.props;
    this.setState({ query });
    dispatch(articlesLoaded());
  }

  render() {
    const { show, onHide, articles, dispatch, newsfeed } = this.props;
    const { body, error } = this.preview;
    const {
      tab: activeTab, query, limit, snippet, queryToSave, filterSummary
    } = this.state;

    return (
      <Modal show={show} onHide={onHide} bsSize={"lg"}>
        <Modal.Header closeButton>
          <Modal.Title>Select FT articles..</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Tabs
            activeKey={activeTab}
            onSelect={(tab) => this.handleTabSelect(tab)}
            id="newsfeed-tabs"
          >
            <Tab eventKey="find" title="Find articles">
              <Row>
                <Col xs={12}>
                  <ArticleSearchForm
                    query={query}
                    limit={limit}
                    snippet={snippet}
                    onQuerySelect={(q) => this.handleQuerySelect(q)}
                    onLimitSelect={(l) => this.setState({ limit: l })}
                    onSearch={(q) => this.handleSearch(q)}
                    onSaveQuery={(q) => this.handleSaveCustomQuery(q)}
                  />
                </Col>
                <Col xs={12}>
                  <ArticleList
                    list={articles}
                    loading={newsfeed.loading}
                    onSelect={(article) => dispatch(articlesToggleSelection(article.id))}
                    onAll={() => dispatch(articlesSelectAll())}
                    onNone={() => dispatch(articlesSelectNone())}
                  />
                </Col>
                <Col xs={6}>
                  <ControlLabel>Snippet</ControlLabel>
                  <SnippetPicker
                    value={snippet}
                    onSelect={(s) => this.setState({ snippet: s })}
                  />
                </Col>
                <Col xs={3}>
                  <ControlLabel>Filter Summary</ControlLabel>
                  <div>
                    <Switch
                      value={filterSummary}
                      onChange={(_, val) => this.setState({ filterSummary: val })}
                    />
                  </div>
                </Col>
              </Row>
            </Tab>
            <Tab eventKey="preview" title="Preview">
              <div className="article-preview">
                {error
                  ? <Message text={error.message} type="danger" />
                  : <HtmlPreview body={body} />
                }
              </div>
            </Tab>
            <Tab eventKey="queries" title="Queries">
              <QueryManager
                query={queryToSave}
                onItemClick={(qry) => this.handleItemClick(qry)}
              />
            </Tab>
          </Tabs>
        </Modal.Body>
        <Modal.Footer>
          <Button
            key="cancel"
            onClick={() => onHide()}
          >
            Cancel
          </Button>
          <Button
            bsStyle="primary"
            disabled={!this.insertEnabled}
            onClick={() => this.handleInsert()}
          >
            Insert
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

@connect((state) => ({
  newsfeed: state.newsfeed,
  articles: getArticles(state.newsfeed),
  selectedArticles: getArticles(state.newsfeed, true)
}))
export default class NewsQueryDialogConnected extends NewsQueryDialog { }

