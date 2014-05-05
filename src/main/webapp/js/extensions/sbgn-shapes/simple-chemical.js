;(function($$){"use strict";

	sbgnShapes["simple chemical"] = true;

	var CanvasRenderer = $$('renderer', 'canvas');
	var renderer = CanvasRenderer.prototype;
	
	//default node shapes are in nodeShape array,
	//all different types must be added
	var nodeShape = $$.style.types.nodeShape.enums;
	nodeShape.push("simple chemical");

	var nodeShapes = CanvasRenderer.nodeShapes;

	nodeShapes["simple chemical"] = {
		multimerPadding:3,

		draw: function(context, node) {
			var centerX = node._private.position.x;
			var centerY = node._private.position.y;;
			var width = node.width();
			var height = node.height();
			var multimerPadding = nodeShapes["simple chemical"].multimerPadding;
			var padding = node._private.style["border-width"].pxValue;
			var cornerRadius = $$.math.getRoundRectangleRadius(width, height);

			if($$.sbgn.isMultimer(node)){
				//add multimer shape
				renderer.drawRoundRectanglePath(context, centerX + multimerPadding, 
					centerY + multimerPadding, width, height, cornerRadius);
			}

			renderer.drawRoundRectanglePath(context, centerX, centerY, width, height, cornerRadius);
		},

		drawPath: function(context, node) {
			var centerX = node._private.position.x;
			var centerY = node._private.position.y;;
			var width = node.width();
			var height = node.height();
			var multimerPadding = nodeShapes["simple chemical"].multimerPadding;
			var label = node._private.data.sbgnlabel;
			var padding = node._private.style["border-width"].pxValue;
			var cloneMarker = node._private.data.sbgnclonemarker;
			var cornerRadius = $$.math.getRoundRectangleRadius(width, height);

			if($$.sbgn.isMultimer(node)){
				//add multimer shape
				renderer.drawRoundRectangle(context, centerX + multimerPadding, 
					centerY + multimerPadding, width, height, cornerRadius);

				context.stroke();

				$$.sbgn.drawSimpleChemicalCloneMarker(context, 
					centerX + multimerPadding, centerY + multimerPadding, 
					width, height, cloneMarker, true);

				context.stroke();
			}

			renderer.drawRoundRectangle(context, centerX, centerY, width, height, cornerRadius);

			context.stroke();
			
			$$.sbgn.drawSimpleChemicalCloneMarker(context, centerX, centerY, 
				width, height, cloneMarker, false);

			var nodeProp = {'label':label, 'centerX':centerX, 'centerY':centerY-2,
				'opacity':node._private.style['text-opacity'].value, 'width': node._private.data.sbgnbbox.w};
			$$.sbgn.drawLabelText(context, nodeProp);
			
			$$.sbgn.drawPathStateAndInfos(renderer, node, context, centerX, centerY);

		},

		intersectLine: function(node, x, y) {
			var centerX = node._private.position.x;
			var centerY = node._private.position.y;;
			var width = node.width();
			var height = node.height();
			var padding = node._private.style["border-width"].pxValue / 2;
			var multimerPadding = nodeShapes["complex"].multimerPadding;

			var stateAndInfoIntersectLines = $$.sbgn.intersectLineStateAndInfoBoxes(
				node, x, y);

			var nodeIntersectLines = nodeShapes["roundrectangle"].intersectLine(
    			centerX, centerY, width, height, x, y, padding) ;

			//check whether sbgn class includes multimer substring or not
			var multimerIntersectionLines = new Array();
			if($$.sbgn.isMultimer(node)){
				multimerIntersectionLines = nodeShapes["ellipse"].intersectLine(
					centerX + multimerPadding, centerY + multimerPadding, width, 
					height, x, y, padding);
			}

			var intersections = stateAndInfoIntersectLines.concat(nodeIntersectLines, multimerIntersectionLines);

			return $$.sbgn.closestIntersectionPoint([x, y], intersections);
		},

		intersectBox: function(x1, y1, x2, y2, node) {
			var centerX = node._private.position.x;
			var centerY = node._private.position.y;;
			var width = node.width();
			var height = node.height();
			var padding = node._private.style["border-width"].pxValue / 2;
			var multimerPadding = nodeShapes["complex"].multimerPadding;

			var nodeIntersectBox = nodeShapes["roundrectangle"].intersectBox(
				x1, y1, x2, y2, width, 
				height, centerX, centerY, padding);

			var stateAndInfoIntersectBox = $$.sbgn.intersectBoxStateAndInfoBoxes(
				x1, y1, x2, y2, node);

			//check whether sbgn class includes multimer substring or not
			var multimerIntersectBox = false;
			if($$.sbgn.isMultimer(node)){
				multimerIntersectBox = nodeShapes["ellipse"].intersectBox(
				x1, y1, x2, y2, width, height, 
				centerX + multimerPadding, centerY + multimerPadding, 
				padding);
			}

			return nodeIntersectBox || stateAndInfoIntersectBox || multimerIntersectBox;

		},

		checkPointRough: function(x, y, node, threshold) {
			var centerX = node._private.position.x;
			var centerY = node._private.position.y;;
			var width = node.width();
			var height = node.height();
			var padding = node._private.style["border-width"].pxValue / 2;
			var multimerPadding = nodeShapes["complex"].multimerPadding;

			var nodeCheckPointRough = nodeShapes["roundrectangle"].checkPointRough(x, y, 
				padding, width, height, centerX, centerY);

			var stateAndInfoCheckPointRough = $$.sbgn.checkPointRoughStateAndInfoBoxes(node,
				x, y, centerX, centerY);

			//check whether sbgn class includes multimer substring or not
			var multimerCheckPointRough = false;
			if($$.sbgn.isMultimer(node)){
				multimerCheckPointRough = nodeShapes["ellipse"].checkPointRough(x, y, 
				padding, width, height, 
				centerX + multimerPadding, centerY + multimerPadding);
			}

			return nodeCheckPointRough || stateAndInfoCheckPointRough || multimerCheckPointRough;
		},

		checkPoint: function(x, y, node, threshold) {
			var centerX = node._private.position.x;
			var centerY = node._private.position.y;;
			var width = node.width();
			var height = node.height();
			var padding = node._private.style["border-width"].pxValue / 2;
			var multimerPadding = nodeShapes["complex"].multimerPadding;

			var nodeCheckPoint =  nodeShapes["roundrectangle"].checkPoint(x, y, 
				padding, width, height, 
				centerX, centerY);

			var stateAndInfoCheckPoint = $$.sbgn.checkPointStateAndInfoBoxes(x, y, node, 
				threshold);

			//check whether sbgn class includes multimer substring or not
			var multimerCheckPoint = false;
			if($$.sbgn.isMultimer(node)){
				multimerCheckPoint = nodeShapes["ellipse"].checkPoint(x, y, 
				padding, width, height, 
				centerX + multimerPadding, centerY + multimerPadding);
			}

			return nodeCheckPoint || stateAndInfoCheckPoint || multimerCheckPoint;
		}
	}

})( cytoscape );