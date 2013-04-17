/**
 * Created with JetBrains WebStorm.
 * User: HEME
 * Date: 13-1-22
 * Time: ����4:49
 * ��ʾ��
 * @author jinker
 */
goog.provide("cp.widget.Tip");

goog.require("cp.jquery");
goog.require("cp.util.Class");
goog.require("cp.mvp.View");

cp.widget.Tip = cp.mvp.View.extend({
	/**
	 * @constructs
	 */
	init: function (targetEl) {
		this._$target = cp.$(targetEl);
		this._$target.data(cp.widget.Tip.PROCESS_ALONE, true);
		this._initUI();
		this._binding();
	},
	/**
	 * @protected
	 */
	_onShow: function () {
		cp.widget.Tip._show(this._$target);
	},
	/**
	 * @protected
	 */
	_onHide: function () {
		cp.widget.Tip._hide(this._$target);
	},
	/**
	 * @protected
	 */
	_binding: function () {
		var self = this;
		this._onMouseEnterHandler = function () {
			self._onShow();
		};
		this._onMouseLeaveHandler = function () {
			self._onHide();
		};
		this._$target
			.on("mouseenter", this._onMouseEnterHandler)
			.on("mouseleave", this._onMouseLeaveHandler);
	},
	/**
	 * @protected
	 */
	_unbinding: function () {
		this._$target
			.off("mouseenter", this._onMouseEnterHandler)
			.off("mouseleave", this._onMouseLeaveHandler);
	},
	/**
	 * ����
	 */
	destroy: function () {
		this._unbinding();
		this._$target.removeData(cp.widget.Tip.PROCESS_ALONE);
		this._$target = null;
	}
});

/**
 * ����������������ȫ�ִ�������
 * @type {string}
 */
cp.widget.Tip.PROCESS_ALONE = "tip-process-alone";

/**
 * @type {string}
 */
cp.widget.Tip.dataMouseEnterKey = "mouseenter";

/**
 * ��ʾλ�ã�t���ϣ�r���ң�b���£�l����
 * @type {string}
 */
cp.widget.Tip.KEY_POSITION = "data-tip-position";

/**
 * �������ã��硰l-t������ʾ�����϶���
 * @type {string}
 */
cp.widget.Tip.KEY_ALIGN = "data-tip-align";

(function ($) {
	var Class = cp.util.Class;

	//����������ʾtip��Ŀ��
	var showingTargets = [];
	var showingTargetsMap = {};

	//��ʾ����ʾλ��
	var POSITION = {
		TOP: "t",
		RIGHT: "r",
		BOTTOM: "b",
		LEFT: "l"
	};
	//��ֱ����
	var V_ALIGN = {
		TOP: "t",
		MIDDLE: "m",
		BOTTOM: "b"
	};
	//ˮƽ����
	var H_ALIGN = {
		LEFT: "l",
		CENTER: "c",
		RIGHT: "r"
	};

	var dataMouseEnterKey = cp.widget.Tip.dataMouseEnterKey;

	var PositionHandler =
		/** @lends cp.widget.Tip.PositionHandler# */
		{
			/**
			 * @class λ�ü���
			 * @augments Class
			 *
			 * @constructs
			 */
			init: function () {
				//�����left��top
				this._resultLeft = 0;
				this._resultTop = 0;
			},
			/**
			 * �ж��Ƿ����
			 * @param {Number} scrollLeft ����left
			 * @param {Number} scrollTop ����top
			 * @param {Number} viewPortWidth �ӽ����
			 * @param {Number} viewPortHeight �ӽ�߶�
			 * @param {Number} targetLeft Ŀ��left
			 * @param {Number} targetTop Ŀ��top
			 * @param {Number} targetWidth Ŀ��width
			 * @param {Number} targetHeight Ŀ��height
			 * @param {Number} tipWidth ��ʾ��width
			 * @param {Number} tipHeight ��ʾ��height
			 * @param {String} vAlign ��ֱ����
			 * @param {String} hAlign ˮƽ����
			 * @param {Element} tipEl ��ʾ��
			 * @return {Boolean}
			 */
			canHandler: function (scrollLeft, scrollTop, viewPortWidth, viewPortHeight, targetLeft, targetTop, targetWidth, targetHeight, tipWidth, tipHeight, vAlign, hAlign, tipEl) {
				this._scrollLeft = scrollLeft;
				this._scrollTop = scrollTop;
				this._viewPortWidth = viewPortWidth;
				this._viewPortHeight = viewPortHeight;
				this._targetLeft = targetLeft;
				this._targetTop = targetTop;
				this._targetWidth = targetWidth;
				this._targetHeight = targetHeight;
				this._tipWidth = tipWidth;
				this._tipHeight = tipHeight;
				this._vAlign = vAlign;
				this._hAlign = hAlign;
				this._tipEl = tipEl;
				return false;
			},
			/**
			 * ��ȡλ��
			 * @return {Object}
			 *          {
		 *              left:0,
		 *              top:0
		 *          }
			 */
			getPosition: function () {
				var self = this;
				return {
					left: self._resultLeft,
					top: self._resultTop
				};
			}
		}
		;
	PositionHandler = cp.widget.Tip.PositionHandler = Class.extend(PositionHandler);

	var PositionHandlerTop =
	/** @lends cp.widget.Tip.PositionHandlerTop# */
	{
		/**
		 * @class topλ�ü���
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
			this._super.apply(this, Array.prototype.slice.call(arguments, 0));

			var canHandle = true;
			var left = 0,
				top = 0;

			if (this._tipWidth <= this._viewPortWidth) {
				top = this._targetTop - this._tipHeight;

				//�����ж��ϱ����޳����ӽ�
				if (top < this._scrollTop) {
					canHandle = false;
				}

				//���ܷ��£���������left
				if (canHandle) {
					switch (this._hAlign) {
						case H_ALIGN.LEFT:
							left = this._targetLeft;
							break;
						case H_ALIGN.CENTER:
							left = this._targetLeft + this._targetWidth / 2 - this._tipWidth / 2;
							break;
						case H_ALIGN.RIGHT:
							left = this._targetLeft + this._targetWidth - this._tipWidth;
							break;
						default :
							left = this._targetLeft + this._targetWidth / 2 - this._tipWidth / 2;
							break;
					}
					//����Ƿ��ڳ�����߽���
					if (left < this._scrollLeft) {
						left = this._scrollLeft;
					}
					//����Ƿ񳬳��ұ߽���
					if (left + this._tipWidth > this._scrollLeft + this._viewPortWidth) {
						left = this._scrollLeft + this._viewPortWidth - this._tipWidth;
					}
				}
			} else {
				canHandle = false;
			}

			this._resultLeft = left;
			this._resultTop = top;

			return canHandle;
		}
	};
	PositionHandlerTop = cp.widget.Tip.PositionHandlerTop = PositionHandler.extend(PositionHandlerTop);

	var PositionHandlerRight =
	/** @lends cp.widget.Tip.PositionHandlerRight# */
	{
		/**
		 * @class �ұ�λ�ü���
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
			this._super.apply(this, Array.prototype.slice.call(arguments, 0));

			var canHandle = true;
			var left = 0,
				top = 0;

			if (this._tipHeight <= this._viewPortHeight) {
				left = this._targetLeft + this._targetWidth;

				//�����ж��ұ����޳����ӽ�
				if (left + this._tipWidth > this._scrollLeft + this._viewPortWidth) {
					canHandle = false;
				}

				//���ܷ��£���������top
				if (canHandle) {
					switch (this._vAlign) {
						case V_ALIGN.TOP:
							top = this._targetTop;
							break;
						case V_ALIGN.MIDDLE:
							top = this._targetTop + this._targetHeight / 2 - this._tipHeight / 2;
							break;
						case V_ALIGN.BOTTOM:
							top = this._targetTop + this._targetHeight - this._tipHeight;
							break;
						default :
							top = this._targetTop + this._targetHeight / 2 - this._tipHeight / 2;
					}
					//����Ƿ��ڳ����ϱ߽���
					if (top < this._scrollTop) {
						top = this._scrollTop;
					}
					//����Ƿ񳬳��±߽���
					if (top + this._tipHeight > this._scrollTop + this._viewPortHeight) {
						top = this._scrollTop + this._viewPortHeight - this._tipHeight;
					}
				}
			} else {
				canHandle = false;
			}

			this._resultLeft = left;
			this._resultTop = top;

			return canHandle;
		}
	};
	PositionHandlerRight = cp.widget.Tip.PositionHandlerRight = PositionHandler.extend(PositionHandlerRight);

	var PositionHandlerBottom =
	/** @lends cp.widget.Tip.PositionHandlerBottom# */
	{
		/**
		 * @class �ײ�λ�ü���
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
			this._super.apply(this, Array.prototype.slice.call(arguments, 0));

			var canHandle = true;
			var left = 0,
				top = 0;

			if (this._tipWidth <= this._viewPortWidth) {
				top = this._targetTop + this._targetHeight;

				//�����ж��±����޳����ӽ�
				if (top + this._tipHeight > this._scrollTop + this._viewPortHeight) {
					canHandle = false;
				}

				//���ܷ��£���������left
				if (canHandle) {
					switch (this._hAlign) {
						case H_ALIGN.LEFT:
							left = this._targetLeft;
							break;
						case H_ALIGN.CENTER:
							left = this._targetLeft + this._targetWidth / 2 - this._tipWidth / 2;
							break;
						case H_ALIGN.RIGHT:
							left = this._targetLeft + this._targetWidth - this._tipWidth;
							break;
						default :
							left = this._targetLeft + this._targetWidth / 2 - this._tipWidth / 2;
							break;
					}
					//����Ƿ��ڳ�����߽���
					if (left < this._scrollLeft) {
						left = this._scrollLeft;
					}
					//����Ƿ񳬳��ұ߽���
					if (left + this._tipWidth > this._scrollLeft + this._viewPortWidth) {
						left = this._scrollLeft + this._viewPortWidth - this._tipWidth;
					}
				}
			} else {
				canHandle = false;
			}

			this._resultLeft = left;
			this._resultTop = top;

			return canHandle;
		}
	};
	PositionHandlerBottom = cp.widget.Tip.PositionHandlerBottom = PositionHandler.extend(PositionHandlerBottom);

	var PositionHandlerLeft =
	/** @lends cp.widget.Tip.PositionHandlerLeft# */
	{
		/**
		 * @class ���λ�ü���
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
			this._super.apply(this, Array.prototype.slice.call(arguments, 0));

			var canHandle = true;
			var left = 0,
				top = 0;

			if (this._tipHeight <= this._viewPortHeight) {
				left = this._targetLeft - this._tipWidth;

				//�����ж�������޳����ӽ�
				if (left < this._scrollLeft) {
					canHandle = false;
				}

				//���ܷ��£���������top
				if (canHandle) {
					switch (this._vAlign) {
						case V_ALIGN.TOP:
							top = this._targetTop;
							break;
						case V_ALIGN.MIDDLE:
							top = this._targetTop + this._targetHeight / 2 - this._tipHeight / 2;
							break;
						case V_ALIGN.BOTTOM:
							top = this._targetTop + this._targetHeight - this._tipHeight;
							break;
						default :
							top = this._targetTop + this._targetHeight / 2 - this._tipHeight / 2;
							break;
					}
					//����Ƿ��ڳ����ϱ߽���
					if (top < this._scrollTop) {
						top = this._scrollTop;
					}
					//����Ƿ񳬳��±߽���
					if (top + this._tipHeight > this._scrollTop + this._viewPortHeight) {
						top = this._scrollTop + this._viewPortHeight - this._tipHeight;
					}
				}
			} else {
				canHandle = false;
			}

			this._resultLeft = left;
			this._resultTop = top;

			return canHandle;
		}
	};
	PositionHandlerLeft = cp.widget.Tip.PositionHandlerLeft = PositionHandler.extend(PositionHandlerLeft);

	var positionHandlerTop = new PositionHandlerTop();
	var positionHandlerRight = new PositionHandlerRight();
	var positionHandlerBottom = new PositionHandlerBottom();
	var positionHandlerLeft = new PositionHandlerLeft();

	/**
	 * Ĭ���Ϸ���ʾ
	 * @type {Array}
	 */
	var positionHandlersTop = [positionHandlerTop, positionHandlerRight, positionHandlerBottom, positionHandlerLeft];
	/**
	 * Ĭ���ҷ���ʾ
	 * @type {Array}
	 */
	var positionHandlersRight = [ positionHandlerRight, positionHandlerBottom, positionHandlerLeft, positionHandlerTop];
	/**
	 * Ĭ���·���ʾ
	 * @type {Array}
	 */
	var positionHandlersBottom = [positionHandlerBottom, positionHandlerLeft, positionHandlerTop, positionHandlerRight];
	/**
	 * Ĭ������ʾ
	 * @type {Array}
	 */
	var positionHandlersLeft = [positionHandlerLeft, positionHandlerTop, positionHandlerRight, positionHandlerBottom];

	/**
	 * �ӻ������Ƴ�������ʾ
	 * @param target
	 */
	var removeTip = function (target) {
		target = $(target);
		var $tip = target.data("tip");

		if ($tip) {
			$tip.remove();
		}

		var index = indexOf(target[0], showingTargets);
		if (index > -1) {
			showingTargets.splice(index, 1);
		}
		target.removeData("tip");
	};

	var indexOf = function (item, array) {
		if (array.indexOf) {
			return array.indexOf(item);
		} else {
			for (var i = 0, l = array.length; i < l; i++) {
				if (item === array[i]) {
					return i;
				}
			}
			return -1;
		}
	};

	/**
	 * ����������
	 * @param target
	 * @param $tip
	 */
	var addTip = function (target, $tip) {
		target = $(target);
		target.data("tip", $tip);
		showingTargets.push(target[0]);
	};
	/**
	 * ������Ŀ��
	 * @param {$} $target
	 * @param {Array.<cp.widget.Tip.PositionHandler>=} $target
	 */
	var onMouseEnter = cp.widget.Tip._show = function ($target, positionHandlers) {
		var temp;
		var $tipMsgEl = $target.find(".js-tip-msg").eq(0);
		if ($tipMsgEl.length == 0) {
			$tipMsgEl = $target.next();
		}
		$tipMsgEl.css({visibility: "hidden"});
		$tipMsgEl = $tipMsgEl.clone(true);
		$tipMsgEl.show().css({visibility: "visible"});

		$target.data(dataMouseEnterKey, true);

		var $tip = $target.data("tip");
		if (!$tip) {
			$tip = $("<div style='z-index:10000001;position:absolute;visibility:hidden;'></div>");
		}
		$tip.empty();
		$tip.append($tipMsgEl);
		//���ȼ���dom�У�ʹ���ܻ�ȡ�¼��Լ���ʼ��Ⱦ��Ϊ֮���ȡ��ߴ���׼��
		$("body").append($tip);
		$tip
			.one("mouseenter", function () {
				$tip.data(dataMouseEnterKey, true);
			})
			.one("mouseleave", function () {
				$tip.data(dataMouseEnterKey, false);
				//�������߳�
				setTimeout(function () {
					if (!$target.data(dataMouseEnterKey)) {
						removeTip($target);
					}
				}, 200);
			});

		var viewPortWidth = $(window).width();
		var viewPortHeight = $(window).height();
		var scrollLeft = $(document).scrollLeft();
		var scrollTop = $(document).scrollTop();

		temp = $target.offset();
		var targetLeft = temp.left;
		var targetTop = temp.top;
		var targetWidth = $target.outerWidth();
		var targetHeight = $target.outerHeight();
		temp = $tip.children().eq(0);
		var tipWidth = temp.outerWidth();
		var tipHeight = temp.outerHeight();

		var alignStr = $target.attr(cp.widget.Tip.KEY_ALIGN) || (H_ALIGN.RIGHT + "-" + V_ALIGN.TOP);
		temp = alignStr.split("-");
		var hAlign = temp[0] || H_ALIGN.CENTER;//ˮƽ���뷽��l����c���У�r����
		var vAlign = temp[1] || V_ALIGN.MIDDLE;//��ֱ���뷽��t���ϣ�m���У�b����

		var pHandlers;
		if (positionHandlers) {
			pHandlers = positionHandlers;
		} else {
			var position = $target.attr(cp.widget.Tip.KEY_POSITION) || POSITION.RIGHT;
			switch (position) {
				case "t":
					pHandlers = positionHandlersTop;
					break;
				case "r":
					pHandlers = positionHandlersRight;
					break;
				case "b":
					pHandlers = positionHandlersBottom;
					break;
				case "l":
					pHandlers = positionHandlersLeft;
					break;
				default :
					pHandlers = positionHandlersRight;
					break;
			}
		}

		var positionHandler;
		for (var i = 0, l = pHandlers.length; i < l; i++) {
			positionHandler = pHandlers[i];
			if (positionHandler.canHandler(scrollLeft, scrollTop, viewPortWidth, viewPortHeight, targetLeft, targetTop, targetWidth, targetHeight, tipWidth, tipHeight, vAlign, hAlign, $tip[0])) {
				var p = positionHandler.getPosition();
				$tip.css({
					visibility: "",
					left: p.left,
					top: p.top,
					width: tipWidth,
					height: tipHeight
				});
				$tip.show();
				break;
			}
		}

		//����������
		addTip($target, $tip);
	};

	/**
	 * ������뿪Ŀ��
	 * @param {$} $target
	 */
	var onMouseLeave = cp.widget.Tip._hide = function ($target) {
		$target.data(dataMouseEnterKey, false);

		//����js���̣߳�ʹ�������¼����ȷ���
		setTimeout(function () {
			var $tip = $target.data("tip");
			if ($tip) {
				if (!$tip.data(dataMouseEnterKey)) {
					removeTip($target);
				}
			}
		}, 100);
	};

	var bindingTargets = [];
	/**
	 * ʹ��el֮������tip��Ч
	 * @param {Element} el
	 */
	cp.widget.Tip.bind = function (el) {
		if (el) {
			bindingTargets.push(el);

			var mouseEnterHandler = function () {
				var $this = $(this);
				if (!$this.data(cp.widget.Tip.PROCESS_ALONE)) {
					onMouseEnter($this);
				}
			};
			var mouseLeaveHandler = function () {
				var $this = $(this);
				if (!$this.data(cp.widget.Tip.PROCESS_ALONE)) {
					onMouseLeave($this);
				}
			};
			$(el)
				.data("tip-mouseEnterHandler", mouseEnterHandler)
				.data("tip-mouseLeaveHandler", mouseLeaveHandler)
				.on("mouseenter", ".js-tip", mouseEnterHandler)
				.on("mouseleave", ".js-tip", mouseLeaveHandler);
		}
	};
	/**
	 * ȡ��tipЧ��
	 * @param {Element} el
	 */
	cp.widget.Tip.unbind = function (el) {
		if (el) {
			var mouseEnterHandler = $(el).data("tip-mouseEnterHandler");
			var mouseLeaveHandler = $(el).data("tip-mouseLeaveHandler");
			if (mouseEnterHandler) {
				$(el).off("mouseenter", ".js-tip", mouseEnterHandler);
			}
			if (mouseLeaveHandler) {
				$(el).off("mouseleave", ".js-tip", mouseLeaveHandler);
			}
		}
	};
	/**
	 * ��ʾtip
	 * @param {String|Jquery} target Ŀ��
	 */
	cp.widget.Tip.show = function (target) {
		$(target).each(function (index, el) {
			onMouseEnter($(el));
		});
	};
	/**
	 * ����tip
	 * @param {String|Jquery} target Ŀ��
	 */
	cp.widget.Tip.hide = function (target) {
		$(target).each(function (index, el) {
			onMouseLeave($(el));
		});
	};

	/**
	 * ʹ��ȫ��tip��Ч
	 * @deprecated
	 */
	cp.widget.Tip.init = function () {
		$(document)
			.bind("click", function () {
				var target;
				for (var i = 0; target = showingTargets[i]; i++) {
					if (!$(target).data(cp.widget.Tip.PROCESS_ALONE)) {
						cp.widget.Tip.hide(target);
					}
				}
			});

		cp.widget.Tip.bind(document);
	};
})(cp.jquery);