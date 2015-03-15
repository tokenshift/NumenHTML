$(function () {
	var sheetBg = {width: 3274, height: 2550};
	var win = $(window);

	var params = (function() {
		var query = window.location.search.substr(1).split('&');
		if (query == "") return {};
		
		var params = {};
		for (var i = 0; i < query.length; ++i) {
			var pair = query[i].split('=', 2);
			if (pair.length == 1) {
				params[pair[0]] = "";
			} else {
				params[pair[0]] = decodeURIComponent(pair[1].replace(/\+/g, " "));
			}
		}

		return params
	})();

	function sizeForPrint() {
		var scale = 8.5 / sheetBg.height;

		$('#page1').css({
			'height': '8.5in',
			'width': '11in'
		})

		$('#page2').css({
			'height': '8.5in',
			'width': '11in'
		})

		$('.set-position').each(function (i, e) {
			var field = $(e);

			scaleField(scale, field, 'top', 'in');
			scaleField(scale, field, 'bottom', 'in');
			scaleField(scale, field, 'left', 'in');
			scaleField(scale, field, 'right', 'in');
			scaleField(scale, field, 'width', 'in');
			scaleField(scale, field, 'height', 'in');
			
			/*field.css({
				'bottom': 8.5 * Number(field.data('bottom')) / sheetBg.height + 'in',
				'bottom': 8.5 * Number(field.data('bottom')) / sheetBg.height + 'in',
				'left': 11 * Number(field.data('left')) / sheetBg.width + 'in',
				'width': 11 * Number(field.data('width')) / sheetBg.width + 'in'
			});*/
		});

		$('.field').css({
			'font-size': '18px'
		});
	}

	function sizeForWeb() {
		var scale = Math.min(win.width()/sheetBg.width, win.height()/sheetBg.height);

		$('#page1').css({
			'height': scale*sheetBg.height+'px',
			'width': scale*sheetBg.width+'px'
		})

		$('#page2').css({
			'height': scale*sheetBg.height+'px',
			'width': scale*sheetBg.width+'px'
		})

		$('.set-position').each(function (i, e) {
			var field = $(e);
			scaleField(scale, field, 'top', 'px');
			scaleField(scale, field, 'bottom', 'px');
			scaleField(scale, field, 'left', 'px');
			scaleField(scale, field, 'right', 'px');
			scaleField(scale, field, 'width', 'px');
			scaleField(scale, field, 'height', 'px');
		});

		$('.field').css({
			'font-size': scale*52+'px'
		});
	}

	function scaleField(scale, field, attr, unit) {
		if (field.data(attr) && Number(field.data(attr))) {
			field.css(attr, scale*Number(field.data(attr))+unit);
		}
	}

	if (params['print'] == 'true') {
		$(document.body).addClass('print');
		sizeForPrint();
		$(window).resize(sizeForPrint);
		window.print();
	} else {
		sizeForWeb();
		$(window).resize(sizeForWeb);
	}

	$('.select-portrait').change(function (e) {
		var reader = new FileReader();
		reader.onload = function (e) {
			$('.portrait').css('background-image', 'url('+e.target.result+')');
		};

		var file = e.target.files[0];
		reader.readAsDataURL(file);
	});

	function onClickSave() {
		var data = ["<!DOCTYPE html>\n<html>\n", document.documentElement.innerHTML, "<\/html>"];
		data = new Blob(data, {type: 'text/html;charset=utf-8'});
	
		var name = $('.field.name').text().trim();
		if (name == '') {
			name = 'Character Sheet';
		}

		saveAs(data, name + '.html');
	}

	$('button.save').click(onClickSave);

	$('[contenteditable]:not(.multiline)').on('mouseup focus', function (e) {
		var range = document.createRange();
		range.selectNodeContents(e.target);
		var sel = window.getSelection();
		sel.removeAllRanges();
		sel.addRange(range);
		e.preventDefault();
	});

	$('.check.field').on('click keydown', function (e) {
		if (e.type != 'keydown' || e.which == 32 || e.which == 13) {
			$(e.target).toggleClass('checked');
			e.preventDefault();
		}
	});
});
