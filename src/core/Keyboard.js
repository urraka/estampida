Keyboard = {};

Keyboard.state_ = [];

Keyboard.initialize = function() {
	Keyboard.state_.length = 256;

	for (i in Keyboard.state_) {
		Keyboard.state_[i] = false;
	}

	$(window).keydown(function(e) {
		Keyboard.state_[e.which] = true;
	});

	$(window).keyup(function(e) {
		Keyboard.state_[e.which] = false;
	});
}

Keyboard.isKeyPressed = function(key) {
	return Keyboard.state_[key] === true;
}

Keyboard.bind = function(owner, callback) {
	$(window).keydown(function(e) {
		callback.call(owner, e.which, true);
	});

	$(window).keyup(function(e) {
		callback.call(owner, e.which, false);
	});
}

Keyboard.Cancel = 3;
Keyboard.Help = 6;
Keyboard.Backspace = 8;
Keyboard.Tab = 9;
Keyboard.Clear = 12;
Keyboard.Return = 13;
Keyboard.Enter = 14;
Keyboard.Shift = 16;
Keyboard.Control = 17;
Keyboard.Alt = 18;
Keyboard.Pause = 19;
Keyboard.CapsLock = 20;
Keyboard.Escape = 27;
Keyboard.Space = 32;
Keyboard.PageUp = 33;
Keyboard.PageDown = 34;
Keyboard.End = 35;
Keyboard.Home = 36;
Keyboard.Left = 37;
Keyboard.Up = 38;
Keyboard.Right = 39;
Keyboard.Down = 40;
Keyboard.PrintScreen = 44;
Keyboard.Insert = 45;
Keyboard.Delete = 46;
Keyboard.Num0 = 48;
Keyboard.Num1 = 49;
Keyboard.Num2 = 50;
Keyboard.Num3 = 51;
Keyboard.Num4 = 52;
Keyboard.Num5 = 53;
Keyboard.Num6 = 54;
Keyboard.Num7 = 55;
Keyboard.Num8 = 56;
Keyboard.Num9 = 57;
Keyboard.SemiColon = 59;
Keyboard.Equals = 61;
Keyboard.A = 65;
Keyboard.B = 66;
Keyboard.C = 67;
Keyboard.D = 68;
Keyboard.E = 69;
Keyboard.F = 70;
Keyboard.G = 71;
Keyboard.H = 72;
Keyboard.I = 73;
Keyboard.J = 74;
Keyboard.K = 75;
Keyboard.L = 76;
Keyboard.M = 77;
Keyboard.N = 78;
Keyboard.O = 79;
Keyboard.P = 80;
Keyboard.Q = 81;
Keyboard.R = 82;
Keyboard.S = 83;
Keyboard.T = 84;
Keyboard.U = 85;
Keyboard.V = 86;
Keyboard.W = 87;
Keyboard.X = 88;
Keyboard.Y = 89;
Keyboard.Z = 90;
Keyboard.ContextMenu = 93;
Keyboard.Numpad0 = 96;
Keyboard.Numpad1 = 97;
Keyboard.Numpad2 = 98;
Keyboard.Numpad3 = 99;
Keyboard.Numpad4 = 100;
Keyboard.Numpad5 = 101;
Keyboard.Numpad6 = 102;
Keyboard.Numpad7 = 103;
Keyboard.Numpad8 = 104;
Keyboard.Numpad9 = 105;
Keyboard.Multiply = 106;
Keyboard.Add = 107;
Keyboard.Separator = 108;
Keyboard.Subtract = 109;
Keyboard.Decimal = 110;
Keyboard.Divide = 111;
Keyboard.F1 = 112;
Keyboard.F2 = 113;
Keyboard.F3 = 114;
Keyboard.F4 = 115;
Keyboard.F5 = 116;
Keyboard.F6 = 117;
Keyboard.F7 = 118;
Keyboard.F8 = 119;
Keyboard.F9 = 120;
Keyboard.F10 = 121;
Keyboard.F11 = 122;
Keyboard.F12 = 123;
Keyboard.F13 = 124;
Keyboard.F14 = 125;
Keyboard.F15 = 126;
Keyboard.F16 = 127;
Keyboard.F17 = 128;
Keyboard.F18 = 129;
Keyboard.F19 = 130;
Keyboard.F20 = 131;
Keyboard.F21 = 132;
Keyboard.F22 = 133;
Keyboard.F23 = 134;
Keyboard.F24 = 135;
Keyboard.NumLock = 144;
Keyboard.ScrollLock = 145;
Keyboard.Comma = 188;
Keyboard.Period = 190;
Keyboard.Slash = 191;
Keyboard.BackQuote = 192;
Keyboard.OpenBracket = 219;
Keyboard.BackSlash = 220;
Keyboard.CloseBracket = 221;
Keyboard.Quote = 222;
Keyboard.Meta = 224;
