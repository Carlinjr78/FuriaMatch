console.log("script.js carregado");

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
      const response = await fetch('../dados/usuarios_simulados.json');
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
