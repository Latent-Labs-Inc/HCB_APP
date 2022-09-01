interface String {
	toTitle(): string;
	camel2title(): string;
}

String.prototype.toTitle = function () {
	return this.replace(/(^|\s)\S/g, function (t) {
		return t.toUpperCase();
	});
};

String.prototype.camel2title = function () {
	return this.replace(/([A-Z])/g, function (t) {
		return " " + t.toLowerCase();
	}).toTitle();
};
