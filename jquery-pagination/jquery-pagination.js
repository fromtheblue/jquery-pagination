/**
 * Created by Wangqiong on 2017/2/27.
 * 基于bootstrap3的jquery分页插件
 * option:{
 *     firstPage:"首页",
 *     lastPage:"尾页",
 *     prevPage:"上一页",
 *     nextPage:"下一页",
 *     total:0,  总页数
 *     currentPage:0,  当前页数
 *     preCount:12,    每页最多显示的数据数
 *     showPageCount:5  页面中最多展示的分页页码数
 *     showCustomPage:true,  是否显示右侧输入页码跳转组件
 *     showMsg:true,  是否显示左侧说明
 *     showMsgRender:function(currentPage,preCount,total,totalPage){  左侧说明的格式
 *        return "当前第"+(currentPage+1)+"/"+totalPage+"页,每页"+preCount+"条,共"+total+"条记录";
 *     },
 *     click:function(page){}   触发分页行为的回调函数
 *}
 *method:
 *     render(option)   用来重新渲染分页插件
 *                      option用来覆盖上面的option,若某些属性未传,则仍使用原来的属性
 *
 */
(function ($) {
    if ($.fn.pagination) {
        return;
    }
    var setMethods = {
        render: render
    };
    var getMethods = {};
    $.fn.pagination = function () {
        var args = arguments,
            params, method;
        if (!args.length || typeof args[0] == 'object') {
            return this.each(function (idx) {
                var $self = $(this);
                $self.data('pagination', $.extend(true, {}, $.fn.pagination.default, args[0]));
                params = $self.data('pagination');
                _init.call($self, params);
                _render.call($self);
            });
        } else {
            if (!$(this).data('pagination')) {
                throw new Error('You has not init pagination!');
            }
            params = Array.prototype.slice.call(args, 1);
            if (setMethods.hasOwnProperty(args[0])) {
                method = setMethods[args[0]];
                return this.each(function (idx) {
                    var $self = $(this);
                    method.apply($self, params);
                    _render.call($self);
                });
            } else if (getMethods.hasOwnProperty(args[0])) {
                method = getMethods[args[0]];
                return method.apply(this, params);
            } else {
                throw new Error('There is no such method');
            }
        }
    }
    $.fn.pagination.default = {
        firstPage: "首页",
        lastPage: "尾页",
        prevPage: "上一页",
        nextPage: "下一页",
        total: 0,
        currentPage: 0,
        preCount: 12,
        showPageCount: 5,
        showCustomPage: true,
        showMsg: true,
        showMsgRender: function (currentPage, preCount, total, totalPage) {
            return "当前第" + (currentPage + 1) + "/" + totalPage + "页,每页" + preCount + "条,共" + total + "条记录";
        },
        click: function (page) {}
    }

    function _init(params) {
        return this;
    }

    function render(option) {
        $.extend(this.data('pagination'), option);
    }

    function _render() {
        var $self = this,
            params = $self.data("pagination");
        params.totalPage = Math.ceil(params.total / params.preCount);
        if (params.totalPage == 0) {
            params.totalPage = 1;
        }
        this.addClass("pagination-container").html([
            function () {
                if (params.showMsg) {
                    return $("<div/>", {
                        "class": "pagination-msg-panel",
                        "html": params.showMsgRender(params.currentPage, params.preCount, params.total, params.totalPage)
                    })
                }
            }(),
            $("<div/>", {
                "class": "pagination-operate-panel"
            }).append(
                $("<nav/>").append(
                    $("<ul/>", {
                        "class": "pagination"
                    }).append(
                        function () {
                            var currentPage = params.currentPage,
                                totalPage = params.totalPage,
                                showPageCount = params.showPageCount,
                                i,
                                arr = [];
                            var firstShow = currentPage - Math.ceil((showPageCount - 1 - Math.ceil(showPageCount % 2)) / 2);
                            var lastShow = currentPage + Math.floor((showPageCount - 1 + Math.ceil(showPageCount % 2)) / 2);
                            if (firstShow < 0) {
                                firstShow = 0;
                                lastShow = showPageCount - 1;
                            }
                            if (lastShow > totalPage - 1) {
                                lastShow = totalPage - 1;
                                firstShow = lastShow - showPageCount + 1;
                            }
                            if (firstShow < 0) {
                                firstShow = 0;
                            }
                            for (i = firstShow; i <= lastShow; i++) {
                                (function (i) {
                                    arr.push(
                                        $("<li/>").append(
                                            $("<a/>", {
                                                "text": (i + 1),
                                                "class": function () {
                                                    if (i == currentPage) {
                                                        return "active";
                                                    }
                                                },
                                                "click": function () {
                                                    params.click.call($self, i);
                                                }
                                            })
                                        )
                                    )
                                }(i))
                            }
                            arr.unshift(
                                $("<li/>").append(
                                    $("<a/>", {
                                        "text": params.prevPage,
                                        "class": function () {
                                            if (!currentPage) {
                                                return "disabled";
                                            }
                                        },
                                        "click": function () {
                                            if (!currentPage) {
                                                return;
                                            }
                                            params.click.call($self, currentPage - 1);
                                        }
                                    })
                                )
                            )
                            arr.unshift(
                                $("<li/>").append(
                                    $("<a/>", {
                                        "text": params.firstPage,
                                        "class": function () {
                                            if (!currentPage) {
                                                return "disabled";
                                            }
                                        },
                                        "click": function () {
                                            if (!currentPage) {
                                                return;
                                            }
                                            params.click.call($self, 0);
                                        }
                                    })
                                )
                            )
                            arr.push(
                                $("<li/>").append(
                                    $("<a/>", {
                                        "text": params.nextPage,
                                        "class": function () {
                                            if (currentPage == totalPage - 1) {
                                                return "disabled";
                                            }
                                        },
                                        "click": function () {
                                            if (currentPage == totalPage - 1) {
                                                return;
                                            }
                                            params.click.call($self, currentPage + 1);
                                        }
                                    })
                                )
                            )
                            arr.push(
                                $("<li/>").append(
                                    $("<a/>", {
                                        "text": params.lastPage,
                                        "class": function () {
                                            if (currentPage == totalPage - 1) {
                                                return "disabled";
                                            }
                                        },
                                        "click": function () {
                                            if (currentPage == totalPage - 1) {
                                                return;
                                            }
                                            params.click.call($self, totalPage - 1);
                                        }
                                    })
                                )
                            )
                            return arr;
                        }()
                    )
                ),
                function () {
                    var customPage;
                    if (params.showCustomPage) {
                        var btn = $("<button/>", {
                            "class": "btn btn-default go disabled",
                            "text": "确定",
                            "click": function () {
                                _enter.call(customPage.get(0), 13);
                            }
                        });
                        return [$("<label/>").append(
                                document.createTextNode("跳转: "),
                                (customPage = $("<input/>", {
                                    "class": "form-control custom-page",
                                    "keyup": function (event) {
                                        _enter.call(this, event.keyCode);
                                    }
                                })),
                                document.createTextNode(" 页")
                            ),
                            btn
                        ];

                        function _enter(keyCode) {
                            var value = this.value.trim(),
                                isCorrect = /^\d+$/.test(this.value) && this.value > 0 && this.value <= params.totalPage,
                                isDanger = !isCorrect;
                            if (!value) {
                                isDanger = false;
                            }
                            $(this).toggleClass("custom-page-danger", isDanger);
                            $(btn).toggleClass("disabled", !isCorrect);
                            if (keyCode == 13 && isCorrect) {
                                params.click(this.value - 1);
                            }
                        }
                    }
                }()
            )
        ]);
    }
})(jQuery);