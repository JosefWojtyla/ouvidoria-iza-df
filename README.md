# 🤖 IZA - Ouvidoria Digital DF

> **Solução desenvolvida para o 1º Hackathon Participa DF (2026) - Categoria 2 (Ouvidoria)**

A **IZA** é um canal de atendimento inteligente via **PWA** que humaniza a relação entre o cidadão e o Governo do Distrito Federal. Ela transforma formulários complexos em uma conversa simples, acessível e direta.

---

## 🚀 Visão Geral
Muitos cidadãos desistem de registrar suas demandas pela complexidade dos sistemas atuais. A IZA elimina essas barreiras com uma interface conversacional focada em quem tem pressa ou possui dificuldades técnicas, motoras ou de visão.

## 🌟 Principais Diferenciais

### ♿ 1. Acessibilidade Dinâmica
* **Ajuste de Fonte:** Controle total do tamanho do texto para usuários com baixa visão.
* **Alto Contraste:** Interface otimizada para legibilidade máxima em qualquer ambiente.
* **Design Limpo:** Navegação intuitiva que evita a sobrecarga cognitiva e facilita o uso por idosos.

### 🎙️ 2. Registro Multimídia
O cidadão relata o problema como preferir, eliminando barreiras de escrita ou analfabetismo funcional:
* **Áudio:** Registro por voz para maior rapidez e inclusão.
* **Fotos e Vídeos:** Anexo de imagens e/ou vídeos diretamente no chat para comprovação visual imediata.
* **Texto:** Fluxo guiado para quem prefere a digitação tradicional.

### 📍 3. Geolocalização Inteligente
Integração com o **GPS do dispositivo** para marcar o local exato da ocorrência (buracos, falta de iluminação, entulho, etc.), economizando tempo da fiscalização e garantindo precisão ao GDF.

### 🛡️ 4. Transparência e LGPD
* **Opção de Anonimato:** Segurança para denúncias sensíveis ou medo de retaliação.
* **Protocolo e PDF:** Geração de número oficial e comprovante para download imediato.
* **Consulta em Tempo Real:** Acompanhamento do status de análise integrado ao banco de dados.

---

## 🛠️ Tecnologias Utilizadas
* **Frontend:** [React.js](https://reactjs.org/) + [Vite](https://vitejs.dev/)
* **Estilização:** [Tailwind CSS v4](https://tailwindcss.com/)
* **Backend/Banco de Dados:** [Supabase](https://supabase.com/) (PostgreSQL)
* **Hospedagem:** [Vercel](https://vercel.com/)

---

## ⚙️ Guia para os Avaliadores

Para testar a solução completa e verificar a integração com os serviços:

1. **Acesso:** Utilize a URL pública gerada pela Vercel.
2. **Registro de Demanda:** - Inicie um relato e aceite os termos da LGPD.
   - Utilize a função **GPS** para capturar a localização.
   - Pode nviar uma foto,gravar um áudio e/ou texto.
3. **Persistência de Dados:** - Após finalizar, anote o número do protocolo.
   - Vá em **"Consultar Protocolo"** e verifique se os dados salvos batem com o seu relato.
4. **Simulação de Gestão (Status):** - Como o sistema está conectado ao Supabase, a mudança de status reflete instantaneamente para o cidadão. 
   - *Nota:* Para fins de avaliação, o status padrão inicial é "Em análise".

---

## 💻 Como executar localmente

1. Clone o repositório:
   ```bash
   git clone [https://github.com/JosefWojtyla/ouvidoria-iza-df.git](https://github.com/JosefWojtyla/ouvidoria-iza-df.git)

2. Acessar a Pasta
   ```bash
   cd ouvidoria-iza-df

3. Instalar Dependências
Certifique-se de ter o Node.js instalado.
   ```bash
   npm install

4. Configurar Variáveis de Ambiente
Crie um arquivo chamado .env na raiz do projeto e adicione essas chaves do Supabase:
   ```bash
   VITE_SUPABASE_URL= https://fluppxfijamixrmedmzs.supabase.co
   VITE_SUPABASE_ANON_KEY= sb_publishable_eZMNumX1HxuKj5JHIvD6kw_iOYtNd-k

5. Iniciar o App
   ```bash
   npm run dev

Clique no link que aparecerá no seu terminal http://localhost:


## 📱 Como acessar e instalar (PWA)

A **IZA** foi desenvolvida como um Progressive Web App, o que significa que você pode instalá-la no seu celular sem precisar da Play Store ou App Store.

### 🌐 Link de Acesso
Acesse através do link oficial: [CLIQUE AQUI PARA ACESSAR O PROJETO](https://ouvidoria-iza-df.vercel.app)

### 📥 Passo a passo para Instalação:

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