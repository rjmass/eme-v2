'use strict';

export default class EditorOverrides {

  static get IMG_WIDTH() {
    return 1024;
  }

  static get IMG_VISIBLE_WIDTH() {
    return 350;
  }

	static load() {
		EditorOverrides.alwaysBlankLinkInDialog();
    EditorOverrides.noAnchorLink();
	}

	static alwaysBlankLinkInDialog() {
		let element = { items: [] };
		CKEDITOR.on('dialogDefinition', (e) => {
			// for a link
			if (e.data.name === 'link') {
				let target = e.data.definition.getContents('target');
				element = target.get('linkTargetType');
			}
			// for an image
			if (e.data.name === 'image') {
				let target = e.data.definition.getContents('Link');
				element = target.get('cmbTarget');
			}

			let options = element.items;
			for (let i = options.length - 1; i >= 0; i--) {
				let [label] = options[i];
				if (!label.match(/new window/i)) {
					options.splice(i, 1);
				}
			}
			element.default = '_blank';
		});
	}

	static noAnchorLink() {
		let element = { items:[] };

    CKEDITOR.on('dialogDefinition', (e) => {

			if (e.data.name === 'link') {
				let target = e.data.definition.getContents('info');
				element = target.get('linkType');
			}
			let options = element.items;

			for (let i = options.length - 1; i >= 0; i--) {
				let value = options[i][1];
				if (value.match(/anchor/i)) {
					options.splice(i, 1);
				}
			}

    });
	}

	static alwaysBlankLinkOnPaste(editor) {
		editor.on('paste', (event) => {
			let $div = $('<div/>');
			$div.html(event.data.dataValue);
			$div.find('a').attr("target", "_blank");
			event.data.dataValue = $div.html();
		});
	}

	static alwaysNormalParagraphOnPaste(editor) {
		editor.on('paste', (event) => {
			let $div = $('<div/>');
			$div.html(event.data.dataValue);
			$div.find('p').attr("style", "font-family:arial;font-size:16px;line-height:23px;margin:0px 0px 30px;");
			event.data.dataValue = $div.html();
		});
	}


  static proxifyUrl(url) {
    const WIDTH = EditorOverrides.IMG_WIDTH;
		const PROXYURL = 'https://www.ft.com/__origami/service/image/v2/images/raw/';
		// Add the FT proxy to the image if it is not already in place
		if (!url.startsWith(PROXYURL)) {
			let proxyOptions = `?source=ft-email-manual&width=${WIDTH}&fit=scale-down`;
      return `${PROXYURL}${encodeURIComponent(url)}${proxyOptions}`;
    }
    return url;
	}

	static proxifyHtml(html) {
    const VISIBLE_WIDTH = EditorOverrides.IMG_VISIBLE_WIDTH;
		let $div = $('<div/>');
		$div.html(html);

		$div.find('img').each((index, img) => {
			const $img = $(img);
			const src = $img.attr('src');
      const newSrc = EditorOverrides.proxifyUrl(src);
      const width = Math.min(img.naturalWidth, VISIBLE_WIDTH);
			$img.attr('src', newSrc)
				.width(width)
				.css('vertical-align', 'middle')
				.css('margin', '0 4px');
		});

		return $div.html();
	}

  static addImageProxy(editor) {
    // for dialog
    CKEDITOR.on('dialogDefinition', (e) => {
      if (e.data.name === 'image') {
        e.data.definition.dialog.on('hide', () => {
					if (editor.status === 'ready') {
						let html = editor.getData();
						html = EditorOverrides.proxifyHtml(html);
						editor.setData(html);
					}
        });
      }

    });
  }

}
