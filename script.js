const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');

// Set canvas dimensions dynamically for different screen sizes
canvas.width = window.innerWidth - 50;
canvas.height = window.innerHeight - 150;

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

// Mouse events for desktop
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);

// Touch events for mobile
canvas.addEventListener('touchstart', startDrawing, { passive: false });
canvas.addEventListener('touchmove', draw, { passive: false });
canvas.addEventListener('touchend', stopDrawing);

// Function to start drawing
function startDrawing(e) {
    e.preventDefault();
    const { x, y } = getEventPosition(e);
    startX = x;
    startY = y;
    drawing = true;
}

// Function to draw on canvas
function draw(e) {
    if (!drawing) return;

    e.preventDefault();
    const { x, y } = getEventPosition(e);

    if (currentShape === 'Freehand') {
        drawShape(startX, startY, x, y, currentShape);
        startX = x; // Update start point for continuous freehand drawing
        startY = y;
    } else {
        // For other shapes, preview the shape while dragging
        clearCanvas(); // Clear canvas for a clean redraw
        drawAllShapes(); // Redraw previous shapes
        drawShape(startX, startY, x, y, currentShape); // Draw current shape
    }
}

// Function to stop drawing
function stopDrawing(e) {
    if (!drawing) return;

    const { x, y } = getEventPosition(e);
    drawing = false;

    // Add the final shape to the canvas
    drawShape(startX, startY, x, y, currentShape);
}

// Get mouse/touch position
function getEventPosition(e) {
    if (e.touches && e.touches[0]) {
        return { x: e.touches[0].clientX - canvas.offsetLeft, y: e.touches[0].clientY - canvas.offsetTop };
    }
    return { x: e.offsetX, y: e.offsetY };
}

// Function to draw shapes based on selection
let shapes = [];
function drawShape(x1, y1, x2, y2, shape) {
    ctx.strokeStyle = currentColor;
    ctx.lineWidth = 2;

    switch (shape) {
        case 'Line':
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
            shapes.push({ type: 'Line', x1, y1, x2, y2, color: currentColor });
            break;
        case 'Rectangle':
            ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);
            shapes.push({ type: 'Rectangle', x1, y1, x2, y2, color: currentColor });
            break;
        case 'Oval':
            ctx.beginPath();
            const radiusX = Math.abs(x2 - x1) / 2;
            const radiusY = Math.abs(y2 - y1) / 2;
            const centerX = x1 + radiusX;
            const centerY = y1 + radiusY;
            ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, Math.PI * 2);
            ctx.stroke();
            shapes.push({ type: 'Oval', x1, y1, x2, y2, color: currentColor });
            break;
        case 'Freehand':
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
            shapes.push({ type: 'Freehand', x1, y1, x2, y2, color: currentColor });
            break;
    }
}

// Redraw all saved shapes (used when previewing)
function drawAllShapes() {
    shapes.forEach(shape => {
        ctx.strokeStyle = shape.color;
        switch (shape.type) {
            case 'Line':
                ctx.beginPath();
                ctx.moveTo(shape.x1, shape.y1);
                ctx.lineTo(shape.x2, shape.y2);
                ctx.stroke();
                break;
            case 'Rectangle':
                ctx.strokeRect(shape.x1, shape.y1, shape.x2 - shape.x1, shape.y2 - shape.y1);
                break;
            case 'Oval':
                ctx.beginPath();
                const radiusX = Math.abs(shape.x2 - shape.x1) / 2;
                const radiusY = Math.abs(shape.y2 - shape.y1) / 2;
                const centerX = shape.x1 + radiusX;
                const centerY = shape.y1 + radiusY;
                ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, Math.PI * 2);
                ctx.stroke();
                break;
            case 'Freehand':
                ctx.beginPath();
                ctx.moveTo(shape.x1, shape.y1);
                ctx.lineTo(shape.x2, shape.y2);
                ctx.stroke();
                break;
        }
    });
}

// Clear the canvas and reset shapes array
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    shapes = [];
}
