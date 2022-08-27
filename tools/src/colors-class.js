
/*
 * Color.js from the DrawTools.js library
 * Creator: Hamilton Cline
 * Email: hamdiggy@gmail.com
 * Website: hamiltondraws.com
*/



export class RGB {
    constructor(r, g, b) {
        this.r = +r;
        this.g = +g;
        this.b = +b;
    }
}
export class HSL {
    constructor(h, s, l) {
        this.h = +h;
        this.s = +s;
        this.l = +l;
    }
}
export class CMYK {
    constructor(c, m, y, k) {
        this.c = +c;
        this.m = +m;
        this.y = +y;
        this.k = +k;
    }
}
export class COLOR {

    static hexReg = /^#?[0-9a-fA-F]{3,6}/;
    static rgbReg = /^rgba?\((\d+),\s*(\d+),\s*(\d+)[,\d\.]*\)/;
    static hslReg = /^hsla?\((\d+),\s*(\d+)%,\s*(\d+)%[,\d\.]*\)/;

    constructor(color, type) {
        this.rgb = new RGB(0, 0, 0);
        this.hsl = new HSL(0, 0, 0);
        this.cmyk = new CMYK(0, 0, 0, 0);
        this.hex = "000000";

        if (type === undefined) {
            if (COLOR.hexReg.test(color))
                type = "hex";
            else if (color instanceof RGB)
                type = "rgb";
            else if (COLOR.rgbReg.test(color))
                type = "rgbs";
            else if (color instanceof HSL)
                type = "hsl";
            else if (COLOR.hslReg.test(color))
                type = "hsls";
            else if (/[a-zA-z]+/.test(color))
                type = "word";
            else if (typeof color == "object") {
                if (color.r !== undefined)
                    type = "rgb";
                if (color.h !== undefined)
                    type = "hsl";
            }
        } else {
            this.setVal(type, color);
            this.updateVals(type);
        }
    }
    setVal(key = "r", value) {
        let r,g,b;
        switch (key) {
            case "r":
            case "g":
            case "b":
                this.rgb[key] = value; key = "rgb";
                break;
            case "rgb":
                Object.assign(this.rgb, value);
                break;
            case "rgbs":
                [r,g,b] = COLOR.rgbReg.exec(value);
                Object.assign(this.rgb, new RGB(r, g, b));
                key = "rgb";
                break;
            case "h":
            case "s":
            case "l":
                this.hsl[key] = value; key = "hsl";
                break;
            case "hsl":
                Object.assign(this.hsl, value);
                break;
            case "hsls":
                [r,g,b] = COLOR.hslReg.exec(value);
                Object.assign(this.hsl, new HSL(r, g, b));
                key = "hsl";
                break;
            case "c":
            case "m":
            case "y":
            case "k":
                this.cmyk[key] = value; key = "cmyk";
                break;
            case "cmyk":
                Object.assign(this.cmyk, value);
                break;
            case "hex":
                if (value[0] == "#") value = value.slice(1);
                if (value.length == 3) {
                    [r,g,b] = value.split('');
                    this.hex = `${r}${r}${g}${g}${b}${b}`;
                } else this.hex = value;
                break;
            case "word":
                this.hex = this.wordToHex(value);
                key = "hex";
                break;
        }
        this.updateVals(key);
        return this;
    }
    updateVals(key) {
        switch (key) {
            case "rgb":
                this.rgbToHsl().rgbToCmyk().rgbToHex();
                break;
            case "hsl":
                this.hslToRgb().rgbToCmyk().rgbToHex();
                break;
            case "cmyk":
                this.cmykToRgb().rgbToHsl().rgbToHex();
                break;
            case "hex":
                this.hexToRgb().rgbToHsl().rgbToCmyk();
                break;
        }
        return this;
    }
    rgbToHsl() {
        let r = this.rgb.r / 255,
            g = this.rgb.g / 255,
            b = this.rgb.b / 255, 
            max = Math.max(r, g, b),
            min = Math.min(r, g, b),
            h, s, l = (max + min) / 2;
        if (max == min) {
            h = s = 0; // achromatic
        } else {
            let d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
        this.hsl.h = h * 360;
        this.hsl.s = s * 100;
        this.hsl.l = l * 100;
        return this;
    }
    rgbToCmyk() {
        let r = this.rgb.r / 255,
            g = this.rgb.g / 255,
            b = this.rgb.b / 255,
            k = Math.min(1 - r, 1 - g, 1 - b),
            c = (1 - r - k) / (1 - k),
            m = (1 - g - k) / (1 - k),
            y = (1 - b - k) / (1 - k);
        this.cmyk.c = c * 255 || 0;
        this.cmyk.m = m * 255 || 0;
        this.cmyk.y = y * 255 || 0;
        this.cmyk.k = k * 255;
        return this;
    }
    rgbToHex() {
        this.hex =
            ("0" + Math.round(this.rgb.r).toString(16)).slice(-2) +
            ("0" + Math.round(this.rgb.g).toString(16)).slice(-2) +
            ("0" + Math.round(this.rgb.b).toString(16)).slice(-2);
        return this;
    }
    hslToRgb() {
        let h = this.hsl.h / 360,
            s = this.hsl.s / 100,
            l = this.hsl.l / 100,
            r, g, b;
        if (s == 0) {
            r = g = b = l;
        } else {
            let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            let p = 2 * l - q;
            r = this.hue2rgb(p, q, h + 1 / 3);
            g = this.hue2rgb(p, q, h);
            b = this.hue2rgb(p, q, h - 1 / 3);
        }
        this.rgb.r = r * 255;
        this.rgb.g = g * 255;
        this.rgb.b = b * 255;
        return this;
    }
    wordToHex(str) {
        let ctx = document.createElement('canvas').getContext('2d');
        ctx.fillStyle = str;
        return ctx.fillStyle.substr(1);
    }
    hue2rgb(p, q, t) {
        if (t < 0)
            t += 1;
        if (t > 1)
            t -= 1;
        if (t < 1 / 6)
            return p + (q - p) * 6 * t;
        if (t < 1 / 2)
            return q;
        if (t < 2 / 3)
            return p + (q - p) * (2 / 3 - t) * 6;
        return p;
    }
    cmykToRgb() {
        let c = this.cmyk.c / 100,
            m = this.cmyk.m / 100,
            y = this.cmyk.y / 100,
            k = this.cmyk.k / 100,
            r = 1 - Math.min(1, c * (1 - k) + k),
            g = 1 - Math.min(1, m * (1 - k) + k),
            b = 1 - Math.min(1, y * (1 - k) + k);
        this.rgb.r = r * 255;
        this.rgb.g = g * 255;
        this.rgb.b = b * 255;
        return this;
    }
    hexToRgb() {
        this.rgb.r = parseInt(this.hex.slice(0, 2), 16);
        this.rgb.g = parseInt(this.hex.slice(2, 2), 16);
        this.rgb.b = parseInt(this.hex.slice(4, 2), 16);
        return this;
    }
    toString(type, alpha = 1) {
        switch (type) {
            case "rgb": return `rgb(${Math.round(this.rgb.r)},${Math.round(this.rgb.g)},${Math.round(this.rgb.b)})`;
            case "rgba": return `rgba(${Math.round(this.rgb.r)},${Math.round(this.rgb.g)},${Math.round(this.rgb.b)},${alpha})`;
            case "rgbv": return `${Math.round(this.rgb.r)},${Math.round(this.rgb.g)},${Math.round(this.rgb.b)}`;
            case "hsl": return `hsl(${Math.round(this.hsl.h)},${Math.round(this.hsl.s)}%,${Math.round(this.hsl.l)}%)`;
            case "hsla": return `hsla(${Math.round(this.hsl.h)},${Math.round(this.hsl.s)}%,${Math.round(this.hsl.l)}%,${alpha})`;
            case "hslv": return `${Math.round(this.hsl.h)},${Math.round(this.hsl.s)}%,${Math.round(this.hsl.l)}%`;
            case "cmyk": return `cmyk(${Math.round(this.cmyk.c)},${Math.round(this.cmyk.m)},${Math.round(this.cmyk.y)},${Math.round(this.cmyk.k)})`;
            case "hex": return "#" + this.hex;
        }
    }
}



