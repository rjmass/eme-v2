function setElementStyle(node) {
  if (node.attributes.bgcolor) {
    node.style.backgroundColor = node.attributes.bgcolor.value;
  }
  if (node.attributes.width) {
    node.style.width = node.attributes.width.value;
  }
  if (node.attributes.valign) {
    node.style.verticalAlign = node.attributes.valign.value;
  }
}

export default function arributeReplace(parentNode) {
  const attrToSupport = '[bgcolor], [width], [valign]';
  const nodes = parentNode.querySelectorAll(attrToSupport);
  for (const node of nodes) {
    setElementStyle(node);
  }
}
