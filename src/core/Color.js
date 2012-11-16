function Color(r, g, b, a) {
	this.assign(r, g, b, a);
}

Color.prototype.assign = function(r, g, b, a) {
	if (r && r instanceof Color) {
		var color = r;
		this.r = color.r;
		this.g = color.g;
		this.b = color.b;
		this.a = color.a;
	}
	else {
		this.r = r || 0;
		this.g = g || 0;
		this.b = b || 0;
		this.a = a || 0;
	}

	return this;
}

Color.prototype.equals = function(r, g, b, a) {
	if (r instanceof Color) {
		var color = r;
		return this.r === color.r &&
		       this.g === color.g &&
		       this.b === color.b &&
		       this.a === color.a;
	}
	else {
		return this.r === r &&
		       this.g === g &&
		       this.b === b &&
		       this.a === a;
	}
}

// static common colors

Color.Black = new Color(0, 0, 0, 255);
Color.White = new Color(255, 255, 255, 255);
Color.Red = new Color(255, 0, 0, 255);
Color.Green = new Color(0, 255, 0, 255);
Color.Blue = new Color(0, 0, 255, 255);
Color.Yellow = new Color(255, 255, 0, 255);
Color.Magenta = new Color(255, 0, 255, 255);
Color.Cyan = new Color(0, 255, 255, 255);
Color.Transparent = new Color(0, 0, 0, 0);
