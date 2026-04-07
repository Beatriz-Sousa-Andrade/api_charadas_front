const cardInner = document.getElementById('card-inner');
const campoPergunta = document.getElementById('pergunta');
const campoResposta = document.getElementById('resposta');
const btnNova = document.getElementById('btn-nova');
const pontuacaoValor = document.getElementById('pontuacao-valor');
const btnAcertei = document.getElementById('btn-acertei');
const btnErrei = document.getElementById('btn-errei');
const btnCompartilhar = document.getElementById('btn-compartilhar');

let pontuacao = 0;
let charadaAtual = { pergunta: '', resposta: '' };
let respondida = false;

function atualizarPontuacao() {
    pontuacaoValor.textContent = pontuacao;
}

// Giro do card
cardInner.addEventListener('click', () => {
    cardInner.classList.toggle('[transform:rotateY(180deg)]');
});

// Buscar charada da AP
async function buscaCharada() {
    try {
        campoPergunta.textContent = 'Carregando...';
        campoResposta.textContent = '...';
        
        const respostaApi = await fetch('https://api-de-charadas-vert.vercel.app/charadas/aleatoria');
        const dados = await respostaApi.json();
        
        charadaAtual = { pergunta: dados.pergunta, resposta: dados.resposta };
        campoPergunta.textContent = dados.pergunta;
        campoResposta.textContent = dados.resposta;
        respondida = false;
        
        cardInner.classList.remove('[transform:rotateY(180deg)]');
    } catch (erro) {
        campoPergunta.textContent = "Erro ao conectar com o servidor.";
        campoResposta.textContent = "❌";
        console.error(erro);
    }
}

// Eventos de pontuação
btnAcertei.addEventListener('click', (e) => {
    e.stopPropagation();
    if (!respondida) {
        pontuacao += 10;
        respondida = true;
        atualizarPontuacao();
        alert('🎉 Parabéns! +10 pontos!');
    } else {
        alert('Você já respondeu essa charada!');
    }
});

btnErrei.addEventListener('click', (e) => {
    e.stopPropagation();
    if (!respondida) {
        pontuacao = Math.max(0, pontuacao - 5);
        respondida = true;
        atualizarPontuacao();
        alert('😅 Não desanime! -5 pontos.');
    } else {
        alert('Você já respondeu essa charada!');
    }
});

// Compartilhar
btnCompartilhar.addEventListener('click', async (e) => {
    e.stopPropagation();
    if (!charadaAtual.pergunta) {
        alert('Carregue uma charada primeiro!');
        return;
    }
    const texto = `🧠 ${charadaAtual.pergunta}\n\nResposta: ${charadaAtual.resposta}\n\nJogue você também!`;
    try {
        await navigator.clipboard.writeText(texto);
        alert('📋 Charada copiada!');
    } catch {
        alert('Não foi possível copiar.');
    }
});

// Próxima charada
btnNova.addEventListener('click', () => {
    buscaCharada();
});

// Inicial
buscaCharada();