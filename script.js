const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');
const rec = canvas.getBoundingClientRect();
var isMouseDown = false;
var n = 0;
var prevY = 0;
var flag = true;

var triangles = [];

// funtion to remove all triangles in canvas
function reset() {
    triangles = [];
    const context = canvas.getContext('2d');

    context.clearRect(0, 0, canvas.width, canvas.height);
}

// funtion to draw triangle
function draw(event) {
    if (event.button == 0) {
        var rec = canvas.getBoundingClientRect();
        var pos1 = event.clientX - rec.left;
        var pos2 = event.clientY - rec.top;
        var x2 = 0;
        var y2 = 0;
        var x3 = 0;
        var y3 = 0;
        var clr = getRandomColor();
        var tri = new Triangle(
            { x1: pos1, y1: pos2 },
            { x2: x2, y2: y2 },
            { x3: x3, y3: y3 },
            clr
        );

        prevY = pos2;

        triangles.push(tri);
    }
}

// funtion to get random color
function getRandomColor() {
    var red = Math.floor(Math.random() * 256);
    var green = Math.floor(Math.random() * 256);
    var blue = Math.floor(Math.random() * 256);

    return 'rgb(' + red + ',' + green + ',' + blue + ')';
}

function drag(event) {
    if (isMouseDown == false) {
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < triangles.length; i++) {
        if (i == triangles.length - 1 && flag) {
            var x = triangles[i].point1.x1;
            var y = triangles[i].point1.y1;

            if (event.clientY - rec.top > prevY) {
                prevY = event.clientY - rec.top;
                n += 3;

                triangles[i].point2 = { x2: x - n, y2: y + n };
                triangles[i].point3 = { x3: x + n, y3: y + n };

                ctx.lineWidth = 0.8;
                ctx.beginPath();
                ctx.moveTo(x, y);
                if (x - n <= 0) {
                    return;
                }

                ctx.lineTo(x - n, y + n);
                ctx.lineTo(x + n, y + n);
                ctx.fillStyle = triangles[i].color;
                ctx.fill();
                ctx.closePath();
                ctx.stroke();
            } else if (triangles[i].point2.y2 <= y) {
                continue;
            } else if (event.clientY - rec.top < prevY) {
                prevY = event.clientY - rec.top;
                n -= 3;
                triangles[i].point2 = { x2: x - n, y2: y + n };
                triangles[i].point3 = { x3: x + n, y3: y + n };

                ctx.lineWidth = 0.8;
                ctx.beginPath();
                ctx.moveTo(x, y);

                ctx.lineTo(x - n, y + n);
                ctx.lineTo(x + n, y + n);
                ctx.fillStyle = triangles[i].color;
                ctx.fill();
                ctx.closePath();
                ctx.stroke();
            }
        } else {
            var x = triangles[i].point1.x1;
            var y = triangles[i].point1.y1;

            var x2 = triangles[i].point2.x2;
            var y2 = triangles[i].point2.y2;

            var x3 = triangles[i].point3.x3;
            var y3 = triangles[i].point3.y3;

            var mouseX = parseInt(event.clientX - rec.left);
            var mouseY = parseInt(event.clientY - rec.top);

            ctx.lineWidth = 0.8;

            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x2, y2);
            ctx.lineTo(x3, y3);

            if (ctx.isPointInPath(mouseX, mouseY) || triangles[i].current) {
                var tri = triangles[triangles.length - 1];

                if (tri.point2.y2 <= 0) {
                    triangles.pop();
                }
                flag = false;
                var diffX = x - x2;
                var diffY = y2 - y;
                triangles[i].current = true;
                triangles[i].point1.x1 = mouseX;
                triangles[i].point1.y1 = mouseY;
                triangles[i].point2.x2 = mouseX - diffX;
                triangles[i].point2.y2 = mouseY + diffY;
                triangles[i].point3.x3 = mouseX + diffX;
                triangles[i].point3.y3 = mouseY + diffY;
                drawAll();
                return;
            } else {
                ctx.fillStyle = triangles[i].color;
                ctx.fill();
                ctx.closePath();
                ctx.stroke();
            }
        }
    }
}

// function to delete a triangle
function deleteTriangle(event) {
    isMouseDown = false;
    for (let i = 0; i < triangles.length; i++) {
        ctx.lineWidth = 0.8;

        var x = triangles[i].point1.x1;
        var y = triangles[i].point1.y1;

        var x2 = triangles[i].point2.x2;
        var y2 = triangles[i].point2.y2;

        var x3 = triangles[i].point3.x3;
        var y3 = triangles[i].point3.y3;

        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x2, y2);
        ctx.lineTo(x3, y3);

        var mouseX = parseInt(event.clientX - rec.left);
        var mouseY = parseInt(event.clientY - rec.top);

        if (ctx.isPointInPath(mouseX, mouseY)) {
            triangles.splice(i, 1);
            drawAll();
        }

        drawAll();
    }
}

// funtion to redraw all triangles
function drawAll() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < triangles.length; i++) {
        ctx.lineWidth = 0.8;

        var x = triangles[i].point1.x1;
        var y = triangles[i].point1.y1;

        var x2 = triangles[i].point2.x2;
        var y2 = triangles[i].point2.y2;

        var x3 = triangles[i].point3.x3;
        var y3 = triangles[i].point3.y3;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x2, y2);
        ctx.lineTo(x3, y3);

        ctx.fillStyle = triangles[i].color;
        ctx.fill();
        ctx.closePath();

        ctx.stroke();
    }
}

// event listners

window.addEventListener('load', () => {
    canvas.width = window.innerWidth - 200;
    canvas.height = window.innerHeight - 200;
});

canvas.addEventListener('mousedown', (e) => {
    flag = true;

    isMouseDown = true;
    draw(e);
});

canvas.addEventListener('mousemove', (event) => {
    drag(event);
});

canvas.addEventListener('mouseup', (event) => {
    var tri = triangles[triangles.length - 1];
    isMouseDown = false;
    n = 0;

    for (let i = 0; i < triangles.length; i++) {
        triangles[i].current = false;
    }

    if (tri.point2.y2 <= 0) {
        triangles.pop();
        drawAll();
    }

    drawAll();
});

canvas.addEventListener('dblclick', (event) => {
    isMouseDown = false;
    deleteTriangle(event);
});

class Triangle {
    constructor(point1, point2, point3, color) {
        this.point1 = point1;
        this.point2 = point2;
        this.point3 = point3;
        this.color = color;
    }

    color;
    current = false;
    point1 = {
        x1: 0,
        y1: 0,
    };

    point2 = {
        x2: 0,
        y2: 0,
    };

    point3 = {
        x3: 0,
        y3: 0,
    };
}
