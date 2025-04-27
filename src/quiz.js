// src/quiz.js

// Pega o usuário salvo no localStorage
const usuarioAtual = JSON.parse(localStorage.getItem('usuario_atual'));
if (!usuarioAtual) {
  window.location.href = 'index.html';
}

// Função para descobrir a categoria dominante
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

// Função para carregar perguntas da categoria
async function carregarPerguntas(categoria) {
  const response = await fetch('../dados/perguntas.json');
  const perguntasPorCategoria = await response.json();
  return perguntasPorCategoria[categoria] || [];
}

// Variáveis
let perguntas = [];
let perguntaAtual = 0;
let respostasTags = [];

// Mostrar pergunta atual
function mostrarPergunta() {
  const quizContainer = document.querySelector('.quiz-content');
  quizContainer.innerHTML = '';

  if (perguntaAtual >= perguntas.length) {
    // Se terminou o quiz, soma as tags dos seguidos + quiz
    finalizarQuiz();
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

// Finalizar quiz e juntar tags
async function finalizarQuiz() {
  try {
    const response = await fetch('../dados/tags_map.json');
    const tagsMap = await response.json();

    let tagsHandles = [];
    (usuarioAtual.seguidos || []).forEach(handle => {
      const tags = tagsMap[handle];
      if (tags) {
        tagsHandles.push(...tags);
      }
    });

    const todasTags = [...tagsHandles, ...respostasTags];
    localStorage.setItem('tags_acumuladas', JSON.stringify(todasTags));

    window.location.href = 'resultado.html';

  } catch (error) {
    console.error('Erro ao finalizar o quiz:', error);
    alert('Erro ao salvar suas respostas. Tente novamente.');
    window.location.href = 'index.html';
  }
}

// Iniciar quiz
async function iniciarQuiz() {
  const categoria = await descobrirCategoriaDominante();
  localStorage.setItem('grupo_pergunta', categoria);
  perguntas = await carregarPerguntas(categoria);
  mostrarPergunta();
}

window.addEventListener('DOMContentLoaded', iniciarQuiz);
