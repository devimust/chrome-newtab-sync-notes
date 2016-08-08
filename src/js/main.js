/**
 * Save to chrome storage.
 *
 * @param html
 */
function saveStorage(html) {
	chrome.storage.sync.set({
		'editorHTML1': html
	});
}

/**
 * Retrieve editor content from chrome storage of
 * and push back to a callback function (cb) as
 * used inside method setupEditor().
 *
 * @param cb
 */
function getStorage(cb) {
	var key = 'editorHTML1';
	chrome.storage.sync.get(key, function (obj) {
		var value = '';
		if (typeof obj.editorHTML1 != 'undefined') {
			value = obj.editorHTML1;
		}
		cb(value);
	});
}

/**
 * Create MediumEditor instance.
 */
function setupEditor() {
	var editor = new MediumEditor('.editable', {
		anchorPreview: false,
		anchor: {
			placeholderText: 'Type a link'
		},
		buttonLabels: 'fontawesome',
		placeholder: {
			text: 'Type something',
			hideOnClick: false
		},
		toolbar: {
			buttons: [
				'h2', 'h3',
				'bold', 'italic', 'underline', 'quote', 'anchor', 'image',
				'orderedlist',
				'unorderedlist',
				'pre',
				'indent'
			]
		}
	});

	/**
	 * Gets chrome storage and sets up event hooks to
	 * save back into chrome storage when content change.
	 */
	getStorage(function(data) {
		editor.setContent(data);

		/**
		 * Nice delayed write of writing to chrome sync to try
		 * to keep withing MAX_WRITE_OPERATIONS_PER_HOUR and
		 * MAX_WRITE_OPERATIONS_PER_MINUTE quota.
		 *
		 * @link https://developer.chrome.com/extensions/storage
		 */
		var timeoutId = 0;
		var writeAfterMilliseconds = 2500; //2.5 seconds
		var QUOTA_BYTES_PER_ITEM = 8192;
		function saveEditorContent() {
			var data = editor.getContent();

			if (data.length >= QUOTA_BYTES_PER_ITEM) {
				// @todo Change this to be less-alerty by using https://github.com/sciactive/pnotify
				alert('Storage quota exceeded, please try to create a new item or remove unused content')
				return;
			}

			saveStorage(data);
		}

		/**
		 * This method fires after each action is performed via
		 * md editor, keypress, etc. Only save editor content after
		 * defined seconds.
		 */
		editor.subscribe('editableInput', function (event, editable) {
			clearTimeout(timeoutId);
			timeoutId = setTimeout(saveEditorContent, writeAfterMilliseconds);
		});
	});
}

/**
 * Only start doing stuff once the DOM is read.
 */
$( document ).ready(function() {
	setupEditor();
});
