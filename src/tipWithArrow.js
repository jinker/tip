/**
 * Date: 13-4-12
 * Time: 上午11:17
 * 带箭头提示层
 * @author jinker
 */
(function ($, window) {
	var Tip = window['Tip'];

	var TipWithArrow = Tip.extend({
		/**
		 * @constructs
		 */
		init: function () {
			this._super.apply(this, Array.prototype.slice.call(arguments, 0));
		},
		/**
		 * @protected
		 */
		_onShow: function () {
			Tip._show(this._$target, this, TipWithArrow.positionHandlersTop);
		},
		_onHide: function () {
//			this._super();
		}
	});

	TipWithArrow.PositionHandlerTop = Tip.PositionHandlerTop.extend(
		/** @lends TipWithArrow.PositionHandlerTop# */
		{
			/**
			 * @class top位置计算
			 * @augments PositionHandler
			 *
			 * @constructs
			 */
			init: function () {
				this._super.apply(this, Array.prototype.slice.call(arguments, 0));
			},
			/**
			 * @override
			 * @return {Boolean}
			 */
			canHandler: function () {
				var res = this._super.apply(this, Array.prototype.slice.call(arguments, 0));

				if (res) {
					var arrowWidth = this._tip._arrowWidth;
					var arrowLength = this._tip._arrowLength;
					var borderWidth = this._tip._borderWidth;

					var arrowLeft = this._targetLeft + this._targetWidth / 2 - arrowWidth / 2 - this._resultLeft - borderWidth;

					var borderWidthStr = arrowLength + "px " + arrowWidth / 2 + "px 0 " + arrowWidth / 2 + "px";
					var $arrow = $("<div class='tip-arrow' style='position:absolute;width:0;height:0;left:" + arrowLeft + "px;bottom:" + (-arrowLength - borderWidth) + "px;border-style:solid;border-color:#2f4f4f transparent transparent transparent;border-width:" + borderWidthStr + ";'>" +
						"<div class='tip-arrow-inner' style='position:absolute;width:0;height:0;left:" + (-arrowWidth / 2) + "px;top:" + (-arrowLength - borderWidth /** Math.SQRT1_2*/) + "px;border-style:solid;border-color:#d3d3d3 transparent transparent transparent;border-width:" + borderWidthStr + "'></div>" +
						"</div>");
					$(this._tipEl).append($arrow);
					this._resultTop -= arrowLength;
				}

				return res;
			}
		}
	);

	TipWithArrow.positionHandlerTop = new TipWithArrow.PositionHandlerTop();
	TipWithArrow.positionHandlerRight = new Tip.PositionHandlerRight();
	TipWithArrow.positionHandlerBottom = new Tip.PositionHandlerBottom();
	TipWithArrow.positionHandlerLeft = new Tip.PositionHandlerLeft();

	/**
	 * 默认上方显示
	 * @type {Array}
	 */
	TipWithArrow.positionHandlersTop = [
		TipWithArrow.positionHandlerTop,
		TipWithArrow.positionHandlerRight,
		TipWithArrow.positionHandlerBottom,
		TipWithArrow.positionHandlerLeft
	];
	/**
	 * 默认右方显示
	 * @type {Array}
	 */
	TipWithArrow.positionHandlersRight = [
		TipWithArrow.positionHandlerRight,
		TipWithArrow.positionHandlerBottom,
		TipWithArrow.positionHandlerLeft,
		TipWithArrow.positionHandlerTop
	];
	/**
	 * 默认下方显示
	 * @type {Array}
	 */
	TipWithArrow.positionHandlersBottom = [
		TipWithArrow.positionHandlerBottom,
		TipWithArrow.positionHandlerLeft,
		TipWithArrow.positionHandlerTop,
		TipWithArrow.positionHandlerRight
	];
	/**
	 * 默认左方显示
	 * @type {Array}
	 */
	TipWithArrow.positionHandlersLeft = [
		TipWithArrow.positionHandlerLeft,
		TipWithArrow.positionHandlerTop,
		TipWithArrow.positionHandlerRight,
		TipWithArrow.positionHandlerBottom
	];

	window['TipWithArrow'] = TipWithArrow;
})($, this);