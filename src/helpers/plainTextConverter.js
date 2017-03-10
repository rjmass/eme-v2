import htmlToText from 'html-to-text';

function convert(text) {
  return text
    .replace(/<newsfeed[\s\S]*>[\s*\S]*<\/newsfeed>/g, '')
    .replace(/\[[ \s\w]+?\](?!([^{}]*}))/g, '')
    .replace(/Placeholder for custom content/g, '\n');
}

function formatUnsubLink(text) {
  return text
    .replace(/(unsubscribe.ft.com\/[\w]+\.html)/, '$1[[data-msys-unsubscribe="1"]]');
}

export default (html) => {
  const plain = convert(html).trim();
  const plainBody = htmlToText.fromString(plain,
    { wordwrap: false, preserveNewlines: true, ignoreImage: true });
  const formatted = formatUnsubLink(plainBody);
  return formatted;
};
