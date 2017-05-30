import React, { Component, PropTypes } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Accordion, Panel } from 'react-bootstrap';
import { RichEditor } from 'components/Editor2';
import { NewsFeedForm } from 'components/NewsFeed';
import EmailBylineSelector from './EmailBylineSelector';
import { getOrderedHtmlFields, emailContentPanelChanged } from 'redux/modules/emails';

@connect(state => ({ activeField: state.emails.currentContentPanel }))
export default class EmailFieldEditor extends Component {

  static propTypes = {
    onFieldChanged: PropTypes.func.isRequired,
    activeField: PropTypes.string,
    authors: PropTypes.array
  }

  render() {
    const { htmlFields, onFieldChanged,
      activeField, dispatch, authors, defaultNewsfeedStyle,
    } = this.props;

    const fields = getOrderedHtmlFields({ htmlFields });
    const onSelect = compose(dispatch, emailContentPanelChanged);

    return (htmlFields ?
      <div>
        <Accordion
          activeKey={activeField}
          onSelect={(key) => onSelect(key)}
        >
          {fields.map((field) => {

            let fieldType = field.attrs['data-eme-type'];
            let fieldRequired = field.attrs['data-eme-required'];
            let fieldKey = field.key;

            return (
              <Panel
                key={fieldKey}
                eventKey={fieldKey}
                data-key={fieldKey}
                header={`${fieldKey}`}
              >
                {activeField === fieldKey && fieldType === 'COMMENT' &&
                  <RichEditor
                    value={field.htmlBody}
                    required={fieldRequired}
                    onChange={(htmlBody) => onFieldChanged(fieldKey, { ...field, htmlBody })}
                    name={`field-html-editor-${fieldKey}`}
                  />}

                {activeField === fieldKey && fieldType === 'NEWSFEED' &&
                  <NewsFeedForm
                    cards={field.articles || []}
                    required={fieldRequired}
                    newsfeedStyle={defaultNewsfeedStyle}
                    snippet={field.snippet}
                    onChange={(htmlBody, articles, snippet) => {
                      onFieldChanged(fieldKey, { ...field, htmlBody, articles, snippet });
                    }}
                  />}

                {fieldType === 'BYLINE' &&
                  <EmailBylineSelector
                    value={field}
                    required={fieldRequired}
                    authors={authors}
                    onChange={(author) => onFieldChanged(fieldKey, { ...field, ...author })}
                  />
                  }
              </Panel>
            )
          })}
        </Accordion>
      </div> : null
    );
  }
}
