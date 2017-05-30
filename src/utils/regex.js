
module.exports = {
  placeHolderPattern: /<!--mdPlaceholder::\d{1,5}-->+/g,
  markDownPattern: /{{\s*([^}]|(}?[^}]*)\s)*\s*}}/g,
  nonAlphaNums: /\W+/g
}
