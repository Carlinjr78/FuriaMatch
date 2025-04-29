console.log("script.js carregado");

// Código de carregamento do botão de início
document.addEventListener('DOMContentLoaded', () => {
  const startButton = document.getElementById('start-button');
  if (!startButton) {
    console.error("Botão de início não encontrado!");
    return;
  }

  startButton.addEventListener('click', async () => {
    const userInput = document.getElementById('handle-input').value.trim().toLowerCase();

    if (!userInput) {
      alert('Digite seu @ antes de começar!');
      return;
    }

    try {
      const response = await fetch('dados/usuarios_simulados.json');
      const usuarios = await response.json();

      const usuarioEncontrado = usuarios.find(user => user.handle.toLowerCase() === userInput);

      if (usuarioEncontrado) {
        localStorage.setItem('usuario_atual', JSON.stringify(usuarioEncontrado));
        console.log("Usuário encontrado, redirecionando...");
        window.location.href = 'quiz.html';
      } else {
        alert('Usuário não encontrado! Tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao buscar os dados dos usuários simulados:', error);
      alert('Erro ao buscar dados. Tente novamente mais tarde.');
    }
  });
});

// Funções para Supabase 

let supabase; // Declaramos aqui primeiro (não inicializa ainda!)

document.addEventListener('DOMContentLoaded', () => {
  // Inicializa Supabase só depois que a página e o SDK carregaram
  if (typeof window.supabase !== 'undefined') {
    supabase = window.supabase.createClient(
      'https://zeickmqtolibjybngewt.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InplaWNrbXF0b2xpYmp5Ym5nZXd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU3ODI5MTQsImV4cCI6MjA2MTM1ODkxNH0.FKNMy5YuynWnZGxNpi5uj4ooYx-BpBHRZGd6Tmk_ndw'
    );
    console.log('🔵 Supabase inicializado.');
  } else {
    console.error('❌ Supabase SDK não carregado!');
  }
});

// Função para contar quantos perfis o usuário segue em cada grupo
async function gerarContagemGrupos(seguidos, personalidades) {
  const contagens = {
    cs: 0,
    lol: 0,
    valorant: 0,
    r6: 0,
    futebol: 0,
    porsche_cup: 0,
    criadores_de_conteudo: 0
  };

  seguidos.forEach(handle => {
    const grupos = personalidades[handle];
    if (grupos) {
      grupos.forEach(grupo => {
        if (contagens.hasOwnProperty(grupo)) {
          contagens[grupo]++;
        }
      });
    } else {
      console.warn(`⚠️ Perfil '${handle}' não encontrado em personalidades.json`);
    }
  });

  return contagens;
}

// Função para enviar o resumo para o Supabase
async function enviarResumoJogo(handle, contagens) {
  if (!supabase) {
    console.error('❌ Supabase não inicializado. Não é possível enviar.');
    return;
  }

  const { data, error } = await supabase
    .from('partidas_usuarios')
    .insert([
      {
        handle: handle,
        cs_count: contagens.cs || 0,
        lol_count: contagens.lol || 0,
        valorant_count: contagens.valorant || 0,
        r6_count: contagens.r6 || 0,
        futebol_count: contagens.futebol || 0,
        porsche_cup_count: contagens.porsche_cup || 0,
        criadores_count: contagens.criadores_de_conteudo || 0
      }
    ]);

  if (error) {
    console.error('❌ Erro ao enviar para Supabase:', error);
  } else {
    console.log('🟢 Registro salvo no Supabase:', data);
  }
}
