const numSegments = 20;
const Segments = [];

for(let i = 0; i < numSegments; i++) {
    const Segments = document.createElement('div');
    Segments.classList.add('snake');
    document.body.appendChild(Segments);
    Segments.push(Segments)
}

let positions = Array(numSegments).fill({ x: 0, y: 0 });

document.addEventListener('mousemove', (e) => {
    positions.unshift({ x: e.clientX, y: e.clientY });
    positions.pop();

    Segments.forEach((Segments, i) => {
        Segments.style.transform = `translate(${positions[i].x}px, ${positions[i].y}px)`;
    });
});
