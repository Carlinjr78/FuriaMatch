// src/resultado.js

async function calcularResultado() {
    const tagsUsuario = JSON.parse(localStorage.getItem('tags_acumuladas'));
  
    if (!tagsUsuario || tagsUsuario.length === 0) {
      alert("Nenhuma resposta encontrada. Redirecionando para o início.");
      window.location.href = 'index.html';
      return;
    }
  
    try {
      // Carregar o tags_map.json
      const response = await fetch('../dados/tags_map.json');
      const tagsMap = await response.json();
  
      // Criar um contador de correspondência para cada personalidade
      const contagem = {};
  
      // Para cada tag respondida pelo usuário
      tagsUsuario.forEach(tagUsuario => {
        const personalidades = tagsMap[tagUsuario];
        if (personalidades) {
          personalidades.forEach(personalidade => {
            contagem[personalidade] = (contagem[personalidade] || 0) + 1;
          });
        }
      });
  
      // Encontrar a personalidade com mais pontos
      const vencedor = Object.entries(contagem).sort((a, b) => b[1] - a[1])[0];
  
      if (!vencedor) {
        alert("Não conseguimos identificar seu match. Redirecionando para o início.");
        window.location.href = 'index.html';
        return;
      }
  
      const [nomePersonalidade, pontos] = vencedor;
  
      // Salvar o resultado final
      localStorage.setItem('match_final', JSON.stringify({ nome: nomePersonalidade, pontos: pontos }));
  
      // Exibir na tela
      exibirResultado(nomePersonalidade);
  
    } catch (error) {
      console.error('Erro ao calcular o resultado:', error);
      alert('Erro ao calcular resultado. Redirecionando para o início.');
      window.location.href = 'index.html';
    }
  }
  
  function exibirResultado(nome) {
    const resultadoContainer = document.querySelector('.result-content');
  
    resultadoContainer.innerHTML = `
      <h1>Seu Match FURIA:</h1>
      <div class="personality">
        <img src="assets/${nome}.png" alt="${nome}">
        <h2>${nome}</h2>
        <p>Parabéns! Você se parece muito com ${nome} dentro do universo FURIA!</p>
      </div>
      <div class="buttons">
        <a href="index.html" class="btn-start">Jogar Novamente</a>
      </div>
    `;
  }
  
  // Quando a página carregar
  window.addEventListener('DOMContentLoaded', () => {
    calcularResultado();
  });
  