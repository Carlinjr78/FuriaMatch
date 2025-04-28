// src/resultado.js

async function calcularResultado() {
  const respostasQuiz = JSON.parse(localStorage.getItem('tags_acumuladas')) || [];
  const grupoPergunta = localStorage.getItem('grupo_pergunta');

  if (!respostasQuiz.length || !grupoPergunta) {
    alert("Informações insuficientes. Redirecionando para o início.");
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

    // Para cada TAG que o usuário acumulou
    respostasQuiz.forEach(tag => {
      for (const [personalidade, tags] of Object.entries(tagsMap)) {
        if (tags.includes(tag)) {
          contagem[personalidade] = (contagem[personalidade] || 0) + 1;
        }
      }
    });

    // Agora filtramos apenas personalidades que pertencem ao grupo certo
    const contagemFiltrado = Object.entries(contagem).filter(([nomePersonalidade]) => {
      const grupos = personalidadesData[nomePersonalidade];
      return grupos && grupos.includes(grupoPergunta);
    });

    let vencedor;

    if (contagemFiltrado.length > 0) {
      // Ordena quem tem mais pontos
      vencedor = contagemFiltrado.sort((a, b) => b[1] - a[1])[0];
    } else {
      // Se ninguém, sorteia um do grupo
      console.warn('Nenhum vencedor filtrado. Sorteando...');
      const candidatos = Object.entries(personalidadesData)
        .filter(([_, grupos]) => grupos.includes(grupoPergunta))
        .map(([nome]) => nome);

      if (candidatos.length > 0) {
        const aleatorio = candidatos[Math.floor(Math.random() * candidatos.length)];
        vencedor = [aleatorio, 1];
      } else {
        alert("Não conseguimos identificar seu match. Redirecionando para o início.");
        window.location.href = 'index.html';
        return;
      }
    }

    const [nomeFinal, pontos] = vencedor;

    localStorage.setItem('match_final', JSON.stringify({ nome: nomeFinal, pontos }));
    exibirResultado(nomeFinal, descricoes[nomeFinal], redesSociais[nomeFinal]);

  } catch (error) {
    console.error('Erro ao calcular resultado:', error);
    alert('Erro ao calcular resultado. Redirecionando para o início.');
    window.location.href = 'index.html';
  }
}

function exibirResultado(nome, descricao, redes) {
  const img = document.getElementById('profile-pic');
  img.src = `../assets/${nome}.png`;
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
        a.innerHTML = `<img src="../assets/${icones[rede]}" alt="${rede}">`;
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

// Quando a página carregar
window.addEventListener('DOMContentLoaded', calcularResultado);