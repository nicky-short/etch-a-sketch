const divContainer = document.getElementById("div-container");
const square = document.createElement('div');
const gridInput = document.getElementById("grid-size");
const colorInput = document.getElementById("color");
const opacityInput = document.getElementById("opacity");
const startBtn = document.getElementById("start-btn");
const warning = document.getElementById("warning");
const manualBtn = document.getElementById("manual-btn");
const undoBtn = document.getElementById("undo-btn");


let gridSize = 32;
let isDrawing = false;
let isManualMode = false;
let isMouseDown = false;
let manualStrokes = [];
let currentStroke = [];

function createGrid(size) {
    divContainer.innerHTML = "";
    const squareSize = 650 / size;
    for (let i = 0; i < size * size; i++) {
        const square = document.createElement('div');
        square.style.width = `${squareSize}px`;
        square.style.height = `${squareSize}px`;
        square.classList.add('square');
        square.style.backgroundColor = "rgba(255, 255, 255, 0)";

        
        square.addEventListener("mouseenter", () => {
            if (isDrawing) {
                colorSquare(square);
            }
        });

        
        square.addEventListener("mousedown", () => {
            if (isManualMode) {
                isMouseDown = true;
                currentStroke = [];
                saveSquareState(square);
                colorSquare(square);
            }
        });

        square.addEventListener("mouseenter", () => {
            if (isManualMode && isMouseDown) {
                saveSquareState(square);
                colorSquare(square);
            }
        });

        square.addEventListener("mouseup", () => {
            if (isManualMode && isMouseDown) {
                isMouseDown = false;
                if (currentStroke.length > 0) {
                    manualStrokes.push(currentStroke);
                }
            }
        });

        divContainer.appendChild(square);
    }
}


function saveSquareState(square) {
    if (!currentStroke.some(entry => entry.square === square)) {
        const previousColor = window.getComputedStyle(square).backgroundColor;
        currentStroke.push({ square, oldColor: previousColor });
    }
}


undoBtn.addEventListener("click", () => {
    if (manualStrokes.length === 0) return;
    const lastStroke = manualStrokes.pop();
    for (const {square, oldColor} of lastStroke) {
        square.style.backgroundColor = oldColor;
    }
});

document.addEventListener("mouseup", () => {
    if (isManualMode && isMouseDown) {
        isMouseDown = false;
        if (currentStroke.length > 0) {
            manualStrokes.push(currentStroke);
        }
    }
});

function colorSquare(square) {
        const baseColor = colorInput.value;
        const opacity = opacityInput.value / 100;
    
        const [rNew, gNew, bNew] = hexToRgb(baseColor);
        const currentColor = window.getComputedStyle(square).backgroundColor;
        const match = currentColor.match(/rgba?\((\d+), (\d+), (\d+)(?:, ([\d.]+))?\)/);
    
        let rOld = 255, gOld = 255, bOld = 255, alphaOld = 0;
    
        if (match) {
            rOld = parseInt(match[1]);
            gOld = parseInt(match[2]);
            bOld = parseInt(match[3]);
            alphaOld = match[4] !== undefined ? parseFloat(match[4]) : 1;
        }

        const rMixed = Math.round(rNew * opacity + rOld * (1 - opacity));
        const gMixed = Math.round(gNew * opacity + gOld * (1 - opacity));
        const bMixed = Math.round(bNew * opacity + bOld * (1 - opacity));
        const newAlpha = Math.min(alphaOld + opacity * (1 - alphaOld), 1);
    
        square.style.backgroundColor = `rgba(${rMixed}, ${gMixed}, ${bMixed}, ${newAlpha})`;
    }
    
function hexToRgb(hex) {
    hex = hex.replace("#", "")
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return [r, g, b];
}

function getAlphaFromRGBA(rgba) {
    const match = rgba.match(/rgba?\((\d+), (\d+), (\d+)(?:, ([\d.]+))?\)/);
    if (!match) return 0;
    return match[4] !== undefined ? parseFloat(match[4]) : 1;
}

gridInput.addEventListener("input", () => {
    const newSize = parseInt(gridInput.value);
    if (isNaN(newSize) || newSize <=0) {
        showGridSizeWarning("please enter a valid number above 0");
        dimGrid(true);
        return;
    }
    if (newSize > 100) {
        showGridSizeWarning("grid cannot be larger than 100!");
        dimGrid(true);
        return;
    }
    clearWarning();
    dimGrid(false);
    gridSize = newSize;
    createGrid(gridSize);

});



startBtn.addEventListener("click", () => {
    isDrawing = !isDrawing;
    if (isDrawing) {
        startBtn.textContent = "stop";
        startBtn.style.backgroundColor = "red";
        startBtn.style.color = "white";
    } else {
        startBtn.textContent = "start";
        startBtn.style.backgroundColor = "rgb(237, 233, 233)";
        startBtn.style.color = "black";
    }


});

function showGridSizeWarning(msg) {
    const warning = document.getElementById("warning");
    warning.textContent = msg;
}

function clearWarning() {
    const warning = document.getElementById("warning");
    warning.textContent = "";
}

function dimGrid(shouldDim) {
    if (shouldDim) {
        divContainer.style.opacity = "0.2";
        divContainer.style.pointerEvents = "none";
    } else {
        divContainer.style.opacity = "1";
        divContainer.style.pointerEvents = "auto";
    }
}

createGrid(gridSize);

undoBtn.disabled = true;
undoBtn.style.opacity = "0.3";


const clearBtn = document.getElementById("clear-btn");
    clearBtn.addEventListener("click", () => {
    createGrid(gridSize);
});


manualBtn.addEventListener("click", () => {
    isDrawing = false;
    isManualMode = !isManualMode;
    if (isManualMode) {
        manualBtn.style.backgroundColor = "rgb(216, 216, 86)";
        manualBtn.style.color = "white";
        startBtn.disabled = true;
        startBtn.style.opacity = "0.3";
        undoBtn.disabled = false;
        undoBtn.style.opacity = "1";
        } else {
            manualBtn.style.backgroundColor = "";
            manualBtn.style.color = "";
            startBtn.disabled = false;
            startBtn.style.opacity = "1";
            undoBtn.disabled = true;
            undoBtn.style.opacity = "0.3";
            }
    });
  
    const saveBtn = document.getElementById("save-btn");
    saveBtn.addEventListener("click", () => {
        const canvas = document.createElement("canvas");
        canvas.width = 650;
        canvas.height = 650;
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#ffffff";  
        ctx.fillRect(0, 0, canvas.width, canvas.height);  


        const squares = Array.from(document.querySelectorAll(".square"));
        const size = Math.sqrt(squares.length);
        const squareSize = 650/size;

        squares.forEach((square, index) => {
            const color = window.getComputedStyle(square).backgroundColor;
            const x = (index % size) * squareSize;
            const y = Math.floor(index/size) * squareSize;

            ctx.fillStyle = color;
            ctx.fillRect(x, y, squareSize, squareSize)
        });

        const link = document.createElement("a");
        link.download = "drawing.png";
        link.href = canvas.toDataURL("image/png");
        link.click();

    });

