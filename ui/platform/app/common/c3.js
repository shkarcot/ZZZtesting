! function(a) {
    "use strict";

    function b(a) {
        var b = this.internal = new c(this);
        b.loadConfig(a), b.init(),
            function d(a, b, c) {
                for (var e in a) b[e] = a[e].bind(c), Object.keys(a[e]).length > 0 && d(a[e], b[e], c)
            }(e, this, this)
    }

    function c(b) {
        var c = this;
        c.d3 = a.d3 ? a.d3 : "undefined" != typeof require ? require("d3") : void 0, c.api = b, c.config = c.getDefaultConfig(), c.data = {}, c.cache = {}, c.axes = {}
    }

    function d(a, b) {
        function c(a, b) {
            a.attr("transform", function(a) {
                return "translate(" + Math.ceil(b(a) + s) + ", 0)"
            })
        }

        function d(a, b) {
            a.attr("transform", function(a) {
                return "translate(0," + Math.ceil(b(a)) + ")"
            })
        }

        function e(a) {
            var b = a[0],
                c = a[a.length - 1];
            return c > b ? [b, c] : [c, b]
        }

        function f(a) {
            var b, c, d = [];
            if (a.ticks) return a.ticks.apply(a, k);
            for (c = a.domain(), b = Math.ceil(c[0]); b < c[1]; b++) d.push(b);
            return d.length > 0 && d[0] > 0 && d.unshift(d[0] - (d[1] - d[0])), d
        }

        function g() {
            var a, c = m.copy();
            return b && (a = m.domain(), c.domain([a[0], a[1] - 1])), c
        }

        function h(a) {
            return j ? j(a) : a
        }

        function i(i) {
            i.each(function() {
                function i(a) {
                    var b = m(a) + s;
                    return B[0] < b && b < B[1] ? o : 0
                }
                var j, k, t = a.select(this),
                    u = this.__chart__ || m,
                    v = this.__chart__ = g(),
                    w = r ? r : f(v),
                    x = t.selectAll(".tick").data(w, v),
                    y = x.enter().insert("g", ".domain").attr("class", "tick").style("opacity", 1e-6),
                    z = x.exit().remove(),
                    A = a.transition(x).style("opacity", 1),
                    B = m.rangeExtent ? m.rangeExtent() : e(m.range()),
                    C = t.selectAll(".domain").data([0]),
                    D = (C.enter().append("path").attr("class", "domain"), a.transition(C));
                y.append("line"), y.append("text");
                var E = y.select("line"),
                    F = A.select("line"),
                    G = x.select("text").text(h),
                    H = y.select("text"),
                    I = A.select("text");
                switch (b ? (s = Math.ceil((v(1) - v(0)) / 2), k = l ? 0 : s) : s = k = 0, n) {
                    case "bottom":
                        j = c, E.attr("y2", o), H.attr("y", Math.max(o, 0) + q), F.attr("x1", k).attr("x2", k).attr("y2", i), I.attr("x", 0).attr("y", Math.max(o, 0) + q), G.attr("dy", ".71em").style("text-anchor", "middle"), D.attr("d", "M" + B[0] + "," + p + "V0H" + B[1] + "V" + p);
                        break;
                    case "top":
                        j = c, E.attr("y2", -o), H.attr("y", -(Math.max(o, 0) + q)), F.attr("x2", 0).attr("y2", -o), I.attr("x", 0).attr("y", -(Math.max(o, 0) + q)), G.attr("dy", "0em").style("text-anchor", "middle"), D.attr("d", "M" + B[0] + "," + -p + "V0H" + B[1] + "V" + -p);
                        break;
                    case "left":
                        j = d, E.attr("x2", -o), H.attr("x", -(Math.max(o, 0) + q)), F.attr("x2", -o).attr("y2", 0), I.attr("x", -(Math.max(o, 0) + q)).attr("y", s), G.attr("dy", ".32em").style("text-anchor", "end"), D.attr("d", "M" + -p + "," + B[0] + "H0V" + B[1] + "H" + -p);
                        break;
                    case "right":
                        j = d, E.attr("x2", o), H.attr("x", Math.max(o, 0) + q), F.attr("x2", o).attr("y2", 0), I.attr("x", Math.max(o, 0) + q).attr("y", 0), G.attr("dy", ".32em").style("text-anchor", "start"), D.attr("d", "M" + p + "," + B[0] + "H0V" + B[1] + "H" + p)
                }
                if (v.rangeBand) {
                    var J = v,
                        K = J.rangeBand() / 2;
                    u = v = function(a) {
                        return J(a) + K
                    }
                } else u.rangeBand ? u = v : z.call(j, v);
                y.call(j, u), A.call(j, v)
            })
        }
        var j, k, l, m = a.scale.linear(),
            n = "bottom",
            o = 6,
            p = 6,
            q = 3,
            r = null,
            s = 0,
            t = !0;
        return i.scale = function(a) {
            return arguments.length ? (m = a, i) : m
        }, i.orient = function(a) {
            return arguments.length ? (n = a in {
                top: 1,
                right: 1,
                bottom: 1,
                left: 1
            } ? a + "" : "bottom", i) : n
        }, i.tickFormat = function(a) {
            return arguments.length ? (j = a, i) : j
        }, i.tickCentered = function(a) {
            return arguments.length ? (l = a, i) : l
        }, i.tickOffset = function() {
            return s
        }, i.ticks = function() {
            return arguments.length ? (k = arguments, i) : k
        }, i.tickCulling = function(a) {
            return arguments.length ? (t = a, i) : t
        }, i.tickValues = function(a) {
            if ("function" == typeof a) r = function() {
                return a(m.domain())
            };
            else {
                if (!arguments.length) return r;
                r = a
            }
            return i
        }, i
    }
    var e, f, g = {
        version: "0.3.0"
    };
    g.generate = function(a) {
        return new b(a)
    }, g.chart = {
        fn: b.prototype,
        internal: {
            fn: c.prototype
        }
    }, e = g.chart.fn, f = g.chart.internal.fn, f.init = function() {
        var a = this,
            b = a.config;
        if (a.initParams(), b.data_url) a.convertUrlToData(b.data_url, b.data_mimeType, b.data_keys, a.initWithData);
        else if (b.data_json) a.initWithData(a.convertJsonToData(b.data_json, b.data_keys));
        else if (b.data_rows) a.initWithData(a.convertRowsToData(b.data_rows));
        else {
            if (!b.data_columns) throw Error("url or json or rows or columns is required.");
            a.initWithData(a.convertColumnsToData(b.data_columns))
        }
    }, f.initParams = function() {
        var a = this,
            b = a.d3,
            c = a.config;
        a.clipId = "c3-" + +new Date + "-clip", a.clipIdForXAxis = a.clipId + "-xaxis", a.clipIdForYAxis = a.clipId + "-yaxis", a.clipPath = a.getClipPath(a.clipId), a.clipPathForXAxis = a.getClipPath(a.clipIdForXAxis), a.clipPathForYAxis = a.getClipPath(a.clipIdForYAxis), a.dragStart = null, a.dragging = !1, a.cancelClick = !1, a.mouseover = !1, a.transiting = !1, a.color = a.generateColor(), a.levelColor = a.generateLevelColor(), a.dataTimeFormat = c.data_xLocaltime ? b.time.format : b.time.format.utc, a.axisTimeFormat = c.axis_x_localtime ? b.time.format : b.time.format.utc, a.defaultAxisTimeFormat = a.axisTimeFormat.multi([
            [".%L", function(a) {
                return a.getMilliseconds()
            }],
            [":%S", function(a) {
                return a.getSeconds()
            }],
            ["%I:%M", function(a) {
                return a.getMinutes()
            }],
            ["%I %p", function(a) {
                return a.getHours()
            }],
            ["%-m/%-d", function(a) {
                return a.getDay() && 1 !== a.getDate()
            }],
            ["%-m/%-d", function(a) {
                return 1 !== a.getDate()
            }],
            ["%-m/%-d", function(a) {
                return a.getMonth()
            }],
            ["%Y/%-m/%-d", function() {
                return !0
            }]
        ]), a.hiddenTargetIds = [], a.hiddenLegendIds = [], a.xOrient = c.axis_rotated ? "left" : "bottom", a.yOrient = c.axis_rotated ? "bottom" : "left", a.y2Orient = c.axis_rotated ? "top" : "right", a.subXOrient = c.axis_rotated ? "left" : "bottom", a.isLegendRight = "right" === c.legend_position, a.isLegendInset = "inset" === c.legend_position, a.isLegendTop = "top-left" === c.legend_inset_anchor || "top-right" === c.legend_inset_anchor, a.isLegendLeft = "top-left" === c.legend_inset_anchor || "bottom-left" === c.legend_inset_anchor, a.legendStep = 0, a.legendItemWidth = 0, a.legendItemHeight = 0, a.legendOpacityForHidden = .15, a.currentMaxTickWidth = 0, a.rotated_padding_left = 30, a.rotated_padding_right = c.axis_rotated && !c.axis_x_show ? 0 : 30, a.rotated_padding_top = 5, a.withoutFadeIn = {}, a.axes.subx = b.selectAll([])
    }, f.initWithData = function(b) {
        var c, d = this,
            e = d.d3,
            f = d.config,
            g = !0;
        d.initPie && d.initPie(), d.initBrush && d.initBrush(), d.initZoom && d.initZoom(), d.selectChart = e.select(f.bindto), d.selectChart.empty() && (d.selectChart = e.select(document.createElement("div")).style("opacity", 0), d.observeInserted(d.selectChart), g = !1), d.selectChart.html("").classed("c3", !0), d.data.xs = {}, d.data.targets = d.convertDataToTargets(b), f.data_filter && (d.data.targets = d.data.targets.filter(f.data_filter)), f.data_hide && d.addHiddenTargetIds(f.data_hide === !0 ? d.mapToIds(d.data.targets) : f.data_hide), d.hasType("gauge") && (f.legend_show = !1), d.updateSizes(), d.updateScales(), d.x.domain(e.extent(d.getXDomain(d.data.targets))), d.y.domain(d.getYDomain(d.data.targets, "y")), d.y2.domain(d.getYDomain(d.data.targets, "y2")), d.subX.domain(d.x.domain()), d.subY.domain(d.y.domain()), d.subY2.domain(d.y2.domain()), d.orgXDomain = d.x.domain(), d.brush && d.brush.scale(d.subX), f.zoom_enabled && d.zoom.scale(d.x), d.svg = d.selectChart.append("svg").style("overflow", "hidden").on("mouseenter", function() {
            return f.onmouseover.call(d)
        }).on("mouseleave", function() {
            return f.onmouseout.call(d)
        }), d.defs = d.svg.append("defs"), d.defs.append("clipPath").attr("id", d.clipId).append("rect"), d.defs.append("clipPath").attr("id", d.clipIdForXAxis).append("rect"), d.defs.append("clipPath").attr("id", d.clipIdForYAxis).append("rect"), d.updateSvgSize(), c = d.main = d.svg.append("g").attr("transform", d.getTranslate("main")), d.initSubchart && d.initSubchart(), d.initTooltip && d.initTooltip(), d.initLegend && d.initLegend(), c.append("text").attr("class", h.text + " " + h.empty).attr("text-anchor", "middle").attr("dominant-baseline", "middle"), d.initRegion(), d.initGrid(), c.append("g").attr("clip-path", d.clipPath).attr("class", h.chart), d.initEventRect(), d.initBar && d.initBar(), d.initLine && d.initLine(), d.initArc && d.initArc(), d.initGauge && d.initGauge(), d.initText && d.initText(), c.insert("rect", f.zoom_privileged ? null : "g." + h.regions).attr("class", h.zoomRect).attr("width", d.width).attr("height", d.height).style("opacity", 0).on("dblclick.zoom", null), f.axis_x_default && d.brush.extent(j(f.axis_x_default) ? f.axis_x_default(d.getXDomain()) : f.axis_x_default), d.initAxis(), d.updateTargets(d.data.targets), g && (d.updateDimension(), d.redraw({
            withTransform: !0,
            withUpdateXDomain: !0,
            withUpdateOrgXDomain: !0,
            withTransitionForAxis: !1
        })), null == a.onresize && (a.onresize = d.generateResize()), a.onresize.add && (a.onresize.add(function() {
            f.onresize.call(d)
        }), a.onresize.add(function() {
            d.api.flush()
        }), a.onresize.add(function() {
            f.onresized.call(d)
        })), d.api.element = d.selectChart.node()
    }, f.smoothLines = function(a, b) {
        var c = this;
        "grid" === b && a.each(function() {
            var a = c.d3.select(this),
                b = a.attr("x1"),
                d = a.attr("x2"),
                e = a.attr("y1"),
                f = a.attr("y2");
            a.attr({
                x1: Math.ceil(b),
                x2: Math.ceil(d),
                y1: Math.ceil(e),
                y2: Math.ceil(f)
            })
        })
    }, f.updateSizes = function() {
        var a = this,
            b = a.config,
            c = a.legend ? a.getLegendHeight() : 0,
            d = a.legend ? a.getLegendWidth() : 0,
            e = a.isLegendRight || a.isLegendInset ? 0 : c,
            f = a.hasArcType(),
            g = b.axis_rotated || f ? 0 : a.getHorizontalAxisHeight("x"),
            h = b.subchart_show && !f ? b.subchart_size_height + g : 0;
        a.currentWidth = a.getCurrentWidth(), a.currentHeight = a.getCurrentHeight(), a.margin = b.axis_rotated ? {
            top: a.getHorizontalAxisHeight("y2") + a.getCurrentPaddingTop(),
            right: f ? 0 : a.getCurrentPaddingRight(),
            bottom: a.getHorizontalAxisHeight("y") + e + a.getCurrentPaddingBottom(),
            left: h + (f ? 0 : a.getCurrentPaddingLeft())
        } : {
            top: 4 + a.getCurrentPaddingTop(),
            right: f ? 0 : a.getCurrentPaddingRight(),
            bottom: g + h + e + a.getCurrentPaddingBottom(),
            left: f ? 0 : a.getCurrentPaddingLeft()
        }, a.margin2 = b.axis_rotated ? {
            top: a.margin.top,
            right: 0 / 0,
            bottom: 20 + e,
            left: a.rotated_padding_left
        } : {
            top: a.currentHeight - h - e,
            right: 0 / 0,
            bottom: g + e,
            left: a.margin.left
        }, a.margin3 = {
            top: 0,
            right: 0 / 0,
            bottom: 0,
            left: 0
        }, a.updateSizeForLegend && a.updateSizeForLegend(c, d), a.width = a.currentWidth - a.margin.left - a.margin.right, a.height = a.currentHeight - a.margin.top - a.margin.bottom, a.width < 0 && (a.width = 0), a.height < 0 && (a.height = 0), a.width2 = b.axis_rotated ? a.margin.left - a.rotated_padding_left - a.rotated_padding_right : a.width, a.height2 = b.axis_rotated ? a.height : a.currentHeight - a.margin2.top - a.margin2.bottom, a.width2 < 0 && (a.width2 = 0), a.height2 < 0 && (a.height2 = 0), a.arcWidth = a.width - (a.isLegendRight ? d + 10 : 0), a.arcHeight = a.height - (a.isLegendRight ? 0 : 10), a.updateRadius && a.updateRadius(), a.isLegendRight && f && (a.margin3.left = a.arcWidth / 2 + 1.1 * a.radiusExpanded)
    }, f.updateTargets = function(a) {
        var b = this,
            c = b.config;
        b.updateTargetsForText(a), b.updateTargetsForBar(a), b.updateTargetsForLine(a), b.updateTargetsForArc && b.updateTargetsForArc(a), b.updateTargetsForSubchart && b.updateTargetsForSubchart(a), b.svg.selectAll("." + h.target).filter(function(a) {
            return b.isTargetToShow(a.id)
        }).transition().duration(c.transition_duration).style("opacity", 1)
    }, f.redraw = function(a, b) {
        var c, d, e, f, g, i, j, k, l, m, n, o, p, q, r, t, u, v, w, x, y, z, A = this,
            B = A.main,
            C = A.d3,
            D = A.config,
            E = A.getShapeIndices(A.isAreaType),
            F = A.getShapeIndices(A.isBarType),
            G = A.getShapeIndices(A.isLineType),
            H = A.hasArcType(),
            I = A.filterTargetsToShow(A.data.targets),
            J = A.xv.bind(A),
            K = (A.config.axis_rotated ? A.circleY : A.circleX).bind(A),
            L = (A.config.axis_rotated ? A.circleX : A.circleY).bind(A);
        if (a = a || {}, c = s(a, "withY", !0), d = s(a, "withSubchart", !0), e = s(a, "withTransition", !0), i = s(a, "withTransform", !1), j = s(a, "withUpdateXDomain", !1), k = s(a, "withUpdateOrgXDomain", !1), l = s(a, "withLegend", !1), f = s(a, "withTransitionForExit", e), g = s(a, "withTransitionForAxis", e), r = e ? D.transition_duration : 0, t = f ? r : 0, u = g ? r : 0, b = b || A.generateAxisTransitions(u), l && D.legend_show && A.updateLegend(A.mapToIds(A.data.targets), a, b), A.isCategorized() && 0 === I.length && A.x.domain([0, A.axes.x.selectAll(".tick").size()]), I.length ? (A.updateXDomain(I, j, k), D.axis_x_tick_values || !D.axis_x_tick_fit && !D.axis_x_tick_count || (x = A.generateTickValues(A.mapTargetsToUniqueXs(I), D.axis_x_tick_count), A.xAxis.tickValues(x), A.subXAxis.tickValues(x))) : (A.xAxis.tickValues([]), A.subXAxis.tickValues([])), A.y.domain(A.getYDomain(I, "y")), A.y2.domain(A.getYDomain(I, "y2")), A.redrawAxis(b, H), A.updateAxisLabels(e), j && I.length)
            if (D.axis_x_tick_culling && x) {
                for (y = 1; y < x.length; y++)
                    if (x.length / y < D.axis_x_tick_culling_max) {
                        z = y;
                        break
                    }
                A.svg.selectAll("." + h.axisX + " .tick text").each(function(a) {
                    var b = x.indexOf(a);
                    b >= 0 && C.select(this).style("display", b % z ? "none" : "block")
                })
            } else A.svg.selectAll("." + h.axisX + " .tick text").style("display", "block");
            !D.axis_rotated && D.axis_x_tick_rotate && A.rotateTickText(A.axes.x, b.axisX, D.axis_x_tick_rotate), m = A.generateDrawArea ? A.generateDrawArea(E, !1) : void 0, n = A.generateDrawBar ? A.generateDrawBar(F) : void 0, o = A.generateDrawLine ? A.generateDrawLine(G, !1) : void 0, p = A.generateXYForText(F, !0), q = A.generateXYForText(F, !1), A.subY.domain(A.y.domain()), A.subY2.domain(A.y2.domain()), A.tooltip.style("display", "none"), A.updateXgridFocus(), B.select("text." + h.text + "." + h.empty).attr("x", A.width / 2).attr("y", A.height / 2).text(D.data_empty_label_text).transition().style("opacity", I.length ? 0 : 1), A.redrawGrid(r, c), A.redrawRegion(r), A.redrawBar(t), A.redrawLine(t), A.redrawArea(t), D.point_show && A.redrawCircle(), A.hasDataLabel() && A.redrawText(t), A.redrawArc && A.redrawArc(r, t, i), A.redrawSubchart && A.redrawSubchart(d, b, r, t, E, F, G), B.selectAll("." + h.selectedCircles).filter(A.isBarType.bind(A)).selectAll("circle").remove(), D.interaction_enabled && A.redrawEventRect(), C.transition().duration(r).each(function() {
            var b = [];
            A.addTransitionForBar(b, n), A.addTransitionForLine(b, o), A.addTransitionForArea(b, m), D.point_show && A.addTransitionForCircle(b, K, L), A.addTransitionForText(b, p, q, a.flow), A.addTransitionForRegion(b), A.addTransitionForGrid(b), a.flow && (v = A.generateWait(), b.forEach(function(a) {
                v.add(a)
            }), w = A.generateFlow({
                targets: I,
                flow: a.flow,
                duration: r,
                drawBar: n,
                drawLine: o,
                drawArea: m,
                cx: K,
                cy: L,
                xv: J,
                xForText: p,
                yForText: q
            }))
        }).call(v || function() {}, w || function() {}), A.mapToIds(A.data.targets).forEach(function(a) {
            A.withoutFadeIn[a] = !0
        }), A.updateZoom && A.updateZoom()
    }, f.updateAndRedraw = function(a) {
        var b, c = this,
            d = c.config;
        a = a || {}, a.withTransition = s(a, "withTransition", !0), a.withTransform = s(a, "withTransform", !1), a.withLegend = s(a, "withLegend", !1), a.withUpdateXDomain = !0, a.withUpdateOrgXDomain = !0, a.withTransitionForExit = !1, a.withTransitionForTransform = s(a, "withTransitionForTransform", a.withTransition), c.updateSizes(), a.withLegend && d.legend_show || (b = c.generateAxisTransitions(a.withTransitionForAxis ? d.transition_duration : 0), c.updateScales(), c.updateSvgSize(), c.transformAll(a.withTransitionForTransform, b)), c.redraw(a, b)
    }, f.isTimeSeries = function() {
        return "timeseries" === this.config.axis_x_type
    }, f.isCategorized = function() {
        return this.config.axis_x_type.indexOf("categor") >= 0
    }, f.isCustomX = function() {
        var a = this,
            b = a.config;
        return !a.isTimeSeries() && (b.data_x || r(b.data_xs))
    }, f.getTranslate = function(a) {
        var b, c, d = this,
            e = d.config;
        return "main" === a ? (b = o(d.margin.left), c = o(d.margin.top)) : "context" === a ? (b = o(d.margin2.left), c = o(d.margin2.top)) : "legend" === a ? (b = d.margin3.left, c = d.margin3.top) : "x" === a ? (b = 0, c = e.axis_rotated ? 0 : d.height) : "y" === a ? (b = 0, c = e.axis_rotated ? d.height : 0) : "y2" === a ? (b = e.axis_rotated ? 0 : d.width, c = e.axis_rotated ? 1 : 0) : "subx" === a ? (b = 0, c = e.axis_rotated ? 0 : d.height2) : "arc" === a && (b = d.arcWidth / 2, c = d.arcHeight / 2), "translate(" + b + "," + c + ")"
    }, f.initialOpacity = function(a) {
        return null !== a.value && this.withoutFadeIn[a.id] ? 1 : 0
    }, f.opacityForCircle = function(a) {
        var b = this;
        return i(a.value) ? b.isScatterType(a) ? .5 : 1 : 0
    }, f.opacityForText = function() {
        return this.hasDataLabel() ? 1 : 0
    }, f.xx = function(a) {
        return a ? this.x(a.x) : null
    }, f.xv = function(a) {
        var b = this;
        return Math.ceil(b.x(b.isTimeSeries() ? b.parseDate(a.value) : a.value))
    }, f.yv = function(a) {
        var b = this,
            c = a.axis && "y2" === a.axis ? b.y2 : b.y;
        return Math.ceil(c(a.value))
    }, f.subxx = function(a) {
        return a ? this.subX(a.x) : null
    }, f.transformMain = function(a, b) {
        var c, d, e, f = this;
        b && b.axisX ? c = b.axisX : (c = f.main.select("." + h.axisX), a && (c = c.transition())), b && b.axisY ? d = b.axisY : (d = f.main.select("." + h.axisY), a && (d = d.transition())), b && b.axisY2 ? e = b.axisY2 : (e = f.main.select("." + h.axisY2), a && (e = e.transition())), (a ? f.main.transition() : f.main).attr("transform", f.getTranslate("main")), c.attr("transform", f.getTranslate("x")), d.attr("transform", f.getTranslate("y")), e.attr("transform", f.getTranslate("y2")), f.main.select("." + h.chartArcs).attr("transform", f.getTranslate("arc"))
    }, f.transformAll = function(a, b) {
        var c = this;
        c.transformMain(a, b), c.config.subchart_show && c.transformContext(a, b), c.legend && c.transformLegend(a)
    }, f.updateSvgSize = function() {
        var a = this;
        a.svg.attr("width", a.currentWidth).attr("height", a.currentHeight), a.svg.select("#" + a.clipId).select("rect").attr("width", a.width).attr("height", a.height), a.svg.select("#" + a.clipIdForXAxis).select("rect").attr("x", a.getXAxisClipX.bind(a)).attr("y", a.getXAxisClipY.bind(a)).attr("width", a.getXAxisClipWidth.bind(a)).attr("height", a.getXAxisClipHeight.bind(a)), a.svg.select("#" + a.clipIdForYAxis).select("rect").attr("x", a.getYAxisClipX.bind(a)).attr("y", a.getYAxisClipY.bind(a)).attr("width", a.getYAxisClipWidth.bind(a)).attr("height", a.getYAxisClipHeight.bind(a)), a.svg.select("." + h.zoomRect).attr("width", a.width).attr("height", a.height), a.selectChart.style("max-height", a.currentHeight + "px")
    }, f.updateDimension = function() {
        var a = this;
        a.config.axis_rotated ? (a.axes.x.call(a.xAxis), a.axes.subx.call(a.subXAxis)) : (a.axes.y.call(a.yAxis), a.axes.y2.call(a.y2Axis)), a.updateSizes(), a.updateScales(), a.updateSvgSize(), a.transformAll(!1)
    }, f.observeInserted = function(b) {
        var c = this,
            d = new MutationObserver(function(e) {
                e.forEach(function(e) {
                    if ("childList" === e.type && e.previousSibling) {
                        d.disconnect();
                        var f = a.setInterval(function() {
                            b.node().parentNode && (a.clearInterval(f), c.updateDimension(), c.redraw({
                                withTransform: !0,
                                withUpdateXDomain: !0,
                                withUpdateOrgXDomain: !0,
                                withTransition: !1,
                                withTransitionForTransform: !1,
                                withLegend: !0
                            }), b.transition().style("opacity", 1))
                        }, 10)
                    }
                })
            });
        d.observe(b.node(), {
            attributes: !0,
            childList: !0,
            characterData: !0
        })
    }, f.generateResize = function() {
        function a() {
            b.forEach(function(a) {
                a()
            })
        }
        var b = [];
        return a.add = function(a) {
            b.push(a)
        }, a
    }, f.endall = function(a, b) {
        var c = 0;
        a.each(function() {
            ++c
        }).each("end", function() {
            --c || b.apply(this, arguments)
        })
    }, f.generateWait = function() {
        var a = [],
            b = function(b, c) {
                var d = setInterval(function() {
                    var b = 0;
                    a.forEach(function(a) {
                        if (a.empty()) return void(b += 1);
                        try {
                            a.transition()
                        } catch (c) {
                            b += 1
                        }
                    }), b === a.length && (clearInterval(d), c && c())
                }, 10)
            };
        return b.add = function(b) {
            a.push(b)
        }, b
    }, f.parseDate = function(b) {
        var c, d = this;
        return c = b instanceof Date ? b : "number" == typeof b ? new Date(b) : d.dataTimeFormat(d.config.data_xFormat).parse(b), (!c || isNaN(+c)) && a.console.error("Failed to parse x '" + b + "' to Date object"), c
    }, f.getDefaultConfig = function() {
        var a = {
            bindto: "#chart",
            size_width: void 0,
            size_height: void 0,
            padding_left: void 0,
            padding_right: void 0,
            padding_top: void 0,
            padding_bottom: void 0,
            zoom_enabled: !1,
            zoom_extent: void 0,
            zoom_privileged: !1,
            zoom_onzoom: function() {},
            interaction_enabled: !0,
            onmouseover: function() {},
            onmouseout: function() {},
            onresize: function() {},
            onresized: function() {},
            transition_duration: 350,
            data_x: void 0,
            data_xs: {},
            data_xFormat: "%Y-%m-%d",
            data_xLocaltime: !0,
            data_idConverter: function(a) {
                return a
            },
            data_names: {},
            data_classes: {},
            data_groups: [],
            data_axes: {},
            data_type: void 0,
            data_types: {},
            data_labels: {},
            data_order: "desc",
            data_regions: {},
            data_color: void 0,
            data_colors: {},
            data_hide: !1,
            data_filter: void 0,
            data_selection_enabled: !1,
            data_selection_grouped: !1,
            data_selection_isselectable: function() {
                return !0
            },
            data_selection_multiple: !0,
            data_onclick: function() {},
            data_onmouseover: function() {},
            data_onmouseout: function() {},
            data_onselected: function() {},
            data_onunselected: function() {},
            data_ondragstart: function() {},
            data_ondragend: function() {},
            data_url: void 0,
            data_json: void 0,
            data_rows: void 0,
            data_columns: void 0,
            data_mimeType: void 0,
            data_keys: void 0,
            data_empty_label_text: "",
            subchart_show: !1,
            subchart_size_height: 60,
            subchart_onbrush: function() {},
            color_pattern: [],
            color_threshold: {},
            legend_show: !0,
            legend_position: "bottom",
            legend_inset_anchor: "top-left",
            legend_inset_x: 10,
            legend_inset_y: 0,
            legend_inset_step: void 0,
            legend_item_onclick: void 0,
            legend_item_onmouseover: void 0,
            legend_item_onmouseout: void 0,
            legend_equally: !1,
            axis_rotated: !1,
            axis_x_show: !0,
            axis_x_type: "indexed",
            axis_x_localtime: !0,
            axis_x_categories: [],
            axis_x_tick_centered: !1,
            axis_x_tick_format: void 0,
            axis_x_tick_culling: {},
            axis_x_tick_culling_max: 10,
            axis_x_tick_count: void 0,
            axis_x_tick_fit: !0,
            axis_x_tick_values: null,
            axis_x_tick_rotate: void 0,
            axis_x_tick_outer: !0,
            axis_x_max: null,
            axis_x_min: null,
            axis_x_padding: {},
            axis_x_height: void 0,
            axis_x_default: void 0,
            axis_x_label: {},
            axis_y_show: !0,
            axis_y_max: void 0,
            axis_y_min: void 0,
            axis_y_center: void 0,
            axis_y_label: {},
            axis_y_tick_format: void 0,
            axis_y_tick_outer: !0,
            axis_y_padding: void 0,
            axis_y_ticks: 10,
            axis_y2_show: !1,
            axis_y2_max: void 0,
            axis_y2_min: void 0,
            axis_y2_center: void 0,
            axis_y2_label: {},
            axis_y2_tick_format: void 0,
            axis_y2_tick_outer: !0,
            axis_y2_padding: void 0,
            axis_y2_ticks: 10,
            grid_x_show: !1,
            grid_x_type: "tick",
            grid_x_lines: [],
            grid_y_show: !1,
            grid_y_lines: [],
            grid_y_ticks: 10,
            grid_focus_show: !0,
            point_show: !0,
            point_r: 2.5,
            point_focus_expand_enabled: !0,
            point_focus_expand_r: void 0,
            point_select_r: void 0,
            line_connect_null: !1,
            bar_width: void 0,
            bar_width_ratio: .6,
            bar_width_max: void 0,
            bar_zerobased: !0,
            area_zerobased: !0,
            pie_label_show: !0,
            pie_label_format: void 0,
            pie_label_threshold: .05,
            pie_sort: !0,
            pie_expand: !0,
            gauge_label_show: !0,
            gauge_label_format: void 0,
            gauge_expand: !0,
            gauge_min: 0,
            gauge_max: 100,
            gauge_units: void 0,
            gauge_width: void 0,
            donut_label_show: !0,
            donut_label_format: void 0,
            donut_label_threshold: .05,
            donut_width: void 0,
            donut_sort: !0,
            donut_expand: !0,
            donut_title: "",
            regions: [],
            tooltip_show: !0,
            tooltip_grouped: !0,
            tooltip_format_title: void 0,
            tooltip_format_name: void 0,
            tooltip_format_value: void 0,
            tooltip_contents: function(a, b, c, d) {
                return this.getTooltipContent ? this.getTooltipContent(a, b, c, d) : ""
            },
            tooltip_init_show: !1,
            tooltip_init_x: 0,
            tooltip_init_position: {
                top: "0px",
                left: "50px"
            }
        };
        return Object.keys(this.additionalConfig).forEach(function(b) {
            a[b] = this.additionalConfig[b]
        }, this), a
    }, f.additionalConfig = {}, f.loadConfig = function(a) {
        function b() {
            var a = d.shift();
            return a && c && "object" == typeof c && a in c ? (c = c[a], b()) : a ? void 0 : c
        }
        var c, d, e, f = this.config;
        Object.keys(f).forEach(function(g) {
            c = a, d = g.split("_"), e = b(), m(e) && (f[g] = e)
        })
    }, f.getScale = function(a, b, c) {
        return (c ? this.d3.time.scale() : this.d3.scale.linear()).range([a, b])
    }, f.getX = function(a, b, c, d) {
        var e, f = this,
            g = f.getScale(a, b, f.isTimeSeries()),
            h = c ? g.domain(c) : g;
        f.isCategorized() ? (d = d || function() {
            return 0
        }, g = function(a, b) {
            var c = h(a) + d(a);
            return b ? c : Math.ceil(c)
        }) : g = function(a, b) {
            var c = h(a);
            return b ? c : Math.ceil(c)
        };
        for (e in h) g[e] = h[e];
        return g.orgDomain = function() {
            return h.domain()
        }, f.isCategorized() && (g.domain = function(a) {
            return arguments.length ? (h.domain(a), g) : (a = this.orgDomain(), [a[0], a[1] + 1])
        }), g
    }, f.getY = function(a, b, c) {
        var d = this.getScale(a, b);
        return c && d.domain(c), d
    }, f.getYScale = function(a) {
        return "y2" === this.getAxisId(a) ? this.y2 : this.y
    }, f.getSubYScale = function(a) {
        return "y2" === this.getAxisId(a) ? this.subY2 : this.subY
    }, f.updateScales = function() {
        var a = this,
            b = a.config,
            c = !a.x;
        a.xMin = b.axis_rotated ? 1 : 0, a.xMax = b.axis_rotated ? a.height : a.width, a.yMin = b.axis_rotated ? 0 : a.height, a.yMax = b.axis_rotated ? a.width : 1, a.subXMin = a.xMin, a.subXMax = a.xMax, a.subYMin = b.axis_rotated ? 0 : a.height2, a.subYMax = b.axis_rotated ? a.width2 : 1, a.x = a.getX(a.xMin, a.xMax, c ? void 0 : a.x.orgDomain(), function() {
            return a.xAxis.tickOffset()
        }), a.y = a.getY(a.yMin, a.yMax, c ? void 0 : a.y.domain()), a.y2 = a.getY(a.yMin, a.yMax, c ? void 0 : a.y2.domain()), a.subX = a.getX(a.xMin, a.xMax, a.orgXDomain, function(b) {
            return b % 1 ? 0 : a.subXAxis.tickOffset()
        }), a.subY = a.getY(a.subYMin, a.subYMax, c ? void 0 : a.subY.domain()), a.subY2 = a.getY(a.subYMin, a.subYMax, c ? void 0 : a.subY2.domain()), a.xAxisTickFormat = a.getXAxisTickFormat(), a.xAxisTickValues = b.axis_x_tick_values ? b.axis_x_tick_values : c ? void 0 : a.xAxis.tickValues(), a.xAxis = a.getXAxis(a.x, a.xOrient, a.xAxisTickFormat, a.xAxisTickValues), a.subXAxis = a.getXAxis(a.subX, a.subXOrient, a.xAxisTickFormat, a.xAxisTickValues), a.yAxis = a.getYAxis(a.y, a.yOrient, b.axis_y_tick_format, b.axis_y_ticks), a.y2Axis = a.getYAxis(a.y2, a.y2Orient, b.axis_y2_tick_format, b.axis_y2_ticks), c || (a.brush && a.brush.scale(a.subX), b.zoom_enabled && a.zoom.scale(a.x)), a.updateArc && a.updateArc()
    }, f.getYDomainMin = function(a) {
        var b, c, d, e, f, g, h = this,
            i = h.config,
            j = h.mapToIds(a),
            k = h.getValuesAsIdKeyed(a);
        if (i.data_groups.length > 0)
            for (g = h.hasNegativeValueInTargets(a), b = 0; b < i.data_groups.length; b++)
                if (e = i.data_groups[b].filter(function(a) {
                        return j.indexOf(a) >= 0
                    }), 0 !== e.length)
                    for (d = e[0], g && k[d] && k[d].forEach(function(a, b) {
                            k[d][b] = 0 > a ? a : 0
                        }), c = 1; c < e.length; c++) f = e[c], k[f] && k[f].forEach(function(a, b) {
                        h.getAxisId(f) !== h.getAxisId(d) || !k[d] || g && +a > 0 || (k[d][b] += +a)
                    });
        return h.d3.min(Object.keys(k).map(function(a) {
            return h.d3.min(k[a])
        }))
    }, f.getYDomainMax = function(a) {
        var b, c, d, e, f, g, h = this,
            i = h.config,
            j = h.mapToIds(a),
            k = h.getValuesAsIdKeyed(a);
        if (i.data_groups.length > 0)
            for (g = h.hasPositiveValueInTargets(a), b = 0; b < i.data_groups.length; b++)
                if (e = i.data_groups[b].filter(function(a) {
                        return j.indexOf(a) >= 0
                    }), 0 !== e.length)
                    for (d = e[0], g && k[d] && k[d].forEach(function(a, b) {
                            k[d][b] = a > 0 ? a : 0
                        }), c = 1; c < e.length; c++) f = e[c], k[f] && k[f].forEach(function(a, b) {
                        h.getAxisId(f) !== h.getAxisId(d) || !k[d] || g && 0 > +a || (k[d][b] += +a)
                    });
        return h.d3.max(Object.keys(k).map(function(a) {
            return h.d3.max(k[a])
        }))
    }, f.getYDomain = function(a, b) {
        var c, d, e, f, g, h, j, k, l, m, n = this,
            o = n.config,
            q = a.filter(function(a) {
                return n.getAxisId(a.id) === b
            }),
            r = "y2" === b ? o.axis_y2_min : o.axis_y_min,
            s = "y2" === b ? o.axis_y2_max : o.axis_y_max,
            t = i(r) ? r : n.getYDomainMin(q),
            u = i(s) ? s : n.getYDomainMax(q),
            v = "y2" === b ? o.axis_y2_center : o.axis_y_center,
            w = n.hasType("bar", q) && o.bar_zerobased || n.hasType("area", q) && o.area_zerobased,
            x = n.hasDataLabel() && o.axis_rotated,
            y = n.hasDataLabel() && !o.axis_rotated;
        return 0 === q.length ? "y2" === b ? n.y2.domain() : n.y.domain() : (t === u && (0 > t ? u = 0 : t = 0), l = t >= 0 && u >= 0, m = 0 >= t && 0 >= u, w && (l && (t = 0), m && (u = 0)), c = Math.abs(u - t), d = e = f = .1 * c, v && (g = Math.max(Math.abs(t), Math.abs(u)), u = g - v, t = v - g), x ? (h = n.getDataLabelLength(t, u, b, "width"), j = p(n.y.range()), k = [h[0] / j, h[1] / j], e += c * (k[1] / (1 - k[0] - k[1])), f += c * (k[0] / (1 - k[0] - k[1]))) : y && (h = n.getDataLabelLength(t, u, b, "height"), e += h[1], f += h[0]), "y" === b && o.axis_y_padding && (e = n.getAxisPadding(o.axis_y_padding, "top", d, c), f = n.getAxisPadding(o.axis_y_padding, "bottom", d, c)), "y2" === b && o.axis_y2_padding && (e = n.getAxisPadding(o.axis_y2_padding, "top", d, c), f = n.getAxisPadding(o.axis_y2_padding, "bottom", d, c)), w && (l && (f = t), m && (e = -u)), [t - f, u + e])
    }, f.getXDomainMin = function(a) {
        var b = this,
            c = b.config;
        return c.axis_x_min ? b.isTimeSeries() ? this.parseDate(c.axis_x_min) : c.axis_x_min : b.d3.min(a, function(a) {
            return b.d3.min(a.values, function(a) {
                return a.x
            })
        })
    }, f.getXDomainMax = function(a) {
        var b = this,
            c = b.config;
        return c.axis_x_max ? b.isTimeSeries() ? this.parseDate(c.axis_x_max) : c.axis_x_max : b.d3.max(a, function(a) {
            return b.d3.max(a.values, function(a) {
                return a.x
            })
        })
    }, f.getXDomainPadding = function(a) {
        var b, c, d, e, f = this,
            g = f.config,
            h = this.getEdgeX(a),
            j = h[1] - h[0];
        return f.isCategorized() ? c = 0 : f.hasType("bar", a) ? (b = f.getMaxDataCount(), c = b > 1 ? j / (b - 1) / 2 : .5) : c = .01 * j, "object" == typeof g.axis_x_padding && r(g.axis_x_padding) ? (d = i(g.axis_x_padding.left) ? g.axis_x_padding.left : c, e = i(g.axis_x_padding.right) ? g.axis_x_padding.right : c) : d = e = "number" == typeof g.axis_x_padding ? g.axis_x_padding : c, {
            left: d,
            right: e
        }
    }, f.getXDomain = function(a) {
        var b = this,
            c = [b.getXDomainMin(a), b.getXDomainMax(a)],
            d = c[0],
            e = c[1],
            f = b.getXDomainPadding(a),
            g = 0,
            h = 0;
        return d - e !== 0 || b.isCategorized() || (d = b.isTimeSeries() ? new Date(.5 * d.getTime()) : -.5, e = b.isTimeSeries() ? new Date(1.5 * e.getTime()) : .5), (d || 0 === d) && (g = b.isTimeSeries() ? new Date(d.getTime() - f.left) : d - f.left), (e || 0 === e) && (h = b.isTimeSeries() ? new Date(e.getTime() + f.right) : e + f.right), [g, h]
    }, f.updateXDomain = function(a, b, c, d) {
        var e = this,
            f = e.config;
        return c && (e.x.domain(d ? d : e.d3.extent(e.getXDomain(a))), e.orgXDomain = e.x.domain(), f.zoom_enabled && e.zoom.scale(e.x).updateScaleExtent(), e.subX.domain(e.x.domain()), e.brush && e.brush.scale(e.subX)), b && (e.x.domain(d ? d : !e.brush || e.brush.empty() ? e.orgXDomain : e.brush.extent()), f.zoom_enabled && e.zoom.scale(e.x).updateScaleExtent()), e.x.domain()
    }, f.isX = function(a) {
        var b = this,
            c = b.config;
        return c.data_x && a === c.data_x || r(c.data_xs) && t(c.data_xs, a)
    }, f.isNotX = function(a) {
        return !this.isX(a)
    }, f.getXKey = function(a) {
        var b = this,
            c = b.config;
        return c.data_x ? c.data_x : r(c.data_xs) ? c.data_xs[a] : null
    }, f.getXValuesOfXKey = function(a, b) {
        var c, d = this,
            e = b && r(b) ? d.mapToIds(b) : [];
        return e.forEach(function(b) {
            d.getXKey(b) === a && (c = d.data.xs[b])
        }), c
    }, f.getXValue = function(a, b) {
        var c = this;
        return a in c.data.xs && c.data.xs[a] && i(c.data.xs[a][b]) ? c.data.xs[a][b] : b
    }, f.getOtherTargetXs = function() {
        var a = this,
            b = Object.keys(a.data.xs);
        return b.length ? a.data.xs[b[0]] : null
    }, f.getOtherTargetX = function(a) {
        var b = this.getOtherTargetXs();
        return b && a < b.length ? b[a] : null
    }, f.addXs = function(a) {
        var b = this;
        Object.keys(a).forEach(function(c) {
            b.config.data_xs[c] = a[c]
        })
    }, f.hasMultipleX = function(a) {
        return this.d3.set(Object.keys(a).map(function(b) {
            return a[b]
        })).size() > 1
    }, f.isMultipleX = function() {
        var a = this,
            b = a.config;
        return r(b.data_xs) && a.hasMultipleX(b.data_xs)
    }, f.addName = function(a) {
        var b, c = this;
        return a && (b = c.config.data_names[a.id], a.name = b ? b : a.id), a
    }, f.getValueOnIndex = function(a, b) {
        var c = a.filter(function(a) {
            return a.index === b
        });
        return c.length ? c[0] : null
    }, f.updateTargetX = function(a, b) {
        var c = this;
        a.forEach(function(a) {
            a.values.forEach(function(d, e) {
                d.x = c.generateTargetX(b[e], a.id, e)
            }), c.data.xs[a.id] = b
        })
    }, f.updateTargetXs = function(a, b) {
        var c = this;
        a.forEach(function(a) {
            b[a.id] && c.updateTargetX([a], b[a.id])
        })
    }, f.generateTargetX = function(a, b, c) {
        var d, e = this;
        return d = e.isTimeSeries() ? e.parseDate(a ? a : e.getXValue(b, c)) : e.isCustomX() && !e.isCategorized() ? i(a) ? +a : e.getXValue(b, c) : c
    }, f.cloneTarget = function(a) {
        return {
            id: a.id,
            id_org: a.id_org,
            values: a.values.map(function(a) {
                return {
                    x: a.x,
                    value: a.value,
                    id: a.id
                }
            })
        }
    }, f.getPrevX = function(a) {
        var b = this,
            c = b.getValueOnIndex(b.data.targets[0].values, a - 1);
        return c ? c.x : null
    }, f.getNextX = function(a) {
        var b = this,
            c = b.getValueOnIndex(b.data.targets[0].values, a + 1);
        return c ? c.x : null
    }, f.getMaxDataCount = function() {
        var a = this;
        return a.d3.max(a.data.targets, function(a) {
            return a.values.length
        })
    }, f.getMaxDataCountTarget = function(a) {
        var b, c = a.length,
            d = 0;
        return c > 1 ? a.forEach(function(a) {
            a.values.length > d && (b = a, d = a.values.length)
        }) : b = c ? a[0] : null, b
    }, f.getEdgeX = function(a) {
        var b, c, d = this.getMaxDataCountTarget(a);
        return d ? (b = d.values[0], c = d.values[d.values.length - 1], [b.x, c.x]) : [0, 0]
    }, f.mapToIds = function(a) {
        return a.map(function(a) {
            return a.id
        })
    }, f.mapToTargetIds = function(a) {
        var b = this;
        return a ? k(a) ? [a] : a : b.mapToIds(b.data.targets)
    }, f.hasTarget = function(a, b) {
        var c, d = this.mapToIds(a);
        for (c = 0; c < d.length; c++)
            if (d[c] === b) return !0;
        return !1
    }, f.isTargetToShow = function(a) {
        return this.hiddenTargetIds.indexOf(a) < 0
    }, f.isLegendToShow = function(a) {
        return this.hiddenLegendIds.indexOf(a) < 0
    }, f.filterTargetsToShow = function(a) {
        var b = this;
        return a.filter(function(a) {
            return b.isTargetToShow(a.id)
        })
    }, f.mapTargetsToUniqueXs = function(a) {
        var b = this,
            c = b.d3.set(b.d3.merge(a.map(function(a) {
                return a.values.map(function(a) {
                    return a.x
                })
            }))).values();
        return c.map(b.isTimeSeries() ? function(a) {
            return new Date(a)
        } : function(a) {
            return +a
        })
    }, f.addHiddenTargetIds = function(a) {
        this.hiddenTargetIds = this.hiddenTargetIds.concat(a)
    }, f.removeHiddenTargetIds = function(a) {
        this.hiddenTargetIds = this.hiddenTargetIds.filter(function(b) {
            return a.indexOf(b) < 0
        })
    }, f.addHiddenLegendIds = function(a) {
        this.hiddenLegendIds = this.hiddenLegendIds.concat(a)
    }, f.removeHiddenLegendIds = function(a) {
        this.hiddenLegendIds = this.hiddenLegendIds.filter(function(b) {
            return a.indexOf(b) < 0
        })
    }, f.getValuesAsIdKeyed = function(a) {
        var b = {};
        return a.forEach(function(a) {
            b[a.id] = [], a.values.forEach(function(c) {
                b[a.id].push(c.value)
            })
        }), b
    }, f.checkValueInTargets = function(a, b) {
        var c, d, e, f = Object.keys(a);
        for (c = 0; c < f.length; c++)
            for (e = a[f[c]].values, d = 0; d < e.length; d++)
                if (b(e[d].value)) return !0;
        return !1
    }, f.hasNegativeValueInTargets = function(a) {
        return this.checkValueInTargets(a, function(a) {
            return 0 > a
        })
    }, f.hasPositiveValueInTargets = function(a) {
        return this.checkValueInTargets(a, function(a) {
            return a > 0
        })
    }, f.isOrderDesc = function() {
        var a = this.config;
        return a.data_order && "desc" === a.data_order.toLowerCase()
    }, f.isOrderAsc = function() {
        var a = this.config;
        return a.data_order && "asc" === a.data_order.toLowerCase()
    }, f.orderTargets = function(a) {
        var b = this,
            c = b.config,
            d = b.isOrderAsc(),
            e = b.isOrderDesc();
        return d || e ? a.sort(function(a, b) {
            var c = function(a, b) {
                    return a + Math.abs(b.value)
                },
                e = a.values.reduce(c, 0),
                f = b.values.reduce(c, 0);
            return d ? f - e : e - f
        }) : j(c.data_order) && a.sort(c.data_order), a
    }, f.filterSameX = function(a, b) {
        return this.d3.merge(a.map(function(a) {
            return a.values
        })).filter(function(a) {
            return a.x - b === 0
        })
    }, f.filterRemoveNull = function(a) {
        return a.filter(function(a) {
            return i(a.value)
        })
    }, f.hasDataLabel = function() {
        var a = this.config;
        return "boolean" == typeof a.data_labels && a.data_labels ? !0 : "object" == typeof a.data_labels && r(a.data_labels) ? !0 : !1
    }, f.getDataLabelLength = function(a, b, c, d) {
        var e = this,
            f = [0, 0],
            g = 1.3;
        return e.selectChart.select("svg").selectAll(".dummy").data([a, b]).enter().append("text").text(function(a) {
            return e.formatByAxisId(c)(a)
        }).each(function(a, b) {
            f[b] = this.getBoundingClientRect()[d] * g
        }).remove(), f
    }, f.isNoneArc = function(a) {
        return this.hasTarget(this.data.targets, a.id)
    }, f.isArc = function(a) {
        return "data" in a && this.hasTarget(this.data.targets, a.data.id)
    }, f.findSameXOfValues = function(a, b) {
        var c, d = a[b].x,
            e = [];
        for (c = b - 1; c >= 0 && d === a[c].x; c--) e.push(a[c]);
        for (c = b; c < a.length && d === a[c].x; c++) e.push(a[c]);
        return e
    }, f.findClosestOfValues = function(a, b, c, d) {
        var e, f = this,
            g = c ? c : 0,
            h = d ? d : a.length - 1,
            i = Math.floor((h - g) / 2) + g,
            j = a[i],
            k = f.x(j.x) - b[f.config.axis_rotated ? 1 : 0];
        return k > 0 ? h = i : g = i, h - g === 1 || 0 === g && 0 === h ? (e = [], (a[g].x || 0 === a[g].x) && (e = e.concat(f.findSameXOfValues(a, g))), (a[h].x || 0 === a[h].x) && (e = e.concat(f.findSameXOfValues(a, h))), f.findClosest(e, b)) : f.findClosestOfValues(a, b, g, h)
    }, f.findClosestFromTargets = function(a, b) {
        var c, d = this;
        return c = a.map(function(a) {
            return d.findClosestOfValues(a.values, b)
        }), d.findClosest(c, b)
    }, f.findClosest = function(a, b) {
        var c, d, e = this;
        return a.forEach(function(a) {
            var f = e.dist(a, b);
            (c > f || !c) && (c = f, d = a)
        }), d
    }, f.dist = function(a, b) {
        var c = this,
            d = c.config,
            e = "y" === c.getAxisId(a.id) ? c.y : c.y2,
            f = d.axis_rotated ? 1 : 0,
            g = d.axis_rotated ? 0 : 1;
        return Math.pow(c.x(a.x) - b[f], 2) + Math.pow(e(a.value) - b[g], 2)
    }, f.convertUrlToData = function(a, b, c, d) {
        var e = this,
            f = b ? b : "csv";
        e.d3.xhr(a, function(a, b) {
            var g;
            g = "json" === f ? e.convertJsonToData(JSON.parse(b.response), c) : e.convertCsvToData(b.response), d.call(e, g)
        })
    }, f.convertCsvToData = function(a) {
        var b, c = this.d3,
            d = c.csv.parseRows(a);
        return 1 === d.length ? (b = [{}], d[0].forEach(function(a) {
            b[0][a] = null
        })) : b = c.csv.parse(a), b
    }, f.convertJsonToData = function(a, b) {
        var c, d, e = this,
            f = [];
        return b ? (c = b.value, b.x && (c.push(b.x), e.config.data_x = b.x), f.push(c), a.forEach(function(a) {
            var b = [];
            c.forEach(function(c) {
                var d = l(a[c]) ? null : a[c];
                b.push(d)
            }), f.push(b)
        }), d = e.convertRowsToData(f)) : (Object.keys(a).forEach(function(b) {
            f.push([b].concat(a[b]))
        }), d = e.convertColumnsToData(f)), d
    }, f.convertRowsToData = function(a) {
        var b, c, d = a[0],
            e = {},
            f = [];
        for (b = 1; b < a.length; b++) {
            for (e = {}, c = 0; c < a[b].length; c++) {
                if (l(a[b][c])) throw new Error("Source data is missing a component at (" + b + "," + c + ")!");
                e[d[c]] = a[b][c]
            }
            f.push(e)
        }
        return f
    }, f.convertColumnsToData = function(a) {
        var b, c, d, e = [];
        for (b = 0; b < a.length; b++)
            for (d = a[b][0], c = 1; c < a[b].length; c++) {
                if (l(e[c - 1]) && (e[c - 1] = {}), l(a[b][c])) throw new Error("Source data is missing a component at (" + b + "," + c + ")!");
                e[c - 1][d] = a[b][c]
            }
        return e
    }, f.convertDataToTargets = function(a, b) {
        var c, d = this,
            e = d.config,
            f = d.d3.keys(a[0]).filter(d.isNotX, d),
            g = d.d3.keys(a[0]).filter(d.isX, d);
        return f.forEach(function(c) {
            var f = d.getXKey(c);
            d.isCustomX() || d.isTimeSeries() ? g.indexOf(f) >= 0 ? d.data.xs[c] = (b && d.data.xs[c] ? d.data.xs[c] : []).concat(a.map(function(a) {
                return a[f]
            }).filter(i).map(function(a, b) {
                return d.generateTargetX(a, c, b)
            })) : e.data_x ? d.data.xs[c] = d.getOtherTargetXs() : r(e.data_xs) && (d.data.xs[c] = d.getXValuesOfXKey(f, d.data.targets)) : d.data.xs[c] = a.map(function(a, b) {
                return b
            })
        }), f.forEach(function(a) {
            if (!d.data.xs[a]) throw new Error('x is not defined for id = "' + a + '".')
        }), c = f.map(function(b, c) {
            var f = e.data_idConverter(b);
            return {
                id: f,
                id_org: b,
                values: a.map(function(a, g) {
                    var h = d.getXKey(b),
                        i = a[h],
                        j = d.generateTargetX(i, b, g);
                    return d.isCustomX() && d.isCategorized() && 0 === c && i && (0 === g && (e.axis_x_categories = []), e.axis_x_categories.push(i)), (l(a[b]) || d.data.xs[b].length <= g) && (j = void 0), {
                        x: j,
                        value: null === a[b] || isNaN(a[b]) ? null : +a[b],
                        id: f
                    }
                }).filter(function(a) {
                    return m(a.x)
                })
            }
        }), c.forEach(function(a) {
            var b;
            a.values = a.values.sort(function(a, b) {
                var c = a.x || 0 === a.x ? a.x : 1 / 0,
                    d = b.x || 0 === b.x ? b.x : 1 / 0;
                return c - d
            }), b = 0, a.values.forEach(function(a) {
                a.index = b++
            }), d.data.xs[a.id].sort(function(a, b) {
                return a - b
            })
        }), e.data_type && d.setTargetType(d.mapToIds(c).filter(function(a) {
            return !(a in e.data_types)
        }), e.data_type), c.forEach(function(a) {
            d.addCache(a.id_org, a)
        }), c
    }, f.load = function(a, b) {
        var c = this;
        a && (b.filter && (a = a.filter(b.filter)), (b.type || b.types) && a.forEach(function(a) {
            c.setTargetType(a.id, b.types ? b.types[a.id] : b.type)
        }), c.data.targets.forEach(function(b) {
            for (var c = 0; c < a.length; c++)
                if (b.id === a[c].id) {
                    b.values = a[c].values, a.splice(c, 1);
                    break
                }
        }), c.data.targets = c.data.targets.concat(a)), c.updateTargets(c.data.targets), c.redraw({
            withUpdateOrgXDomain: !0,
            withUpdateXDomain: !0,
            withLegend: !0
        }), b.done && b.done()
    }, f.loadFromArgs = function(a) {
        var b = this;
        a.data ? b.load(b.convertDataToTargets(a.data), a) : a.url ? b.convertUrlToData(a.url, a.mimeType, a.keys, function(c) {
            b.load(b.convertDataToTargets(c), a)
        }) : a.json ? b.load(b.convertDataToTargets(b.convertJsonToData(a.json, a.keys)), a) : a.rows ? b.load(b.convertDataToTargets(b.convertRowsToData(a.rows)), a) : a.columns ? b.load(b.convertDataToTargets(b.convertColumnsToData(a.columns)), a) : b.load(null, a)
    }, f.unload = function(a, b) {
        var c = this;
        return b || (b = function() {}), a = a.filter(function(a) {
            return c.hasTarget(c.data.targets, a)
        }), a && 0 !== a.length ? (c.svg.selectAll(a.map(function(a) {
            return c.selectorTarget(a)
        })).transition().style("opacity", 0).remove().call(c.endall, b), void a.forEach(function(a) {
            c.withoutFadeIn[a] = !1, c.legend && c.legend.selectAll("." + h.legendItem + c.getTargetSelectorSuffix(a)).remove(), c.data.targets = c.data.targets.filter(function(b) {
                return b.id !== a
            })
        })) : void b()
    }, f.categoryName = function(a) {
        var b = this.config;
        return a < b.axis_x_categories.length ? b.axis_x_categories[a] : a
    }, f.initEventRect = function() {
        var a = this;
        a.main.select("." + h.chart).append("g").attr("class", h.eventRects).style("fill-opacity", 0)
    }, f.redrawEventRect = function() {
        var a, b, c = this,
            d = c.config,
            e = c.isMultipleX(),
            f = c.main.select("." + h.eventRects).style("cursor", d.zoom_enabled ? d.axis_rotated ? "ns-resize" : "ew-resize" : null).classed(h.eventRectsMultiple, e).classed(h.eventRectsSingle, !e);
        f.selectAll("." + h.eventRect).remove(), c.eventRect = f.selectAll("." + h.eventRect), e ? (a = c.eventRect.data([0]), c.generateEventRectsForMultipleXs(a.enter()), c.updateEventRect(a)) : (b = c.getMaxDataCountTarget(c.data.targets), f.datum(b ? b.values : []), c.eventRect = f.selectAll("." + h.eventRect), a = c.eventRect.data(function(a) {
            return a
        }), c.generateEventRectsForSingleX(a.enter()), c.updateEventRect(a), a.exit().remove())
    }, f.updateEventRect = function(a) {
        var b, c, d, e, f, g, h = this,
            i = h.config;
        a = a || h.eventRect.data(function(a) {
            return a
        }), h.isMultipleX() ? (b = 0, c = 0, d = h.width, e = h.height) : (!h.isCustomX() && !h.isTimeSeries() || h.isCategorized() ? (f = h.getEventRectWidth(), g = function(a) {
            return h.x(a.x) - f / 2
        }) : (f = function(a) {
            var b = h.getPrevX(a.index),
                c = h.getNextX(a.index),
                d = h.data.xs[a.id][a.index],
                e = (h.x(c ? c : d) - h.x(b ? b : d)) / 2;
            return 0 > e ? 0 : e
        }, g = function(a) {
            var b = h.getPrevX(a.index),
                c = h.data.xs[a.id][a.index];
            return (h.x(c) + h.x(b ? b : c)) / 2
        }), b = i.axis_rotated ? 0 : g, c = i.axis_rotated ? g : 0, d = i.axis_rotated ? h.width : f, e = i.axis_rotated ? f : h.height), a.attr("class", h.classEvent.bind(h)).attr("x", b).attr("y", c).attr("width", d).attr("height", e)
    }, f.generateEventRectsForSingleX = function(a) {
        var b = this,
            c = b.d3,
            d = b.config;
        a.append("rect").attr("class", b.classEvent.bind(b)).style("cursor", d.data_selection_enabled && d.data_selection_grouped ? "pointer" : null).on("mouseover", function(a) {
            var c, e, f = a.index;
            b.dragging || b.hasArcType() || (c = b.data.targets.map(function(a) {
                return b.addName(b.getValueOnIndex(a.values, f))
            }), e = [], Object.keys(d.data_names).forEach(function(a) {
                for (var b = 0; b < c.length; b++)
                    if (c[b] && c[b].id === a) {
                        e.push(c[b]), c.shift(b);
                        break
                    }
            }), c = e.concat(c), d.point_focus_expand_enabled && b.expandCircles(f), b.expandBars(f), b.main.selectAll("." + h.shape + "-" + f).each(function(a) {
                d.data_onmouseover.call(b, a)
            }))
        }).on("mouseout", function(a) {
            var c = a.index;
            b.hasArcType() || (b.hideXGridFocus(), b.hideTooltip(), b.unexpandCircles(c), b.unexpandBars(), b.main.selectAll("." + h.shape + "-" + c).each(function(a) {
                d.data_onmouseout.call(b, a)
            }))
        }).on("mousemove", function(a) {
            var e, f = a.index,
                g = b.svg.select("." + h.eventRect + "-" + f);
            b.dragging || b.hasArcType() || (e = b.filterTargetsToShow(b.data.targets).map(function(a) {
                return b.addName(b.getValueOnIndex(a.values, f))
            }), d.tooltip_grouped && (b.showTooltip(e, c.mouse(this)), b.showXGridFocus(e)), (!d.tooltip_grouped || d.data_selection_enabled && !d.data_selection_grouped) && b.main.selectAll("." + h.shape + "-" + f).each(function() {
                c.select(this).classed(h.EXPANDED, !0), d.data_selection_enabled && g.style("cursor", d.data_selection_grouped ? "pointer" : null), d.tooltip_grouped || (b.hideXGridFocus(), b.hideTooltip(), d.data_selection_grouped || (b.unexpandCircles(f), b.unexpandBars()))
            }).filter(function(a) {
                return "circle" === this.nodeName ? b.isWithinCircle(this, b.pointSelectR(a)) : "path" === this.nodeName ? b.isWithinBar(this) : void 0
            }).each(function(a) {
                d.data_selection_enabled && (d.data_selection_grouped || d.data_selection_isselectable(a)) && g.style("cursor", "pointer"), d.tooltip_grouped || (b.showTooltip([a], c.mouse(this)), b.showXGridFocus([a]), d.point_focus_expand_enabled && b.expandCircles(f, a.id), b.expandBars(f, a.id))
            }))
        }).on("click", function(a) {
            var c = a.index;
            if (!b.hasArcType() && b.toggleShape) return b.cancelClick ? void(b.cancelClick = !1) : void b.main.selectAll("." + h.shape + "-" + c).each(function(a) {
                b.toggleShape(this, a, c)
            })
        }).call(c.behavior.drag().origin(Object).on("drag", function() {
            b.drag(c.mouse(this))
        }).on("dragstart", function() {
            b.dragstart(c.mouse(this))
        }).on("dragend", function() {
            b.dragend()
        })).on("dblclick.zoom", null)
    }, f.generateEventRectsForMultipleXs = function(a) {
        var b = this,
            c = b.d3,
            d = b.config;
        a.append("rect").attr("x", 0).attr("y", 0).attr("width", b.width).attr("height", b.height).attr("class", h.eventRect).on("mouseout", function() {
            b.hasArcType() || (b.hideXGridFocus(), b.hideTooltip(), b.unexpandCircles())
        }).on("mousemove", function() {
            var a, e, f, g, i = b.filterTargetsToShow(b.data.targets);
            b.dragging || b.hasArcType(i) || (a = c.mouse(this), e = b.findClosestFromTargets(i, a), e && (f = b.isScatterType(e) ? [e] : b.filterSameX(i, e.x), g = f.map(function(a) {
                return b.addName(a)
            }), b.showTooltip(g, a), d.point_focus_expand_enabled && (b.unexpandCircles(), b.expandCircles(e.index, e.id)), b.showXGridFocus(g), b.dist(e, a) < 100 ? (b.svg.select("." + h.eventRect).style("cursor", "pointer"), b.mouseover || (d.data_onmouseover.call(b, e), b.mouseover = !0)) : b.mouseover && (b.svg.select("." + h.eventRect).style("cursor", null), d.data_onmouseout.call(b, e), b.mouseover = !1)))
        }).on("click", function() {
            var a, d, e = b.filterTargetsToShow(b.data.targets);
            b.hasArcType(e) || (a = c.mouse(this), d = b.findClosestFromTargets(e, a), d && b.dist(d, a) < 100 && b.toggleShape && b.main.select("." + h.circles + b.getTargetSelectorSuffix(d.id)).select("." + h.circle + "-" + d.index).each(function() {
                b.toggleShape(this, d, d.index)
            }))
        }).call(c.behavior.drag().origin(Object).on("drag", function() {
            b.drag(c.mouse(this))
        }).on("dragstart", function() {
            b.dragstart(c.mouse(this))
        }).on("dragend", function() {
            b.dragend()
        })).on("dblclick.zoom", null)
    }, f.getCurrentWidth = function() {
        var a = this,
            b = a.config;
        return b.size_width ? b.size_width : a.getParentWidth()
    }, f.getCurrentHeight = function() {
        var a = this,
            b = a.config,
            c = b.size_height ? b.size_height : a.getParentHeight();
        return c > 0 ? c : 320
    }, f.getCurrentPaddingTop = function() {
        var a = this.config;
        return i(a.padding_top) ? a.padding_top : 0
    }, f.getCurrentPaddingBottom = function() {
        var a = this.config;
        return i(a.padding_bottom) ? a.padding_bottom : 0
    }, f.getCurrentPaddingLeft = function() {
        var a = this,
            b = a.config;
        return i(b.padding_left) ? b.padding_left : b.axis_rotated ? b.axis_x_show ? Math.max(n(a.getAxisWidthByAxisId("x")), 40) : 1 : b.axis_y_show ? n(a.getAxisWidthByAxisId("y")) : 1
    }, f.getCurrentPaddingRight = function() {
        var a = this,
            b = a.config,
            c = 10,
            d = a.isLegendRight ? a.getLegendWidth() + 20 : 0;
        return i(b.padding_right) ? b.padding_right + 1 : b.axis_rotated ? c + d : (b.axis_y2_show ? n(a.getAxisWidthByAxisId("y2")) : c) + d
    }, f.getParentRectValue = function(a) {
        for (var b, c = this.selectChart.node(); c && "BODY" !== c.tagName && !(b = c.getBoundingClientRect()[a]);) c = c.parentNode;
        return b
    }, f.getParentWidth = function() {
        return this.getParentRectValue("width")
    }, f.getParentHeight = function() {
        var a = this.selectChart.style("height");
        return a.indexOf("px") > 0 ? +a.replace("px", "") : 0
    }, f.getSvgLeft = function() {
        var a = this,
            b = a.config,
            c = b.axis_rotated ? h.axisX : h.axisY,
            d = a.main.select("." + c).node(),
            e = d ? d.getBoundingClientRect() : {
                right: 0
            },
            f = a.selectChart.node().getBoundingClientRect(),
            g = a.hasArcType(),
            i = e.right - f.left - (g ? 0 : a.getCurrentPaddingLeft());
        return i > 0 ? i : 0
    }, f.getAxisWidthByAxisId = function(a) {
        var b = this,
            c = b.getAxisLabelPositionById(a);
        return c.isInner ? 20 + b.getMaxTickWidth(a) : 40 + b.getMaxTickWidth(a)
    }, f.getHorizontalAxisHeight = function(a) {
        var b = this,
            c = b.config;
        return "x" !== a || c.axis_x_show ? "x" === a && c.axis_x_height ? c.axis_x_height : "y" !== a || c.axis_y_show ? "y2" !== a || c.axis_y2_show ? (b.getAxisLabelPositionById(a).isInner ? 30 : 40) + ("y2" === a ? -10 : 0) : b.rotated_padding_top : !c.legend_show || b.isLegendRight || b.isLegendInset ? 1 : 10 : 0
    }, f.getEventRectWidth = function() {
        var a, b, c, d, e, f, g = this,
            h = g.getMaxDataCountTarget(g.data.targets);
        return h ? (a = h.values[0], b = h.values[h.values.length - 1], c = g.x(b.x) - g.x(a.x), 0 === c ? g.config.axis_rotated ? g.height : g.width : (d = g.getMaxDataCount(), e = g.hasType("bar") ? (d - (g.isCategorized() ? .25 : 1)) / d : 1, f = d > 1 ? c * e / (d - 1) : c, 1 > f ? 1 : f)) : 0
    }, f.getShapeIndices = function(a) {
        var b, c, d = this,
            e = d.config,
            f = {},
            g = 0;
        return d.filterTargetsToShow(d.data.targets.filter(a, d)).forEach(function(a) {
            for (b = 0; b < e.data_groups.length; b++)
                if (!(e.data_groups[b].indexOf(a.id) < 0))
                    for (c = 0; c < e.data_groups[b].length; c++)
                        if (e.data_groups[b][c] in f) {
                            f[a.id] = f[e.data_groups[b][c]];
                            break
                        }
            l(f[a.id]) && (f[a.id] = g++)
        }), f.__max__ = g - 1, f
    }, f.getShapeX = function(a, b, c, d) {
        var e = this,
            f = d ? e.subX : e.x;
        return function(d) {
            var e = d.id in c ? c[d.id] : 0;
            return d.x || 0 === d.x ? f(d.x) - a * (b / 2 - e) : 0
        }
    }, f.getShapeY = function(a) {
        var b = this;
        return function(c) {
            var d = a ? b.getSubYScale(c.id) : b.getYScale(c.id);
            return d(c.value)
        }
    }, f.getShapeOffset = function(a, b, c) {
        var d = this,
            e = d.orderTargets(d.filterTargetsToShow(d.data.targets.filter(a, d))),
            f = e.map(function(a) {
                return a.id
            });
        return function(a, g) {
            var h = c ? d.getSubYScale(a.id) : d.getYScale(a.id),
                i = h(0),
                j = i;
            return e.forEach(function(c) {
                c.id !== a.id && b[c.id] === b[a.id] && f.indexOf(c.id) < f.indexOf(a.id) && c.values[g].value * a.value >= 0 && (j += h(c.values[g].value) - i)
            }), j
        }
    }, f.getInterpolate = function(a) {
        var b = this;
        return b.isSplineType(a) ? "cardinal" : b.isStepType(a) ? "step-after" : "linear"
    }, f.initLine = function() {
        var a = this;
        a.main.select("." + h.chart).append("g").attr("class", h.chartLines)
    }, f.updateTargetsForLine = function(a) {
        var b, c, d = this,
            e = d.config,
            f = d.classChartLine.bind(d),
            g = d.classLines.bind(d),
            i = d.classAreas.bind(d),
            j = d.classCircles.bind(d);
        b = d.main.select("." + h.chartLines).selectAll("." + h.chartLine).data(a).attr("class", f), c = b.enter().append("g").attr("class", f).style("opacity", 0).style("pointer-events", "none"), c.append("g").attr("class", g), c.append("g").attr("class", i), c.append("g").attr("class", function(a) {
            return d.generateClass(h.selectedCircles, a.id)
        }), c.append("g").attr("class", j).style("cursor", function(a) {
            return e.data_selection_isselectable(a) ? "pointer" : null
        }), a.forEach(function(a) {
            d.main.selectAll("." + h.selectedCircles + d.getTargetSelectorSuffix(a.id)).selectAll("." + h.selectedCircle).each(function(b) {
                b.value = a.values[b.index].value
            })
        })
    }, f.redrawLine = function(a) {
        var b = this;
        b.mainLine = b.main.selectAll("." + h.lines).selectAll("." + h.line).data(b.lineData.bind(b)), b.mainLine.enter().append("path").attr("class", b.classLine.bind(b)).style("stroke", b.color), b.mainLine.style("opacity", b.initialOpacity.bind(b)).attr("transform", null), b.mainLine.exit().transition().duration(a).style("opacity", 0).remove()
    }, f.addTransitionForLine = function(a, b) {
        var c = this;
        a.push(c.mainLine.transition().attr("d", b).style("stroke", c.color).style("opacity", 1))
    }, f.generateDrawLine = function(a, b) {
        var c = this,
            d = c.config,
            e = c.d3.svg.line(),
            f = c.generateGetLinePoint(a, b),
            g = b ? c.getSubYScale : c.getYScale,
            h = function(a) {
                return (b ? c.subxx : c.xx).call(c, a)
            },
            i = function(a, b) {
                return d.data_groups.length > 0 ? f(a, b)[0][1] : g.call(c, a.id)(a.value)
            };
        return e = d.axis_rotated ? e.x(i).y(h) : e.x(h).y(i), d.line_connect_null || (e = e.defined(function(a) {
                return null != a.value
            })),
            function(a) {
                var f, h = d.line_connect_null ? c.filterRemoveNull(a.values) : a.values,
                    i = b ? c.x : c.subX,
                    j = g.call(c, a.id),
                    k = 0,
                    l = 0;
                return c.isLineType(a) ? f = d.data_regions[a.id] ? c.lineWithRegions(h, i, j, d.data_regions[a.id]) : e.interpolate(c.getInterpolate(a))(h) : (h[0] && (k = i(h[0].x), l = j(h[0].value)), f = d.axis_rotated ? "M " + l + " " + k : "M " + k + " " + l), f ? f : "M 0 0"
            }
    }, f.generateGetLinePoint = function(a, b) {
        var c = this,
            d = c.config,
            e = a.__max__ + 1,
            f = c.getShapeX(0, e, a, !!b),
            g = c.getShapeY(!!b),
            h = c.getShapeOffset(c.isLineType, a, !!b),
            i = b ? c.getSubYScale : c.getYScale;
        return function(a, b) {
            var e = i.call(c, a.id)(0),
                j = h(a, b) || e,
                k = f(a),
                l = g(a);
            return d.axis_rotated && (0 < a.value && e > l || a.value < 0 && l > e) && (l = e), [
                [k, l - (e - j)]
            ]
        }
    }, f.lineWithRegions = function(a, b, c, d) {
        function e(a, b) {
            var c;
            for (c = 0; c < b.length; c++)
                if (b[c].start < a && a <= b[c].end) return !0;
            return !1
        }
        var f, g, h, i, j, k, n, o, p, q, r, s, t = this,
            u = t.config,
            v = -1,
            w = "M",
            x = [];
        if (m(d))
            for (f = 0; f < d.length; f++) x[f] = {}, x[f].start = l(d[f].start) ? a[0].x : t.isTimeSeries() ? t.parseDate(d[f].start) : d[f].start, x[f].end = l(d[f].end) ? a[a.length - 1].x : t.isTimeSeries() ? t.parseDate(d[f].end) : d[f].end;
        for (r = u.axis_rotated ? function(a) {
                return c(a.value)
            } : function(a) {
                return b(a.x)
            }, s = u.axis_rotated ? function(a) {
                return b(a.x)
            } : function(a) {
                return c(a.value)
            }, h = t.isTimeSeries() ? function(a, d, e, f) {
                var g = a.x.getTime(),
                    h = d.x - a.x,
                    i = new Date(g + h * e),
                    k = new Date(g + h * (e + f));
                return "M" + b(i) + " " + c(j(e)) + " " + b(k) + " " + c(j(e + f))
            } : function(a, d, e, f) {
                return "M" + b(i(e), !0) + " " + c(j(e)) + " " + b(i(e + f), !0) + " " + c(j(e + f))
            }, f = 0; f < a.length; f++) {
            if (l(x) || !e(a[f].x, x)) w += " " + r(a[f]) + " " + s(a[f]);
            else
                for (i = t.getScale(a[f - 1].x, a[f].x, t.isTimeSeries()), j = t.getScale(a[f - 1].value, a[f].value), k = b(a[f].x) - b(a[f - 1].x), n = c(a[f].value) - c(a[f - 1].value), o = Math.sqrt(Math.pow(k, 2) + Math.pow(n, 2)), p = 2 / o, q = 2 * p, g = p; 1 >= g; g += q) w += h(a[f - 1], a[f], g, p);
            v = a[f].x
        }
        return w
    }, f.redrawArea = function(a) {
        var b = this,
            c = b.d3;
        b.mainArea = b.main.selectAll("." + h.areas).selectAll("." + h.area).data(b.lineData.bind(b)), b.mainArea.enter().append("path").attr("class", b.classArea.bind(b)).style("fill", b.color).style("opacity", function() {
            return b.orgAreaOpacity = +c.select(this).style("opacity"), 0
        }), b.mainArea.style("opacity", b.orgAreaOpacity), b.mainArea.exit().transition().duration(a).style("opacity", 0).remove()
    }, f.addTransitionForArea = function(a, b) {
        var c = this;
        a.push(c.mainArea.transition().attr("d", b).style("fill", c.color).style("opacity", c.orgAreaOpacity))
    }, f.generateDrawArea = function(a, b) {
        var c = this,
            d = c.config,
            e = c.d3.svg.area(),
            f = c.generateGetAreaPoint(a, b),
            g = b ? c.getSubYScale : c.getYScale,
            h = function(a) {
                return (b ? c.subxx : c.xx).call(c, a)
            },
            i = function(a, b) {
                return d.data_groups.length > 0 ? f(a, b)[0][1] : g.call(c, a.id)(0)
            },
            j = function(a, b) {
                return d.data_groups.length > 0 ? f(a, b)[1][1] : g.call(c, a.id)(a.value)
            };
        return e = d.axis_rotated ? e.x0(i).x1(j).y(h) : e.x(h).y0(i).y1(j), d.line_connect_null || (e = e.defined(function(a) {
                return null !== a.value
            })),
            function(a) {
                var b, f = d.line_connect_null ? c.filterRemoveNull(a.values) : a.values,
                    g = 0,
                    h = 0;
                return c.isAreaType(a) ? b = e.interpolate(c.getInterpolate(a))(f) : (f[0] && (g = c.x(f[0].x), h = c.getYScale(a.id)(f[0].value)), b = d.axis_rotated ? "M " + h + " " + g : "M " + g + " " + h), b ? b : "M 0 0"
            }
    }, f.generateGetAreaPoint = function(a, b) {
        var c = this,
            d = c.config,
            e = a.__max__ + 1,
            f = c.getShapeX(0, e, a, !!b),
            g = c.getShapeY(!!b),
            h = c.getShapeOffset(c.isAreaType, a, !!b),
            i = b ? c.getSubYScale : c.getYScale;
        return function(a, b) {
            var e = i.call(c, a.id)(0),
                j = h(a, b) || e,
                k = f(a),
                l = g(a);
            return d.axis_rotated && (0 < a.value && e > l || a.value < 0 && l > e) && (l = e), [
                [k, j],
                [k, l - (e - j)]
            ]
        }
    }, f.redrawCircle = function() {
        var a = this;
        a.mainCircle = a.main.selectAll("." + h.circles).selectAll("." + h.circle).data(a.lineOrScatterData.bind(a)), a.mainCircle.enter().append("circle").attr("class", a.classCircle.bind(a)).attr("r", a.pointR.bind(a)).style("fill", a.color), a.mainCircle.style("opacity", a.initialOpacity.bind(a)), a.mainCircle.exit().remove()
    }, f.addTransitionForCircle = function(a, b, c) {
        var d = this;
        a.push(d.mainCircle.transition().style("opacity", d.opacityForCircle.bind(d)).style("fill", d.color).attr("cx", b).attr("cy", c)), a.push(d.main.selectAll("." + h.selectedCircle).transition().attr("cx", b).attr("cy", c))
    }, f.circleX = function(a) {
        return a.x || 0 === a.x ? this.x(a.x) : null
    }, f.circleY = function(a, b) {
        var c = this,
            d = c.getShapeIndices(c.isLineType),
            e = c.generateGetLinePoint(d);
        return c.config.data_groups.length > 0 ? e(a, b)[0][1] : c.getYScale(a.id)(a.value)
    }, f.getCircles = function(a, b) {
        var c = this;
        return (b ? c.main.selectAll("." + h.circles + c.getTargetSelectorSuffix(b)) : c.main).selectAll("." + h.circle + (i(a) ? "-" + a : ""))
    }, f.expandCircles = function(a, b) {
        var c = this,
            d = c.pointExpandedR.bind(c);
        c.getCircles(a, b).classed(h.EXPANDED, !0).attr("r", d)
    }, f.unexpandCircles = function(a) {
        var b = this,
            c = b.pointR.bind(b);
        b.getCircles(a).filter(function() {
            return b.d3.select(this).classed(h.EXPANDED)
        }).classed(h.EXPANDED, !1).attr("r", c)
    }, f.pointR = function(a) {
        var b = this,
            c = b.config;
        return c.point_show && !b.isStepType(a) ? j(c.point_r) ? c.point_r(a) : c.point_r : 0
    }, f.pointExpandedR = function(a) {
        var b = this,
            c = b.config;
        return c.point_focus_expand_enabled ? c.point_focus_expand_r ? c.point_focus_expand_r : 1.75 * b.pointR(a) : b.pointR(a)
    }, f.pointSelectR = function(a) {
        var b = this,
            c = b.config;
        return c.point_select_r ? c.point_select_r : 4 * b.pointR(a)
    }, f.isWithinCircle = function(a, b) {
        var c = this.d3,
            d = c.mouse(a),
            e = c.select(a),
            f = 1 * e.attr("cx"),
            g = 1 * e.attr("cy");
        return Math.sqrt(Math.pow(f - d[0], 2) + Math.pow(g - d[1], 2)) < b
    }, f.initBar = function() {
        var a = this;
        a.main.select("." + h.chart).append("g").attr("class", h.chartBars)
    }, f.updateTargetsForBar = function(a) {
        var b, c, d = this,
            e = d.config,
            f = d.classChartBar.bind(d),
            g = d.classBars.bind(d);
        b = d.main.select("." + h.chartBars).selectAll("." + h.chartBar).data(a).attr("class", f), c = b.enter().append("g").attr("class", f).style("opacity", 0).style("pointer-events", "none"), c.append("g").attr("class", g).style("cursor", function(a) {
            return e.data_selection_isselectable(a) ? "pointer" : null
        })
    }, f.redrawBar = function(a) {
        var b = this,
            c = b.barData.bind(b),
            d = b.classBar.bind(b),
            e = b.initialOpacity.bind(b),
            f = function(a) {
                return b.color(a.id)
            };
        b.mainBar = b.main.selectAll("." + h.bars).selectAll("." + h.bar).data(c), b.mainBar.enter().append("path").attr("class", d).style("stroke", f).style("fill", f), b.mainBar.style("opacity", e), b.mainBar.exit().transition().duration(a).style("opacity", 0).remove()
    }, f.addTransitionForBar = function(a, b) {
        var c = this;
        a.push(c.mainBar.transition().attr("d", b).style("fill", c.color).style("opacity", 1))
    }, f.getBarW = function(a, b) {
        var c = this,
            d = c.config,
            e = "number" == typeof d.bar_width ? d.bar_width : b ? 2 * a.tickOffset() * d.bar_width_ratio / b : 0;
        return d.bar_width_max && e > d.bar_width_max ? d.bar_width_max : e
    }, f.getBars = function(a) {
        var b = this;
        return b.main.selectAll("." + h.bar + (i(a) ? "-" + a : ""))
    }, f.expandBars = function(a) {
        var b = this;
        b.getBars(a).classed(h.EXPANDED, !0)
    }, f.unexpandBars = function(a) {
        var b = this;
        b.getBars(a).classed(h.EXPANDED, !1)
    }, f.generateDrawBar = function(a, b) {
        var c = this,
            d = c.config,
            e = c.generateGetBarPoints(a, b);
        return function(a, b) {
            var c = e(a, b),
                f = d.axis_rotated ? 1 : 0,
                g = d.axis_rotated ? 0 : 1,
                h = "M " + c[0][f] + "," + c[0][g] + " L" + c[1][f] + "," + c[1][g] + " L" + c[2][f] + "," + c[2][g] + " L" + c[3][f] + "," + c[3][g] + " z";
            return h
        }
    }, f.generateGetBarPoints = function(a, b) {
        var c = this,
            d = a.__max__ + 1,
            e = c.getBarW(c.xAxis, d),
            f = c.getShapeX(e, d, a, !!b),
            g = c.getShapeY(!!b),
            h = c.getShapeOffset(c.isBarType, a, !!b),
            i = b ? c.getSubYScale : c.getYScale;
        return function(a, b) {
            var d = i.call(c, a.id)(0),
                j = h(a, b) || d,
                k = f(a),
                l = g(a);
            return c.config.axis_rotated && (0 < a.value && d > l || a.value < 0 && l > d) && (l = d), [
                [k, j],
                [k, l - (d - j)],
                [k + e, l - (d - j)],
                [k + e, j]
            ]
        }
    }, f.isWithinBar = function(a) {
        var b = this.d3,
            c = b.mouse(a),
            d = a.getBoundingClientRect(),
            e = a.pathSegList.getItem(0),
            f = a.pathSegList.getItem(1),
            g = e.x,
            h = Math.min(e.y, f.y),
            i = d.width,
            j = d.height,
            k = 2,
            l = g - k,
            m = g + i + k,
            n = h + j + k,
            o = h - k;
        return l < c[0] && c[0] < m && o < c[1] && c[1] < n
    }, f.initText = function() {
        var a = this;
        a.main.select("." + h.chart).append("g").attr("class", h.chartTexts), a.mainText = a.d3.selectAll([])
    }, f.updateTargetsForText = function(a) {
        var b, c, d = this,
            e = d.classChartText.bind(d),
            f = d.classTexts.bind(d);
        b = d.main.select("." + h.chartTexts).selectAll("." + h.chartText).data(a).attr("class", e), c = b.enter().append("g").attr("class", e).style("opacity", 0).style("pointer-events", "none"), c.append("g").attr("class", f)
    }, f.redrawText = function(a) {
        var b = this,
            c = b.config,
            d = b.barOrLineData.bind(b),
            e = b.classText.bind(b);
        b.mainText = b.main.selectAll("." + h.texts).selectAll("." + h.text).data(d), b.mainText.enter().append("text").attr("class", e).attr("text-anchor", function(a) {
            return c.axis_rotated ? a.value < 0 ? "end" : "start" : "middle"
        }).style("stroke", "none").style("fill", function(a) {
            return b.color(a)
        }).style("fill-opacity", 0), b.mainText.text(function(a) {
            return b.formatByAxisId(b.getAxisId(a.id))(a.value, a.id)
        }), b.mainText.exit().transition().duration(a).style("fill-opacity", 0).remove()
    }, f.addTransitionForText = function(a, b, c, d) {
        var e = this,
            f = d ? 0 : e.opacityForText.bind(e);
        a.push(e.mainText.transition().attr("x", b).attr("y", c).style("fill", e.color).style("fill-opacity", f))
    }, f.getTextRect = function(a, b) {
        var c;
        return this.d3.select("body").selectAll(".dummy").data([a]).enter().append("text").classed(b ? b : "", !0).text(a).each(function() {
            c = this.getBoundingClientRect()
        }).remove(), c
    }, f.generateXYForText = function(a, b) {
        var c = this,
            d = c.generateGetBarPoints(a, !1),
            e = b ? c.getXForText : c.getYForText;
        return function(a, b) {
            return e.call(c, d(a, b), a, this)
        }
    }, f.getXForText = function(a, b, c) {
        var d, e, f = this,
            g = c.getBoundingClientRect();
        return f.config.axis_rotated ? (e = f.isBarType(b) ? 4 : 6, d = a[2][1] + e * (b.value < 0 ? -1 : 1)) : d = f.hasType("bar") ? (a[2][0] + a[0][0]) / 2 : a[0][0], d > f.width ? f.width - g.width : d
    }, f.getYForText = function(a, b, c) {
        var d, e = this,
            f = c.getBoundingClientRect();
        return d = e.config.axis_rotated ? (a[0][0] + a[2][0] + .6 * f.height) / 2 : a[2][1] + (b.value < 0 ? f.height : e.isBarType(b) ? -3 : -6), d < f.height ? f.height : d
    }, f.setTargetType = function(a, b) {
        var c = this,
            d = c.config;
        c.mapToTargetIds(a).forEach(function(a) {
            c.withoutFadeIn[a] = b === d.data_types[a], d.data_types[a] = b
        }), a || (d.data_type = b)
    }, f.hasType = function(a, b) {
        var c = this,
            d = c.config.data_types,
            e = !1;
        return (b || c.data.targets).forEach(function(b) {
            (d[b.id] && d[b.id].indexOf(a) >= 0 || !(b.id in d) && "line" === a) && (e = !0)
        }), e
    }, f.hasArcType = function(a) {
        return this.hasType("pie", a) || this.hasType("donut", a) || this.hasType("gauge", a)
    }, f.isLineType = function(a) {
        var b = this.config,
            c = k(a) ? a : a.id;
        return !b.data_types[c] || ["line", "spline", "area", "area-spline", "step", "area-step"].indexOf(b.data_types[c]) >= 0
    }, f.isStepType = function(a) {
        var b = k(a) ? a : a.id;
        return ["step", "area-step"].indexOf(this.config.data_types[b]) >= 0
    }, f.isSplineType = function(a) {
        var b = k(a) ? a : a.id;
        return ["spline", "area-spline"].indexOf(this.config.data_types[b]) >= 0
    }, f.isAreaType = function(a) {
        var b = k(a) ? a : a.id;
        return ["area", "area-spline", "area-step"].indexOf(this.config.data_types[b]) >= 0
    }, f.isBarType = function(a) {
        var b = k(a) ? a : a.id;
        return "bar" === this.config.data_types[b]
    }, f.isScatterType = function(a) {
        var b = k(a) ? a : a.id;
        return "scatter" === this.config.data_types[b]
    }, f.isPieType = function(a) {
        var b = k(a) ? a : a.id;
        return "pie" === this.config.data_types[b]
    }, f.isGaugeType = function(a) {
        var b = k(a) ? a : a.id;
        return "gauge" === this.config.data_types[b]
    }, f.isDonutType = function(a) {
        var b = k(a) ? a : a.id;
        return "donut" === this.config.data_types[b]
    }, f.isArcType = function(a) {
        return this.isPieType(a) || this.isDonutType(a) || this.isGaugeType(a)
    }, f.lineData = function(a) {
        return this.isLineType(a) ? [a] : []
    }, f.arcData = function(a) {
        return this.isArcType(a.data) ? [a] : []
    }, f.barData = function(a) {
        return this.isBarType(a) ? a.values : []
    }, f.lineOrScatterData = function(a) {
        return this.isLineType(a) || this.isScatterType(a) ? a.values : []
    }, f.barOrLineData = function(a) {
        return this.isBarType(a) || this.isLineType(a) ? a.values : []
    }, f.initGrid = function() {
        var a = this,
            b = a.config,
            c = a.d3;
        a.grid = a.main.append("g").attr("clip-path", a.clipPath).attr("class", h.grid), b.grid_x_show && a.grid.append("g").attr("class", h.xgrids), b.grid_y_show && a.grid.append("g").attr("class", h.ygrids), a.grid.append("g").attr("class", h.xgridLines), a.grid.append("g").attr("class", h.ygridLines), b.grid_focus_show && a.grid.append("g").attr("class", h.xgridFocus).append("line").attr("class", h.xgridFocus), a.xgrid = c.selectAll([]), a.xgridLines = c.selectAll([])
    }, f.updateXGrid = function(a) {
        var b = this,
            c = b.config,
            d = b.d3,
            e = b.generateGridData(c.grid_x_type, b.x),
            f = b.isCategorized() ? b.xAxis.tickOffset() : 0;
        b.xgridAttr = c.axis_rotated ? {
            x1: 0,
            x2: b.width,
            y1: function(a) {
                return b.x(a) - f
            },
            y2: function(a) {
                return b.x(a) - f
            }
        } : {
            x1: function(a) {
                return b.x(a) + f
            },
            x2: function(a) {
                return b.x(a) + f
            },
            y1: 0,
            y2: b.height
        }, b.xgrid = b.main.select("." + h.xgrids).selectAll("." + h.xgrid).data(e), b.xgrid.enter().append("line").attr("class", h.xgrid), a || b.xgrid.attr(b.xgridAttr).style("opacity", function() {
            return +d.select(this).attr(c.axis_rotated ? "y1" : "x1") === (c.axis_rotated ? b.height : 0) ? 0 : 1
        }), b.xgrid.exit().remove()
    }, f.updateYGrid = function() {
        var a = this,
            b = a.config;
        a.ygrid = a.main.select("." + h.ygrids).selectAll("." + h.ygrid).data(a.y.ticks(b.grid_y_ticks)), a.ygrid.enter().append("line").attr("class", h.ygrid), a.ygrid.attr("x1", b.axis_rotated ? a.y : 0).attr("x2", b.axis_rotated ? a.y : a.width).attr("y1", b.axis_rotated ? 0 : a.y).attr("y2", b.axis_rotated ? a.height : a.y), a.ygrid.exit().remove(), a.smoothLines(a.ygrid, "grid")
    }, f.redrawGrid = function(a, b) {
        var c, d, e, f = this,
            g = f.main,
            i = f.config;
        g.select("line." + h.xgridFocus).style("visibility", "hidden"), i.grid_x_show && f.updateXGrid(), f.xgridLines = g.select("." + h.xgridLines).selectAll("." + h.xgridLine).data(i.grid_x_lines), c = f.xgridLines.enter().append("g").attr("class", function(a) {
            return h.xgridLine + (a.class ? " " + a.class : "")
        }), c.append("line").style("opacity", 0), c.append("text").attr("text-anchor", "end").attr("transform", i.axis_rotated ? "" : "rotate(-90)").attr("dx", i.axis_rotated ? 0 : -f.margin.top).attr("dy", -5).style("opacity", 0), f.xgridLines.exit().transition().duration(a).style("opacity", 0).remove(), b && i.grid_y_show && f.updateYGrid(), b && (f.ygridLines = g.select("." + h.ygridLines).selectAll("." + h.ygridLine).data(i.grid_y_lines), d = f.ygridLines.enter().append("g").attr("class", function(a) {
            return h.ygridLine + (a.class ? " " + a.class : "")
        }), d.append("line").style("opacity", 0), d.append("text").attr("text-anchor", "end").attr("transform", i.axis_rotated ? "rotate(-90)" : "").attr("dx", i.axis_rotated ? 0 : -f.margin.top).attr("dy", -5).style("opacity", 0), e = f.yv.bind(f), f.ygridLines.select("line").transition().duration(a).attr("x1", i.axis_rotated ? e : 0).attr("x2", i.axis_rotated ? e : f.width).attr("y1", i.axis_rotated ? 0 : e).attr("y2", i.axis_rotated ? f.height : e).style("opacity", 1), f.ygridLines.select("text").transition().duration(a).attr("x", i.axis_rotated ? 0 : f.width).attr("y", e).text(function(a) {
            return a.text
        }).style("opacity", 1), f.ygridLines.exit().transition().duration(a).style("opacity", 0).remove())
    }, f.addTransitionForGrid = function(a) {
        var b = this,
            c = b.config,
            d = b.xv.bind(b);
        a.push(b.xgridLines.select("line").transition().attr("x1", c.axis_rotated ? 0 : d).attr("x2", c.axis_rotated ? b.width : d).attr("y1", c.axis_rotated ? d : b.margin.top).attr("y2", c.axis_rotated ? d : b.height).style("opacity", 1)), a.push(b.xgridLines.select("text").transition().attr("x", c.axis_rotated ? b.width : 0).attr("y", d).text(function(a) {
            return a.text
        }).style("opacity", 1))
    }, f.showXGridFocus = function(a) {
        var b = this,
            c = b.config,
            d = a.filter(function(a) {
                return a && i(a.value)
            }),
            e = b.main.selectAll("line." + h.xgridFocus),
            f = b.xx.bind(b);
        c.tooltip_show && (b.hasType("scatter") || b.hasArcType() || (e.style("visibility", "visible").data([d[0]]).attr(c.axis_rotated ? "y1" : "x1", f).attr(c.axis_rotated ? "y2" : "x2", f), b.smoothLines(e, "grid")))
    }, f.hideXGridFocus = function() {
        this.main.select("line." + h.xgridFocus).style("visibility", "hidden")
    }, f.updateXgridFocus = function() {
        var a = this,
            b = a.config;
        a.main.select("line." + h.xgridFocus).attr("x1", b.axis_rotated ? 0 : -10).attr("x2", b.axis_rotated ? a.width : -10).attr("y1", b.axis_rotated ? -10 : 0).attr("y2", b.axis_rotated ? -10 : a.height)
    }, f.generateGridData = function(a, b) {
        var c, d, e, f, g = this,
            i = [],
            j = g.main.select("." + h.axisX).selectAll(".tick").size();
        if ("year" === a)
            for (c = g.getXDomain(), d = c[0].getFullYear(), e = c[1].getFullYear(), f = d; e >= f; f++) i.push(new Date(f + "-01-01 00:00:00"));
        else i = b.ticks(10), i.length > j && (i = i.filter(function(a) {
            return ("" + a).indexOf(".") < 0
        }));
        return i
    }, f.getGridFilterToRemove = function(a) {
        return a ? function(b) {
            var c = !1;
            return [].concat(a).forEach(function(d) {
                ("value" in d && b.value === a.value || "class" in d && b.class === a.class) && (c = !0)
            }), c
        } : function() {
            return !0
        }
    }, f.removeGridLines = function(a, b) {
        var c = this,
            d = c.config,
            e = c.getGridFilterToRemove(a),
            f = function(a) {
                return !e(a)
            },
            g = b ? h.xgridLines : h.ygridLines,
            i = b ? h.xgridLine : h.ygridLine;
        c.main.select("." + g).selectAll("." + i).filter(e).transition().duration(d.transition_duration).style("opacity", 0).remove(), b ? d.grid_x_lines = d.grid_x_lines.filter(f) : d.grid_y_lines = d.grid_y_lines.filter(f)
    }, f.initTooltip = function() {
        var a, b = this,
            c = b.config;
        if (b.tooltip = b.selectChart.style("position", "relative").append("div").style("position", "absolute").style("pointer-events", "none").style("z-index", "10").style("display", "none"), c.tooltip_init_show) {
            if (b.isTimeSeries() && k(c.tooltip_init_x)) {
                for (c.tooltip_init_x = b.parseDate(c.tooltip_init_x), a = 0; a < b.data.targets[0].values.length && b.data.targets[0].values[a].x - c.tooltip_init_x !== 0; a++);
                c.tooltip_init_x = a
            }
            b.tooltip.html(c.tooltip_contents.call(b, b.data.targets.map(function(a) {
                return b.addName(a.values[c.tooltip_init_x])
            }), b.getXAxisTickFormat(), b.getYFormat(b.hasArcType()), b.color)), b.tooltip.style("top", c.tooltip_init_position.top).style("left", c.tooltip_init_position.left).style("display", "block")
        }
    }, f.getTooltipContent = function(a, b, c, d) {
        var e, f, g, i, j, k, l = this,
            m = l.config,
            n = m.tooltip_format_title || b,
            o = m.tooltip_format_name || function(a) {
                return a
            },
            p = m.tooltip_format_value || c;
        for (f = 0; f < a.length; f++) a[f] && (a[f].value || 0 === a[f].value) && (e || (g = n ? n(a[f].x) : a[f].x, e = "<table class='" + h.tooltip + "'>" + (g || 0 === g ? "<tr><th colspan='2'>" + g + "</th></tr>" : "")), j = o(a[f].name), i = p(a[f].value, a[f].ratio, a[f].id, a[f].index), k = l.levelColor ? l.levelColor(a[f].value) : d(a[f].id), e += "<tr class='" + h.tooltipName + "-" + a[f].id + "'>", e += "<td class='name'><span style='background-color:" + k + "'></span>" + j + "</td>", e += "<td class='value'>" + i + "</td>", e += "</tr>");
        return e + "</table>"
    }, f.showTooltip = function(a, b) {
        var c, d, e, f, g, h, j, k = this,
            l = k.config,
            m = k.hasArcType(),
            n = a.filter(function(a) {
                return a && i(a.value)
            });
        0 !== n.length && l.tooltip_show && (k.tooltip.html(l.tooltip_contents.call(k, a, k.getXAxisTickFormat(), k.getYFormat(m), k.color)).style("display", "block"), c = k.tooltip.property("offsetWidth"), d = k.tooltip.property("offsetHeight"), m ? (f = k.width / 2 + b[0], h = k.height / 2 + b[1] + 20) : (l.axis_rotated ? (e = k.getSvgLeft(), f = e + b[0] + 100, g = f + c, j = k.getCurrentWidth() - k.getCurrentPaddingRight(), h = k.x(n[0].x) + 20) : (e = k.getSvgLeft(), f = e + k.getCurrentPaddingLeft() + k.x(n[0].x) + 20, g = f + c, j = e + k.getCurrentWidth() - k.getCurrentPaddingRight(), h = b[1] + 15), g > j && (f -= g - j), h + d > k.getCurrentHeight() && h > d + 30 && (h -= d + 30)), k.tooltip.style("top", h + "px").style("left", f + "px"))
    }, f.hideTooltip = function() {
        this.tooltip.style("display", "none")
    }, f.initLegend = function() {
        var a = this;
        a.legend = a.svg.append("g").attr("transform", a.getTranslate("legend")), a.config.legend_show || (a.legend.style("visibility", "hidden"), a.hiddenLegendIds = a.mapToIds(a.data.targets)), a.updateLegend(a.mapToIds(a.data.targets), {
            withTransform: !1,
            withTransitionForTransform: !1,
            withTransition: !1
        })
    }, f.updateSizeForLegend = function(a, b) {
        var c = this,
            d = c.config,
            e = {
                top: c.isLegendTop ? c.getCurrentPaddingTop() + d.legend_inset_y + 5.5 : c.currentHeight - a - c.getCurrentPaddingBottom() - d.legend_inset_y,
                left: c.isLegendLeft ? c.getCurrentPaddingLeft() + d.legend_inset_x + .5 : c.currentWidth - b - c.getCurrentPaddingRight() - d.legend_inset_x + .5
            };
        c.margin3 = {
            top: c.isLegendRight ? 0 : c.isLegendInset ? e.top : c.currentHeight - a,
            right: 0 / 0,
            bottom: 0,
            left: c.isLegendRight ? c.currentWidth - b : c.isLegendInset ? e.left : 0
        }
    }, f.transformLegend = function(a) {
        var b = this;
        (a ? b.legend.transition() : b.legend).attr("transform", b.getTranslate("legend"))
    }, f.updateLegendStep = function(a) {
        this.legendStep = a
    }, f.updateLegendItemWidth = function(a) {
        this.legendItemWidth = a
    }, f.updateLegendItemHeight = function(a) {
        this.legendItemHeight = a
    }, f.getLegendWidth = function() {
        var a = this;
        return a.config.legend_show ? a.isLegendRight || a.isLegendInset ? a.legendItemWidth * (a.legendStep + 1) : a.currentWidth : 0
    }, f.getLegendHeight = function() {
        var a = this,
            b = a.config,
            c = 0;
        return b.legend_show && (c = a.isLegendRight ? a.currentHeight : a.isLegendInset ? b.legend_inset_step ? Math.max(20, a.legendItemHeight) * (b.legend_inset_step + 1) : a.height : Math.max(20, a.legendItemHeight) * (a.legendStep + 1)), c
    }, f.opacityForLegend = function(a) {
        var b = this;
        return a.classed(h.legendItemHidden) ? b.legendOpacityForHidden : 1
    }, f.opacityForUnfocusedLegend = function(a) {
        var b = this;
        return a.classed(h.legendItemHidden) ? b.legendOpacityForHidden : .3
    }, f.toggleFocusLegend = function(a, b) {
        var c = this;
        c.legend.selectAll("." + h.legendItem).transition().duration(100).style("opacity", function(d) {
            var e = c.d3.select(this);
            return a && d !== a ? b ? c.opacityForUnfocusedLegend(e) : c.opacityForLegend(e) : b ? c.opacityForLegend(e) : c.opacityForUnfocusedLegend(e)
        })
    }, f.revertLegend = function() {
        var a = this,
            b = a.d3;
        a.legend.selectAll("." + h.legendItem).transition().duration(100).style("opacity", function() {
            return a.opacityForLegend(b.select(this))
        })
    }, f.showLegend = function(a) {
        var b = this,
            c = b.config;
        c.legend_show || (c.legend_show = !0, b.legend.style("visibility", "visible")), b.removeHiddenLegendIds(a), b.legend.selectAll(b.selectorLegends(a)).style("visibility", "visible").transition().style("opacity", function() {
            return b.opacityForLegend(b.d3.select(this))
        })
    }, f.hideLegend = function(a) {
        var b = this,
            c = b.config;
        c.legend_show && q(a) && (c.legend_show = !1, b.legend.style("visibility", "hidden")), b.addHiddenLegendIds(a), b.legend.selectAll(b.selectorLegends(a)).style("opacity", 0).style("visibility", "hidden")
    }, f.updateLegend = function(a, b, c) {
        function d(b, c, d) {
            function e(a, b) {
                b || (f = (m - A - l) / 2, z > f && (f = (m - l) / 2, A = 0, G++)), F[a] = G, E[G] = t.isLegendInset ? 10 : f, B[a] = A, A += l
            }
            var f, g, i = t.getTextRect(b.textContent, h.legendItem),
                j = 10 * Math.ceil((i.width + w) / 10),
                k = 10 * Math.ceil((i.height + v) / 10),
                l = t.isLegendRight || t.isLegendInset ? k : j,
                m = t.isLegendRight || t.isLegendInset ? t.getLegendHeight() : t.getLegendWidth();
            return d && (A = 0, G = 0, x = 0, y = 0), u.legend_show && !t.isLegendToShow(c) ? void(C[c] = D[c] = F[c] = B[c] = 0) : (C[c] = j, D[c] = k, (!x || j >= x) && (x = j), (!y || k >= y) && (y = k), g = t.isLegendRight || t.isLegendInset ? y : x, void(u.legend_equally ? (Object.keys(C).forEach(function(a) {
                C[a] = x
            }), Object.keys(D).forEach(function(a) {
                D[a] = y
            }), f = (m - g * a.length) / 2, z > f ? (A = 0, G = 0, a.forEach(function(a) {
                e(a)
            })) : e(c, !0)) : e(c)))
        }
        var e, f, g, i, j, k, l, n, o, p, q, r, t = this,
            u = t.config,
            v = 4,
            w = 36,
            x = 0,
            y = 0,
            z = 10,
            A = 0,
            B = {},
            C = {},
            D = {},
            E = [0],
            F = {},
            G = 0,
            H = t.legend.selectAll("." + h.legendItemFocused).size();
        b = b || {}, n = s(b, "withTransition", !0), o = s(b, "withTransitionForTransform", !0), t.isLegendRight ? (e = function(a) {
            return x * F[a]
        }, i = function(a) {
            return E[F[a]] + B[a]
        }) : t.isLegendInset ? (e = function(a) {
            return x * F[a] + 10
        }, i = function(a) {
            return E[F[a]] + B[a]
        }) : (e = function(a) {
            return E[F[a]] + B[a]
        }, i = function(a) {
            return y * F[a]
        }), f = function(a, b) {
            return e(a, b) + 14
        }, j = function(a, b) {
            return i(a, b) + 9
        }, g = function(a, b) {
            return e(a, b) - 4
        }, k = function(a, b) {
            return i(a, b) - 7
        }, l = t.legend.selectAll("." + h.legendItem).data(a).enter().append("g").attr("class", function(a) {
            return t.generateClass(h.legendItem, a)
        }).style("visibility", function(a) {
            return t.isLegendToShow(a) ? "visible" : "hidden"
        }).style("cursor", "pointer").on("click", function(a) {
            u.legend_item_onclick ? u.legend_item_onclick.call(t, a) : t.api.toggle(a)
        }).on("mouseover", function(a) {
            t.d3.select(this).classed(h.legendItemFocused, !0), t.transiting || t.api.focus(a), u.legend_item_onmouseover && u.legend_item_onmouseover.call(t, a)
        }).on("mouseout", function(a) {
            t.d3.select(this).classed(h.legendItemFocused, !1), t.transiting || t.api.revert(), u.legend_item_onmouseout && u.legend_item_onmouseout.call(t, a)
        }), l.append("text").text(function(a) {
            return m(u.data_names[a]) ? u.data_names[a] : a
        }).each(function(a, b) {
            d(this, a, 0 === b)
        }).style("pointer-events", "none").attr("x", t.isLegendRight || t.isLegendInset ? f : -200).attr("y", t.isLegendRight || t.isLegendInset ? -200 : j), l.append("rect").attr("class", h.legendItemEvent).style("fill-opacity", 0).attr("x", t.isLegendRight || t.isLegendInset ? g : -200).attr("y", t.isLegendRight || t.isLegendInset ? -200 : k), l.append("rect").attr("class", h.legendItemTile).style("pointer-events", "none").style("fill", t.color).attr("x", t.isLegendRight || t.isLegendInset ? f : -200).attr("y", t.isLegendRight || t.isLegendInset ? -200 : i).attr("width", 10).attr("height", 10), t.isLegendInset && 0 !== x && t.legend.insert("g", "." + h.legendItem).attr("class", h.legendBackground).append("rect").attr("height", t.getLegendHeight() - 10).attr("width", x * (G + 1) + 10), p = t.legend.selectAll("text").data(a).text(function(a) {
            return m(u.data_names[a]) ? u.data_names[a] : a
        }).each(function(a, b) {
            d(this, a, 0 === b)
        }), (n ? p.transition() : p).attr("x", f).attr("y", j), q = t.legend.selectAll("rect." + h.legendItemEvent).data(a), (n ? q.transition() : q).attr("width", function(a) {
            return C[a]
        }).attr("height", function(a) {
            return D[a]
        }).attr("x", g).attr("y", k), r = t.legend.selectAll("rect." + h.legendItemTile).data(a), (n ? r.transition() : r).style("fill", t.color).attr("x", e).attr("y", i), t.legend.selectAll("." + h.legendItem).classed(h.legendItemHidden, function(a) {
            return !t.isTargetToShow(a)
        }).transition().style("opacity", function(a) {
            var b = t.d3.select(this);
            return t.isTargetToShow(a) ? !H || b.classed(h.legendItemFocused) ? t.opacityForLegend(b) : t.opacityForUnfocusedLegend(b) : t.legendOpacityForHidden
        }), t.updateLegendItemWidth(x), t.updateLegendItemHeight(y), t.updateLegendStep(G), t.updateSizes(), t.updateScales(), t.updateSvgSize(), t.transformAll(o, c)
    }, f.initAxis = function() {
        var a = this,
            b = a.config,
            c = a.main;
        a.axes.x = c.append("g").attr("class", h.axis + " " + h.axisX).attr("clip-path", a.clipPathForXAxis).attr("transform", a.getTranslate("x")).style("visibility", b.axis_x_show ? "visible" : "hidden"), a.axes.x.append("text").attr("class", h.axisXLabel).attr("transform", b.axis_rotated ? "rotate(-90)" : "").style("text-anchor", a.textAnchorForXAxisLabel.bind(a)), a.axes.y = c.append("g").attr("class", h.axis + " " + h.axisY).attr("clip-path", a.clipPathForYAxis).attr("transform", a.getTranslate("y")).style("visibility", b.axis_y_show ? "visible" : "hidden"), a.axes.y.append("text").attr("class", h.axisYLabel).attr("transform", b.axis_rotated ? "" : "rotate(-90)").style("text-anchor", a.textAnchorForYAxisLabel.bind(a)), a.axes.y2 = c.append("g").attr("class", h.axis + " " + h.axisY2).attr("transform", a.getTranslate("y2")).style("visibility", b.axis_y2_show ? "visible" : "hidden"), a.axes.y2.append("text").attr("class", h.axisY2Label).attr("transform", b.axis_rotated ? "" : "rotate(-90)").style("text-anchor", a.textAnchorForY2AxisLabel.bind(a))
    }, f.getXAxis = function(a, b, c, e) {
        var f = this,
            g = f.config,
            h = d(f.d3, f.isCategorized()).scale(a).orient(b);
        return h.tickFormat(c).tickValues(e), f.isCategorized() ? (h.tickCentered(g.axis_x_tick_centered), q(g.axis_x_tick_culling) && (g.axis_x_tick_culling = !1)) : h.tickOffset = function() {
            var a = f.getEdgeX(f.data.targets),
                b = f.x(a[1]) - f.x(a[0]),
                c = b ? b : g.axis_rotated ? f.height : f.width;
            return c / f.getMaxDataCount() / 2
        }, h
    }, f.getYAxis = function(a, b, c, e) {
        return d(this.d3).scale(a).orient(b).tickFormat(c).ticks(e)
    }, f.getAxisId = function(a) {
        var b = this.config;
        return a in b.data_axes ? b.data_axes[a] : "y"
    }, f.getXAxisTickFormat = function() {
        var a = this,
            b = a.config,
            c = a.isTimeSeries() ? a.defaultAxisTimeFormat : a.isCategorized() ? a.categoryName : function(a) {
                return 0 > a ? a.toFixed(0) : a
            };
        return b.axis_x_tick_format && (j(b.axis_x_tick_format) ? c = b.axis_x_tick_format : a.isTimeSeries() && (c = function(c) {
            return c ? a.axisTimeFormat(b.axis_x_tick_format)(c) : ""
        })), j(c) ? function(b) {
            return c.call(a, b)
        } : c
    }, f.getAxisLabelOptionByAxisId = function(a) {
        var b, c = this,
            d = c.config;
        return "y" === a ? b = d.axis_y_label : "y2" === a ? b = d.axis_y2_label : "x" === a && (b = d.axis_x_label), b
    }, f.getAxisLabelText = function(a) {
        var b = this.getAxisLabelOptionByAxisId(a);
        return k(b) ? b : b ? b.text : null
    }, f.setAxisLabelText = function(a, b) {
        var c = this,
            d = c.config,
            e = c.getAxisLabelOptionByAxisId(a);
        k(e) ? "y" === a ? d.axis_y_label = b : "y2" === a ? d.axis_y2_label = b : "x" === a && (d.axis_x_label = b) : e && (e.text = b)
    }, f.getAxisLabelPosition = function(a, b) {
        var c = this.getAxisLabelOptionByAxisId(a),
            d = c && "object" == typeof c && c.position ? c.position : b;
        return {
            isInner: d.indexOf("inner") >= 0,
            isOuter: d.indexOf("outer") >= 0,
            isLeft: d.indexOf("left") >= 0,
            isCenter: d.indexOf("center") >= 0,
            isRight: d.indexOf("right") >= 0,
            isTop: d.indexOf("top") >= 0,
            isMiddle: d.indexOf("middle") >= 0,
            isBottom: d.indexOf("bottom") >= 0
        }
    }, f.getXAxisLabelPosition = function() {
        return this.getAxisLabelPosition("x", this.config.axis_rotated ? "inner-top" : "inner-right")
    }, f.getYAxisLabelPosition = function() {
        return this.getAxisLabelPosition("y", this.config.axis_rotated ? "inner-right" : "inner-top")
    }, f.getY2AxisLabelPosition = function() {
        return this.getAxisLabelPosition("y2", this.config.axis_rotated ? "inner-right" : "inner-top")
    }, f.getAxisLabelPositionById = function(a) {
        return "y2" === a ? this.getY2AxisLabelPosition() : "y" === a ? this.getYAxisLabelPosition() : this.getXAxisLabelPosition()
    }, f.textForXAxisLabel = function() {
        return this.getAxisLabelText("x")
    }, f.textForYAxisLabel = function() {
        return this.getAxisLabelText("y")
    }, f.textForY2AxisLabel = function() {
        return this.getAxisLabelText("y2")
    }, f.xForAxisLabel = function(a, b) {
        var c = this;
        return a ? b.isLeft ? 0 : b.isCenter ? c.width / 2 : c.width : b.isBottom ? -c.height : b.isMiddle ? -c.height / 2 : 0
    }, f.dxForAxisLabel = function(a, b) {
        return a ? b.isLeft ? "0.5em" : b.isRight ? "-0.5em" : "0" : b.isTop ? "-0.5em" : b.isBottom ? "0.5em" : "0"
    }, f.textAnchorForAxisLabel = function(a, b) {
        return a ? b.isLeft ? "start" : b.isCenter ? "middle" : "end" : b.isBottom ? "start" : b.isMiddle ? "middle" : "end"
    }, f.xForXAxisLabel = function() {
        return this.xForAxisLabel(!this.config.axis_rotated, this.getXAxisLabelPosition())
    }, f.xForYAxisLabel = function() {
        return this.xForAxisLabel(this.config.axis_rotated, this.getYAxisLabelPosition())
    }, f.xForY2AxisLabel = function() {
        return this.xForAxisLabel(this.config.axis_rotated, this.getY2AxisLabelPosition())
    }, f.dxForXAxisLabel = function() {
        return this.dxForAxisLabel(!this.config.axis_rotated, this.getXAxisLabelPosition())
    }, f.dxForYAxisLabel = function() {
        return this.dxForAxisLabel(this.config.axis_rotated, this.getYAxisLabelPosition())
    }, f.dxForY2AxisLabel = function() {
        return this.dxForAxisLabel(this.config.axis_rotated, this.getY2AxisLabelPosition())
    }, f.dyForXAxisLabel = function() {
        var a = this,
            b = a.config,
            c = a.getXAxisLabelPosition();
        return b.axis_rotated ? c.isInner ? "1.2em" : -25 - a.getMaxTickWidth("x") : c.isInner ? "-0.5em" : b.axis_x_height ? b.axis_x_height - 10 : "3em"
    }, f.dyForYAxisLabel = function() {
        var a = this,
            b = a.getYAxisLabelPosition();
        return a.config.axis_rotated ? b.isInner ? "-0.5em" : "3em" : b.isInner ? "1.2em" : -20 - a.getMaxTickWidth("y")
    }, f.dyForY2AxisLabel = function() {
        var a = this,
            b = a.getY2AxisLabelPosition();
        return a.config.axis_rotated ? b.isInner ? "1.2em" : "-2.2em" : b.isInner ? "-0.5em" : 30 + this.getMaxTickWidth("y2")
    }, f.textAnchorForXAxisLabel = function() {
        var a = this;
        return a.textAnchorForAxisLabel(!a.config.axis_rotated, a.getXAxisLabelPosition())
    }, f.textAnchorForYAxisLabel = function() {
        var a = this;
        return a.textAnchorForAxisLabel(a.config.axis_rotated, a.getYAxisLabelPosition())
    }, f.textAnchorForY2AxisLabel = function() {
        var a = this;
        return a.textAnchorForAxisLabel(a.config.axis_rotated, a.getY2AxisLabelPosition())
    }, f.xForRotatedTickText = function(a) {
        return 10 * Math.sin(Math.PI * (a / 180))
    }, f.yForRotatedTickText = function(a) {
        return 11.5 - 2.5 * (a / 15)
    }, f.rotateTickText = function(a, b, c) {
        a.selectAll(".tick text").style("text-anchor", "start"), b.selectAll(".tick text").attr("y", this.yForRotatedTickText(c)).attr("x", this.xForRotatedTickText(c)).attr("transform", "rotate(" + c + ")")
    }, f.getMaxTickWidth = function(a) {
        var b, c, d, e = this,
            f = e.config,
            g = 0;
        return e.svg && (b = e.filterTargetsToShow(e.data.targets), "y" === a ? (c = e.y.copy().domain(e.getYDomain(b, "y")), d = e.getYAxis(c, e.yOrient, f.axis_y_tick_format, f.axis_y_ticks)) : "y2" === a ? (c = e.y2.copy().domain(e.getYDomain(b, "y2")), d = e.getYAxis(c, e.y2Orient, f.axis_y2_tick_format, f.axis_y2_ticks)) : (c = e.x.copy().domain(e.getXDomain(b)), d = e.getXAxis(c, e.xOrient, e.getXAxisTickFormat(), f.axis_x_tick_values ? f.axis_x_tick_values : e.xAxis.tickValues())), e.main.append("g").call(d).each(function() {
            e.d3.select(this).selectAll("text").each(function() {
                var a = this.getBoundingClientRect();
                g < a.width && (g = a.width)
            })
        }).remove()), e.currentMaxTickWidth = 0 >= g ? e.currentMaxTickWidth : g, e.currentMaxTickWidth
    }, f.updateAxisLabels = function(a) {
        var b = this,
            c = b.main.select("." + h.axisX + " ." + h.axisXLabel),
            d = b.main.select("." + h.axisY + " ." + h.axisYLabel),
            e = b.main.select("." + h.axisY2 + " ." + h.axisY2Label);
        (a ? c.transition() : c).attr("x", b.xForXAxisLabel.bind(b)).attr("dx", b.dxForXAxisLabel.bind(b)).attr("dy", b.dyForXAxisLabel.bind(b)).text(b.textForXAxisLabel.bind(b)), (a ? d.transition() : d).attr("x", b.xForYAxisLabel.bind(b)).attr("dx", b.dxForYAxisLabel.bind(b)).attr("dy", b.dyForYAxisLabel.bind(b)).text(b.textForYAxisLabel.bind(b)), (a ? e.transition() : e).attr("x", b.xForY2AxisLabel.bind(b)).attr("dx", b.dxForY2AxisLabel.bind(b)).attr("dy", b.dyForY2AxisLabel.bind(b)).text(b.textForY2AxisLabel.bind(b))
    }, f.getAxisPadding = function(a, b, c, d) {
        var e = "ratio" === a.unit ? d : 1;
        return i(a[b]) ? a[b] * e : c
    }, f.generateTickValues = function(a, b) {
        var c, d, e, f, g, h, i, k = this,
            l = a;
        if (b)
            if (c = j(b) ? b() : b, 1 === c) l = [a[0]];
            else if (2 === c) l = [a[0], a[a.length - 1]];
        else if (c > 2) {
            for (f = c - 2, d = a[0], e = a[a.length - 1], g = (e - d) / (f + 1), l = [d], h = 0; f > h; h++) i = +d + g * (h + 1), l.push(k.isTimeSeries() ? new Date(i) : i);
            l.push(e)
        }
        return k.isTimeSeries() || (l = l.sort(function(a, b) {
            return a - b
        })), l
    }, f.generateAxisTransitions = function(a) {
        var b = this,
            c = b.axes;
        return {
            axisX: a ? c.x.transition().duration(a) : c.x,
            axisY: a ? c.y.transition().duration(a) : c.y,
            axisY2: a ? c.y2.transition().duration(a) : c.y2,
            axisSubX: a ? c.subx.transition().duration(a) : c.subx
        }
    }, f.redrawAxis = function(a, b) {
        var c = this;
        c.axes.x.style("opacity", b ? 0 : 1), c.axes.y.style("opacity", b ? 0 : 1), c.axes.y2.style("opacity", b ? 0 : 1), c.axes.subx.style("opacity", b ? 0 : 1), a.axisX.call(c.xAxis), a.axisY.call(c.yAxis), a.axisY2.call(c.y2Axis), a.axisSubX.call(c.subXAxis)
    }, f.getClipPath = function(b) {
        var c = a.navigator.appVersion.toLowerCase().indexOf("msie 9.") >= 0;
        return "url(" + (c ? "" : document.URL.split("#")[0]) + "#" + b + ")"
    }, f.getAxisClipX = function(a) {
        return a ? -31 : -(this.margin.left - 1)
    }, f.getAxisClipY = function(a) {
        return a ? -20 : -4
    }, f.getXAxisClipX = function() {
        var a = this;
        return a.getAxisClipX(!a.config.axis_rotated)
    }, f.getXAxisClipY = function() {
        var a = this;
        return a.getAxisClipY(!a.config.axis_rotated)
    }, f.getYAxisClipX = function() {
        var a = this;
        return a.getAxisClipX(a.config.axis_rotated)
    }, f.getYAxisClipY = function() {
        var a = this;
        return a.getAxisClipY(a.config.axis_rotated)
    }, f.getAxisClipWidth = function(a) {
        var b = this;
        return a ? b.width + 2 + 30 + 30 : b.margin.left + 20
    }, f.getAxisClipHeight = function(a) {
        var b = this,
            c = b.config;
        return a ? (c.axis_x_height ? c.axis_x_height : 0) + 80 : b.height + 8
    }, f.getXAxisClipWidth = function() {
        var a = this;
        return a.getAxisClipWidth(!a.config.axis_rotated)
    }, f.getXAxisClipHeight = function() {
        var a = this;
        return a.getAxisClipHeight(!a.config.axis_rotated)
    }, f.getYAxisClipWidth = function() {
        var a = this;
        return a.getAxisClipWidth(a.config.axis_rotated)
    }, f.getYAxisClipHeight = function() {
        var a = this;
        return a.getAxisClipHeight(a.config.axis_rotated)
    }, f.initPie = function() {
        var a = this,
            b = a.d3,
            c = a.config;
        a.pie = b.layout.pie().value(function(a) {
            return a.values.reduce(function(a, b) {
                return a + b.value
            }, 0)
        }), c.data_order && c.pie_sort && c.donut_sort || a.pie.sort(null)
    }, f.updateRadius = function() {
        var a = this,
            b = a.config,
            c = b.gauge_width || b.donut_width;
        a.radiusExpanded = Math.min(a.arcWidth, a.arcHeight) / 2, a.radius = .95 * a.radiusExpanded, a.innerRadiusRatio = c ? (a.radius - c) / a.radius : .6, a.innerRadius = a.hasType("donut") || a.hasType("gauge") ? a.radius * a.innerRadiusRatio : 0
    }, f.updateArc = function() {
        var a = this;
        a.svgArc = a.getSvgArc(), a.svgArcExpanded = a.getSvgArcExpanded(), a.svgArcExpandedSub = a.getSvgArcExpanded(.98)
    }, f.updateAngle = function(a) {
        var b = this,
            c = b.config,
            d = !1,
            e = 0;
        if (b.pie(b.filterTargetsToShow(b.data.targets)).sort(b.descByStartAngle).forEach(function(b) {
                d || b.data.id !== a.data.id || (d = !0, a = b, a.index = e), e++
            }), isNaN(a.endAngle) && (a.endAngle = a.startAngle), b.isGaugeType(a.data)) {
            var f = c.gauge_min,
                g = c.gauge_max,
                h = Math.abs(f) + g,
                i = Math.PI / h;
            a.startAngle = -1 * (Math.PI / 2) + i * Math.abs(f), a.endAngle = a.startAngle + i * (a.value > g ? g : a.value)
        }
        return d ? a : null
    }, f.getSvgArc = function() {
        var a = this,
            b = a.d3.svg.arc().outerRadius(a.radius).innerRadius(a.innerRadius),
            c = function(c, d) {
                var e;
                return d ? b(c) : (e = a.updateAngle(c), e ? b(e) : "M 0 0")
            };
        return c.centroid = b.centroid, c
    }, f.getSvgArcExpanded = function(a) {
        var b = this,
            c = b.d3.svg.arc().outerRadius(b.radiusExpanded * (a ? a : 1)).innerRadius(b.innerRadius);
        return function(a) {
            var d = b.updateAngle(a);
            return d ? c(d) : "M 0 0"
        }
    }, f.getArc = function(a, b, c) {
        return c || this.isArcType(a.data) ? this.svgArc(a, b) : "M 0 0"
    }, f.transformForArcLabel = function(a) {
        var b, c, d, e, f, g = this,
            h = g.updateAngle(a),
            i = "";
        return h && !g.hasType("gauge") && (b = this.svgArc.centroid(h), c = isNaN(b[0]) ? 0 : b[0], d = isNaN(b[1]) ? 0 : b[1], e = Math.sqrt(c * c + d * d), f = g.radius && e ? (36 / g.radius > .375 ? 1.175 - 36 / g.radius : .8) * g.radius / e : 0, i = "translate(" + c * f + "," + d * f + ")"), i
    }, f.getArcRatio = function(a) {
        var b = this,
            c = b.hasType("gauge") ? Math.PI : 2 * Math.PI;
        return a ? (a.endAngle - a.startAngle) / c : null
    }, f.convertToArcData = function(a) {
        return this.addName({
            id: a.data.id,
            value: a.value,
            ratio: this.getArcRatio(a),
            index: a.index
        })
    }, f.textForArcLabel = function(a) {
        var b, c, d, e, f = this;
        return f.shouldShowArcLabel() ? (b = f.updateAngle(a), c = b ? b.value : null, d = f.getArcRatio(b), f.hasType("gauge") || f.meetsArcLabelThreshold(d) ? (e = f.getArcLabelFormat(), e ? e(c, d) : f.defaultArcValueFormat(c, d)) : "") : ""
    }, f.expandArc = function(a, b) {
        var c = this,
            d = c.svg.selectAll("." + h.chartArc + c.selectorTarget(a)),
            e = c.svg.selectAll("." + h.arc).filter(function(b) {
                return b.data.id !== a
            });
        c.shouldExpand(a) && d.selectAll("path").transition().duration(50).attr("d", c.svgArcExpanded).transition().duration(100).attr("d", c.svgArcExpandedSub).each(function(a) {
            c.isDonutType(a.data)
        }), b || e.style("opacity", .3)
    }, f.unexpandArc = function(a) {
        var b = this,
            c = b.svg.selectAll("." + h.chartArc + b.selectorTarget(a));
        c.selectAll("path." + h.arc).transition().duration(50).attr("d", b.svgArc), b.svg.selectAll("." + h.arc).style("opacity", 1)
    }, f.shouldExpand = function(a) {
        var b = this,
            c = b.config;
        return b.isDonutType(a) && c.donut_expand || b.isGaugeType(a) && c.gauge_expand || b.isPieType(a) && c.pie_expand
    }, f.shouldShowArcLabel = function() {
        var a = this,
            b = a.config,
            c = !0;
        return a.hasType("donut") ? c = b.donut_label_show : a.hasType("pie") && (c = b.pie_label_show), c
    }, f.meetsArcLabelThreshold = function(a) {
        var b = this,
            c = b.config,
            d = b.hasType("donut") ? c.donut_label_threshold : c.pie_label_threshold;
        return a >= d
    }, f.getArcLabelFormat = function() {
        var a = this,
            b = a.config,
            c = b.pie_label_format;
        return a.hasType("gauge") ? c = b.gauge_label_format : a.hasType("donut") && (c = b.donut_label_format), c
    }, f.getArcTitle = function() {
        var a = this;
        return a.hasType("donut") ? a.config.donut_title : ""
    }, f.descByStartAngle = function(a, b) {
        return a.startAngle - b.startAngle
    }, f.updateTargetsForArc = function(a) {
        var b, c, d = this,
            e = d.main,
            f = d.classChartArc.bind(d),
            g = d.classArcs.bind(d);
        b = e.select("." + h.chartArcs).selectAll("." + h.chartArc).data(d.pie(a)).attr("class", f), c = b.enter().append("g").attr("class", f), c.append("g").attr("class", g), c.append("text").attr("dy", d.hasType("gauge") ? "-0.35em" : ".35em").style("opacity", 0).style("text-anchor", "middle").style("pointer-events", "none")
    }, f.initArc = function() {
        var a = this;
        a.arcs = a.main.select("." + h.chart).append("g").attr("class", h.chartArcs).attr("transform", a.getTranslate("arc")), a.arcs.append("text").attr("class", h.chartArcsTitle).style("text-anchor", "middle").text(a.getArcTitle())
    }, f.redrawArc = function(a, b, c) {
        var d, e = this,
            f = e.d3,
            g = e.config,
            i = e.main;
        d = i.selectAll("." + h.arcs).selectAll("." + h.arc).data(e.arcData.bind(e)), d.enter().append("path").attr("class", e.classArc.bind(e)).style("fill", function(a) {
            return e.color(a.data)
        }).style("cursor", function(a) {
            return g.data_selection_isselectable(a) ? "pointer" : null
        }).style("opacity", 0).each(function(a) {
            e.isGaugeType(a.data) && (a.startAngle = a.endAngle = -1 * (Math.PI / 2)), this._current = a
        }).on("mouseover", function(a) {
            var b, c;
            e.transiting || (b = e.updateAngle(a), c = e.convertToArcData(b), e.expandArc(b.data.id), e.toggleFocusLegend(b.data.id, !0), e.config.data_onmouseover(c, this))
        }).on("mousemove", function(a) {
            var b = e.updateAngle(a),
                c = e.convertToArcData(b),
                d = [c];
            e.showTooltip(d, f.mouse(this))
        }).on("mouseout", function(a) {
            var b, c;
            e.transiting || (b = e.updateAngle(a), c = e.convertToArcData(b), e.unexpandArc(b.data.id), e.revertLegend(), e.hideTooltip(), e.config.data_onmouseout(c, this))
        }).on("click", function(a, b) {
            var c, d;
            e.toggleShape && (c = e.updateAngle(a), d = e.convertToArcData(c), e.toggleShape(this, d, b))
        }), d.attr("transform", function(a) {
            return !e.isGaugeType(a.data) && c ? "scale(0)" : ""
        }).style("opacity", function(a) {
            return a === this._current ? 0 : 1
        }).each(function() {
            e.transiting = !0
        }).transition().duration(a).attrTween("d", function(a) {
            var b, c = e.updateAngle(a);
            return c ? (isNaN(this._current.endAngle) && (this._current.endAngle = this._current.startAngle), b = f.interpolate(this._current, c), this._current = b(0), function(a) {
                return e.getArc(b(a), !0)
            }) : function() {
                return "M 0 0"
            }
        }).attr("transform", c ? "scale(1)" : "").style("fill", function(a) {
            return e.levelColor ? e.levelColor(a.data.values[0].value) : e.color(a.data.id)
        }).style("opacity", 1).call(e.endall, function() {
            e.transiting = !1
        }), d.exit().transition().duration(b).style("opacity", 0).remove(), i.selectAll("." + h.chartArc).select("text").style("opacity", 0).attr("class", function(a) {
            return e.isGaugeType(a.data) ? h.gaugeValue : ""
        }).text(e.textForArcLabel.bind(e)).attr("transform", e.transformForArcLabel.bind(e)).transition().duration(a).style("opacity", function(a) {
            return e.isTargetToShow(a.data.id) && e.isArcType(a.data) ? 1 : 0
        }), i.select("." + h.chartArcsTitle).style("opacity", e.hasType("donut") || e.hasType("gauge") ? 1 : 0)
    }, f.initGauge = function() {
        var a = this,
            b = a.config,
            c = a.arcs;
        a.hasType("gauge") && (c.append("path").attr("class", h.chartArcsBackground).attr("d", function() {
            var c = {
                data: [{
                    value: b.gauge_max
                }],
                startAngle: -1 * (Math.PI / 2),
                endAngle: Math.PI / 2
            };
            return a.getArc(c, !0, !0)
        }), c.append("text").attr("dy", ".75em").attr("class", h.chartArcsGaugeUnit).style("text-anchor", "middle").style("pointer-events", "none").text(b.gauge_label_show ? b.gauge_units : ""), c.append("text").attr("dx", -1 * (a.innerRadius + (a.radius - a.innerRadius) / 2) + "px").attr("dy", "1.2em").attr("class", h.chartArcsGaugeMin).style("text-anchor", "middle").style("pointer-events", "none").text(b.gauge_label_show ? b.gauge_min : ""), c.append("text").attr("dx", a.innerRadius + (a.radius - a.innerRadius) / 2 + "px").attr("dy", "1.2em").attr("class", h.chartArcsGaugeMax).style("text-anchor", "middle").style("pointer-events", "none").text(b.gauge_label_show ? b.gauge_max : ""))
    }, f.initRegion = function() {
        var a = this;
        a.main.append("g").attr("clip-path", a.clipPath).attr("class", h.regions)
    }, f.redrawRegion = function(a) {
        var b = this,
            c = b.config;
        b.mainRegion = b.main.select("." + h.regions).selectAll("." + h.region).data(c.regions), b.mainRegion.enter().append("g").attr("class", b.classRegion.bind(b)).append("rect").style("fill-opacity", 0), b.mainRegion.exit().transition().duration(a).style("opacity", 0).remove()
    }, f.addTransitionForRegion = function(a) {
        var b = this,
            c = b.regionX.bind(b),
            d = b.regionY.bind(b),
            e = b.regionWidth.bind(b),
            f = b.regionHeight.bind(b);
        a.push(b.mainRegion.selectAll("rect").transition().attr("x", c).attr("y", d).attr("width", e).attr("height", f).style("fill-opacity", function(a) {
            return i(a.opacity) ? a.opacity : 1
        }))
    }, f.regionX = function(a) {
        var b, c = this,
            d = c.config,
            e = "y" === a.axis ? c.y : c.y2;
        return b = "y" === a.axis || "y2" === a.axis ? d.axis_rotated ? "start" in a ? e(a.start) : 0 : 0 : d.axis_rotated ? 0 : "start" in a ? c.x(c.isTimeSeries() ? c.parseDate(a.start) : a.start) : 0
    }, f.regionY = function(a) {
        var b, c = this,
            d = c.config,
            e = "y" === a.axis ? c.y : c.y2;
        return b = "y" === a.axis || "y2" === a.axis ? d.axis_rotated ? 0 : "end" in a ? e(a.end) : 0 : d.axis_rotated ? "start" in a ? c.x(c.isTimeSeries() ? c.parseDate(a.start) : a.start) : 0 : 0
    }, f.regionWidth = function(a) {
        var b, c = this,
            d = c.config,
            e = c.regionX(a),
            f = "y" === a.axis ? c.y : c.y2;
        return b = "y" === a.axis || "y2" === a.axis ? d.axis_rotated ? "end" in a ? f(a.end) : c.width : c.width : d.axis_rotated ? c.width : "end" in a ? c.x(c.isTimeSeries() ? c.parseDate(a.end) : a.end) : c.width, e > b ? 0 : b - e
    }, f.regionHeight = function(a) {
        var b, c = this,
            d = c.config,
            e = this.regionY(a),
            f = "y" === a.axis ? c.y : c.y2;
        return b = "y" === a.axis || "y2" === a.axis ? d.axis_rotated ? c.height : "start" in a ? f(a.start) : c.height : d.axis_rotated ? "end" in a ? c.x(c.isTimeSeries() ? c.parseDate(a.end) : a.end) : c.height : c.height, e > b ? 0 : b - e
    }, f.isRegionOnX = function(a) {
        return !a.axis || "x" === a.axis
    }, f.drag = function(a) {
        var b, c, d, e, f, g, i, j, k = this,
            l = k.config,
            m = k.main,
            n = k.d3;
        k.hasArcType() || l.data_selection_enabled && (!l.zoom_enabled || k.zoom.altDomain) && l.data_selection_multiple && (b = k.dragStart[0], c = k.dragStart[1], d = a[0], e = a[1], f = Math.min(b, d), g = Math.max(b, d), i = l.data_selection_grouped ? k.margin.top : Math.min(c, e), j = l.data_selection_grouped ? k.height : Math.max(c, e), m.select("." + h.dragarea).attr("x", f).attr("y", i).attr("width", g - f).attr("height", j - i), m.selectAll("." + h.shapes).selectAll("." + h.shape).filter(function(a) {
            return l.data_selection_isselectable(a)
        }).each(function(a, b) {
            var c, d, e, l, m, o, p = n.select(this),
                q = p.classed(h.SELECTED),
                r = p.classed(h.INCLUDED),
                s = !1;
            if (p.classed(h.circle)) c = 1 * p.attr("cx"), d = 1 * p.attr("cy"), m = k.togglePoint, s = c > f && g > c && d > i && j > d;
            else {
                if (!p.classed(h.bar)) return;
                o = u(this), c = o.x, d = o.y, e = o.width, l = o.height, m = k.toggleBar, s = !(c > g || f > c + e || d > j || i > d + l)
            }
            s ^ r && (p.classed(h.INCLUDED, !r), p.classed(h.SELECTED, !q), m.call(k, !q, p, a, b))
        }))
    }, f.dragstart = function(a) {
        var b = this,
            c = b.config;
        b.hasArcType() || c.data_selection_enabled && (b.dragStart = a, b.main.select("." + h.chart).append("rect").attr("class", h.dragarea).style("opacity", .1), b.dragging = !0, b.config.data_ondragstart())
    }, f.dragend = function() {
        var a = this,
            b = a.config;
        a.hasArcType() || b.data_selection_enabled && (a.main.select("." + h.dragarea).transition().duration(100).style("opacity", 0).remove(), a.main.selectAll("." + h.shape).classed(h.INCLUDED, !1), a.dragging = !1, a.config.data_ondragend())
    }, f.selectPoint = function(a, b, c) {
        var d = this,
            e = d.config,
            f = (e.axis_rotated ? d.circleY : d.circleX).bind(d),
            g = (e.axis_rotated ? d.circleX : d.circleY).bind(d),
            i = d.pointSelectR.bind(d);
        e.data_onselected.call(d.api, b, a.node()), d.main.select("." + h.selectedCircles + d.getTargetSelectorSuffix(b.id)).selectAll("." + h.selectedCircle + "-" + c).data([b]).enter().append("circle").attr("class", function() {
            return d.generateClass(h.selectedCircle, c)
        }).attr("cx", f).attr("cy", g).attr("stroke", function() {
            return d.color(b)
        }).attr("r", function(a) {
            return 1.4 * d.pointSelectR(a)
        }).transition().duration(100).attr("r", i)
    }, f.unselectPoint = function(a, b, c) {
        var d = this;
        d.config.data_onunselected(b, a.node()), d.main.select("." + h.selectedCircles + d.getTargetSelectorSuffix(b.id)).selectAll("." + h.selectedCircle + "-" + c).transition().duration(100).attr("r", 0).remove()
    }, f.togglePoint = function(a, b, c, d) {
        a ? this.selectPoint(b, c, d) : this.unselectPoint(b, c, d)
    }, f.selectBar = function(a, b) {
        var c = this;
        c.config.data_onselected.call(c, b, a.node()), a.transition().duration(100).style("fill", function() {
            return c.d3.rgb(c.color(b)).brighter(.75)
        })
    }, f.unselectBar = function(a, b) {
        var c = this;
        c.config.data_onunselected.call(c, b, a.node()), a.transition().duration(100).style("fill", function() {
            return c.color(b)
        })
    }, f.toggleBar = function(a, b, c, d) {
        a ? this.selectBar(b, c, d) : this.unselectBar(b, c, d)
    }, f.toggleArc = function(a, b, c, d) {
        this.toggleBar(a, b, c.data, d)
    }, f.getToggle = function(a) {
        var b = this;
        return "circle" === a.nodeName ? b.togglePoint : b.d3.select(a).classed(h.bar) ? b.toggleBar : b.toggleArc
    }, f.toggleShape = function(a, b, c) {
        var d, e, f = this,
            g = f.d3,
            i = f.config,
            j = g.select(a),
            k = j.classed(h.SELECTED);
        "circle" === a.nodeName ? (d = f.isWithinCircle(a, 1.5 * f.pointSelectR(b)), e = f.togglePoint) : "path" === a.nodeName && (j.classed(h.bar) ? (d = f.isWithinBar(a), e = f.toggleBar) : (d = !0, e = f.toggleArc)), (i.data_selection_grouped || d) && (i.data_selection_enabled && i.data_selection_isselectable(b) && (i.data_selection_multiple || f.main.selectAll("." + h.shapes + (i.data_selection_grouped ? f.getTargetSelectorSuffix(b.id) : "")).selectAll("." + h.shape).each(function(a, b) {
            var c = g.select(this);
            c.classed(h.SELECTED) && e.call(f, !1, c.classed(h.SELECTED, !1), a, b)
        }), j.classed(h.SELECTED, !k), e.call(f, !k, j, b, c)), f.config.data_onclick.call(f.api, b, a))
    }, f.initBrush = function() {
        var a = this,
            b = a.d3;
        a.brush = b.svg.brush().on("brush", function() {
            a.redrawForBrush()
        }), a.brush.update = function() {
            return a.context && a.context.select("." + h.brush).call(this), this
        }, a.brush.scale = function(b) {
            return a.config.axis_rotated ? this.y(b) : this.x(b)
        }
    }, f.initSubchart = function() {
        var a = this,
            b = a.config,
            c = a.context = a.svg.append("g").attr("transform", a.getTranslate("context"));
        b.subchart_show || c.style("visibility", "hidden"), c.append("g").attr("clip-path", a.clipPath).attr("class", h.chart), c.select("." + h.chart).append("g").attr("class", h.chartBars), c.select("." + h.chart).append("g").attr("class", h.chartLines), c.append("g").attr("clip-path", a.clipPath).attr("class", h.brush).call(a.brush).selectAll("rect").attr(b.axis_rotated ? "width" : "height", b.axis_rotated ? a.width2 : a.height2), a.axes.subx = c.append("g").attr("class", h.axisX).attr("transform", a.getTranslate("subx")).attr("clip-path", b.axis_rotated ? "" : a.clipPathForXAxis)
    }, f.updateTargetsForSubchart = function(a) {
        var b, c, d, e, f = this,
            g = f.context,
            i = f.config,
            j = f.classChartBar.bind(f),
            k = f.classBars.bind(f),
            l = f.classChartLine.bind(f),
            m = f.classLines.bind(f),
            n = f.classAreas.bind(f);
        i.subchart_show && (e = g.select("." + h.chartBars).selectAll("." + h.chartBar).data(a).attr("class", j), d = e.enter().append("g").style("opacity", 0).attr("class", j), d.append("g").attr("class", k), c = g.select("." + h.chartLines).selectAll("." + h.chartLine).data(a).attr("class", l), b = c.enter().append("g").style("opacity", 0).attr("class", l), b.append("g").attr("class", m), b.append("g").attr("class", n))
    }, f.redrawSubchart = function(a, b, c, d, e, f, g) {
        var i, j, k, l, m, n, o = this,
            p = o.d3,
            q = o.context,
            r = o.config,
            s = o.barData.bind(o),
            t = o.lineData.bind(o),
            u = o.classBar.bind(o),
            v = o.classLine.bind(o),
            w = o.classArea.bind(o),
            x = o.initialOpacity.bind(o);
        r.subchart_show && (p.event && "zoom" === p.event.type && o.brush.extent(o.x.orgDomain()).update(), a && (!r.axis_rotated && r.axis_x_tick_rotate && o.rotateTickText(o.axes.subx, b.axisSubX, r.axis_x_tick_rotate), o.brush.empty() || o.brush.extent(o.x.orgDomain()).update(), l = o.generateDrawArea(e, !0), m = o.generateDrawBar(f, !0), n = o.generateDrawLine(g, !0), k = q.selectAll("." + h.bars).selectAll("." + h.bar).data(s), k.enter().append("path").attr("class", u).style("stroke", "none").style("fill", o.color), k.style("opacity", x).transition().duration(c).attr("d", m).style("opacity", 1), k.exit().transition().duration(c).style("opacity", 0).remove(), i = q.selectAll("." + h.lines).selectAll("." + h.line).data(t), i.enter().append("path").attr("class", v).style("stroke", o.color), i.style("opacity", x).transition().duration(c).attr("d", n).style("opacity", 1), i.exit().transition().duration(c).style("opacity", 0).remove(), j = q.selectAll("." + h.areas).selectAll("." + h.area).data(t), j.enter().append("path").attr("class", w).style("fill", o.color).style("opacity", function() {
            return o.orgAreaOpacity = +p.select(this).style("opacity"), 0
        }), j.style("opacity", 0).transition().duration(c).attr("d", l).style("fill", o.color).style("opacity", o.orgAreaOpacity), j.exit().transition().duration(d).style("opacity", 0).remove()))
    }, f.redrawForBrush = function() {
        var a = this,
            b = a.x;
        a.redraw({
            withTransition: !1,
            withY: !1,
            withSubchart: !1,
            withUpdateXDomain: !0
        }), a.config.subchart_onbrush.call(a.api, b.orgDomain())
    }, f.transformContext = function(a, b) {
        var c, d = this;
        b && b.axisSubX ? c = b.axisSubX : (c = d.context.select("." + h.axisX), a && (c = c.transition())), d.context.attr("transform", d.getTranslate("context")), c.attr("transform", d.getTranslate("subx"))
    }, f.initZoom = function() {
        var a = this,
            b = a.d3,
            c = a.config;
        a.zoom = b.behavior.zoom().on("zoomstart", function() {
            a.zoom.altDomain = b.event.sourceEvent.altKey ? a.x.orgDomain() : null
        }).on("zoom", function() {
            a.redrawForZoom.call(a)
        }), a.zoom.scale = function(a) {
            return c.axis_rotated ? this.y(a) : this.x(a)
        }, a.zoom.orgScaleExtent = function() {
            var b = c.zoom_extent ? c.zoom_extent : [1, 10];
            return [b[0], Math.max(a.getMaxDataCount() / b[1], b[1])]
        }, a.zoom.updateScaleExtent = function() {
            var b = p(a.x.orgDomain()) / p(a.orgXDomain),
                c = this.orgScaleExtent();
            return this.scaleExtent([c[0] * b, c[1] * b]), this
        }
    }, f.updateZoom = function() {
        var a = this,
            b = a.config.zoom_enabled ? a.zoom : function() {};
        a.main.select("." + h.zoomRect).call(b), a.main.selectAll("." + h.eventRect).call(b)
    }, f.redrawForZoom = function() {
        var a = this,
            b = a.d3,
            c = a.config,
            d = a.zoom,
            e = a.x,
            f = a.orgXDomain;
        if (c.zoom_enabled && 0 !== a.filterTargetsToShow(a.data.targets).length) {
            if ("mousemove" === b.event.sourceEvent.type && d.altDomain) return e.domain(d.altDomain), void d.scale(e).updateScaleExtent();
            a.isCategorized() && e.orgDomain()[0] === f[0] && e.domain([f[0] - 1e-10, e.orgDomain()[1]]), a.redraw({
                withTransition: !1,
                withY: !1,
                withSubchart: !1
            }), "mousemove" === b.event.sourceEvent.type && (a.cancelClick = !0), c.zoom_onzoom.call(a.api, e.orgDomain())
        }
    }, f.generateColor = function() {
        var a = this,
            b = a.config,
            c = a.d3,
            d = b.data_colors,
            e = r(b.color_pattern) ? b.color_pattern : c.scale.category10().range(),
            f = b.data_color,
            g = [];
        return function(a) {
            var b, c = a.id || a;
            return d[c] instanceof Function ? b = d[c](a) : d[c] ? b = d[c] : (g.indexOf(c) < 0 && g.push(c), b = e[g.indexOf(c) % e.length], d[c] = b), f instanceof Function ? f(b, a) : b
        }
    }, f.generateLevelColor = function() {
        var a = this,
            b = a.config,
            c = b.color_pattern,
            d = b.color_threshold,
            e = "value" === d.unit,
            f = d.values && d.values.length ? d.values : [],
            g = d.max || 100;
        return r(b.color_threshold) ? function(a) {
            var b, d, h = c[c.length - 1];
            for (b = 0; b < f.length; b++)
                if (d = e ? a : 100 * a / g, d < f[b]) {
                    h = c[b];
                    break
                }
            return h
        } : null
    }, f.getYFormat = function(a) {
        var b = this,
            c = a && !b.hasType("gauge") ? b.defaultArcValueFormat : b.yFormat,
            d = a && !b.hasType("gauge") ? b.defaultArcValueFormat : b.y2Format;
        return function(a, e, f) {
            var g = "y2" === b.getAxisId(f) ? d : c;
            return g.call(b, a, e)
        }
    }, f.yFormat = function(a) {
        var b = this,
            c = b.config,
            d = c.axis_y_tick_format ? c.axis_y_tick_format : b.defaultValueFormat;
        return d(a)
    }, f.y2Format = function(a) {
        var b = this,
            c = b.config,
            d = c.axis_y2_tick_format ? c.axis_y2_tick_format : b.defaultValueFormat;
        return d(a)
    }, f.defaultValueFormat = function(a) {
        return i(a) ? +a : ""
    }, f.defaultArcValueFormat = function(a, b) {
        return (100 * b).toFixed(1) + "%"
    }, f.formatByAxisId = function(a) {
        var b = this,
            c = b.config.data_labels,
            d = function(a) {
                return i(a) ? +a : ""
            };
        return "function" == typeof c.format ? d = c.format : "object" == typeof c.format && c.format[a] && (d = c.format[a]), d
    }, f.hasCaches = function(a) {
        for (var b = 0; b < a.length; b++)
            if (!(a[b] in this.cache)) return !1;
        return !0
    }, f.addCache = function(a, b) {
        this.cache[a] = this.cloneTarget(b)
    }, f.getCaches = function(a) {
        var b, c = [];
        for (b = 0; b < a.length; b++) a[b] in this.cache && c.push(this.cloneTarget(this.cache[a[b]]));
        return c
    };
    var h = f.CLASS = {
        target: "c3-target",
        chart: "c3-chart",
        chartLine: "c3-chart-line",
        chartLines: "c3-chart-lines",
        chartBar: "c3-chart-bar",
        chartBars: "c3-chart-bars",
        chartText: "c3-chart-text",
        chartTexts: "c3-chart-texts",
        chartArc: "c3-chart-arc",
        chartArcs: "c3-chart-arcs",
        chartArcsTitle: "c3-chart-arcs-title",
        chartArcsBackground: "c3-chart-arcs-background",
        chartArcsGaugeUnit: "c3-chart-arcs-gauge-unit",
        chartArcsGaugeMax: "c3-chart-arcs-gauge-max",
        chartArcsGaugeMin: "c3-chart-arcs-gauge-min",
        selectedCircle: "c3-selected-circle",
        selectedCircles: "c3-selected-circles",
        eventRect: "c3-event-rect",
        eventRects: "c3-event-rects",
        eventRectsSingle: "c3-event-rects-single",
        eventRectsMultiple: "c3-event-rects-multiple",
        zoomRect: "c3-zoom-rect",
        brush: "c3-brush",
        focused: "c3-focused",
        region: "c3-region",
        regions: "c3-regions",
        tooltip: "c3-tooltip",
        tooltipName: "c3-tooltip-name",
        shape: "c3-shape",
        shapes: "c3-shapes",
        line: "c3-line",
        lines: "c3-lines",
        bar: "c3-bar",
        bars: "c3-bars",
        circle: "c3-circle",
        circles: "c3-circles",
        arc: "c3-arc",
        arcs: "c3-arcs",
        area: "c3-area",
        areas: "c3-areas",
        empty: "c3-empty",
        text: "c3-text",
        texts: "c3-texts",
        gaugeValue: "c3-gauge-value",
        grid: "c3-grid",
        xgrid: "c3-xgrid",
        xgrids: "c3-xgrids",
        xgridLine: "c3-xgrid-line",
        xgridLines: "c3-xgrid-lines",
        xgridFocus: "c3-xgrid-focus",
        ygrid: "c3-ygrid",
        ygrids: "c3-ygrids",
        ygridLine: "c3-ygrid-line",
        ygridLines: "c3-ygrid-lines",
        axis: "c3-axis",
        axisX: "c3-axis-x",
        axisXLabel: "c3-axis-x-label",
        axisY: "c3-axis-y",
        axisYLabel: "c3-axis-y-label",
        axisY2: "c3-axis-y2",
        axisY2Label: "c3-axis-y2-label",
        legendBackground: "c3-legend-background",
        legendItem: "c3-legend-item",
        legendItemEvent: "c3-legend-item-event",
        legendItemTile: "c3-legend-item-tile",
        legendItemHidden: "c3-legend-item-hidden",
        legendItemFocused: "c3-legend-item-focused",
        dragarea: "c3-dragarea",
        EXPANDED: "_expanded_",
        SELECTED: "_selected_",
        INCLUDED: "_included_"
    };
    f.generateClass = function(a, b) {
        return " " + a + " " + a + this.getTargetSelectorSuffix(b)
    }, f.classText = function(a) {
        return this.generateClass(h.text, a.index)
    }, f.classTexts = function(a) {
        return this.generateClass(h.texts, a.id)
    }, f.classShape = function(a) {
        return this.generateClass(h.shape, a.index)
    }, f.classShapes = function(a) {
        return this.generateClass(h.shapes, a.id)
    }, f.classLine = function(a) {
        return this.classShape(a) + this.generateClass(h.line, a.id)
    }, f.classLines = function(a) {
        return this.classShapes(a) + this.generateClass(h.lines, a.id)
    }, f.classCircle = function(a) {
        return this.classShape(a) + this.generateClass(h.circle, a.index)
    }, f.classCircles = function(a) {
        return this.classShapes(a) + this.generateClass(h.circles, a.id)
    }, f.classBar = function(a) {
        return this.classShape(a) + this.generateClass(h.bar, a.index)
    }, f.classBars = function(a) {
        return this.classShapes(a) + this.generateClass(h.bars, a.id)
    }, f.classArc = function(a) {
        return this.classShape(a.data) + this.generateClass(h.arc, a.data.id)
    }, f.classArcs = function(a) {
        return this.classShapes(a.data) + this.generateClass(h.arcs, a.data.id)
    }, f.classArea = function(a) {
        return this.classShape(a) + this.generateClass(h.area, a.id)
    }, f.classAreas = function(a) {
        return this.classShapes(a) + this.generateClass(h.areas, a.id)
    }, f.classRegion = function(a, b) {
        return this.generateClass(h.region, b) + " " + ("class" in a ? a.class : "")
    }, f.classEvent = function(a) {
        return this.generateClass(h.eventRect, a.index)
    }, f.classTarget = function(a) {
        var b = this,
            c = b.config.data_classes[a],
            d = "";
        return c && (d = " " + h.target + "-" + c), b.generateClass(h.target, a) + d
    }, f.classChartText = function(a) {
        return h.chartText + this.classTarget(a.id)
    }, f.classChartLine = function(a) {
        return h.chartLine + this.classTarget(a.id)
    }, f.classChartBar = function(a) {
        return h.chartBar + this.classTarget(a.id)
    }, f.classChartArc = function(a) {
        return h.chartArc + this.classTarget(a.data.id)
    }, f.getTargetSelectorSuffix = function(a) {
        return a || 0 === a ? "-" + (a.replace ? a.replace(/([^a-zA-Z0-9-_])/g, "-") : a) : ""
    }, f.selectorTarget = function(a) {
        return "." + h.target + this.getTargetSelectorSuffix(a)
    }, f.selectorTargets = function(a) {
        var b = this;
        return a.length ? a.map(function(a) {
            return b.selectorTarget(a)
        }) : null
    }, f.selectorLegend = function(a) {
        return "." + h.legendItem + this.getTargetSelectorSuffix(a)
    }, f.selectorLegends = function(a) {
        var b = this;
        return a.length ? a.map(function(a) {
            return b.selectorLegend(a)
        }) : null
    };
    var i = f.isValue = function(a) {
            return a || 0 === a
        },
        j = f.isFunction = function(a) {
            return "function" == typeof a
        },
        k = f.isString = function(a) {
            return "string" == typeof a
        },
        l = f.isUndefined = function(a) {
            return "undefined" == typeof a
        },
        m = f.isDefined = function(a) {
            return "undefined" != typeof a
        },
        n = f.ceil10 = function(a) {
            return 10 * Math.ceil(a / 10)
        },
        o = f.asHalfPixel = function(a) {
            return Math.ceil(a) + .5
        },
        p = f.diffDomain = function(a) {
            return a[1] - a[0]
        },
        q = f.isEmpty = function(a) {
            return !a || k(a) && 0 === a.length || "object" == typeof a && 0 === Object.keys(a).length
        },
        r = f.notEmpty = function(a) {
            return Object.keys(a).length > 0
        },
        s = f.getOption = function(a, b, c) {
            return m(a[b]) ? a[b] : c
        },
        t = f.hasValue = function(a, b) {
            var c = !1;
            return Object.keys(a).forEach(function(d) {
                a[d] === b && (c = !0)
            }), c
        },
        u = f.getPathBox = function(a) {
            var b = a.getBoundingClientRect(),
                c = [a.pathSegList.getItem(0), a.pathSegList.getItem(1)],
                d = c[0].x,
                e = Math.min(c[0].y, c[1].y);
            return {
                x: d,
                y: e,
                width: b.width,
                height: b.height
            }
        };
    e.focus = function(a) {
        function b(a) {
            c.filterTargetsToShow(a).transition().duration(100).style("opacity", 1)
        }
        var c = this.internal,
            d = c.svg.selectAll(c.selectorTarget(a)),
            e = d.filter(c.isNoneArc.bind(c)),
            f = d.filter(c.isArc.bind(c));
        this.revert(), this.defocus(), b(e.classed(h.focused, !0)), b(f), c.hasArcType() && c.expandArc(a, !0), c.toggleFocusLegend(a, !0)
    }, e.defocus = function(a) {
        function b(a) {
            c.filterTargetsToShow(a).transition().duration(100).style("opacity", .3)
        }
        var c = this.internal,
            d = c.svg.selectAll(c.selectorTarget(a)),
            e = d.filter(c.isNoneArc.bind(c)),
            f = d.filter(c.isArc.bind(c));
        this.revert(), b(e.classed(h.focused, !1)), b(f), c.hasArcType() && c.unexpandArc(a), c.toggleFocusLegend(a, !1)
    }, e.revert = function(a) {
        function b(a) {
            c.filterTargetsToShow(a).transition().duration(100).style("opacity", 1)
        }
        var c = this.internal,
            d = c.svg.selectAll(c.selectorTarget(a)),
            e = d.filter(c.isNoneArc.bind(c)),
            f = d.filter(c.isArc.bind(c));
        b(e.classed(h.focused, !1)), b(f), c.hasArcType() && c.unexpandArc(a), c.revertLegend()
    }, e.show = function(a, b) {
        var c = this.internal;
        a = c.mapToTargetIds(a), b = b || {}, c.removeHiddenTargetIds(a), c.svg.selectAll(c.selectorTargets(a)).transition().style("opacity", 1), b.withLegend && c.showLegend(a), c.redraw({
            withUpdateOrgXDomain: !0,
            withUpdateXDomain: !0,
            withLegend: !0
        })
    }, e.hide = function(a, b) {
        var c = this.internal;
        a = c.mapToTargetIds(a), b = b || {}, c.addHiddenTargetIds(a), c.svg.selectAll(c.selectorTargets(a)).transition().style("opacity", 0), b.withLegend && c.hideLegend(a), c.redraw({
            withUpdateOrgXDomain: !0,
            withUpdateXDomain: !0,
            withLegend: !0
        })
    }, e.toggle = function(a) {
        var b = this.internal;
        b.isTargetToShow(a) ? this.hide(a) : this.show(a)
    }, e.zoom = function() {}, e.zoom.enable = function(a) {
        var b = this.internal;
        b.config.zoom_enabled = a, b.updateAndRedraw()
    }, e.unzoom = function() {
        var a = this.internal;
        a.brush.clear().update(), a.redraw({
            withUpdateXDomain: !0
        })
    }, e.load = function(a) {
        var b = this.internal,
            c = b.config;
        return a.xs && b.addXs(a.xs), "classes" in a && Object.keys(a.classes).forEach(function(b) {
            c.data_classes[b] = a.classes[b]
        }), "categories" in a && b.isCategorized() && (c.axis_x_categories = a.categories), "cacheIds" in a && b.hasCaches(a.cacheIds) ? void b.load(b.getCaches(a.cacheIds), a.done) : void("unload" in a ? b.unload(b.mapToTargetIds("boolean" == typeof a.unload && a.unload ? null : a.unload), function() {
            b.loadFromArgs(a)
        }) : b.loadFromArgs(a))
    }, e.unload = function(a) {
        var b = this.internal;
        a = a || {}, b.unload(b.mapToTargetIds(a.ids), function() {
            b.redraw({
                withUpdateOrgXDomain: !0,
                withUpdateXDomain: !0,
                withLegend: !0
            }), a.done && a.done()
        })
    }, e.flow = function(a) {
        var b, c, d, e, f, g, h, j, k = this.internal,
            l = [],
            n = k.getMaxDataCount(),
            o = 0,
            p = 0;
        if (a.json) c = k.convertJsonToData(a.json, a.keys);
        else if (a.rows) c = k.convertRowsToData(a.rows);
        else {
            if (!a.columns) return;
            c = k.convertColumnsToData(a.columns)
        }
        b = k.convertDataToTargets(c, !0), k.data.targets.forEach(function(a) {
            var c, d, e = !1;
            for (c = 0; c < b.length; c++)
                if (a.id === b[c].id) {
                    for (e = !0, a.values[a.values.length - 1] && (p = a.values[a.values.length - 1].index + 1), o = b[c].values.length, d = 0; o > d; d++) b[c].values[d].index = p + d, k.isTimeSeries() || (b[c].values[d].x = p + d);
                    a.values = a.values.concat(b[c].values), b.splice(c, 1);
                    break
                }
            e || l.push(a.id)
        }), k.data.targets.forEach(function(a) {
            var b, c;
            for (b = 0; b < l.length; b++)
                if (a.id === l[b])
                    for (p = a.values[a.values.length - 1].index + 1, c = 0; o > c; c++) a.values.push({
                        id: a.id,
                        index: p + c,
                        x: k.isTimeSeries() ? k.getOtherTargetX(p + c) : p + c,
                        value: null
                    })
        }), k.data.targets.length && b.forEach(function(a) {
            var b, c = [];
            for (b = k.data.targets[0].values[0].index; p > b; b++) c.push({
                id: a.id,
                index: b,
                x: k.isTimeSeries() ? k.getOtherTargetX(b) : b,
                value: null
            });
            a.values.forEach(function(a) {
                a.index += p, k.isTimeSeries() || (a.x += p)
            }), a.values = c.concat(a.values)
        }), k.data.targets = k.data.targets.concat(b), d = k.getMaxDataCount(), f = k.data.targets[0], g = f.values[0], m(a.to) ? (o = 0, j = k.isTimeSeries() ? k.parseDate(a.to) : a.to, f.values.forEach(function(a) {
            a.x < j && o++
        })) : m(a.length) && (o = a.length), n ? 1 === n && k.isTimeSeries() && (h = (f.values[f.values.length - 1].x - g.x) / 2, e = [new Date(+g.x - h), new Date(+g.x + h)], k.updateXDomain(null, !0, !0, e)) : (h = k.isTimeSeries() ? f.values.length > 1 ? f.values[f.values.length - 1].x - g.x : g.x - k.getXDomain(k.data.targets)[0] : 1, e = [g.x - h, g.x], k.updateXDomain(null, !0, !0, e)), k.updateTargets(k.data.targets), k.redraw({
            flow: {
                index: g.index,
                length: o,
                duration: i(a.duration) ? a.duration : k.config.transition_duration,
                done: a.done,
                orgDataCount: n
            },
            withLegend: !0,
            withTransition: n > 1
        })
    }, f.generateFlow = function(a) {
        var b = this,
            c = b.config,
            d = b.d3;
        return function() {
            var e, f, g, i = a.targets,
                j = a.flow,
                k = a.drawBar,
                l = a.drawLine,
                m = a.drawArea,
                n = a.cx,
                o = a.cy,
                q = a.xv,
                r = a.xForText,
                s = a.yForText,
                t = a.duration,
                u = 1,
                v = j.index,
                w = j.length,
                x = b.getValueOnIndex(b.data.targets[0].values, v),
                y = b.getValueOnIndex(b.data.targets[0].values, v + w),
                z = b.x.domain(),
                A = j.duration || t,
                B = j.done || function() {},
                C = b.generateWait(),
                D = b.xgrid || d.selectAll([]),
                E = b.xgridLines || d.selectAll([]),
                F = b.mainRegion || d.selectAll([]),
                G = b.mainText || d.selectAll([]),
                H = b.mainBar || d.selectAll([]),
                I = b.mainLine || d.selectAll([]),
                J = b.mainArea || d.selectAll([]),
                K = b.mainCircle || d.selectAll([]);
            b.data.targets.forEach(function(a) {
                a.values.splice(0, w)
            }), g = b.updateXDomain(i, !0, !0), b.updateXGrid && b.updateXGrid(!0), j.orgDataCount ? e = 1 === j.orgDataCount || x.x === y.x ? b.x(z[0]) - b.x(g[0]) : b.isTimeSeries() ? b.x(z[0]) - b.x(g[0]) : b.x(x.x) - b.x(y.x) : 1 !== b.data.targets[0].values.length ? e = b.x(z[0]) - b.x(g[0]) : b.isTimeSeries() ? (x = b.getValueOnIndex(b.data.targets[0].values, 0), y = b.getValueOnIndex(b.data.targets[0].values, b.data.targets[0].values.length - 1), e = b.x(x.x) - b.x(y.x)) : e = p(g) / 2, u = p(z) / p(g), f = "translate(" + e + ",0) scale(" + u + ",1)", d.transition().ease("linear").duration(A).each(function() {
                C.add(b.axes.x.transition().call(b.xAxis)), C.add(H.transition().attr("transform", f)), C.add(I.transition().attr("transform", f)), C.add(J.transition().attr("transform", f)), C.add(K.transition().attr("transform", f)), C.add(G.transition().attr("transform", f)), C.add(F.filter(b.isRegionOnX).transition().attr("transform", f)), C.add(D.transition().attr("transform", f)), C.add(E.transition().attr("transform", f))
            }).call(C, function() {
                var a, d = [],
                    e = [],
                    f = [];
                if (w) {
                    for (a = 0; w > a; a++) d.push("." + h.shape + "-" + (v + a)), e.push("." + h.text + "-" + (v + a)), f.push("." + h.eventRect + "-" + (v + a));
                    b.svg.selectAll("." + h.shapes).selectAll(d).remove(), b.svg.selectAll("." + h.texts).selectAll(e).remove(), b.svg.selectAll("." + h.eventRects).selectAll(f).remove(), b.svg.select("." + h.xgrid).remove()
                }
                D.attr("transform", null).attr(b.xgridAttr), E.attr("transform", null), E.select("line").attr("x1", c.axis_rotated ? 0 : q).attr("x2", c.axis_rotated ? b.width : q), E.select("text").attr("x", c.axis_rotated ? b.width : 0).attr("y", q), H.attr("transform", null).attr("d", k), I.attr("transform", null).attr("d", l), J.attr("transform", null).attr("d", m), K.attr("transform", null).attr("cx", n).attr("cy", o), G.attr("transform", null).attr("x", r).attr("y", s).style("fill-opacity", b.opacityForText.bind(b)), F.attr("transform", null), F.select("rect").filter(b.isRegionOnX).attr("x", b.regionX.bind(b)).attr("width", b.regionWidth.bind(b)), b.updateEventRect(), B()
            })
        }
    }, e.selected = function(a) {
        var b = this.internal,
            c = b.d3;
        return c.merge(b.main.selectAll("." + h.shapes + b.getTargetSelectorSuffix(a)).selectAll("." + h.shape).filter(function() {
            return c.select(this).classed(h.SELECTED)
        }).map(function(a) {
            return a.map(function(a) {
                var b = a.__data__;
                return b.data ? b.data : b
            })
        }))
    }, e.select = function(a, b, c) {
        var d = this.internal,
            e = d.d3,
            f = d.config;
        f.data_selection_enabled && d.main.selectAll("." + h.shapes).selectAll("." + h.shape).each(function(g, i) {
            var j = e.select(this),
                k = g.data ? g.data.id : g.id,
                l = d.getToggle(this).bind(d),
                n = f.data_selection_grouped || !a || a.indexOf(k) >= 0,
                o = !b || b.indexOf(i) >= 0,
                p = j.classed(h.SELECTED);
            j.classed(h.line) || j.classed(h.area) || (n && o ? f.data_selection_isselectable(g) && !p && l(!0, j.classed(h.SELECTED, !0), g, i) : m(c) && c && p && l(!1, j.classed(h.SELECTED, !1), g, i))
        })
    }, e.unselect = function(a, b) {
        var c = this.internal,
            d = c.d3,
            e = c.config;
        e.data_selection_enabled && c.main.selectAll("." + h.shapes).selectAll("." + h.shape).each(function(f, g) {
            var i = d.select(this),
                j = f.data ? f.data.id : f.id,
                k = c.getToggle(this).bind(c),
                l = e.data_selection_grouped || !a || a.indexOf(j) >= 0,
                m = !b || b.indexOf(g) >= 0,
                n = i.classed(h.SELECTED);
            i.classed(h.line) || i.classed(h.area) || l && m && e.data_selection_isselectable(f) && n && k(!1, i.classed(h.SELECTED, !1), f, g)
        })
    }, e.transform = function(a, b) {
        var c = this.internal,
            d = ["pie", "donut"].indexOf(a) >= 0 ? {
                withTransform: !0
            } : null;
        c.transformTo(b, a, d)
    }, f.transformTo = function(a, b, c) {
        var d = this,
            e = !d.hasArcType(),
            f = c || {
                withTransitionForAxis: e
            };
        f.withTransitionForTransform = !1, d.transiting = !1, d.setTargetType(a, b), d.updateAndRedraw(f)
    }, e.groups = function(a) {
        var b = this.internal,
            c = b.config;
        return l(a) ? c.data_groups : (c.data_groups = a, b.redraw(), c.data_groups)
    }, e.xgrids = function(a) {
        var b = this.internal,
            c = b.config;
        return a ? (c.grid_x_lines = a, b.redraw(), c.grid_x_lines) : c.grid_x_lines
    }, e.xgrids.add = function(a) {
        var b = this.internal;
        return this.xgrids(b.config.grid_x_lines.concat(a ? a : []))
    }, e.xgrids.remove = function(a) {
        var b = this.internal;
        b.removeGridLines(a, !0)
    }, e.ygrids = function(a) {
        var b = this.internal,
            c = b.config;
        return a ? (c.grid_y_lines = a, b.redraw(), c.grid_y_lines) : c.grid_y_lines
    }, e.ygrids.add = function(a) {
        var b = this.internal;
        return this.ygrids(b.config.grid_y_lines.concat(a ? a : []))
    }, e.ygrids.remove = function(a) {
        var b = this.internal;
        b.removeGridLines(a, !1)
    }, e.regions = function(a) {
        var b = this.internal,
            c = b.config;
        return a ? (c.regions = a, b.redraw(), c.regions) : c.regions
    }, e.regions.add = function(a) {
        var b = this.internal,
            c = b.config;
        return a ? (c.regions = c.regions.concat(a), b.redraw(), c.regions) : c.regions
    }, e.regions.remove = function(a) {
        var b, c, d, e = this.internal,
            f = e.config;
        return a = a || {}, b = e.getOption(a, "duration", f.transition_duration), c = e.getOption(a, "classes", [h.region]), d = e.main.select("." + h.regions).selectAll(c.map(function(a) {
            return "." + a
        })), (b ? d.transition().duration(b) : d).style("opacity", 0).remove(), f.regions = f.regions.filter(function(a) {
            var b = !1;
            return a.class ? (a.class.split(" ").forEach(function(a) {
                c.indexOf(a) >= 0 && (b = !0)
            }), !b) : !0
        }), f.regions
    }, e.data = function() {}, e.data.get = function(a) {
        var b = this.data.getAsTarget(a);
        return m(b) ? b.values.map(function(a) {
            return a.value
        }) : void 0
    }, e.data.getAsTarget = function(a) {
        var b = this.data.targets.filter(function(b) {
            return b.id === a
        });
        return b.length > 0 ? b[0] : void 0
    }, e.data.names = function(a) {
        var b = this.internal,
            c = b.config;
        return arguments.length ? (Object.keys(a).forEach(function(b) {
            c.data_names[b] = a[b]
        }), b.redraw({
            withLegend: !0
        }), c.data_names) : c.data_names
    }, e.data.colors = function(a) {
        var b = this.internal,
            c = b.config;
        return arguments.length ? (Object.keys(a).forEach(function(b) {
            c.data_colors[b] = a[b]
        }), b.redraw({
            withLegend: !0
        }), c.data_colors) : c.data_colors
    }, e.category = function(a, b) {
        var c = this.internal,
            d = c.config;
        return arguments.length > 1 && (d.axis_x_categories[a] = b, c.redraw()), d.axis_x_categories[a]
    }, e.categories = function(a) {
        var b = this.internal,
            c = b.config;
        return arguments.length ? (c.axis_x_categories = a, b.redraw(), c.axis_x_categories) : c.axis_x_categories
    }, e.color = function(a) {
        var b = this.internal;
        return b.color(a)
    }, e.x = function(a) {
        var b = this.internal;
        return arguments.length && (b.updateTargetX(b.data.targets, a), b.redraw({
            withUpdateOrgXDomain: !0,
            withUpdateXDomain: !0
        })), b.data.xs
    }, e.xs = function(a) {
        var b = this.internal;
        return arguments.length && (b.updateTargetXs(b.data.targets, a), b.redraw({
            withUpdateOrgXDomain: !0,
            withUpdateXDomain: !0
        })), b.data.xs
    }, e.axis = function() {}, e.axis.labels = function(a) {
        var b = this.internal;
        arguments.length && (Object.keys(a).forEach(function(c) {
            b.setAxisLabelText(c, a[c])
        }), b.updateAxisLabels())
    }, e.axis.max = function(a) {
        var b = this.internal,
            c = b.config;
        arguments.length && ("object" == typeof a ? (i(a.x) && (c.axis_x_max = a.x), i(a.y) && (c.axis_y_max = a.y), i(a.y2) && (c.axis_y2_max = a.y2)) : c.axis_y_max = c.axis_y2_max = a, b.redraw({
            withUpdateOrgXDomain: !0,
            withUpdateXDomain: !0
        }))
    }, e.axis.min = function(a) {
        var b = this.internal,
            c = b.config;
        arguments.length && ("object" == typeof a ? (i(a.x) && (c.axis_x_min = a.x), i(a.y) && (c.axis_y_min = a.y), i(a.y2) && (c.axis_y2_min = a.y2)) : c.axis_y_min = c.axis_y2_min = a, b.redraw({
            withUpdateOrgXDomain: !0,
            withUpdateXDomain: !0
        }))
    }, e.axis.range = function(a) {
        arguments.length && (m(a.max) && this.axis.max(a.max), m(a.min) && this.axis.min(a.min))
    }, e.legend = function() {}, e.legend.show = function(a) {
        var b = this.internal;
        b.showLegend(b.mapToTargetIds(a)), b.updateAndRedraw({
            withLegend: !0
        })
    }, e.legend.hide = function(a) {
        var b = this.internal;
        b.hideLegend(b.mapToTargetIds(a)), b.updateAndRedraw({
            withLegend: !0
        })
    }, e.resize = function(a) {
        var b = this.internal,
            c = b.config;
        c.size_width = a ? a.width : null, c.size_height = a ? a.height : null, this.flush()
    }, e.flush = function() {
        var a = this.internal;
        a.updateAndRedraw({
            withLegend: !0,
            withTransition: !1,
            withTransitionForTransform: !1
        })
    }, e.destroy = function() {
        var b = this.internal;
        b.data.targets = void 0, b.data.xs = {}, b.selectChart.classed("c3", !1).html(""), a.onresize = null
    }, "function" == typeof define && define.amd ? define("c3", ["d3"], g) : "undefined" != typeof exports && "undefined" != typeof module ? module.exports = g : a.c3 = g
}(window);