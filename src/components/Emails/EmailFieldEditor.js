import React, { Component, PropTypes } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Accordion, Panel } from 'react-bootstrap';
import { RichEditor } from 'components/Editor2';
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
    const { htmlFields, onFieldChanged, activeField, dispatch, authors } = this.props;
    const fields = getOrderedHtmlFields({ htmlFields });
    const onSelect = compose(dispatch, emailContentPanelChanged);

    return (htmlFields ?
      <div>
        <Accordion
          activeKey={activeField}
          onSelect={(key) => onSelect(key)}
        >
          {fields.map((field) =>
            <Panel
              key={field.key}
              eventKey={field.key}
              data-key={field.key}
              header={`${field.key}`}
            >
              {activeField === field.key && field.key.toLowerCase() !== 'byline' &&
                <RichEditor
                  value={field.htmlBody}
                  onChange={(htmlBody) => onFieldChanged(field.key, { ...field, htmlBody })}
                  name={`field-html-editor-${field.key}`}
                />}

              {activeField === field.key && field.key.toLowerCase() === 'byline' &&
                <EmailBylineSelector
                  value={field}
                  authors={authors}
                  onChange={(author) => onFieldChanged(field.key, { ...field, ...author })}
                />
                }
            </Panel>
          )}
        </Accordion>
      </div> : null
    );
  }
}
