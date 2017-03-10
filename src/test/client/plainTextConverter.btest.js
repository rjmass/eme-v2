import { expect } from 'chai';
import plainTextConverter from 'helpers/plainTextConverter';

describe('Plain Text Converter', () => {
  it('strips out the newsfeed', () => {
    const html = '<newsfeed atr="5">some news feed {{newsitem}}</newsfeed>';
    expect(plainTextConverter(html)).to.eql('');
  });

  it('strips out placeholders', () => {
    const html = 'Placeholder for custom content';
    expect(plainTextConverter(html)).to.eql('');
  });

  it('strips out brackets', () => {
    const html = '[Placeholder for custom content]';
    expect(plainTextConverter(html)).to.eql('');
  });

  it('converts the html unsub link to plain format', () => {
    const html = '<a href="https://unsubscribe.ft.com/marketing.html" data-msys-unsubscribe="1">Unsubscribe</a>';
    expect(plainTextConverter(html)).to.contain('https://unsubscribe.ft.com/marketing.html[[data-msys-unsubscribe="1"]]');
  });
});
