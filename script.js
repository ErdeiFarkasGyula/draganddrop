const types = ["paper", "plastic", "metal", "mixed"];
let score = 0;
let errors = 0;
let timeLeft = 60;
let timerId = null;
let currentType = null;

const labels = { paper: 'Papír', plastic: 'Műanyag', metal: 'Fém', mixed: 'Vegyes' };

window.addEventListener('DOMContentLoaded', () => {
    const trash = document.getElementById('trash');
    const scoreEl = document.getElementById('score');
    const errorsEl = document.getElementById('errors');
    const timeEl = document.getElementById('time');
    let messageEl = document.getElementById('message');
    const bins = Array.from(document.querySelectorAll('.bin'));

    if (!messageEl) {
        messageEl = document.createElement('div');
        messageEl.id = 'message';
        messageEl.style.marginTop = '12px';
        messageEl.style.fontWeight = '600';
        document.body.appendChild(messageEl);
    }

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
            case 'paper': return '#cce5ff';
            case 'plastic': return '#fff3b0';
            case 'metal': return '#d0d0d0';
            case 'mixed': return '#c2e0c2';
            default: return '#ffffff';
        }
    }

    bins.forEach(bin => {
        const countEl = bin.querySelector('.count');
        if (countEl) countEl.textContent = '0';
    });

    function newTrash() {
        if (timeLeft <= 0) return;
        currentType = pickRandomType();
        trash.setAttribute('data-type', currentType);
        trash.style.backgroundColor = colorForType(currentType);
        trash.textContent = labels[currentType] || '';
    }

    function showFeedback(bin, correct) {
        bin.classList.add(correct ? 'correct' : 'wrong');
        setTimeout(() => {
            bin.classList.remove(correct ? 'correct' : 'wrong');
        }, 500);
    }

    function endGame() {
        clearInterval(timerId);
        if (trash) trash.style.display = 'none';
        messageEl.textContent = `Játék vége! Pontszám: ${score}, Hibák: ${errors}`;
    }

    trash.addEventListener('dragstart', (e) => {
        if (!currentType) return;
        e.dataTransfer.setData('text/plain', currentType);
        e.dataTransfer.effectAllowed = 'move';
    });

    bins.forEach(bin => {
        bin.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
        });
        
        bin.addEventListener('drop', (e) => {
            e.preventDefault();
            if (timeLeft <= 0) return;
            const binType = bin.getAttribute('data-type');
            const droppedType = e.dataTransfer.getData('text/plain');

            if (droppedType && droppedType === binType) {
                score++;
                const countEl = bin.querySelector('.count');
                if (countEl) countEl.textContent = String(parseInt(countEl.textContent || '0', 10) + 1);
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

        bins.forEach(bin => {
            const countEl = bin.querySelector('.count');
            if (countEl) countEl.textContent = '0';
        });

        if (trash) trash.style.display = '';
        messageEl.textContent = '';

        updateInfo();
        newTrash();

        if (timerId) clearInterval(timerId);
        timerId = setInterval(tick, 1000);
    }

    startGame();
});