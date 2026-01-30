# 🤖 IZA - Ouvidoria Digital DF

> **Solução desenvolvida para o 1º Hackathon Participa DF (2026) - Categoria 2 (Ouvidoria)**

A **IZA** é uma plataforma de atendimento inteligente (PWA) criada para humanizar e simplificar a relação entre o cidadão e o Governo do Distrito Federal. Transformamos processos complexos em uma conversa fluida, inclusiva e acessível.

---

##  Demonstração em Vídeo (Obrigatório - Item 8.2.2)
Assista à demonstração completa das funcionalidades e decisões técnicas:
 **[[LINK DO VÍDEO](https://youtu.be/enHV5KHJ9eU)]**

---

##  Diferenciais e Requisitos Atendidos (P1)

###  1. Acessibilidade Digital (WCAG 2.1 AA)
* **Controle de Interface:** Ajuste dinâmico de tamanho de fonte e modo de alto contraste.
* **Navegação Semântica:** Uso de HTML5 semântico e `aria-labels` em todos os botões interativos para total compatibilidade com leitores de tela (TalkBack/VoiceOver).
* **Design Inclusivo:** Interface limpa para evitar sobrecarga cognitiva.

###  2. Multicanalidade Total
A IZA permite o registro de manifestações via:
* **Texto:** Fluxo guiado e intuitivo.
* **Voz:** Gravação de áudio integrada.
* **Mídia:** Anexo de fotos e **vídeos** para comprovação visual.
* **Localização:** Captura automática de coordenadas via GPS para precisão no atendimento.

###  3. Transparência e Segurança
* **Anonimato Opcional:** O cidadão pode escolher realizar denúncias de forma anônima.
* **Gestão de Protocolos:** Geração automática de número de protocolo e comprovante em PDF.
* **Status em Tempo Real:** Consulta direta ao banco de dados para acompanhamento da demanda.

---

##  Tecnologias e Arquitetura (P2)
* **Linguagem:** JavaScript (React.js)
* **Build Tool:** Vite (Otimizado para PWA)
* **Estilização:** Tailwind CSS v4
* **Backend as a Service:** Supabase (PostgreSQL + Storage para mídias)
* **Hospedagem:** Vercel

> **Boas Práticas:** O código foi estruturado seguindo princípios de coesão e baixo acoplamento, com separação clara entre lógica de estado (React Hooks) e componentes de interface.

---

##  Como Executar Localmente

Siga os passos para rodar o ambiente de desenvolvimento:

1. Clonar o Repositório
```bash
git clone [https://github.com/JosefWojtyla/ouvidoria-iza-df.git](https://github.com/JosefWojtyla/ouvidoria-iza-df.git)
cd ouvidoria-iza-df
```
2. Acessar a Pasta
```bash
   cd ouvidoria-iza-df
```

3. Instalar Dependências
Certifique-se de ter o Node.js instalado.
```bash
   npm install
```
4. Configurar Variáveis de Ambiente
Crie um arquivo chamado .env na raiz do projeto e adicione essas chaves do Supabase:
```bash
   VITE_SUPABASE_URL= https://fluppxfijamixrmedmzs.supabase.co
   VITE_SUPABASE_ANON_KEY= sb_publishable_eZMNumX1HxuKj5JHIvD6kw_iOYtNd-k
```
5. Iniciar o App
```bash
   npm run dev
```
Clique no link que aparecerá no seu terminal


##  Como acessar e instalar (PWA)

A **IZA** foi desenvolvida como um Progressive Web App, o que significa que você pode instalá-la no seu celular sem precisar da Play Store ou App Store.

###  Link de Acesso
Acesse através do link oficial: [CLIQUE AQUI PARA ACESSAR O PROJETO](https://ouvidoria-iza-df.vercel.app)

###  Passo a passo para Instalação:

#### **No Android (Google Chrome):**
1. Acesse o link acima pelo navegador.
2. Toque nos **três pontinhos** no canto superior direito.
3. Selecione **"Instalar aplicativo"** ou **"Adicionar à tela inicial"**.
4. Confirme a instalação. O ícone da IZA aparecerá junto aos seus outros apps!

#### **No iPhone (Safari):**
1. Acesse o link acima pelo Safari.
2. Toque no botão de **Compartilhar** (ícone do quadrado com uma seta para cima).
3. Role a lista para baixo e toque em **"Adicionar à Tela de Início"**.
4. Toque em **Adicionar** no canto superior direito.
