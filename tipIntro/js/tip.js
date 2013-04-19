/**
 * Created with IntelliJ IDEA.
 * User: hp
 * Date: 13-4-19
 * Time: ����9:45
 * To change this template use File | Settings | File Templates.
 */
(function ($, window) {
	var viewPortWidth;
	var viewPortHeight;
	var tipHeight;
	var tipWidth;
	var tipTop;
	var tipLeft;
	var offset;

	var tipMsgWidth;
	var tipMsgHeight;

	var $tip = $(".tip");
	var $tipMsg = $tip.children(".tip-msg").eq(0);

	var $wnd = $(window);

	/**
	 * ��Ұ��Χ
	 */
	var updateViewPort = function () {
		viewPortWidth = $wnd.width();
		viewPortHeight = $wnd.height();
	};

	$wnd.resize(function () {
		updateViewPort();
	});
	updateViewPort();

	/**
	 * ��ȡtipλ�ü��ߴ�
	 */
	var updateTipPositionAndSize = function () {
		offset = $tip.offset();
		tipLeft = offset.left;
		tipTop = offset.top;
		tipWidth = $tip.outerWidth();
		tipHeight = $tip.outerHeight();
	};

	/**
	 * ��ȡtipMsg�ߴ�
	 */
	var updateTipMsgSize = function () {
		tipMsgWidth = $tipMsg.outerWidth();
		tipMsgHeight = $tipMsg.outerHeight();
	};

	/**
	 * �������ʱ��ʾ��ʾ
	 */
	var onMouseEnter = function () {
		//��tipMsg����DOM
		$("body").append($tipMsg);

		updateTipPositionAndSize();
		updateTipMsgSize();

		if (tipLeft + tipWidth + tipMsgWidth <= viewPortWidth && tipHeight <= viewPortHeight) {
			//�ұ�
			$tipMsg.css({
				top: tipTop + tipMsgHeight <= viewPortHeight ? tipTop : (viewPortHeight - tipMsgHeight),
				left: tipLeft + tipWidth
			});
			$tipMsg.show();
		} else if (tipTop + tipHeight + tipMsgHeight <= viewPortHeight && tipMsgWidth <= viewPortWidth) {
			//�·�
			$tipMsg.css({
				top: tipTop + tipHeight,
				left: tipLeft + tipMsgWidth <= viewPortWidth ? tipLeft : (viewPortWidth - tipMsgWidth)
			});
			$tipMsg.show();
		} else if (tipLeft - tipMsgWidth >= 0 && tipHeight <= viewPortHeight) {
			//���
			$tipMsg.css({
				top: tipTop + tipMsgHeight <= viewPortHeight ? tipTop : (viewPortHeight - tipMsgHeight),
				left: tipLeft - tipMsgWidth
			});
			$tipMsg.show();
		} else if (tipTop - tipMsgHeight >= 0 && tipMsgWidth <= viewPortWidth) {
			//�Ϸ�
			$tipMsg.css({
				top: tipTop - tipMsgHeight,
				left: tipLeft + tipMsgWidth <= viewPortWidth ? tipLeft : (viewPortWidth - tipMsgWidth)
			});
			$tipMsg.show();
		}
	};

	/**
	 * �������ʱ������ʾ
	 */
	var onMouseLeave = function () {
		$tipMsg.hide().remove();
	};

	$tip
		.mouseenter(function () {
			onMouseEnter();
		})
		.mouseleave(function () {
			onMouseLeave();
		})
})($, this);