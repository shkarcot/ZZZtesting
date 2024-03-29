(function() {
	'use strict';
    angular.module('console.imageCropDirective', [])
    .directive("mrImage",["$rootScope", function($rootScope) {
    return {
        restrict: "A",
        scope: {
            src: "=mrSrc",
            maxWidth: "=?mrMaxWidth",
            aspectRatio: "=?mrAspectRatio",
            scale: "=?mrScale",
            drawer: "=?mrDrawer",
            selector: "=?mrSelector"
        },
        template: '<div mr-image-selector id="calImage" mr-model="selector" mr-aspect-ratio="aspectRatio" style="height: {{scaleValue(height, scale) + \'px\'}}; width: {{scaleValue(width, scale) + \'px\'}}"><img ng-src="{{src}}" width="{{scaleValue(width, scale)}}" height="{{scaleValue(height, scale)}}"></div><div mr-image-drawer mr-model="drawer" ng-class=\"$root.imageBlur\" style="height: {{scaleValue(height, scale) + \'px\'}}; width: {{scaleValue(width, scale) + \'px\'}}"></div>',
        link: function(a, b) {
            function c(c) {
                a.image = new Image, a.image.onload = function() {
                    a.$apply(function() {
                        a.height = a.height || a.image.height, a.width = a.width || a.image.width, a.scale = angular.isUndefined(a.scale) && angular.isDefined(a.maxWidth) ? a.maxWidth >= a.width ? 1 : a.maxWidth / a.width : a.scale || 1, b.css("width", a.scaleValue(a.width, a.scale) + "px"), b.css("height", a.scaleValue(a.height, a.scale) + "px")
                    })
                }, a.image.src = c
            }
            b.addClass("mr-image"), c(a.src), a.scaleValue = function(a, b) {
                return Math.floor(a * b)
            }
        }
    }
    }])
    .directive("mrImageDrawer",["$rootScope", function(rootScope) {
    return {
        restrict: "A",
        scope: {
            rects: "=mrModel"
        },
        template: "<div ng-repeat=\"rect in rects\"  ng-show=\" showDrawer(rect) \" ng-class=\"$root.highlight[$index]\" ng-click=\"editItem(rect,$index)\" style=\"position: absolute;cursor: pointer;top:    {{ rect.y1 }}px;left:   {{ rect.x1 }}px;width:  {{ (rect.x2 - rect.x1)}}px;height: {{ (rect.y2 - rect.y1)}}px;border: {{ rect.stroke || 3 }}px {{rect.borderStyle}} {{ rect.color || '#F00' }};background-color: {{ increaseBrightness(rect.bgColor || '#F00', '0.3') }}\"ng-style='rectStyle'ng-mouseenter=\"rectStyle = { 'background-color': increaseBrightness(rect.color || '#F00', '0.1') }\"ng-mouseout=\"rectStyle =   { 'background-color': increaseBrightness(rect.color || '#F00', '0.3' ) }\"><i ng-show=\"rect.is_update\" class=\"fa  fa-pencil\" style=\"float:right;font-size:45px;color: #33ad85;\" ng-click=\"removeSelected($index)\"></i><i ng-show=\"rect.is_accept || rect.isAllAccept\" class=\"fa  fa-check \" style=\"float:right;font-size:45px; color: #33ad85;\" ng-click=\"removeSelected($index)\"></i></div>",
        link: function(a) {
            a.increaseBrightness = function(a, b) {
                a = a.replace(/^\s*#|\s*$/g, ""), 3 == a.length && (a = a.replace(/(.)/g, "$1$1"));
                var c = parseInt(a.substr(0, 2), 16),
                    d = parseInt(a.substr(2, 2), 16),
                    e = parseInt(a.substr(4, 2), 16);
                return "rgba(" + c + "," + d + "," + e + "," + b + ")"
            }
            a.removeSelected = function(index){
                rootScope.$broadcast("selected",index);
            }
            a.editItem = function(data,index){
                rootScope.$broadcast("edited",data);
            }
            a.showDrawer = function(rect){

                if(rootScope.selectedIndex.length==0 && rootScope.selectedPage.length==0 && rect.is_display){
                    return true;
                }
                else{
                    for(var i=0; i<rootScope.selectedIndex.length;i++){
                        if(rect.index == rootScope.selectedIndex[i] && rect.page_no == rootScope.selectedPage[i] && rect.is_display){
                            return true;
                        }
                    }
                    return false;
                }

            }
        }
    }
    }])
    .directive("mrImageSelector",["$rootScope", function(rootScope) {
    function a(a) {
        var b, c = {
                top: 0,
                left: 0
            },
            d = a && a[0].ownerDocument;
        return b = d.documentElement, void 0 !== typeof a[0].getBoundingClientRect && (c = a[0].getBoundingClientRect()), {
            top: c.top + (window.pageYOffset || b.scrollTop) - (b.clientTop || 0),
            left: c.left + (window.pageXOffset || b.scrollLeft) - (b.clientLeft || 0)
        }
    }
    return {
        restrict: "A",
        scope: {
            selector: "=?mrModel",
            src: "=?mrSrc",
            aspectRatio: "=?mrAspectRatio"
        },
        link: function(b, c) {
            function d(a, b, c) {
                L.css("display", "block"), M.css("right", b - a.left + "px"), P.css("left", b - a.right + "px"), N.css("left", a.left + "px"), N.css("right", a.right + "px"), N.css("bottom", c - a.top + "px"), O.css("left", a.left + "px"), O.css("right", a.right + "px"), O.css("top", c - a.bottom + "px")
            }

            function e() {
                H[0].documentElement.className = H[0].documentElement.className.replace(" mr-user-select", "")
            }

            function f() {
                H[0].documentElement.className += " mr-user-select"
            }

            function g() {
                H.bind("mousemove", j), H.bind("mouseup", k)
            }

            function h() {
                H.unbind("mousemove", j), H.unbind("mouseup", k)
            }

            function i(b) {
                f();
                var d = a(c);
                Q = b.pageX - d.left, R = b.pageY - d.top, S = !0, g()
            }

            function j(d) {
                S = !1;
                var e = a(c),
                    f = d.pageX - e.left,
                    g = d.pageY - e.top;
                b.$apply(function() {
                    l(Q, R, f, g)
                })
            }

            function k() {
                e(), S && b.$apply(z), h()
            }

            function l(a, b, d, e) {
                var f = c.css("height").replace("px", ""),
                    g = c.css("width").replace("px", "");
                d = 0 > d ? 0 : d, d = d > g ? g : d, e = 0 > e ? 0 : e, e = e > f ? f : e;
                var h = {
                    top: e > b ? b : e,
                    bottom: e > b ? f - e : f - b,
                    left: d > a ? a : d,
                    right: d > a ? g - d : g - a
                };
                w(h, g, f)
            }

            function m() {
                H.bind("mousemove", p), H.bind("mouseup", q)
            }

            function n() {
                H.unbind("mousemove", p), H.unbind("mouseup", q)
            }

            function o(a) {
                a.stopPropagation(), f(), W = angular.element(a.target).attr("class").replace("mr-drag-handle", "").replace("mr-drag-line", "").trim(), T = a.pageX, U = a.pageY, V = {
                    top: parseInt(I.css("top")),
                    bottom: parseInt(I.css("bottom")),
                    left: parseInt(I.css("left")),
                    right: parseInt(I.css("right"))
                }, m()
            }

            function p(a) {
                var d = c.css("height").replace("px", ""),
                    e = c.css("width").replace("px", ""),
                    f = a.pageX - T,
                    g = a.pageY - U,
                    h = {
                        top: V.top,
                        bottom: V.bottom,
                        left: V.left,
                        right: V.right
                    };
                "n" == W[0] ? h.top += g : "s" == W[0] && (h.bottom -= g), "w" == W[0] || "w" == W[1] ? h.left += f : ("e" == W[0] || "e" == W[1]) && (h.right -= f);
                var i;
                (h.top >= d - h.bottom || h.bottom >= d - h.top) && (i = h.top, h.top = d - h.bottom, h.bottom = d - i), (h.left >= e - h.right || h.right >= e - h.left) && (i = h.left, h.left = e - h.right, h.right = e - i), h.top = h.top < 0 ? 0 : h.top, h.bottom = h.bottom < 0 ? 0 : h.bottom, h.left = h.left < 0 ? 0 : h.left, h.right = h.right < 0 ? 0 : h.right, G && ("n" == W && (h.left = e - (h.right + (d - h.top - h.bottom) * G)), "s" == W && (h.right = e - (h.left + (d - h.top - h.bottom) * G)), ("w" == W || "nw" == W || "ne" == W) && (h.top = d - (h.bottom + (e - h.left - h.right) / G), h.top < 0 && (h.top = 0, "w" == W[0] || "w" == W[1] ? h.left = e - (h.right + (d - h.top - h.bottom) * G) : h.right = e - (h.left + (d - h.top - h.bottom) * G))), ("e" == W || "se" == W || "sw" == W) && (h.bottom = d - (h.top + (e - h.left - h.right) / G), h.bottom < 0 && (h.bottom = 0, "e" == W[0] || "e" == W[1] ? h.right = e - (h.left + (d - h.top - h.bottom) * G) : h.left = e - (h.right + (d - h.top - h.bottom) * G)))), b.$apply(function() {
                    w(h, e, d)
                })
            }

            function q() {
                e(), n()
            }

            function r() {
                H.bind("mousemove", u), H.bind("mouseup", v)
            }

            function s() {
                H.unbind("mousemove", u), H.unbind("mouseup", v)
            }

            function t(a) {
                a.stopPropagation(), f(), T = a.pageX, U = a.pageY, V = {
                    top: parseInt(I.css("top")),
                    bottom: parseInt(I.css("bottom")),
                    left: parseInt(I.css("left")),
                    right: parseInt(I.css("right"))
                }, r()
            }

            function u(a) {
                var d = c.css("height").replace("px", ""),
                    e = c.css("width").replace("px", ""),
                    f = a.pageX - T,
                    g = a.pageY - U,
                    h = {
                        top: V.top + g,
                        bottom: V.bottom - g,
                        left: V.left + f,
                        right: V.right - f
                    };
                h.top < 0 && (h.bottom = h.bottom + h.top, h.top = 0), h.bottom < 0 && (h.top = h.bottom + h.top, h.bottom = 0), h.left < 0 && (h.right = h.right + h.left, h.left = 0), h.right < 0 && (h.left = h.left + h.right, h.right = 0), b.$apply(function() {
                    w(h, e, d)
                })
            }

            function v() {
                e(), s()
            }

            function w(a, c, e) {
                a && (G && (Q > a.left ? a.left = c - (a.right + (e - a.top - a.bottom) * G) : a.right = c - (a.left + (e - a.top - a.bottom) * G), a.top < 0 && (a.top = 0, a.left = c - (a.right + (e - a.top - a.bottom) * G)), a.bottom < 0 && (a.bottom = 0, a.right = c - (a.left + (e - a.top - a.bottom) * G)), a.left < 0 && (a.left = 0, a.top = e - (a.bottom + (c - a.left - a.right) / G)), a.right < 0 && (a.right = 0, a.bottom = e - (a.top + (c - a.left - a.right) / G))), d(a, c, e), I.css("display", "block"), I.css({
                    top: a.top + "px",
                    bottom: a.bottom + "px",
                    left: a.left + "px",
                    right: a.right + "px"
                }), Y(), F.x1 = a.left, F.y1 = a.top, F.x2 = c - a.right, F.y2 = e - a.bottom, Y = b.$watch("selector", C, !0))
                rootScope.$broadcast("selector",b.selector);
            }

            function x() {
                X || (c.bind("mousedown", i), J.bind("mousedown", o), K.bind("mousedown", o), I.bind("mousedown", t), X = !0)
            }

            function y() {
                X && (c.unbind("mousedown", i), J.unbind("mousedown", o), K.unbind("mousedown", o), I.unbind("mousedown", t), X = !1)
            }

            function z() {
                F.x1 = F.x2 = F.y1 = F.y2 = void 0, I.css("display", "none"), L.css("display", "none")
            }

            function A() {
                return angular.isUndefined(F.x1) && angular.isUndefined(F.x2) && angular.isUndefined(F.y1) && angular.isUndefined(F.y2)
            }

            function B() {
                return isFinite(F.x1) && isFinite(F.x2) && isFinite(F.y1) && isFinite(F.y2)
            }

            function C(a, b) {
                return D(a.enabled), angular.equals(a, b) || a.enabled != b.enabled || A() ? void 0 : B() ? void l(a.x1, a.y1, a.x2, a.y2) : void console.error("[ERROR]: Selector position value (x1, x2, y1, y2) is not a valid number.")
            }

            function D(a) {
                F.enabled = "boolean" != typeof a ? !0 : a, F.enabled && B() ? (x(), c.css("z-index", 300), I.css("display", "block"), L.css("display", "block")) : F.enabled ? (x(), c.css("z-index", 300), z()) : (y(), c.css("z-index", 100), I.css("display", "none"), L.css("display", "none"))
            }

            function E() {
                var a = document.createElement("canvas"),
                    c = a.getContext("2d"),
                    d = 1 / b.$parent.scale,
                    e = (F.x2 - F.x1) * d,
                    f = (F.y2 - F.y1) * d;
                return a.width = e, a.height = f, c.drawImage(b.$parent.image, F.x1 * d, F.y1 * d, e, f, 0, 0, e, f), a.toDataURL("image/png")
            }
            b.selector = b.selector || {};
            var F = b.selector,
                G = b.aspectRatio;
            b.$watch("aspectRatio", function(a) {
                G = a
            });
            var H = angular.element(document),
                I = angular.element('<div class="mr-box" style="top:0px;left:0px;"><div class="mr-line top"></div><div class="mr-line bottom"></div><div class="mr-line left"></div><div class="mr-line right"></div></div>'),
                J = angular.element('<div class="mr-drag-line n"></div><div class="mr-drag-line s"></div><div class="mr-drag-line w"></div><div class="mr-drag-line e"></div>'),
                K = angular.element('<div class="mr-drag-handle nw"></div><div class="mr-drag-handle n"></div><div class="mr-drag-handle ne"></div><div class="mr-drag-handle w"></div><div class="mr-drag-handle e"></div><div class="mr-drag-handle sw"></div><div class="mr-drag-handle s"></div><div class="mr-drag-handle se"></div>');
            I.append(J).append(K), c.append(I);
            var L = angular.element('<div class="mr-shadow">'),
                M = angular.element('<div class="mr-shadow left">'),
                N = angular.element('<div class="mr-shadow center top">'),
                O = angular.element('<div class="mr-shadow center bottom">'),
                P = angular.element('<div class="mr-shadow right">');
            L.append(M).append(N).append(O).append(P), c.append(L);
            var Q, R, S = !1;
            c.bind("mousedown", i);
            var T, U, V, W;
            J.bind("mousedown", o), K.bind("mousedown", o), I.bind("mousedown", t);
            var X = !0;
            F.clear = z, F.enabled = "boolean" != typeof F.enabled ? !0 : F.enabled;
            var Y = b.$watch("selector", C, !0);
            F.crop = E
        }
    }
    }]);


})();