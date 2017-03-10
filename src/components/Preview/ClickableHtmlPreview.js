import { connect } from 'react-redux';
import { emailContentPanelChanged } from 'redux/modules/emails';
import HtmlPreview from './HtmlPreview';
import attributeReplace from './attributeReplace';

@connect()
export default class ClickableHtmlPreview extends HtmlPreview {
  componentDidMount() {
    const iFrame = document.getElementsByClassName('preview-frame')[0];
    const iFrameHtml = iFrame.contentWindow.document.getElementsByTagName('html')[0];
    let htmlPreview = iFrameHtml.getElementsByClassName('html-preview')[0];
    if (htmlPreview) {
      this.addContentListeners(htmlPreview.getElementsByTagName('content'));
    }

    this.observer = new MutationObserver(() => {
      htmlPreview = iFrameHtml.getElementsByClassName('html-preview')[0];
      if (htmlPreview) {
        attributeReplace(htmlPreview);
        this.addContentListeners(iFrameHtml.getElementsByTagName('content'));
      }
      return;
    });
    this.observer.observe(iFrameHtml, { childList: true, subtree: true });
  }

  componentWillUpdate() {
    this.removeContentListeners();
  }

  componentWillUnmount() {
    this.removeContentListeners();
    this.observer.disconnect();
  }

  addContentListeners(content) {
    const contentBlocks = [];
    for (const contentBlock of content) {
      contentBlock.firstChild.addEventListener('click', (e) => this.handleContentClick(e));
      contentBlocks.push(contentBlock.firstChild);
    }
    this.contentBlocks = contentBlocks;
  }

  removeContentListeners() {
    if (this.contentBlocks) {
      this.contentBlocks.forEach(node => {
        node.removeEventListener('click', this.handleContentClick);
      });
    }
  }

  handleContentClick(e) {
    this.props.dispatch(emailContentPanelChanged(e.currentTarget.dataset.name));
  }
}
