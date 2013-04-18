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
			this._arrowLength = 20;
			this._arrowWidth = 30;
			this._super.apply(this, Array.prototype.slice.call(arguments, 0));
			this._borderWidth = 2;
		},
		/**
		 * @override
		 * @protected
		 */
		_onShow: function () {
			Tip._show(this._$target, this, TipWithArrow.positionHandlersTop);
		},
		/**
		 * @override
		 * @protected
		 */
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

					var arrowLeft;
					var arrowInnerLeft;
					var arrowInnerWidth;
					var borderWidthStr;
					var arrowInnerLength;
					var borderInnerWidthStr;

					arrowLeft = this._targetLeft + this._targetWidth / 2 - arrowWidth / 2 - this._resultLeft - borderWidth;

					if (arrowLeft < 0) {
						//TODO
					} else if (arrowLeft + arrowWidth > this._tipWidth) {
						arrowLeft = this._targetLeft + this._targetWidth / 2 - arrowWidth - this._resultLeft - borderWidth;
						borderWidthStr = arrowLength + "px 0 0 " + arrowWidth + "px";
						arrowInnerWidth = arrowWidth - borderWidth - borderWidth * Math.SQRT2;
						arrowInnerLength = arrowInnerWidth * arrowLength / arrowWidth;
						borderInnerWidthStr = arrowInnerLength + "px 0 0 " + arrowInnerWidth + "px";
						arrowInnerLeft = -arrowInnerWidth - borderWidth;
					} else {
						borderWidthStr = arrowLength + "px " + arrowWidth / 2 + "px 0 " + arrowWidth / 2 + "px";
						arrowInnerLength = arrowLength - borderWidth;
						arrowInnerWidth = arrowInnerLength * arrowWidth / arrowLength;
						borderInnerWidthStr = arrowInnerLength + "px " + arrowInnerWidth / 2 + "px 0 " + arrowInnerWidth / 2 + "px";
						arrowInnerLeft = -arrowInnerWidth / 2;
					}

					var $arrow = $("<div class='tip-arrow' style='position:absolute;width:0;height:0;left:" + arrowLeft + "px;bottom:" + (-arrowLength) + "px;border-style:solid;border-color:#2f4f4f transparent transparent transparent;border-width:" + borderWidthStr + ";'>" +
						"<div class='tip-arrow-inner' style='position:absolute;width:0;height:0;left:" + arrowInnerLeft + "px;top:" + (-arrowLength) + "px;border-style:solid;border-color:#d3d3d3 transparent transparent transparent;border-width:" + borderInnerWidthStr + "'></div>" +
						"</div>");
					$(this._tipEl).append($arrow);
					this._resultTop -= arrowInnerLength;
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