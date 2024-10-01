const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');

// Set canvas dimensions
canvas.width = window.innerWidth - 100;
canvas.height = window.innerHeight - 200;

let currentShape = 'Freehand';
let currentColor = '#000000';
let startX, startY, drawing = false;

// Get elements for user controls
const shapeSelect = document.getElementById('shape');
const colorPicker = document.getElementById('colorPicker');
const clearButton = document.getElementById('clearButton');

// Event listeners for controls
shapeSelect.addEventListener('change', (e) => currentShape = e.target.value);
colorPicker.addEventListener('input', (e) => currentColor = e.target.value);
clearButton.addEventListener('click', clearCanvas);

canvas.addEventListener('mousedown', (e) => {
    startX = e.offsetX;
    startY = e.offsetY;
    if (currentShape === 'Text') {
        addText();
    } else {
        drawing = true;
    }
});

canvas.addEventListener('mouseup', (e) => {
    if (drawing) {
        const endX = e.offsetX;
        const endY = e.offsetY;
        drawShape(startX, startY, endX, endY, currentShape);
        drawing = false;
    }
});

canvas.addEventListener('mousemove', (e) => {
    if (drawing && currentShape === 'Freehand') {
        const endX = e.offsetX;
        const endY = e.offsetY;
        drawShape(startX, startY, endX, endY, currentShape);
        startX = endX;
        startY = endY;
    }
});

// Function to draw different shapes
function drawShape(x1, y1, x2, y2, shape) {
    ctx.strokeStyle = currentColor;
    ctx.fillStyle = currentColor;
    ctx.lineWidth = 2;

    switch (shape) {
        case 'Line':
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
            break;
        case 'Rectangle':
            ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);
            break;
        case 'Oval':
            ctx.beginPath();
            const radiusX = Math.abs(x2 - x1) / 2;
            const radiusY = Math.abs(y2 - y1) / 2;
            const centerX = x1 + radiusX;
            const centerY = y1 + radiusY;
            ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, Math.PI * 2);
            ctx.stroke();
            break;
        case 'Freehand':
            ctx.lineTo(x2, y2);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x2, y2);
            break;
    }
}

// Function to clear the canvas
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Function to add text to the canvas
function addText() {
    const text = prompt("Enter your text:");
    if (text) {
        ctx.fillStyle = currentColor;
        ctx.font = "20px Arial";  // You can customize font size and style here
        ctx.fillText(text, startX, startY);
    }
}
