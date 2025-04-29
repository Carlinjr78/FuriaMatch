
# FURIA MATCH

**Descubra quem você é no universo da FURIA!** 🔥🚀

Este projeto foi desenvolvido para o desafio técnico da vaga de Assistente de Engenharia de Software da FURIA Tech. Ele tem como objetivo entender mais profundamente os fãs da FURIA por meio de uma solução interativa baseada em dados simulados de redes sociais e interações.

---

## 🎯 Objetivo

O **FURIA MATCH** busca criar uma experiência divertida e interativa que conecta os fãs da FURIA às personalidades da organização, utilizando preferências e padrões simulados a partir de seus perfis e interações.

---

## 📋 Funcionalidades

- 🔑 Autenticação simulada via `@handle`
- 📊 Questionário adaptativo baseado nas tags dominantes dos perfis
- 🧩 Análise de categorias principais (CS, LoL, Valorant, Futebol, Criadores, Porsche Cup, R6)
- 📸 Resultado personalizado com imagem, descrição e links de redes sociais
- ♿ Botões de acessibilidade (Text-to-Speech integrado)
- 💾 Banco de dados no Supabase com dados reais exportados para CSV
- 📱 Layout 100% responsivo com alto contraste
- 🔗 Compartilhamento direto do resultado via Twitter/X
- 🌍 Protótipo online acessível
- 📈 Painel em Power BI para visualização de dados e insights

---

## 🚀 Tecnologias Utilizadas

- HTML5
- CSS3
- JavaScript puro
- Supabase (banco de dados na nuvem)
- Text-to-Speech (Web Speech API)
- Vercel (deploy e hospedagem)
- Power BI (dashboard e análise de dados)

---

## 🗂️ Estrutura Atualizada do Projeto

```
/docs
├── /dados_personalidades (documentação e estrutura inicial do projeto)
├── furia_match_insights.pbix (painel interativo no Power BI)
├── log_de_execucao.md (registro detalhado das etapas do projeto)
├── partidas_usuarios_rows.csv (dados extraídos do Supabase)

/public
├── /assets (imagens e ícones)
├── /dados (arquivos JSON com dados simulados)
├── /src (scripts JS)
├── index.html
├── quiz.html
├── resultado.html
├── style.css

readme.md
```

---

## 🧠 Banco de Dados

Os dados são armazenados e gerenciados via **Supabase**, um backend com PostgreSQL integrado.  
O dataset utilizado no projeto foi exportado e está disponível em `/docs/partidas_usuarios_rows.csv`, contendo o histórico das interações dos usuários simulados.

---

## 🌐 Protótipo Online

Acesse o projeto hospedado na Vercel:  
🔗 [https://furia-match.vercel.app](https://furia-match.vercel.app/)

> O site é totalmente funcional, responsivo e adaptado para acessibilidade.  
> Para testar, use: `@usuario_01`, `@usuario_02`, etc.

---

## 🌟 Perfis Simulados para Teste

- `@usuario_01`: Segue todos os grupos igualmente (resultado aleatório)
- `@usuario_02`: Foco em LoL
- `@usuario_03`: Foco em R6
- `@usuario_04`: Foco em Valorant
- `@usuario_05`: Foco em Futebol
- `@usuario_06`: Foco em CS
- `@usuario_07`: Foco em Criadores de Conteúdo
- `@usuario_08`: Foco em Porsche Cup

---


## 📊 Painel no Power BI

📈 Painel interativo com os dados do projeto:  
🔗 [Link do Power BI - FURIA Insights](https://app.powerbi.com/links/erroWY3Um6?ctid=de1d385c-d0e2-4519-962c-8dcac851c871&pbi_source=linkShare)
ou execute no seu Power Bi o projeto está em `furia_match_insights.pbix`

O painel permite visualizar padrões de interação, tags dominantes, preferências de público e insights gerados a partir do uso do sistema.


---

## 🛠️ Como Rodar Localmente

1. Clone o repositório:
```bash
git clone https://github.com/Carlinjr78/FuriaMatch
```

2. Acesse a pasta pública do projeto:
```bash
cd furia-match/public
```

3. Abra o `index.html` com o Live Server (VS Code) ou diretamente no navegador.

---

## 📌 Próximos Passos

- Integração com autenticação real (OAuth via redes sociais)
- Recomendação de conteúdos personalizados por perfil
- Expansão do banco com dados reais e mais testes com usuários


---

## 👨‍💻 Desenvolvedor

Desenvolvido por **Carlos Alberto Júnior**  
Estudante de Ciência da Computação e Técnico em Automação Industrial.  
Apaixonado por inovação, games, acessibilidade e experiências digitais interativas.

---

# #GOFURIA🔥
