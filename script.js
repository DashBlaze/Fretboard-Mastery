const notes = ["E", "F", "F#", "G", "G#", "A", "A#", "B", "C", "C#", "D", "D#"];
const strings = [
    ["E", "F", "F#", "G", "G#", "A", "A#", "B", "C", "C#", "D", "D#"],
    ["B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#"],
    ["G", "G#", "A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#"],
    ["D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B", "C", "C#"],
    ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"],
    ["E", "F", "F#", "G", "G#", "A", "A#", "B", "C", "C#", "D", "D#"]
];
let currentNote = "";
let score = 0;
let interval;
let intervalTime = 4000;
let attempts = 10;
let isPaused = false;
let progressInterval;

document.querySelectorAll('.startButton').forEach(button => {
    button.addEventListener('click', () => {
        intervalTime = parseInt(button.dataset.interval);
        startGame();
    });
});
document.getElementById('pauseButton').addEventListener('click', pauseGame);

function startGame() {
    score = 0;
    attempts = 10;
    isPaused = false;
    document.getElementById('score').innerText = `Puntuación: ${score}`;
    document.getElementById('noteDisplay').innerText = "";
    generateFretboard();
    nextNote();
    startProgress();
}

function pauseGame() {
    isPaused = !isPaused;
    document.getElementById('pauseButton').innerText = isPaused ? "Resume" : "Pause";
    if (isPaused) {
        clearInterval(interval);
        clearInterval(progressInterval);
    } else {
        startProgress();
    }
}

function startProgress() {
    const clickSound = document.getElementById('clickSound');
    clearInterval(interval); // Clear any existing interval
    clearInterval(progressInterval);
    const progressBar = document.getElementById('progressBar');
    progressBar.style.width = '0%';
    let width = 0;
    progressInterval = setInterval(() => {
        if (!isPaused) {
            width += 100 / (intervalTime / 100);
            progressBar.style.width = `${width}%`;
            if (width >= 100) {
                width = 0;
                clickSound.play();
                nextNote();
            }
        }
    }, 100);
}

function nextNote() {
    if (attempts === 0) {
        clearInterval(interval);
        clearInterval(progressInterval);
        alert("Juego terminado! Tu puntuación es: " + score);
        isPaused = true;
        document.getElementById('pauseButton').innerText = "Reanudar Juego";
        return;
    }
    currentNote = notes[Math.floor(Math.random() * notes.length)];
    document.getElementById('noteDisplay').innerText = currentNote;
    attempts--;
}

function generateFretboard() {
    const fretboardContainer = document.getElementById('fretboard-container');
    fretboardContainer.innerHTML = "";

    const fretboard = document.createElement('div');
    fretboard.id = 'fretboard';
    fretboardContainer.appendChild(fretboard);

    // Crear cuerdas
    for (let i = 0; i < 6; i++) {
        const string = document.createElement('div');
        string.classList.add('string');
        string.style.top = `${(i * 33 + 16)}px`; // Ajustar la posición vertical de las cuerdas
        fretboard.appendChild(string);
    }

    // Crear trastes y marcadores de notas
    for (let stringIndex = 0; stringIndex < 6; stringIndex++) {
        for (let fretIndex = 0; fretIndex <= 12; fretIndex++) {
            const cell = document.createElement('div');
            cell.classList.add('fret');
            if (fretIndex === 0) {
                const openStringNote = document.createElement('div');
                openStringNote.classList.add('open-string-note');
                openStringNote.innerText = strings[stringIndex][fretIndex];
                cell.appendChild(openStringNote);
            } else {
                const marker = document.createElement('div');
                marker.classList.add('fret-marker');
                marker.dataset.note = getNoteForFret(stringIndex, fretIndex);
                marker.addEventListener('click', checkNote);
                cell.appendChild(marker);
            }
            fretboard.appendChild(cell);
        }
    }

    // Crear contenedor para números de trastes
    const fretNumbersContainer = document.createElement('div');
    fretNumbersContainer.classList.add('fret-numbers');
    fretboardContainer.appendChild(fretNumbersContainer);

    // Crear números de trastes
    for (let i = 0; i <= 12; i++) {
        const fretNumber = document.createElement('div');
        fretNumber.classList.add('fret-number');
        fretNumber.innerText = i;
        fretNumbersContainer.appendChild(fretNumber);
    }
}

function getNoteForFret(stringIndex, fretIndex) {
    const openStringNote = strings[stringIndex][0];
    const noteIndex = (notes.indexOf(openStringNote) + fretIndex) % notes.length;
    return notes[noteIndex];
}

function checkNote() {
    if (this.dataset.note === currentNote) {
        this.classList.add('correct');
        this.innerText = this.dataset.note;
        this.removeEventListener('click', checkNote); // Deshabilitar el botón después de presionarlo correctamente
        score++;
        document.getElementById('score').innerText = `Puntuación: ${score}`;
    }
}

// Generar el diapasón al cargar la página
generateFretboard();