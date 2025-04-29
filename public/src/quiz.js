// src/quiz.js

// Pega o usuário salvo no localStorage
const usuarioAtual = JSON.parse(localStorage.getItem('usuario_atual'));
if (!usuarioAtual) {
  window.location.href = 'index.html';
}

// Função para descobrir a categoria dominante
async function descobrirCategoriaDominante() {
  const response = await fetch('dados/personalidades.json');
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
  const response = await fetch('dados/perguntas.json');
  const perguntasPorCategoria = await response.json();
  return perguntasPorCategoria[categoria] || [];
}

// Variáveis
let perguntas = [];
let perguntaAtual = 0;
let respostasTags = [];

// Mostrar pergunta atual
function mostrarPergunta() {
  if (perguntaAtual >= perguntas.length) {
    finalizarQuiz();
    return;
  }

  const pergunta = perguntas[perguntaAtual];

  // Atualiza o texto da pergunta no h2 existente
  const textoPergunta = document.getElementById('texto-pergunta');
  textoPergunta.innerText = pergunta.pergunta;

  // Mostra os botões de ouvir e parar
  const botaoOuvir = document.getElementById('btn-ouvir-pergunta');
  const botaoParar = document.getElementById('btn-parar-leitura');
  botaoOuvir.style.display = 'inline-block';
  botaoParar.style.display = 'none'; // Começa escondido até começar a falar

  // Atualiza as opções de resposta
  const quizContainer = document.querySelector('.quiz-content');

  // Remove opções antigas, se existirem
  const opcoesAntigas = document.querySelector('.options');
  if (opcoesAntigas) {
    opcoesAntigas.remove();
  }

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
    localStorage.setItem('tags_acumuladas', JSON.stringify(respostasTags));
    window.location.href = 'resultado.html';
  } catch (error) {
    console.error('Erro ao finalizar o quiz:', error);
    alert('Erro ao salvar suas respostas. Tente novamente.');
    document.body.innerHTML = '<div style="display:flex;justify-content:center;align-items:center;height:100vh;font-size:30px;">Calculando seu resultado...</div>';
    await new Promise(resolve => setTimeout(resolve, 6000));
  window.location.href = 'resultado.html';

  }
}

// Iniciar quiz
async function iniciarQuiz() {
  // Mostra a tela de analisando perfil...
  await new Promise(resolve => setTimeout(resolve, 2000)); // Aguarda 1.5 segundos

  const categoria = await descobrirCategoriaDominante();
  localStorage.setItem('grupo_pergunta', categoria);
  perguntas = await carregarPerguntas(categoria);
  mostrarPergunta();
}

window.addEventListener('DOMContentLoaded', iniciarQuiz);

// Função para falar pergunta e opções
function falarPergunta() {
  if ('speechSynthesis' in window) {
    speechSynthesis.cancel();

    const tituloPergunta = document.getElementById('texto-pergunta').innerText;
    const opcoes = document.querySelectorAll('.options button');

    let textoCompleto = tituloPergunta;

    if (opcoes.length > 0) {
      textoCompleto += ". Alternativas: ";
      opcoes.forEach((opcao, index) => {
        textoCompleto += opcao.innerText;
        if (index < opcoes.length - 1) {
          textoCompleto += ", ";
        } else {
          textoCompleto += ".";
        }
      });
    }

    const utterance = new SpeechSynthesisUtterance(textoCompleto);
    utterance.lang = 'pt-BR';
    utterance.rate = 1;

    const botaoOuvir = document.getElementById('btn-ouvir-pergunta');
    const botaoParar = document.getElementById('btn-parar-leitura');

    botaoOuvir.classList.add('piscando'); 
    botaoParar.style.display = 'inline-block'; 

    // Quando terminar de falar, para o piscar e some o botão de parar
    utterance.onend = () => {
      botaoOuvir.classList.remove('piscando');
      botaoParar.style.display = 'none';
    };

    speechSynthesis.speak(utterance);
  } else {
    alert('Seu navegador não suporta leitura de texto.');
  }
}

// Função para parar leitura
function pararLeitura() {
  if ('speechSynthesis' in window) {
    speechSynthesis.cancel();
    const botaoOuvir = document.getElementById('btn-ouvir-pergunta');
    const botaoParar = document.getElementById('btn-parar-leitura');
    botaoOuvir.classList.remove('piscando'); // para de piscar
    botaoParar.style.display = 'none'; // esconde botão de parar
  }
}