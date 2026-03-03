const types = ["paper", "plastic", "metal", "mixed"];
let score = 0;
let errors = 0;
let timeLeft = 60;
let timerId = null;
let currentType = null;

window.addEventListener('DOMContentLoaded', () => {
    const trash = document.getElementById('trash');
    const scoreEl = document.getElementById('score');
    const errorsEl = document.getElementById('errors');
    const timeEl = document.getElementById('time');
    const messageEl = document.getElementById('message');
    const bins = Array.from(document.querySelectorAll('.bin'));

    function updateInfo() {
        scoreEl.textContent = score;
        errorsEl.textContent = errors;
        timeEl.textContent = timeLeft;
    }

    function pickRandomType() {
        return types[Math.floor(Math.random() * types.length)];
    }

    function colorForType(type) {
        switch (type) {
            case 'paper': return 'lightblue';
            case 'plastic': return 'lightyellow';
            case 'metal': return 'lightgray';
            case 'mixed': return 'lightgreen';
        }
    }

    function newTrash() {
        if (timeLeft <= 0) return;
        currentType = pickRandomType();
        trash.setAttribute('data-type', currentType);
        trash.style.backgroundColor = colorForType(currentType);
    }

    function showFeedback(bin, correct) {
        bin.classList.add(correct ? 'correct' : 'wrong');
        setTimeout(() => {
            bin.classList.remove(correct ? 'correct' : 'wrong');
        }, 500);
    }

    function endGame() {
        clearInterval(timerId);
        trash.style.display = 'none';
        messageEl.textContent = `Játék vége! Pontszám: ${score}, Hibák: ${errors}`;
    }

    trash.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', currentType);
    });

    bins.forEach(bin => {
        bin.addEventListener('dragover', (e) => {
            e.preventDefault();
        });
        bin.addEventListener('drop', (e) => {
            e.preventDefault();
            if (timeLeft <= 0) return;
            const binType = bin.getAttribute('data-type');
            const droppedType = e.dataTransfer.getData('text/plain');
            if (droppedType === binType) {
                score++;
                const countEl = bin.querySelector('.count');
                countEl.textContent = parseInt(countEl.textContent) + 1;
                showFeedback(bin, true);
            } else {
                errors++;
                showFeedback(bin, false);
            }
            updateInfo();
            newTrash();
        });
    });

    function tick() {
        timeLeft--;
        updateInfo();
        if (timeLeft <= 0) {
            endGame();
        }
    }

    function startGame() {
        score = 0;
        errors = 0;
        timeLeft = 60;
        updateInfo();
        newTrash();
        timerId = setInterval(tick, 1000);
    }

    startGame();
});