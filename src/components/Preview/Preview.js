import React, { Component, PropTypes } from 'react';
import convertSparkpostSyntax from 'helpers/convertSparkpostSyntax';
import { replaceCustomTags } from './previewContent';
import { Tabs, Tab } from 'react-bootstrap';
import { Message } from 'components/Message';
import ClickableHtmlPreview from './ClickableHtmlPreview';
import './Preview.css';

export default class Preview extends Component {

  static propTypes = {
    html: PropTypes.string,
    htmlFields: PropTypes.object,
    disableNonActiveTabs: PropTypes.bool,
    activeTab: PropTypes.oneOf(['html']),
    onTabSelect: PropTypes.func
  }

  constructor(...args) {
    super(...args);
    this.errors = {};
    this.substituteHtmlBody = this.substituteBody.bind(this, 'html');
  }

  getHtmlBody() {
    const { html = '', substitutionData } = this.props;
    return this.substituteHtmlBody(html, substitutionData);
  }

  substituteBody(type, content, substitutionData) {
    const { substitutionEnabled, htmlFields = {} } = this.props;
    this.errors[type] = null;

    if (type === 'html') {
      content = replaceCustomTags(content, htmlFields);
    }

    if (!substitutionEnabled) {
      return content;
    }

    if (substitutionEnabled && !substitutionData) {
      return content;
    }

    try {
      const substitutedBody = convertSparkpostSyntax(content, substitutionData);
      return substitutedBody;
    } catch (error) {
      this.errors[type] = error;
      return content;
    }
  }

  render() {
    const { activeTab,
      onTabSelect = () => false,
      substitutionEnabled,
      substitutionData
    } = this.props;
    const htmlBody = this.getHtmlBody();
    const errors = this.errors;
    return (
      <Tabs
        id="preview-tabs"
        activeKey={activeTab}
        onSelect={onTabSelect}
      >
        <Tab eventKey={'html'} title="HTML Preview">
          <div className="help-block" />
          {(substitutionEnabled && !substitutionData) ?
            <Message text={'Please select a recipient.'} type="info" />
            : null
          }
          {errors.html
            ? <Message text={errors.html.message} type="danger" />
            : <ClickableHtmlPreview body={htmlBody} />}
        </Tab>
      </Tabs>
    );
  }
}
