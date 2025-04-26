// src/quiz.js

// Pega o usuário que foi salvo no localStorage
const usuarioAtual = JSON.parse(localStorage.getItem('usuario_atual'));
if (!usuarioAtual) {
  window.location.href = 'index.html';
}

// Função para descobrir a categoria dominante (ou sortear no empate)
async function descobrirCategoriaDominante() {
  const response = await fetch('../dados/personalidades.json');
  const personalidades = await response.json();
  const contagemCategorias = {};

  const handlesSeguidos = usuarioAtual.seguidos || [];

  if (handlesSeguidos.length === 0) {
    console.error('Usuário atual não possui "seguidos" listados.');
    window.location.href = 'index.html';
    return;
  }

  handlesSeguidos.forEach(nome => {
    const categorias = personalidades[nome];
    if (categorias) {
      categorias.forEach(cat => {
        contagemCategorias[cat] = (contagemCategorias[cat] || 0) + 1;
      });
    } else {
      console.warn(`Personalidade '${nome}' não encontrada em personalidades.json`);
    }
  });

  let maiorContagem = 0;
  let categoriasDominantes = [];

  for (const [categoria, quantidade] of Object.entries(contagemCategorias)) {
    if (quantidade > maiorContagem) {
      maiorContagem = quantidade;
      categoriasDominantes = [categoria];
    } else if (quantidade === maiorContagem) {
      categoriasDominantes.push(categoria);
    }
  }

  if (categoriasDominantes.length === 1) {
    return categoriasDominantes[0];
  } else {
    const aleatoria = categoriasDominantes[Math.floor(Math.random() * categoriasDominantes.length)];
    return aleatoria;
  }
}

// Função para carregar perguntas da categoria correta
async function carregarPerguntas(categoria) {
  const response = await fetch('../dados/perguntas.json');
  const perguntasPorCategoria = await response.json();
  return perguntasPorCategoria[categoria] || [];
}

// Variáveis de controle
let perguntas = [];
let perguntaAtual = 0;
let respostasTags = [];

// Função para mostrar a pergunta atual
function mostrarPergunta() {
  const quizContainer = document.querySelector('.quiz-content');
  quizContainer.innerHTML = '';

  if (perguntaAtual >= perguntas.length) {
    // Se terminou o quiz, salva as tags acumuladas e vai para o resultado
    localStorage.setItem('tags_acumuladas', JSON.stringify(respostasTags));
    window.location.href = 'resultado.html';
    return;
  }

  const pergunta = perguntas[perguntaAtual];

  const titulo = document.createElement('h2');
  titulo.textContent = pergunta.pergunta;
  quizContainer.appendChild(titulo);

  const opcoesDiv = document.createElement('div');
  opcoesDiv.classList.add('options');

  pergunta.opcoes.forEach(opcao => {
    const botao = document.createElement('button');
    botao.textContent = opcao.texto;
    botao.addEventListener('click', () => {
      respostasTags.push(...opcao.tags);
      perguntaAtual++;
      mostrarPergunta();
    });
    opcoesDiv.appendChild(botao);
  });

  quizContainer.appendChild(opcoesDiv);
}

// Função principal para iniciar o quiz
async function iniciarQuiz() {
  const categoria = await descobrirCategoriaDominante();
  perguntas = await carregarPerguntas(categoria);
  mostrarPergunta();
}

// Iniciar quando carregar a página
window.addEventListener('DOMContentLoaded', iniciarQuiz);
