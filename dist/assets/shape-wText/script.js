// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeShapes();
    setupEventListeners();
});

// Initialize existing shapes
function initializeShapes() {
    const allShapes = document.querySelectorAll('.shape');
    allShapes.forEach(shape => {
        const controls = shape.parentElement.querySelector('.shape-controls');
        updateShapeAppearance(shape, controls);
        updateOpacityValue(controls);
        setupShapeControls(shape, controls);
    });
}

// Set up event listeners for existing elements
function setupEventListeners() {
    // No add buttons to set up anymore
}

// Set up controls for a shape
function setupShapeControls(shape, controls) {
    const colorPicker = controls.querySelector('.color-picker');
    const fillToggle = controls.querySelector('.fill-toggle');
    const opacitySlider = controls.querySelector('.opacity-slider');
    const opacityControl = controls.querySelector('.opacity-control');
    
    // Color picker change - sync with other shapes in the same section
    colorPicker.addEventListener('change', function() {
        syncColorsInSection(shape, colorPicker.value);
    });
    
    // Fill toggle change - sync with other shapes in the same section
    fillToggle.addEventListener('change', function() {
        syncFillInSection(shape, fillToggle.checked);
    });
    
    // Opacity slider change - only affects this specific shape
    opacitySlider.addEventListener('input', function() {
        updateShapeAppearance(shape, controls);
        updateOpacityValue(controls);
    });
    
    // Initial opacity control visibility
    if (!fillToggle.checked) {
        opacityControl.classList.add('hidden');
    }
}

// Sync colors across all shapes in the same section
function syncColorsInSection(changedShape, newColor) {
    const section = changedShape.closest('.section');
    const allShapesInSection = section.querySelectorAll('.shape');
    
    allShapesInSection.forEach(shape => {
        const controls = shape.parentElement.querySelector('.shape-controls');
        const colorPicker = controls.querySelector('.color-picker');
        
        // Update the color picker value
        colorPicker.value = newColor;
        
        // Update the shape appearance
        updateShapeAppearance(shape, controls);
    });
}

// Sync fill state across all shapes in the same section
function syncFillInSection(changedShape, isFilled) {
    const section = changedShape.closest('.section');
    const allShapesInSection = section.querySelectorAll('.shape');
    
    allShapesInSection.forEach(shape => {
        const controls = shape.parentElement.querySelector('.shape-controls');
        const fillToggle = controls.querySelector('.fill-toggle');
        const opacityControl = controls.querySelector('.opacity-control');
        
        // Update the fill toggle value
        fillToggle.checked = isFilled;
        
        // Show/hide opacity control based on fill state
        if (isFilled) {
            opacityControl.classList.remove('hidden');
        } else {
            opacityControl.classList.add('hidden');
        }
        
        // Update the shape appearance
        updateShapeAppearance(shape, controls);
    });
}

// Update shape appearance based on controls
function updateShapeAppearance(shape, controls) {
    const colorPicker = controls.querySelector('.color-picker');
    const fillToggle = controls.querySelector('.fill-toggle');
    const opacitySlider = controls.querySelector('.opacity-slider');
    
    const color = colorPicker.value;
    const isFilled = fillToggle.checked;
    const opacity = opacitySlider.value / 100;
    
    // Always reset shape opacity to 1 since we'll use HSLA for transparency
    shape.style.opacity = 1;
    
    if (isFilled) {
        // Filled shape - convert hex to HSLA with opacity
        const hsla = hexToHsla(color, opacity);
        shape.style.backgroundColor = hsla;
        shape.style.borderColor = color;
    } else {
        // Outline only
        shape.style.backgroundColor = 'transparent';
        shape.style.borderColor = color;
        shape.style.borderWidth = '3px';
    }
    
    // Update text color based on the shape color and fill
    updateTextColor(shape, color, isFilled, opacity);
}

// Update text color (placeholder for future logic)
function updateTextColor(shape, shapeColor, isFilled, opacity) {
    const textElement = shape.querySelector('.shape-text');
    
    // Calculate brightness to determine if original color is light or dark
    const rgb = hexToRgb(shapeColor);
    const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
    
    if (!isFilled) {
        // Not filled: always use original shape color for text
        textElement.style.color = shapeColor;
        textElement.style.textShadow = 'none';
        return;
    }
    
    // Method 1: For lighter/brighter original colors (brightness > 128)
    if (brightness > 128) {
        if (opacity > 0.7) {
            // High opacity: use dark variant for contrast
            textElement.style.color = adjustColorLightness(shapeColor, 15);
        } else if (opacity >= 0.4 && opacity <= 0.7) {
            // Medium opacity: blend dark variants
            const filledTextColor = adjustColorLightness(shapeColor, 15);
            const strokeTextColor = shapeColor //adjustColorLightness(shapeColor, 35);
            textElement.style.color = blendColorsHSL(filledTextColor, strokeTextColor, 0.5);
        } else {
            // Low opacity: use original shape color
            textElement.style.color = shapeColor;
        }
    } 
    // Method 2: For darker original colors (brightness <= 128)
    else {
        if (opacity > 0.8) {
            // Above 80% opacity: use 85% lighter color
            textElement.style.color = adjustColorLightness(shapeColor, 85);
        } else if (opacity >= 0.6 && opacity <= 0.8) {
            // Between 80-60% opacity: blend the two colors
            const filledTextColor = adjustColorLightness(shapeColor, 85);
            const strokeTextColor = shapeColor;
            textElement.style.color = blendColorsHSL(filledTextColor, strokeTextColor, 0.5);
        } else {
            // Below 60% opacity: switch to original shape color
            textElement.style.color = shapeColor;
        }
    }
    
    // Remove text shadow
    textElement.style.textShadow = 'none';
}

// Update opacity value display
function updateOpacityValue(controls) {
    const opacitySlider = controls.querySelector('.opacity-slider');
    const opacityValue = controls.querySelector('.opacity-value');
    const shapeGroup = controls.closest('.shape-group');
    const opacityLabel = shapeGroup.querySelector('.opacity-label');
    
    const currentOpacity = `${opacitySlider.value}%`;
    opacityValue.textContent = currentOpacity;
    
    // Update the opacity label above the shape
    if (opacityLabel) {
        opacityLabel.textContent = currentOpacity;
    }
}

// Helper function to convert hex to RGB
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

// Helper function to convert hex to HSLA
function hexToHsla(hex, alpha = 1) {
    const rgb = hexToRgb(hex);
    if (!rgb) return hex;
    
    const r = rgb.r / 255;
    const g = rgb.g / 255;
    const b = rgb.b / 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    
    if (max === min) {
        h = s = 0; // achromatic
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    
    return `hsla(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%, ${alpha})`;
}

// Helper function to adjust lightness of a color
function adjustColorLightness(hex, targetLightness) {
    const rgb = hexToRgb(hex);
    if (!rgb) return hex;
    
    const r = rgb.r / 255;
    const g = rgb.g / 255;
    const b = rgb.b / 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    
    if (max === min) {
        h = s = 0; // achromatic
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    
    // Use the target lightness instead of the original
    return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${targetLightness}%)`;
}

// Helper function to convert hex to HSL object
function hexToHsl(hex) {
    const rgb = hexToRgb(hex);
    if (!rgb) return null;
    
    const r = rgb.r / 255;
    const g = rgb.g / 255;
    const b = rgb.b / 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    
    if (max === min) {
        h = s = 0; // achromatic
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    
    return {
        h: h * 360, // Convert to degrees
        s: s * 100, // Convert to percentage
        l: l * 100  // Convert to percentage
    };
}

// Helper function to interpolate hue values (handles wraparound)
function interpolateHue(h1, h2, ratio) {
    const diff = h2 - h1;
    
    // Choose the shorter path around the color wheel
    if (Math.abs(diff) > 180) {
        if (diff > 0) {
            h1 += 360;
        } else {
            h2 += 360;
        }
    }
    
    const result = h1 + (h2 - h1) * ratio;
    return ((result % 360) + 360) % 360; // Normalize to 0-360
}

// Helper function to blend two HSL objects
function blendHSL(hsl1, hsl2, ratio) {
    return {
        h: interpolateHue(hsl1.h, hsl2.h, ratio),
        s: hsl1.s + (hsl2.s - hsl1.s) * ratio,
        l: hsl1.l + (hsl2.l - hsl1.l) * ratio
    };
}

// Helper function to convert HSL object to CSS hsl() string
function hslToString(hsl) {
    return `hsl(${Math.round(hsl.h)}, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%)`;
}

// Helper function to blend two hex colors using HSL
function blendColorsHSL(color1, color2, ratio = 0.5) {
    const hsl1 = hexToHsl(color1);
    const hsl2 = hexToHsl(color2);
    
    if (!hsl1 || !hsl2) return color1;
    
    const blendedHsl = blendHSL(hsl1, hsl2, ratio);
    return hslToString(blendedHsl);
}

// Helper function to blend two hex colors
function blendColors(color1, color2, ratio = 0.5) {
    const rgb1 = hexToRgb(color1);
    const rgb2 = hexToRgb(color2);
    
    if (!rgb1 || !rgb2) return color1;
    
    const r = Math.round(rgb1.r * (1 - ratio) + rgb2.r * ratio);
    const g = Math.round(rgb1.g * (1 - ratio) + rgb2.g * ratio);
    const b = Math.round(rgb1.b * (1 - ratio) + rgb2.b * ratio);
    
    return `rgb(${r}, ${g}, ${b})`;
}

// Add smooth animations
document.addEventListener('DOMContentLoaded', function() {
    // Add stagger animation to initial shapes
    const shapes = document.querySelectorAll('.shape-group');
    shapes.forEach((shape, index) => {
        shape.style.opacity = '0';
        shape.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            shape.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            shape.style.opacity = '1';
            shape.style.transform = 'translateY(0)';
        }, index * 100); // Reduced delay since we have more shapes now
    });
}); 