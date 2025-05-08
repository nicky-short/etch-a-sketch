const divContainer = document.getElementById("div-container")

let gridSize = 32;

function createGrid(size) {
    const squareSize = 650 / size;
    for (let i=0; i< size * size; i++) {
    const square = document.createElement('div');
    square.style.width = `${squareSize}px`;
    square.style.height = `${squareSize}px`;
    square.classList.add('square');
    divContainer.appendChild(square);
    }
}


createGrid(gridSize);