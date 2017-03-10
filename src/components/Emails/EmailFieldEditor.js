import React, { Component, PropTypes } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Accordion, Panel } from 'react-bootstrap';
import { RichEditor } from 'components/Editor';
import { getOrderedHtmlFields, emailContentPanelChanged } from 'redux/modules/emails';

@connect(state => ({ activeField: state.emails.currentContentPanel }))
export default class EmailFieldEditor extends Component {

  static propTypes = {
    onFieldChanged: PropTypes.func.isRequired,
    activeField: PropTypes.string
  }

  render() {
    const { htmlFields, onFieldChanged, activeField, dispatch } = this.props;
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
              {activeField === field.key &&
                <RichEditor
                  value={field.htmlBody}
                  onChange={(htmlBody) => onFieldChanged(field.key, { ...field, htmlBody })}
                  name={`field-html-editor-${field.key}`}
                />}
            </Panel>
          )}
        </Accordion>
      </div> : null
    );
  }
}
