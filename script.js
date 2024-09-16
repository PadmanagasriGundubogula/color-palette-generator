document.addEventListener("DOMContentLoaded", () => {
    const generateBtn = document.querySelector(".generate-btn");
    const paletteContainer = document.querySelector(".palette");
    const colorCountInput = document.getElementById("color-count");
    const themeSelector = document.getElementById("theme-selector");
    const baseColorInput = document.getElementById("base-color");
    const randomColorOption = document.getElementById("random-color");
    const baseColorOption = document.getElementById("base-color-option");
    const colorPickerContainer = document.getElementById("color-picker-container");

    // Function to convert hex to RGB
    const hexToRgb = (hex) => {
        let bigint = parseInt(hex.slice(1), 16);
        let r = (bigint >> 16) & 255;
        let g = (bigint >> 8) & 255;
        let b = bigint & 255;
        return { r, g, b };
    };

    // Function to convert RGB to hex
    const rgbToHex = (r, g, b) => {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
    };

    // Function to generate shades of a base color
    const getShades = (baseColor, numShades) => {
        let { r, g, b } = hexToRgb(baseColor);
        const shades = [];

        // Check if the base color is white or close to white
        if (r > 230 && g > 230 && b > 230) {
            // Generate darker shades instead of lighter shades
            for (let i = 0; i < numShades; i++) {
                const factor = i / numShades;
                const newR = Math.round(r * (1 - factor));  // Darkening
                const newG = Math.round(g * (1 - factor));  // Darkening
                const newB = Math.round(b * (1 - factor));  // Darkening
                shades.push(rgbToHex(newR, newG, newB));
            }
        } else {
            // For non-white colors, generate lighter shades as before
            for (let i = 0; i < numShades; i++) {
                const factor = i / numShades;
                const newR = Math.round(r + (255 - r) * factor);  // Lightening
                const newG = Math.round(g + (255 - g) * factor);  // Lightening
                const newB = Math.round(b + (255 - b) * factor);  // Lightening
                shades.push(rgbToHex(newR, newG, newB));
            }
        }

        return shades;
    };

    // Function to generate a random color
    const getRandomColor = () => {
        const randomHex = Math.floor(Math.random() * 16777215).toString(16);
        return `#${randomHex.padStart(6, '0')}`;
    };

    // Function to copy hex code to clipboard
    const copyToClipboard = (hexCode) => {
        navigator.clipboard.writeText(hexCode).then(() => {
            alert(`Copied ${hexCode} to clipboard!`);
        });
    };

    // Function to create a color block
    const createColorBlock = (index, color) => {
        const block = document.createElement("div");
        block.className = "color-block";
        block.innerHTML = `
            <div class="color" style="background-color: ${color}"></div>
            <p class="hex-code">${color}</p>
        `;
        block.addEventListener("click", () => copyToClipboard(color));
        return block;
    };

    // Function to update the palette
    const updatePalette = () => {
        let numberOfColors = parseInt(colorCountInput.value);
        if (numberOfColors < 3) numberOfColors = 3;

        paletteContainer.innerHTML = "";  // Clear previous palette

        if (baseColorOption.checked) {
            // Generate shades of the base color
            const baseColor = baseColorInput.value;
            const shades = getShades(baseColor, numberOfColors);
            shades.forEach((shade, i) => {
                const block = createColorBlock(i, shade);
                paletteContainer.appendChild(block);
            });
        } else {
            // Generate random colors
            for (let i = 0; i < numberOfColors; i++) {
                const randomColor = getRandomColor();
                const block = createColorBlock(i, randomColor);
                paletteContainer.appendChild(block);
            }
        }
    };

    // Function to toggle visibility of color picker
    const toggleColorPicker = () => {
        if (baseColorOption.checked) {
            colorPickerContainer.style.display = "block";
        } else {
            colorPickerContainer.style.display = "none";
        }
    };

    // Function to apply the selected theme
    const applyTheme = () => {
        const selectedTheme = themeSelector.value;
        document.body.className = ''; // Clear previous class
        document.body.classList.add(selectedTheme); // Apply the new theme
    };

    // Event listeners
    themeSelector.addEventListener("change", applyTheme);
    randomColorOption.addEventListener("change", toggleColorPicker);
    baseColorOption.addEventListener("change", toggleColorPicker);
    generateBtn.addEventListener("click", updatePalette);

    // Initial palette generation and theme application
    updatePalette();
    applyTheme();
});
