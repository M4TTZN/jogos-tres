const totalCasas = 100;
let playerPos = 0;
let stars = 0;
let lastRoll = 0;

// Gerar obstáculos e bônus aleatórios
const boardData = Array.from({ length: totalCasas }, (_, i) => {
    if (i === 0) return { type: 'start', text: 'Início' };
    if (i === 99) return { type: 'end', text: 'Fim' };
    const rand = Math.random();
    if (rand < 0.15) return { type: 'obstacle', text: '🚨 Obstáculo!', penalty: 3 };
    if (rand > 0.85) return { type: 'bonus', text: '⭐ Bônus!', reward: 2 };
    return { type: 'normal', text: i };
});

const questoes = [
    "Alguém te empurrou na fila. Você empurra de volta ou avisa o professor?",
    "Você quer o brinquedo do colega. Você toma da mão dele ou pede para dividir?",
    "O barulho está muito alto. Você grita ou usa seus protetores/pede licença?",
    "Você terminou a tarefa antes de todos. Você faz bagunça ou lê um livro?",
    "Um amigo está chorando. Você ri ou pergunta se ele quer ajuda?"
];

function createBoard() {
    const board = document.getElementById('board');
    boardData.forEach((data, i) => {
        const tile = document.createElement('div');
        tile.className = `tile ${data.type}`;
        tile.innerHTML = `<span>${data.text}</span>`;
        tile.id = `tile-${i}`;
        board.appendChild(tile);
    });
    moveToken(0);
}

function rollDice() {
    const btn = document.getElementById('roll-btn');
    btn.disabled = true;
    
    let rolls = 0;
    const interval = setInterval(() => {
        lastRoll = Math.floor(Math.random() * 6) + 1;
        document.getElementById('dice').innerText = lastRoll;
        rolls++;
        if (rolls > 12) {
            clearInterval(interval);
            advancePlayer(lastRoll);
            btn.disabled = false;
        }
    }, 60);
}

function advancePlayer(steps) {
    playerPos += steps;
    if (playerPos >= totalCasas - 1) playerPos = totalCasas - 1;
    
    moveToken(playerPos);

    setTimeout(() => {
        const house = boardData[playerPos];
        if (house.type === 'obstacle' || Math.random() > 0.6) {
            triggerChallenge();
        }
    }, 600);
}

function moveToken(index) {
    const tile = document.getElementById(`tile-${index}`);
    const token = document.getElementById('player-token');
    
    // Posicionamento suave
    token.style.left = `${tile.offsetLeft + 15}px`;
    token.style.top = `${tile.offsetTop + 15}px`;
    
    // Auto-scroll para seguir o boneco
    tile.scrollIntoView({ behavior: 'smooth', block: 'center' });
    document.getElementById('current-pos').innerText = index;
}

function triggerChallenge() {
    const q = questoes[Math.floor(Math.random() * questoes.length)];
    document.getElementById('modal-text').innerText = q;
    document.getElementById('modal').classList.remove('hidden');
}

function handleAnswer(isCorrect) {
    document.getElementById('modal').classList.add('hidden');
    if (isCorrect) {
        stars += 10;
        document.getElementById('star-count').innerText = stars;
        alert("Boa escolha! +10 Estrelas");
    } else {
        alert("Ops! Resposta inadequada. Volte 3 casas.");
        playerPos = Math.max(0, playerPos - 3);
        moveToken(playerPos);
    }
}

window.onload = createBoard;
