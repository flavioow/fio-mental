<div align="center">
    <h1>🧠 Mental FIO — Cuidar de quem cuida.</h1>

![version](https://img.shields.io/badge/versão-v1.0.0-blue)

</div>

**Mental FIO** é um espaço pensado para promover **bem-estar e cuidado emocional de forma acessível**.
Através da plataforma, colaboradores podem conversar com um **psicólogo virtual** e receber **relatórios personalizados**,
empresas podem oferecer **benefícios de saúde mental aos seus times**, e psicólogos têm a chance de **impactar mais vidas** com seu trabalho. [Veja o nosso site!](https://fio-mental.vercel.app/)

> Nosso objetivo é facilitar o acesso à escuta, ao apoio e ao autoconhecimento, tudo em um só lugar.

---

## 🌱 Sobre o projeto

O **Mental FIO** nasceu com a proposta de aproximar tecnologia e empatia.
A ideia é criar um ambiente digital onde **funcionários, empresas e psicólogos** interajam de forma simples, segura e acolhedora.

O projeto atual é composto por três perfis principais:

### 👤 Funcionário

- Acessa um chat com IA para conversar e refletir sobre seu bem-estar;
- Recebe relatórios automáticos com insights sobre as conversas;
- Visualiza o histórico pessoal de relatórios.

### 🏢 Empresa

- Cadastra e gerencia funcionários;
- Gerencia psicólogos;
- Visualiza estatísticas gerais de uso sem acesso a dados individuais.

### 💬 Psicólogo

- Se cadastra com especialidade e contato;
- Recebe solicitações de sessão.

---

## 🚀 Instalação e execução

O projeto pode ser executado de duas formas principais, escolha conforme sua necessidade:

### Cenário A — Desenvolvimento / Teste isolado

Use quando quiser rodar exatamente o código do repositório em outra máquina, sem depender das configurações locais.

1. Clone:

```bash
git clone https://github.com/flavioow/fio-mental
cd fio-mental
```

2. (Opcional) Instalar deps se for rodar localmente sem Docker

```bash
npm install
npm run dev
```

3. Rodar via Docker (recomendado p/ isolar o ambiente)

```bash
docker compose up -d
```

O `docker compose up` builda a imagem (se necessário) e já sobe o container com as configurações do `docker-compose.yml`.

Acesse: `http://localhost:3000`

**Quando usar:** desenvolvimento, teste do código local, review de PRs, etc.

---

### Cenário B — Usar a imagem pública (Docker Hub)

Use quando quiser rodar rapidamente a versão empacotada (sem baixar o código fonte).

1. puxar a imagem pública (já buildada)

```bash
docker pull flavioow/fio-mental:latest
```

2. executar em background (modo detached)

```bash
docker run -d --name fio-mental -p 3000:3000 flavioow/fio-mental:latest
```

Acesse: `http://localhost:3000`

**Quando usar:** deploy rápido, testar release, compartilhar com alguém que não precisa do código fonte.

---

### Comandos úteis

```bash
# ver containers em execução
docker compose ps
# logs (attach)
docker compose logs -f
# parar e remover (quando subido com compose)
docker compose down
# parar um container rodando via docker run
docker stop fio-mental && docker rm fio-mental
```

## 📖 Documentação

A documentação técnica e de arquitetura do Mental FIO será publicada em breve,
incluindo informações sobre:

- Estrutura de pastas e rotas;
- Integração com o modelo de IA;
- Fluxos de autenticação e perfis de usuário;
- Padrões de design e UI/UX adotados.

---

## 🙏 Créditos

Feito com carinho por [@flavioow](https://flavioow.vercel.app/), [Mateus](https://github.com/Mateus-Teixeira-WOW), [Kevin](https://kevin-simoes.github.io/kevin.folio/), Pivatti e Eduardo 💻

Projeto em desenvolvimento ativo. Contribuições e ideias são sempre bem-vindas!
