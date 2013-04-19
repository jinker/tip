/**
 * Created with IntelliJ IDEA.
 * User: hp
 * Date: 13-4-19
 * Time: 下午9:45
 * To change this template use File | Settings | File Templates.
 */
(function ($, window) {
	var inherits = function (childCtor, parentCtor) {
		/** @constructor */
		function tempCtor() {
		};
		tempCtor.prototype = parentCtor.prototype;
		childCtor.superClass_ = parentCtor.prototype;
		childCtor.prototype = new tempCtor();
		/** @override */
		childCtor.prototype.constructor = childCtor;
	};

	/**
	 * 位置处理器
	 * @constructor
	 */
	var PositionHandler = function () {
		this._left = null;
		this._top = null;
	};
	/**
	 * 获取位置属性
	 * @return {{left: number, top: number}}
	 */
	PositionHandler.prototype.getPosition = function () {
		return {
			left: this._left,
			top: this._top
		};
	};

	/**
	 * 是否可处理位置
	 * @param {number} tipWidth
	 * @param {number} tipHeight
	 * @param {number} tipLeft
	 * @param {number} tipTop
	 * @param {number} tipMsgWidth
	 * @param {number} tipMsgHeight
	 * @param {number} viewPortWidth
	 * @param {number} viewPortHeight
	 * @return {boolean}
	 */
	PositionHandler.prototype.canHandle = function (tipWidth, tipHeight, tipLeft, tipTop, tipMsgWidth, tipMsgHeight, viewPortWidth, viewPortHeight) {
		return false;
	};

	var PositionHandlerRight = function () {
		PositionHandler.apply(this);
	};
	inherits(PositionHandlerRight, PositionHandler);

	/**
	 * @override
	 * @inheritsDoc
	 */
	PositionHandlerRight.prototype.canHandle = function (tipWidth, tipHeight, tipLeft, tipTop, tipMsgWidth, tipMsgHeight, viewPortWidth, viewPortHeight) {
		if (tipLeft + tipWidth + tipMsgWidth <= viewPortWidth && tipHeight <= viewPortHeight) {
			this._top = tipTop + tipMsgHeight <= viewPortHeight ? tipTop : (viewPortHeight - tipMsgHeight);
			this._left = tipLeft + tipWidth
			return true;
		}
		return false;
	};

	var PositionHandlerBottom = function () {
		PositionHandler.apply(this);
	};
	inherits(PositionHandlerBottom, PositionHandler);

	/**
	 * @override
	 * @inheritsDoc
	 */
	PositionHandlerBottom.prototype.canHandle = function (tipWidth, tipHeight, tipLeft, tipTop, tipMsgWidth, tipMsgHeight, viewPortWidth, viewPortHeight) {
		if (tipTop + tipHeight + tipMsgHeight <= viewPortHeight && tipMsgWidth <= viewPortWidth) {
			this._top = tipTop + tipHeight;
			this._left = tipLeft + tipMsgWidth <= viewPortWidth ? tipLeft : (viewPortWidth - tipMsgWidth);
			return true;
		}
		return false;
	};

	var PositionHandlerLeft = function () {
		PositionHandler.apply(this);
	};
	inherits(PositionHandlerLeft, PositionHandler);

	/**
	 * @override
	 * @inheritsDoc
	 */
	PositionHandlerLeft.prototype.canHandle = function (tipWidth, tipHeight, tipLeft, tipTop, tipMsgWidth, tipMsgHeight, viewPortWidth, viewPortHeight) {
		if (tipLeft - tipMsgWidth >= 0 && tipHeight <= viewPortHeight) {
			this._top = tipTop + tipMsgHeight <= viewPortHeight ? tipTop : (viewPortHeight - tipMsgHeight);
			this._left = tipLeft - tipMsgWidth;
			return true;
		}
		return false;
	};

	var PositionHandlerTop = function () {
		PositionHandler.apply(this);
	};
	inherits(PositionHandlerTop, PositionHandler);

	/**
	 * @override
	 * @inheritsDoc
	 */
	PositionHandlerTop.prototype.canHandle = function (tipWidth, tipHeight, tipLeft, tipTop, tipMsgWidth, tipMsgHeight, viewPortWidth, viewPortHeight) {
		if (tipTop - tipMsgHeight >= 0 && tipMsgWidth <= viewPortWidth) {
			this._top = tipTop - tipMsgHeight;
			this._left = tipLeft + tipMsgWidth <= viewPortWidth ? tipLeft : (viewPortWidth - tipMsgWidth);
			return true;
		}
		return false;
	};

	var $wnd = $(window);
	var viewPortWidth;
	var viewPortHeight;
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
	 * tip类
	 * @param {Element} el
	 * @param {Array.<PositionHandler>=} positionHandlers
	 * @constructor
	 */
	var Tip = function (el, positionHandlers) {
		this._tipHeight;
		this._tipWidth;
		this._tipTop;
		this._tipLeft;
		this._tipMsgWidth;
		this._tipMsgHeight;

		this._$tip = $(el);
		this._$tipMsg = this._$tip.children(".tip-msg").eq(0);

		this._positionHandlers = positionHandlers || [
			new PositionHandlerBottom(),
			new PositionHandlerRight(),
			new PositionHandlerLeft(),
			new PositionHandlerTop()
		];

		this._bind();
	};
	/**
	 * 事件绑定
	 * @private
	 */
	Tip.prototype._bind = function () {
		var self = this;
		this._$tip
			.mouseenter(function () {
				self._onMouseEnter();
			})
			.mouseleave(function () {
				self._onMouseLeave();
			});
	};
	/**
	 *
	 * @private
	 */
	Tip.prototype._onMouseEnter = function () {
		//将tipMsg加入DOM
		$("body").append(this._$tipMsg);

		this._updateTipPositionAndSize();
		this._updateTipMsgSize();

		var handler;
		for (var i = 0; handler = this._positionHandlers[i]; i++) {
			if (handler.canHandle(this._tipWidth, this._tipHeight, this._tipLeft, this._tipTop, this._tipMsgWidth, this._tipMsgHeight, viewPortWidth, viewPortHeight)) {
				this._$tipMsg.css(handler.getPosition()).show();
				return;
			}
		}
	};
	/**
	 * 鼠标移入时隐藏提示
	 * @private
	 */
	Tip.prototype._onMouseLeave = function () {
		this._$tipMsg.hide().remove();
	};
	/**
	 * 获取tip位置及尺寸
	 * @private
	 */
	Tip.prototype._updateTipPositionAndSize = function () {
		var offset = this._$tip.offset();
		this._tipLeft = offset.left;
		this._tipTop = offset.top;
		this._tipWidth = this._$tip.outerWidth();
		this._tipHeight = this._$tip.outerHeight();
	};
	/**
	 * 获取tipMsg尺寸
	 * @private
	 */
	Tip.prototype._updateTipMsgSize = function () {
		this._tipMsgWidth = this._$tipMsg.outerWidth();
		this._tipMsgHeight = this._$tipMsg.outerHeight();
	};

	window['Tip'] = Tip;
	window['PositionHandlerTop'] = PositionHandlerTop;
	window['PositionHandlerRight'] = PositionHandlerRight;
	window['PositionHandlerBottom'] = PositionHandlerBottom;
	window['PositionHandlerLeft'] = PositionHandlerLeft;
})($, this);