
function svg2json(svg) {
	var result = { lineStrips: [] };
	var pathList = svg.getElementsByTagName("path");

	for (var i = 0; i < pathList.length; i++) {
		result.lineStrips.push(getPathPoints(svg, pathList[i]));
	}

	return JSON.stringify(result);
}

function getPathPoints(svg, path) {
	var points = [];
	var transform = svg.getTransformToElement(path);

	var segList = path.pathSegList;
	var count = segList.numberOfItems;

	var x = 0;
	var y = 0;
	var prevMove = true;
	var svgPoint = svg.createSVGPoint();

	var plen = 0;

	for (var i = 0; i < count; i++) {
		var item = segList.getItem(i);
		var ix = Math.round(item.x);
		var iy = Math.round(item.y);

		if (item.pathSegTypeAsLetter === "M") {
			x = ix;
			y = iy;
			prevMove = true;
		}
		else if (item.pathSegTypeAsLetter === "m") {
			x += ix;
			y += iy;
			prevMove = true;
		}
		else if (item.pathSegTypeAsLetter === "l" || item.pathSegTypeAsLetter === "L") {
			if (prevMove) {
				svgPoint.x = x;
				svgPoint.y = y;

				var pt = svgPoint.matrixTransform(transform);

				if (plen === 0 || (pt.x !== points[plen - 1].x || pt.y !== points[plen - 1].y)) {
					points.push({ x: pt.x, y: pt.y });
					plen++;
				}
			}

			prevMove = false;

			if (item.pathSegTypeAsLetter === "l") {
				x += ix;
				y += iy;
			}
			else if (item.pathSegTypeAsLetter === "L") {
				x = ix;
				y = iy;
			}

			svgPoint.x = x;
			svgPoint.y = y;

			var pt = svgPoint.matrixTransform(transform);

			if (plen === 0 || (pt.x !== points[plen - 1].x || pt.y !== points[plen - 1].y)) {
				points.push({ x: pt.x, y: pt.y });
				plen++;
			}
		}
		else if (item.pathSegType === SVGPathSeg.PATHSEG_CLOSEPATH) {
			if (plen > 0 && (points[plen - 1].x !== points[0].x || points[plen - 1].y !== points[0].y)) {
				points.push({ x: points[0].x, y: points[0].y });
				plen++;
			}
		}
	}

	return points;
}
