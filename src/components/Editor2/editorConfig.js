const TOOLBAR = [
  { name: 'styles', items: ['Bold', 'Italic', 'Format', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight'] },
  { name: 'clipboard', items: ['Undo', 'Redo'] },
  { name: 'paragraph', items: ['NumberedList', 'BulletedList', 'Blockquote'] },
  { name: 'insert', items: ['Link', 'Unlink', 'Image', 'addImage'] }
];

module.exports = (config) => {
  return {
    allowedContent: 'p{margin,font-weight,font-size,line-height,font-family,adding,border-width,border-top-style,border-bottom-style,border-top-color,border-bottom-color,text-align,color,font-style,padding}; b i blockquote ol ul li; a[!href,target]; img[!src,alt,width]{vertical-align,margin,float}',
    pasteFilter: 'p b{*}; i{*}; ol ul li a[!href,target]; img[!src,alt,width]',
    coreStyles_bold: { element: 'b', overrides: 'strong' },
    coreStyles_italic: { element: 'i', overrides: 'em' },
    disableObjectResizing: false,
    disableNativeSpellChecker: false,
    enterMode: 1 /*p tag*/,
    height: 400,
    toolbar: TOOLBAR,
    fullPage: false,
    startupFocus: false,
    removePlugins: 'format,language,tableresize,liststyle,tabletools,scayt,menubutton,contextmenu',
    //extraPlugins: 'ftFormat,justify,simpleuploads',
    extraPlugins: 'ftFormat,justify',
    ftFormat_tags: 'p;h1;h2;h3',
    //ftFormat_p: { element: 'p', styles: { 'font-family': 'Arial', 'margin': '0px 0px 30px', 'font-size': '16px', 'line-height': '23px' } },
    //ftFormat_h1: { element: 'p', styles: { color: 'rgb(214,109,6)', 'font-weight': 'bold', 'font-size': '20px',
      //'line-height': '23px', 'font-family': 'Arial,sans-serif', 'margin': '0px 0px 12px', 'padding': '8px 0px', 'border-width': '1px 0px',
      //'border-top-style': 'dotted',  'border-bottom-style': 'dotted', 'border-top-color': 'rgb(206,198,185)', 'border-bottom-color': 'rgb(206,198,185)'}
    //},
    //ftFormat_h2: { element: 'p', styles: { color: 'rgb(127,65,4)', 'font-weight': 'bold', 'font-size': '18px',
      //'line-height': '23px', 'font-family': 'Arial,sans-serif', 'margin': '0px 0px 10px', 'padding': '6px 0px'}
    //},
    //ftFormat_h3: { element: 'p', styles: { color: 'rgb(64,32,2)', 'font-weight': 'bold', 'font-size': '16px',
      //'line-height': '23px', 'font-family': 'Arial,sans-serif', 'margin': '0px 0px 10px', 'padding': '6px 0px'}
    //},
    ftFormat_p: { element: 'p', styles: { 'font-family':'arial,sans-serif' } },
    // style: Heading1
    ftFormat_h1: { element: 'p', styles: { 'font-size': '20px', margin: '5px' } },
    ftFormat_h2: { element: 'p', styles: { 'font-size': '20px', margin: '5px' } },
    ftFormat_h3: { element: 'p', styles: { color: 'rgb(64,32,2)', 'font-size': '16px',
      'line-height': '23px', 'margin': '0px 0px 10px' }
    },
    filebrowserImageBrowseLinkUrl: null,
    filebrowserImageBrowseUrl: `${config.urlInfix}/#/gallery`,
    filebrowserWindowWidth: '1000',
    filebrowserWindowHeight: '600',
    filebrowserImageUploadUrl: `${config.baseUrl}/upload-image`
  };
};
