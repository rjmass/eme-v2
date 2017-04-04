'use strict';

export default class FtFormat {

  static load() {

    if (!CKEDITOR.plugins.registered.ftFormat) {
      CKEDITOR.plugins.add('ftFormat', {
        requires: 'richcombo',
        init: function (editor) {
          if (editor.blockless) {
            return;
          }

          var config = editor.config;

          var lang = {
            label: 'Format',
            panelTitle: 'Paragraph Format',
            tag_address: 'Address',
            tag_div: 'Normal (DIV)',
            tag_h1: 'Heading 1',
            tag_h2: 'Heading 2',
            tag_h3: 'Heading 3',
            tag_h4: 'Heading 4',
            tag_h5: 'Heading 5',
            tag_h6: 'Heading 6',
            tag_p: 'Normal',
            tag_pre: 'Formatted'
          };

          // Gets the list of tags from the settings.
          var tags = config.ftFormat_tags.split(';');

          // Create style objects for all defined styles.
          var styles = {},
            stylesCount = 0,
            allowedContent = [];
          for (var i = 0; i < tags.length; i++) {
            var tag = tags[i];
            var style = new CKEDITOR.style(config['ftFormat_' + tag]);
            if (!editor.filter.customConfig || editor.filter.check(style)) {
              stylesCount++;
              styles[tag] = style;
              styles[tag]._.enterMode = editor.config.enterMode;
              allowedContent.push(style);
            }
          }

          // Hide entire combo when all formats are rejected.
          if (stylesCount === 0) {
            return;
          }

          editor.ui.addRichCombo('Format', {
            label: lang.label,
            title: lang.panelTitle,
            toolbar: 'styles,20',
            allowedContent: allowedContent,

            panel: {
              css: [CKEDITOR.skin.getPath('editor')].concat(config.contentsCss),
              multiSelect: false,
              attributes: {'aria-label': lang.panelTitle}
            },

            init: function () {
              this.startGroup(lang.panelTitle);

              for (var tag in styles) {
                var label = lang['tag_' + tag];

                // Add the tag entry to the panel list.
                this.add(tag, styles[tag].buildPreview(label), label);
              }
            },

            onClick: function (value) {
              editor.focus();
              editor.fire('saveSnapshot');

              var style = styles[value];

              editor.applyStyle(style);

              // Save the undo snapshot after all changes are affected. (#4899)
              setTimeout(function () {
                editor.fire('saveSnapshot');
              }, 0);
            },

            onRender: function () {
              editor.on('selectionChange', function (ev) {
                var currentTag = this.getValue(),
                  elementPath = ev.data.path;

                this.refresh();

                for (var tag in styles) {
                  if (styles[tag].checkActive(elementPath, editor)) {
                    if (tag !== currentTag) {
                      this.setValue(tag, editor.lang.format['tag_' + tag]);
                    }
                    return;
                  }
                }

                // If no styles match, just empty it.
                this.setValue('');

              }, this);
            },

            onOpen: function () {
              this.showAll();
              for (var name in styles) {
                var style = styles[name];

                // Check if that style is enabled in activeFilter.
                if (!editor.activeFilter.check(style)) {
                  this.hideItem(name);
                }

              }
            },

            refresh: function () {
              var elementPath = editor.elementPath();

              if (!elementPath) {
                return;
              }

              // Check if element path contains 'p' element.
              if (!elementPath.isContextFor('p')) {
                this.setState(CKEDITOR.TRISTATE_DISABLED);
                return;
              }

              // Check if there is any available style.
              for (var name in styles) {
                if (editor.activeFilter.check(styles[name])) {
                  return;
                }
              }
              this.setState(CKEDITOR.TRISTATE_DISABLED);
            }
          });
        }
      });

      /**
       * A list of semicolon-separated style names (by default: tags) representing
       * the style definition for each entry to be displayed in the Format drop-down list
       * in the toolbar. Each entry must have a corresponding configuration in a
       * setting named `'ftFormat_(tagName)'`. For example, the `'p'` entry has its
       * definition taken from [config.ftFormat_p](#!/api/CKEDITOR.config-cfg-ftFormat_p).
       *
       *    config.ftFormat_tags = 'p;h2;h3;pre';
       *
       * @cfg {String} [ftFormat_tags='p;h1;h2;h3;h4;h5;h6;pre;address;div']
       * @member CKEDITOR.config
       */
      CKEDITOR.config.ftFormat_tags = 'p;h1;h2;h3;h4;h5;h6;pre;address;div';

      /**
       * The style definition to be used to apply the `Normal` format.
       *
       *    config.ftFormat_p = { element: 'p', attributes: { 'class': 'normalPara' } };
       *
       * @cfg {Object} [ftFormat_p={ element: 'p' }]
       * @member CKEDITOR.config
       */
      CKEDITOR.config.ftFormat_p = {element: 'p'};

      /**
       * The style definition to be used to apply the `Normal (DIV)` format.
       *
       *    config.ftFormat_div = { element: 'div', attributes: { 'class': 'normalDiv' } };
       *
       * @cfg {Object} [ftFormat_div={ element: 'div' }]
       * @member CKEDITOR.config
       */
      CKEDITOR.config.ftFormat_div = {element: 'div'};

      /**
       * The style definition to be used to apply the `Formatted` format.
       *
       *    config.ftFormat_pre = { element: 'pre', attributes: { 'class': 'code' } };
       *
       * @cfg {Object} [ftFormat_pre={ element: 'pre' }]
       * @member CKEDITOR.config
       */
      CKEDITOR.config.ftFormat_pre = {element: 'pre'};

      /**
       * The style definition to be used to apply the `Address` format.
       *
       *    config.ftFormat_address = { element: 'address', attributes: { 'class': 'styledAddress' } };
       *
       * @cfg {Object} [ftFormat_address={ element: 'address' }]
       * @member CKEDITOR.config
       */
      CKEDITOR.config.ftFormat_address = {element: 'address'};

      /**
       * The style definition to be used to apply the `Heading 1` format.
       *
       *    config.ftFormat_h1 = { element: 'h1', attributes: { 'class': 'contentTitle1' } };
       *
       * @cfg {Object} [ftFormat_h1={ element: 'h1' }]
       * @member CKEDITOR.config
       */
      CKEDITOR.config.ftFormat_h1 = {element: 'h1'};

      /**
       * The style definition to be used to apply the `Heading 2` format.
       *
       *    config.ftFormat_h2 = { element: 'h2', attributes: { 'class': 'contentTitle2' } };
       *
       * @cfg {Object} [ftFormat_h2={ element: 'h2' }]
       * @member CKEDITOR.config
       */
      CKEDITOR.config.ftFormat_h2 = {element: 'h2'};

      /**
       * The style definition to be used to apply the `Heading 3` format.
       *
       *    config.ftFormat_h3 = { element: 'h3', attributes: { 'class': 'contentTitle3' } };
       *
       * @cfg {Object} [ftFormat_h3={ element: 'h3' }]
       * @member CKEDITOR.config
       */
      CKEDITOR.config.ftFormat_h3 = {element: 'h3'};

      /**
       * The style definition to be used to apply the `Heading 4` format.
       *
       *    config.ftFormat_h4 = { element: 'h4', attributes: { 'class': 'contentTitle4' } };
       *
       * @cfg {Object} [ftFormat_h4={ element: 'h4' }]
       * @member CKEDITOR.config
       */
      CKEDITOR.config.ftFormat_h4 = {element: 'h4'};

      /**
       * The style definition to be used to apply the `Heading 5` format.
       *
       *    config.ftFormat_h5 = { element: 'h5', attributes: { 'class': 'contentTitle5' } };
       *
       * @cfg {Object} [ftFormat_h5={ element: 'h5' }]
       * @member CKEDITOR.config
       */
      CKEDITOR.config.ftFormat_h5 = {element: 'h5'};

      /**
       * The style definition to be used to apply the `Heading 6` format.
       *
       *    config.ftFormat_h6 = { element: 'h6', attributes: { 'class': 'contentTitle6' } };
       *
       * @cfg {Object} [ftFormat_h6={ element: 'h6' }]
       * @member CKEDITOR.config
       */
      CKEDITOR.config.ftFormat_h6 = {element: 'h6'};

    }
  }
}
