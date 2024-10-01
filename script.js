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

canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mousemove', draw);

// Touch event listeners for finger drawing on mobile devices
canvas.addEventListener('touchstart', startTouchDrawing, { passive: false });
canvas.addEventListener('touchend', stopTouchDrawing, { passive: false });
canvas.addEventListener('touchmove', drawTouch, { passive: false });

function getMousePosition(e) {
    return {
        x: e.offsetX,
        y: e.offsetY
    };
}

function getTouchPosition(e) {
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top
    };
}

function startDrawing(e) {
    const pos = getMousePosition(e);
    startX = pos.x;
    startY = pos.y;
    drawing = true;
}

function stopDrawing(e) {
    if (drawing) {
        const pos = getMousePosition(e);
        drawShape(startX, startY, pos.x, pos.y, currentShape);
        drawing = false;
    }
}

function draw(e) {
    if (drawing && currentShape === 'Freehand') {
        const pos = getMousePosition(e);
        drawShape(startX, startY, pos.x, pos.y, currentShape);
        startX = pos.x;
        startY = pos.y;
    }
}

function startTouchDrawing(e) {
    e.preventDefault();
    const pos = getTouchPosition(e);
    startX = pos.x;
    startY = pos.y;
    drawing = true;
}

function stopTouchDrawing(e) {
    e.preventDefault();
    if (drawing) {
        const pos = getTouchPosition(e);
        drawShape(startX, startY, pos.x, pos.y, currentShape);
        drawing = false;
    }
}

function drawTouch(e) {
    e.preventDefault();
    if (drawing && currentShape === 'Freehand') {
        const pos = getTouchPosition(e);
        drawShape(startX, startY, pos.x, pos.y, currentShape);
        startX = pos.x;
        startY = pos.y;
    }
}

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
