# 🤖 IZA - Ouvidoria Digital DF

> **Solução desenvolvida para o 1º Hackathon Participa DF (2026) - Categoria 2 (Ouvidoria)**

Um canal de atendimento inteligente via **PWA** que humaniza a relação entre o cidadão e o Governo do Distrito Federal, transformando a burocracia em uma conversa simples e acessível.

---

## 🚀 Visão Geral
A **IZA** facilita o acesso ao Controle Social no Distrito Federal. Entendemos que muitos cidadãos desistem de registrar suas demandas devido à complexidade dos formulários tradicionais ou por possuírem alguma limitação física ou técnica. A IZA elimina essas barreiras através de uma interface conversacional intuitiva.

## 🌟 Principais Diferenciais

### ♿ 1. Acessibilidade Extrema
Criado para ser usado por todos, sem exceção. 
* **Ajuste de Fonte:** Controle dinâmico do tamanho do texto para baixa visão.
* **Alto Contraste:** Interface otimizada para daltonismo e legibilidade em ambientes externos.
* **LIBRAS:** Integração com o widget oficial **VLibras** para tradução em tempo real.
* **Etiquetas de Tela:** Preparado com `aria-labels` para navegação por voz/leitores de tela (TalkBack/VoiceOver).

### 🎙️ 2. Multimédia e Multicanal
O cidadão relata os problemas da forma que for mais confortável para ele:
* **Texto:** Chatbot guiado passo a passo.
* **Áudio e Vídeo:** Opção de registro multimídia para eliminar barreiras de escrita (analfabetismo funcional ou limitações motoras).
* **Imagens:** Anexo de fotos diretamente no chat para comprovação visual.

### 📍 3. Localização Inteligente
Usa o **GPS do dispositivo** para localizar demandas urbanas (como buracos, falta de iluminação ou problemas em hospitais) com exatidão, facilitando o trabalho da fiscalização do GDF.

### 🛡️ 4. Segurança, Sigilo e LGPD
* **Anonimato:** Opção de denúncia anônima para garantir a segurança do denunciante em casos sensíveis.
* **Conformidade LGPD:** Termo de aceite e privacidade implementado no primeiro acesso.
* **Download de Protocolo:** Geração automática de comprovante para acompanhamento oficial.

---

## 🛠️ Tecnologias Utilizadas
* [React.js](https://reactjs.org/) + [Vite](https://vitejs.dev/)
* [Tailwind CSS v4](https://tailwindcss.com/)
* [PWA Capabilities](https://web.dev/progressive-web-apps/)
* [VLibras Plugin](https://vlibras.gov.br/)

---

## ⚙️ Como executar o projeto localmente

1. Clone o repositório:
   ```bash
   git clone [https://github.com/SEU_USUARIO/NOME_DO_REPO.git](https://github.com/SEU_USUARIO/NOME_DO_REPO.git)