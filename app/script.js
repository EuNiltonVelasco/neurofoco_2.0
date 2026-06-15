document.addEventListener("DOMContentLoaded", function() {

    // ===== CONFIGURAÇÃO =====
    let tempoSessao = 420; // tempo total em segundos (7 minutos)
    let tempoRestante = tempoSessao;

    const perguntas = [
    { pergunta: "Qual estrutura repete enquanto a condição for verdadeira?", opcoes: ["enquanto", "para", "repita", "se"], correta: 0 },
    { pergunta: "Qual comando é usado para tomada de decisão condicional?", opcoes: ["escolha", "para", "enquanto", "se...entao"], correta: 3 },
    { pergunta: "Qual comando cria um laço com número definido de repetições?", opcoes: ["enquanto", "para", "repita", "faca"], correta: 1 },
    { pergunta: "Qual operador é usado para atribuição de valores em variáveis?", opcoes: ["=", "==", "<-", ":="], correta: 2 },
    { pergunta: "Qual palavra-chave é usada para iniciar a declaração de variáveis?", opcoes: ["var", "inicio", "variavel", "global"], correta: 0 },
    { pergunta: "Qual é a palavra-chave que encerra a estrutura 'se'?", opcoes: ["fim", "finaise", "fimse", "fimalgoritmo"], correta: 2 },
    { pergunta: "Qual comando interrompe a execução de um laço de repetição?", opcoes: ["parar", "interrompa", "quebrar", "fimpara"], correta: 1 },
    { pergunta: "Qual tipo de dado é usado para armazenar textos ou caracteres?", opcoes: ["texto", "caractere", "cadeia", "string"], correta: 1 },
    { pergunta: "Qual é o operador lógico correspondente ao 'E' (conjunção)?", opcoes: ["e", "ou", "nao", "&&"], correta: 0 },
    { pergunta: "Qual estrutura é usada para selecionar múltiplas opções baseadas em uma variável?", opcoes: ["se", "caso", "escolha...caso", "repita"], correta: 2 },
    { pergunta: "Qual laço executa o bloco pelo menos uma vez antes de testar a condição?", opcoes: ["para", "enquanto", "repita...ate", "faca"], correta: 2 },
    { pergunta: "Qual operador lógico inverte o valor de uma expressão booleana?", opcoes: ["nao", "inverter", "falso", "!"], correta: 0 },
    { pergunta: "Como se escreve o operador de 'diferente de' no VisuAlg?", opcoes: ["!=", "<>", "=/=", "not="], correta: 1 },
    { pergunta: "Qual comando exibe dados na tela e pula para a próxima linha?", opcoes: ["escreva", "imprima", "mostre", "escreval"], correta: 3 },
    { pergunta: "Qual palavra-chave finaliza obrigatoriamente todo arquivo do VisuAlg?", opcoes: ["fim", "fimalgoritmo", "fimprograma", "fines"], correta: 1 },
    { pergunta: "Qual tipo de dado é usado para valores numéricos com casas decimais?", opcoes: ["inteiro", "fracao", "real", "float"], correta: 2 },
    { pergunta: "Qual comando é usado para receber dados digitados pelo usuário?", opcoes: ["leia", "receba", "entrada", "escreva"], correta: 0 },
    { pergunta: "Quais são os únicos valores aceitos pelo tipo de dado 'logico'?", opcoes: ["0 e 1", "sim e nao", "positivo e negativo", "verdadeiro e falso"], correta: 3 },
    { pergunta: "Qual palavra-chave marca o início do bloco de comandos executáveis?", opcoes: ["algoritmo", "var", "inicio", "executar"], correta: 2 },
    { pergunta: "Como se declara um vetor (array) de 10 posições inteiras no VisuAlg?", opcoes: ["vetor [1..10] de inteiro", "vetor [0..9] de inteiro", "array [1..10] of inteiro", "matriz [10] de inteiro"], correta: 0 }

];


    let fila = [...perguntas];
    let atual;
    let acertos = 0;
    let erros = 0;
    let historico = [];

    // ===== ELEMENTOS =====
    const perguntaEl = document.getElementById("pergunta");
    const opcoesEl = document.getElementById("opcoes");
    const feedbackEl = document.getElementById("feedback");
    const acertosEl = document.getElementById("acertos");
    const errosEl = document.getElementById("erros");
    const percentualEl = document.getElementById("percentual");
    const nextBtn = document.getElementById("nextBtn");
    const finalizarBtn = document.getElementById("finalizarBtn");
    const mensagemFinalEl = document.getElementById("mensagemFinal");
    const toggleHz = document.getElementById("toggleHz");
    const audioElement = document.getElementById("audio15hz");

    const canvas = document.getElementById("grafico");
    const ctx = canvas.getContext("2d");
    const timerEl = document.getElementById("timer");

    let sessionActive = true;

    // ===== ÁUDIO 15Hz =====
    toggleHz.addEventListener("click", () => {
        if (audioElement.paused) {
            audioElement.play().catch(e => console.error(e));
            toggleHz.classList.add("active");
        } else {
            audioElement.pause();
            audioElement.currentTime = 0;
            toggleHz.classList.remove("active");
        }
    });

    // ===== FUNÇÕES =====
    function mostrarPergunta() {
        if (!sessionActive) return;

        if (fila.length === 0) fila = [...perguntas];

        atual = fila.shift();
        perguntaEl.innerText = atual.pergunta;
        opcoesEl.innerHTML = "";

        atual.opcoes.forEach((op, i) => {
            const btn = document.createElement("button");
            btn.innerText = op;

            btn.onclick = () => {
                if (!sessionActive) return;

                document.querySelectorAll("#opcoes button").forEach(b => b.disabled = true);

                if (i === atual.correta) {
                    btn.style.background = "#22c55e";
                    feedbackEl.style.color = "#22c55e";
                    feedbackEl.innerText = "✔️ Correto!";
                    acertos++;
                    historico.push(1);
                } else {
                    btn.style.background = "#ef4444";
                    feedbackEl.style.color = "#ef4444";
                    feedbackEl.innerText = "❌ Errado!";
                    erros++;
                    fila.push(atual);
                    historico.push(0);
                }

                atualizarStats();
                desenharGrafico();
            };

            opcoesEl.appendChild(btn);
        });

        feedbackEl.innerText = "";
    }

    function atualizarStats() {
        acertosEl.innerText = acertos;
        errosEl.innerText = erros;
        const total = acertos + erros;
        percentualEl.innerText = total > 0 ? Math.round((acertos / total) * 100) + "%" : "0%";
    }

   function desenharGrafico() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // ===== GRID =====
    ctx.strokeStyle = "#334155"; // cinza escuro
    ctx.lineWidth = 1;
    ctx.beginPath();
    for(let i=0; i<=canvas.height; i+=20) {
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
    }
    for(let i=0; i<=canvas.width; i+=20) {
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
    }
    ctx.stroke();

    // ===== LINHA DE ACERTOS =====
    ctx.lineWidth = 2;
    ctx.beginPath();
    historico.forEach((valor, i) => {
        const x = (i / (historico.length - 1 || 1)) * canvas.width;
        const y = canvas.height - (valor ? canvas.height * 0.8 : canvas.height * 0.2);

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = "#22c55e"; // verde
    ctx.stroke();

    // ===== PONTOS =====
    historico.forEach((valor, i) => {
        const x = (i / (historico.length - 1 || 1)) * canvas.width;
        const y = canvas.height - (valor ? canvas.height * 0.8 : canvas.height * 0.2);

        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fillStyle = valor ? "#22c55e" : "#ef4444";
        ctx.fill();

        // Halo
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, Math.PI * 2);
        ctx.strokeStyle = valor ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)";
        ctx.stroke();
    });

    // ===== LEGENDA =====
    ctx.font = "10px Arial";
    ctx.fillStyle = "#22c55e";
    ctx.fillText("Acertos", 5, 12);
    ctx.fillStyle = "#ef4444";
    ctx.fillText("Erros", 60, 12);

    // ===== PERCENTUAL DE ACERTOS =====
    const total = acertos + erros || 1;
    const perc = Math.round((acertos / total) * 100);
    ctx.font = "12px Arial";
    ctx.fillStyle = "#38bdf8"; // azul claro
    ctx.fillText(`Acertividade: ${perc}%`, 5, canvas.height - 5);
}

    function finalizarSessao() {
        sessionActive = false;
        // Desabilita botões
        document.querySelectorAll("#opcoes button, #nextBtn").forEach(b => b.disabled = true);

        // Mensagem final
        mensagemFinalEl.style.display = "block";
        mensagemFinalEl.innerText = "Parabéns, volte novamente depois, lembre-se de aprender um pouco e sempre.";

        // Para áudio
        audioElement.pause();
        toggleHz.classList.remove("active");
    }

    // ===== TIMER =====
    function atualizarTimer() {
        if (!sessionActive) return;

        if (tempoRestante <= 0) {
            finalizarSessao();
            timerEl.innerText = "00:00";
            return;
        }

        const minutos = Math.floor(tempoRestante / 60);
        const segundos = tempoRestante % 60;
        timerEl.innerText = `${minutos.toString().padStart(2,'0')}:${segundos.toString().padStart(2,'0')}`;

        tempoRestante--;
    }

    setInterval(atualizarTimer, 1000);

    // ===== INICIALIZAÇÃO =====
    mostrarPergunta();
    desenharGrafico();
    atualizarStats();

   nextBtn.addEventListener("click", mostrarPergunta);

finalizarBtn.addEventListener("click", () => {
    window.location.href = "final.html";
});

});