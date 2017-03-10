export default ({ url, width, height, fit = 'scale-down' }) => {
  const heightParam = height ? `&height=${height}` : '';
  return `https://www.ft.com/__origami/service/image/v2/images/raw/${url}?source=ft-email-manual&width=${width}${heightParam}&fit=${fit}`;
};
