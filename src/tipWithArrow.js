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
			this._arrowLength = 15;
			this._arrowWidth = 30;
			this._super.apply(this, Array.prototype.slice.call(arguments, 0));
			this._borderWidth = 5;
		},
		/**
		 * @override
		 * @protected
		 */
		_onShow: function () {
			Tip._show(this._$target, this, TipWithArrow.positionHandlersRight);
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
			 * @augments Tip.PositionHandlerTop
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
					var arrowLength = this._tip._arrowLength;
					var borderWidth = this._tip._borderWidth;

					this._resultTop -= arrowLength - borderWidth;
					if (this._resultTop >= 0) {
						var arrowWidth = this._tip._arrowWidth;

						var arrowLeft;
						var arrowInnerLeft;
						var arrowInnerWidth;
						var borderWidthStr;
						var arrowInnerLength;
						var borderInnerWidthStr;

						arrowLeft = this._targetLeft + this._targetWidth / 2 - arrowWidth / 2 - this._resultLeft - borderWidth;

						if (arrowLeft + borderWidth < 0) {
							//when arrow out of left bound of tip
							arrowLeft = this._targetLeft + this._targetWidth / 2 - this._resultLeft - borderWidth;
							borderWidthStr = arrowLength + "px " + arrowWidth + "px 0 0";
							arrowInnerWidth = arrowWidth - borderWidth - borderWidth * Math.SQRT2;
							arrowInnerLength = arrowInnerWidth * arrowLength / arrowWidth;
							borderInnerWidthStr = arrowInnerLength + "px " + arrowInnerWidth + "px 0 0";
							arrowInnerLeft = borderWidth;
						} else if (arrowLeft + arrowWidth + borderWidth > this._tipWidth) {
							//when arrow out of right bound of tip
							arrowLeft = this._targetLeft + this._targetWidth / 2 - arrowWidth - this._resultLeft - borderWidth;
							borderWidthStr = arrowLength + "px 0 0 " + arrowWidth + "px";
							arrowInnerWidth = arrowWidth - borderWidth - borderWidth * Math.SQRT2;
							arrowInnerLength = arrowInnerWidth * arrowLength / arrowWidth;
							borderInnerWidthStr = arrowInnerLength + "px 0 0 " + arrowInnerWidth + "px";
							arrowInnerLeft = -arrowInnerWidth - borderWidth;
						} else {
							//Normal
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
					} else {
						res = false;
					}
				}

				return res;
			}
		}
	);

	TipWithArrow.PositionHandlerRight = Tip.PositionHandlerRight.extend(
		/** @lends TipWithArrow.PositionHandlerRight# */
		{
			/**
			 * @class right位置计算
			 * @augments Tip.PositionHandlerRight
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
					var arrowLength = this._tip._arrowLength;
					var borderWidth = this._tip._borderWidth;

					this._resultLeft += arrowLength - borderWidth;
					//the tip not out of the right bound of view port
					if (this._resultLeft + this._tipWidth < this._viewPortWidth) {
						var arrowWidth = this._tip._arrowWidth;

						var arrowTop;
						var arrowInnerTop;
						var arrowInnerWidth;
						var borderWidthStr;
						var arrowInnerLength;
						var borderInnerWidthStr;

						switch (this._vAlign) {
							case Tip.V_LAIN.TOP:
								arrowTop = this._targetTop + this._targetHeight / 2 - arrowWidth / 2 - this._resultTop - borderWidth;
								break;
							case Tip.V_LAIN.MIDDLE:
								arrowTop = this._targetTop + this._targetHeight / 2 - arrowWidth / 2 - this._resultTop - borderWidth;
								break;
							case Tip.V_LAIN.BOTTOM:
								arrowTop = this._targetTop + this._targetHeight / 2 - arrowWidth / 2 - this._resultTop - borderWidth;
								break;
						}

						if (arrowTop + borderWidth < 0) {
							//when arrow out of top bound of tip
							arrowTop = this._targetLeft + this._targetWidth / 2 - this._resultLeft - borderWidth;
							borderWidthStr = arrowLength + "px " + arrowWidth + "px 0 0";
							arrowInnerWidth = arrowWidth - borderWidth - borderWidth * Math.SQRT2;
							arrowInnerLength = arrowInnerWidth * arrowLength / arrowWidth;
							borderInnerWidthStr = arrowInnerLength + "px " + arrowInnerWidth + "px 0 0";
							arrowInnerTop = borderWidth;
						} else if (arrowTop + arrowWidth + borderWidth > this._tipWidth) {
							//when arrow out of right bound of tip
							arrowTop = this._targetLeft + this._targetWidth / 2 - arrowWidth - this._resultLeft - borderWidth;
							borderWidthStr = arrowLength + "px 0 0 " + arrowWidth + "px";
							arrowInnerWidth = arrowWidth - borderWidth - borderWidth * Math.SQRT2;
							arrowInnerLength = arrowInnerWidth * arrowLength / arrowWidth;
							borderInnerWidthStr = arrowInnerLength + "px 0 0 " + arrowInnerWidth + "px";
							arrowInnerTop = -arrowInnerWidth - borderWidth;
						} else {
							//Normal
							borderWidthStr = arrowWidth / 2 + "px " + arrowLength + "px " + arrowWidth / 2 + "px 0";
							arrowInnerLength = arrowLength - borderWidth;
							arrowInnerWidth = arrowInnerLength * arrowWidth / arrowLength;
							borderInnerWidthStr = arrowInnerWidth / 2 + "px " + arrowInnerLength + "px " + arrowInnerWidth / 2 + "px 0";
							arrowInnerTop = -arrowInnerWidth / 2;
						}

						var $arrow = $("<div class='tip-arrow' style='position:absolute;width:0;height:0;left:" + (-arrowLength) + "px;top:" + arrowTop + "px;border-style:solid;border-color:transparent #2f4f4f transparent transparent;border-width:" + borderWidthStr + ";'>" +
							"<div class='tip-arrow-inner' style='position:absolute;width:0;height:0;left:" + (borderWidth) + "px;top:" + arrowInnerTop + "px;border-style:solid;border-color:transparent #d3d3d3 transparent transparent;border-width:" + borderInnerWidthStr + "'></div>" +
							"</div>");
						$(this._tipEl).append($arrow);
					} else {
						res = false;
					}
				}

				return res;
			}
		}
	);

	TipWithArrow.positionHandlerTop = new TipWithArrow.PositionHandlerTop();
	TipWithArrow.positionHandlerRight = new TipWithArrow.PositionHandlerRight();
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