/**
 * Created with IntelliJ IDEA.
 * User: hp
 * Date: 13-4-19
 * Time: 下午9:45
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
	 * 视野范围
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
	 * 获取tip位置及尺寸
	 */
	var updateTipPositionAndSize = function () {
		offset = $tip.offset();
		tipLeft = offset.left;
		tipTop = offset.top;
		tipWidth = $tip.outerWidth();
		tipHeight = $tip.outerHeight();
	};

	/**
	 * 获取tipMsg尺寸
	 */
	var updateTipMsgSize = function () {
		tipMsgWidth = $tipMsg.outerWidth();
		tipMsgHeight = $tipMsg.outerHeight();
	};

	/**
	 * 鼠标移入时显示提示
	 */
	var onMouseEnter = function () {
		//将tipMsg加入DOM
		$("body").append($tipMsg);

		updateTipPositionAndSize();
		updateTipMsgSize();

		if (tipLeft + tipWidth + tipMsgWidth <= viewPortWidth && tipHeight <= viewPortHeight) {
			//右边
			$tipMsg.css({
				top: tipTop + tipMsgHeight <= viewPortHeight ? tipTop : (viewPortHeight - tipMsgHeight),
				left: tipLeft + tipWidth
			});
			$tipMsg.show();
		} else if (tipTop + tipHeight + tipMsgHeight <= viewPortHeight && tipMsgWidth <= viewPortWidth) {
			//下方
			$tipMsg.css({
				top: tipTop + tipHeight,
				left: tipLeft + tipMsgWidth <= viewPortWidth ? tipLeft : (viewPortWidth - tipMsgWidth)
			});
			$tipMsg.show();
		} else if (tipLeft - tipMsgWidth >= 0 && tipHeight <= viewPortHeight) {
			//左边
			$tipMsg.css({
				top: tipTop + tipMsgHeight <= viewPortHeight ? tipTop : (viewPortHeight - tipMsgHeight),
				left: tipLeft - tipMsgWidth
			});
			$tipMsg.show();
		} else if (tipTop - tipMsgHeight >= 0 && tipMsgWidth <= viewPortWidth) {
			//上方
			$tipMsg.css({
				top: tipTop - tipMsgHeight,
				left: tipLeft + tipMsgWidth <= viewPortWidth ? tipLeft : (viewPortWidth - tipMsgWidth)
			});
			$tipMsg.show();
		}
	};

	/**
	 * 鼠标移入时隐藏提示
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