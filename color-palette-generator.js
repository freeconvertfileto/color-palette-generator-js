(function() {
    var baseColorEl = document.getElementById('cpgBaseColor');
    var baseHexEl = document.getElementById('cpgBaseHex');
    var paletteTypeEl = document.getElementById('cpgPaletteType');
    var generateBtn = document.getElementById('cpgGenerate');
    var paletteEl = document.getElementById('cpgPalette');

    function hexToRgb(hex) {
        var r = parseInt(hex.slice(1, 3), 16);
        var g = parseInt(hex.slice(3, 5), 16);
        var b = parseInt(hex.slice(5, 7), 16);
        return { r: r, g: g, b: b };
    }

    function rgbToHsl(r, g, b) {
        r /= 255; g /= 255; b /= 255;
        var max = Math.max(r, g, b), min = Math.min(r, g, b);
        var h, s, l = (max + min) / 2;
        if (max === min) {
            h = s = 0;
        } else {
            var d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
                case g: h = ((b - r) / d + 2) / 6; break;
                case b: h = ((r - g) / d + 4) / 6; break;
            }
        }
        return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
    }

    function hslToRgb(h, s, l) {
        h /= 360; s /= 100; l /= 100;
        var r, g, b;
        if (s === 0) {
            r = g = b = l;
        } else {
            var hue2rgb = function(p, q, t) {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1/6) return p + (q - p) * 6 * t;
                if (t < 1/2) return q;
                if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            };
            var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            var p = 2 * l - q;
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }
        return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
    }

    function rgbToHex(r, g, b) {
        return '#' + [r, g, b].map(function(v) { return v.toString(16).padStart(2, '0'); }).join('');
    }

    function hslColor(h, s, l) {
        h = ((h % 360) + 360) % 360;
        var rgb = hslToRgb(h, s, l);
        return { hex: rgbToHex(rgb.r, rgb.g, rgb.b), rgb: rgb, hsl: { h: h, s: s, l: l } };
    }

    function generatePalette(hex, type) {
        var rgb = hexToRgb(hex);
        var hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
        var h = hsl.h, s = hsl.s, l = hsl.l;
        var colors = [];

        if (type === 'complementary') {
            colors = [
                hslColor(h, s, l),
                hslColor(h, Math.max(s - 20, 10), Math.min(l + 15, 90)),
                hslColor(h + 180, s, l),
                hslColor(h + 180, Math.max(s - 20, 10), Math.min(l + 15, 90)),
                hslColor(h, s, Math.max(l - 20, 10))
            ];
        } else if (type === 'triadic') {
            colors = [
                hslColor(h, s, l),
                hslColor(h + 120, s, l),
                hslColor(h + 240, s, l),
                hslColor(h + 120, s, Math.min(l + 15, 90)),
                hslColor(h + 240, s, Math.min(l + 15, 90))
            ];
        } else if (type === 'analogous') {
            colors = [
                hslColor(h - 40, s, l),
                hslColor(h - 20, s, l),
                hslColor(h, s, l),
                hslColor(h + 20, s, l),
                hslColor(h + 40, s, l)
            ];
        } else if (type === 'split-complementary') {
            colors = [
                hslColor(h, s, l),
                hslColor(h + 150, s, l),
                hslColor(h + 210, s, l),
                hslColor(h + 150, s, Math.min(l + 15, 90)),
                hslColor(h + 210, s, Math.min(l + 15, 90))
            ];
        } else if (type === 'tetradic') {
            colors = [
                hslColor(h, s, l),
                hslColor(h + 90, s, l),
                hslColor(h + 180, s, l),
                hslColor(h + 270, s, l),
                hslColor(h, s, Math.min(l + 20, 90))
            ];
        } else if (type === 'monochromatic') {
            colors = [
                hslColor(h, s, Math.max(l - 30, 5)),
                hslColor(h, s, Math.max(l - 15, 10)),
                hslColor(h, s, l),
                hslColor(h, s, Math.min(l + 15, 90)),
                hslColor(h, s, Math.min(l + 30, 95))
            ];
        }
        return colors;
    }

    function renderPalette(colors) {
        if (!paletteEl) return;
        paletteEl.innerHTML = '';
        colors.forEach(function(c) {
            var swatch = document.createElement('div');
            swatch.className = 'cpg-swatch';

            var colorDiv = document.createElement('div');
            colorDiv.className = 'cpg-swatch-color';
            colorDiv.style.background = c.hex;

            var info = document.createElement('div');
            info.className = 'cpg-swatch-info';

            var hexSpan = document.createElement('div');
            hexSpan.className = 'cpg-swatch-hex';
            hexSpan.textContent = c.hex.toUpperCase();

            var valSpan = document.createElement('div');
            valSpan.className = 'cpg-swatch-values';
            valSpan.textContent = 'RGB(' + c.rgb.r + ',' + c.rgb.g + ',' + c.rgb.b + ')';

            var valSpan2 = document.createElement('div');
            valSpan2.className = 'cpg-swatch-values';
            valSpan2.textContent = 'HSL(' + c.hsl.h + ',' + c.hsl.s + '%,' + c.hsl.l + '%)';

            var copyBtn = document.createElement('button');
            copyBtn.className = 'cpg-swatch-copy';
            copyBtn.textContent = 'Copy HEX';
            copyBtn.addEventListener('click', function() {
                navigator.clipboard.writeText(c.hex.toUpperCase()).then(function() {
                    copyBtn.textContent = 'Copied!';
                    setTimeout(function() { copyBtn.textContent = 'Copy HEX'; }, 1500);
                });
            });

            info.appendChild(hexSpan);
            info.appendChild(valSpan);
            info.appendChild(valSpan2);
            info.appendChild(copyBtn);
            swatch.appendChild(colorDiv);
            swatch.appendChild(info);
            paletteEl.appendChild(swatch);
        });
    }

    function run() {
        var hex = baseHexEl ? baseHexEl.value.trim() : '#3b82f6';
        if (!/^#[0-9a-fA-F]{6}$/.test(hex)) {
            hex = baseColorEl ? baseColorEl.value : '#3b82f6';
        }
        var type = paletteTypeEl ? paletteTypeEl.value : 'complementary';
        var colors = generatePalette(hex, type);
        renderPalette(colors);
    }

    if (baseColorEl) {
        baseColorEl.addEventListener('input', function() {
            if (baseHexEl) baseHexEl.value = baseColorEl.value;
        });
    }

    if (baseHexEl) {
        baseHexEl.addEventListener('input', function() {
            var v = baseHexEl.value.trim();
            if (/^#[0-9a-fA-F]{6}$/.test(v) && baseColorEl) {
                baseColorEl.value = v;
            }
        });
    }

    if (generateBtn) generateBtn.addEventListener('click', run);

    run();
})();
