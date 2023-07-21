function recursiveReplace(element) {
	element.childNodes.forEach(node => {
		if (node.nodeType === 3) replaceWithCyrillic(node);
		else if (node.nodeType === 1 && node.nodeName !== "SCRIPT" && node.nodeName !== "STYLE") recursiveReplace(node);
	});
}

function replaceWithCyrillic(node) {
	node.nodeValue = node.nodeValue.replace(/a/g, "а");
	node.nodeValue = node.nodeValue.replace(/c/g, "с");
	node.nodeValue = node.nodeValue.replace(/e/g, "е");
	node.nodeValue = node.nodeValue.replace(/o/g, "о");
	node.nodeValue = node.nodeValue.replace(/p/g, "р");
	node.nodeValue = node.nodeValue.replace(/y/g, "у");
	node.nodeValue = node.nodeValue.replace(/x/g, "х");

	node.nodeValue = node.nodeValue.replace(/A/g, "А");
	node.nodeValue = node.nodeValue.replace(/C/g, "С");
	node.nodeValue = node.nodeValue.replace(/E/g, "Е");
	node.nodeValue = node.nodeValue.replace(/O/g, "О");
	node.nodeValue = node.nodeValue.replace(/P/g, "Р");
	node.nodeValue = node.nodeValue.replace(/X/g, "Х");
}

function replaceWithZeroWidths(node) {
	node.nodeValue = node.nodeValue.split("").join("⁣");
}

// credits to my friend @pg_4919 for this script