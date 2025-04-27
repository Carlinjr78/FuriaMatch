// src/resultado.js

async function calcularResultado() {
  const respostasQuiz = JSON.parse(localStorage.getItem('tags_acumuladas')) || [];
  const grupoPergunta = localStorage.getItem('grupo_pergunta');
  const usuarioAtual = JSON.parse(localStorage.getItem('usuario_atual')) || {};
  const seguidos = usuarioAtual.seguidos || [];

  if (respostasQuiz.length === 0 && seguidos.length === 0) {
    alert("Nenhuma resposta encontrada. Redirecionando para o início.");
    window.location.href = 'index.html';
    return;
  }

  try {
    const [tagsMapRes, descricoesRes, redesRes, personalidadesRes] = await Promise.all([
      fetch('../dados/tags_map.json'),
      fetch('../dados/descricoes.json'),
      fetch('../dados/redes_sociais.json'),
      fetch('../dados/personalidades.json')
    ]);

    const tagsMap = await tagsMapRes.json();
    const descricoes = await descricoesRes.json();
    const redesSociais = await redesRes.json();
    const personalidadesData = await personalidadesRes.json();

    const contagem = {};

    // Soma tags dos seguidos (se houver)
    seguidos.forEach(handle => {
      const categorias = personalidadesData[handle];
      if (categorias) {
        categorias.forEach(cat => {
          contagem[handle] = (contagem[handle] || 0) + 1;
        });
      }
    });

    // Soma tags respondidas no quiz
    respostasQuiz.forEach(tag => {
      const personalidades = tagsMap[tag];
      if (personalidades) {
        personalidades.forEach(p => {
          contagem[p] = (contagem[p] || 0) + 1;
        });
      }
    });

    // Filtro por grupo da pergunta
    const contagemFiltrado = Object.entries(contagem).filter(([nome]) => {
      const grupos = personalidadesData[nome];
      return grupos && grupos.includes(grupoPergunta);
    });

    let vencedor = contagemFiltrado.sort((a, b) => b[1] - a[1])[0];

    if (!vencedor) {
      console.warn('Nenhum vencedor filtrado, sorteando...');
      const possiveis = Object.entries(personalidadesData)
        .filter(([_, grupos]) => grupos.includes(grupoPergunta))
        .map(([nome]) => nome);

      if (possiveis.length > 0) {
        const aleatorio = possiveis[Math.floor(Math.random() * possiveis.length)];
        vencedor = [aleatorio, 1];
      } else {
        alert("Não conseguimos identificar seu match. Redirecionando para o início.");
        window.location.href = 'index.html';
        return;
      }
    }

    const [nomePersonalidade, pontos] = vencedor;

    localStorage.setItem('match_final', JSON.stringify({ nome: nomePersonalidade, pontos }));
    exibirResultado(nomePersonalidade, descricoes[nomePersonalidade], redesSociais[nomePersonalidade]);

  } catch (error) {
    console.error('Erro ao calcular resultado:', error);
    alert('Erro ao calcular resultado. Redirecionando para o início.');
    window.location.href = 'index.html';
  }
}

function exibirResultado(nome, descricao, redes) {
  const img = document.getElementById('profile-pic');
  img.src = `assets/${nome}.png`;
  img.alt = formatarNome(nome);

  document.getElementById('nome-personalidade').textContent = formatarNome(nome);
  document.getElementById('descricao-personalidade').textContent = descricao || "Descrição indisponível.";

  const socialSection = document.getElementById('social-section');
  const socialLinks = document.getElementById('social-links');
  socialLinks.innerHTML = '';

  const icones = {
    instagram: "instagram.svg",
    twitch: "twitch.svg",
    youtube: "youtube.svg",
    tiktok: "tiktok.svg",
    twitter: "twitter.svg"
  };

  if (redes) {
    document.getElementById('social-title').textContent = `Acompanhe ${formatarNome(nome)} nas redes sociais:`;
    for (const rede in redes) {
      if (icones[rede]) {
        const a = document.createElement('a');
        a.href = redes[rede];
        a.target = '_blank';
        a.innerHTML = `<img src="assets/${icones[rede]}" alt="${rede}">`;
        socialLinks.appendChild(a);
      }
    }
    socialSection.style.display = 'flex';
  } else {
    socialSection.style.display = 'none';
  }

  const compartilharBtn = document.getElementById('compartilhar-btn');
  compartilharBtn.addEventListener('click', () => {
    const texto = encodeURIComponent(`Descobri que sou como ${formatarNome(nome)} no universo FURIA! 🔥🚀 #FuriaMatch`);
    const url = encodeURIComponent(window.location.origin + "/furia-match/");
    const linkX = `https://twitter.com/intent/tweet?text=${texto}&url=${url}`;
    window.open(linkX, '_blank');
  });
}

function formatarNome(nome) {
  if (nome.toLowerCase() === "a_batata") return "A.Batata";
  return nome.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

// Iniciar
window.addEventListener('DOMContentLoaded', calcularResultado);
