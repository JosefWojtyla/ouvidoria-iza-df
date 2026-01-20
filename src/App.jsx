import { supabase } from "./supabaseClient";
import React, { useState, useEffect, useRef } from "react";
import { jsPDF } from "jspdf";

function App() {
  const [fontSize, setFontSize] = useState(16);
  const [altoContraste, setAltoContraste] = useState(false);
  const [etapa, setEtapa] = useState("inicio");
  const [fluxo, setFluxo] = useState(0);
  const [input, setInput] = useState("");
  const [aceitoTermos, setAceitoTermos] = useState(false);
  const [anonimo, setAnonimo] = useState(false);
  const [localizando, setLocalizando] = useState(false);

  // Estados para Áudio Real
  const [gravando, setGravando] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const [dados, setDados] = useState({
    nome: "",
    tipo: "",
    local: "",
    relato: "",
    protocolo: "",
  });
  const [mensagens, setMensagens] = useState([
    {
      id: 1,
      texto:
        "Olá! Eu sou a **IZA**, sua assistente de ouvidoria. \n\nComo você prefere começar? \n\n1. **Digite seu nome** ou aperte **Anônimo**. \n2. Ou **segure o microfone** abaixo e me conte direto o que houve!",
      remetente: "iza",
    },
  ]);

  const scrollRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensagens]);

  // VLibras
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://vlibras.gov.br/app/vlibras-plugin.js";
    script.async = true;
    script.onload = () => {
      if (window.VLibras)
        new window.VLibras.Widget("https://vlibras.gov.br/app");
    };
    document.body.appendChild(script);
  }, []);

  const renderizarTexto = (texto) => {
    const partes = texto.split(/(\*\*.*?\*\*)/g);
    return partes.map((parte, i) => {
      if (parte.startsWith("**") && parte.endsWith("**")) {
        return (
          <strong
            key={i}
            className={
              altoContraste
                ? "text-yellow-400 font-black"
                : "text-blue-900 font-black"
            }
          >
            {parte.slice(2, -2)}
          </strong>
        );
      }
      return parte;
    });
  };

  // --- LÓGICA DE ÁUDIO REAL ---
  const iniciarGravacao = async () => {
    try {
      console.log("Tentando acessar microfone...");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
          console.log("Recebendo dados de áudio...");
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/wav",
        });
        stream.getTracks().forEach((track) => track.stop());

        const audioUrl = URL.createObjectURL(audioBlob);

        // ATENÇÃO AQUI: Guardamos o áudio E marcamos que há um relato
        setDados((prev) => ({ ...prev, relatoAudio: audioBlob }));

        setMensagens((prev) => [
          ...prev,
          {
            id: Date.now(),
            texto: "🎙️ Áudio capturado com sucesso!",
            remetente: "usuario",
            audio: audioUrl,
          },
        ]);
      };

      mediaRecorderRef.current.start();
      setGravando(true);
    } catch (err) {
      console.error("Erro no microfone:", err);
      alert(
        "Não consegui acessar seu microfone. Verifique as permissões do navegador.",
      );
    }
  };

  const pararGravacao = () => {
    if (mediaRecorderRef.current && gravando) {
      mediaRecorderRef.current.stop();
      setGravando(false);
    }
  };

  // --- FUNÇÃO AUXILIAR PARA UPLOAD (STORAGE) ---
  const uploadParaStorage = async (arquivo, pasta) => {
    if (!arquivo) return null;
    try {
      console.log(`Iniciando upload para a pasta ${pasta}...`);
      const extensao = pasta === "audios" ? "wav" : "jpg";
      const nomeArquivo = `${Date.now()}-${Math.random().toString(36).substring(7)}.${extensao}`;
      const caminho = `${pasta}/${nomeArquivo}`;

      const { data, error } = await supabase.storage
        .from("arquivos_iza")
        .upload(caminho, arquivo, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        console.error("ERRO NO UPLOAD DO STORAGE:", error.message);
        return null;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("arquivos_iza").getPublicUrl(caminho);

      console.log("Upload concluído! URL gerada:", publicUrl);
      return publicUrl;
    } catch (err) {
      console.error("ERRO INESPERADO NO UPLOAD:", err.message);
      return null;
    }
  };

  // --- LÓGICA DE GPS REAL (Endereço por Extenso) ---
  const pegarLocalizacaoReal = () => {
    if (!navigator.geolocation) return;
    setLocalizando(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          // API gratuita do OpenStreetMap para pegar o endereço
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
          );
          const data = await response.json();
          const endereco =
            data.display_name || `Lat: ${latitude}, Long: ${longitude}`;
          setLocalizando(false);
          enviarMensagem(`📍 Localização: ${endereco}`);
        } catch (err) {
          setLocalizando(false);
          enviarMensagem(`📍 Coordenadas: ${latitude}, ${longitude}`);
        }
      },
      () => {
        setLocalizando(false);
        alert("Erro ao obter GPS.");
      },
    );
  };

  const enviarMensagem = async (
    textoManual,
    isAnonimo = false,
    imgFile = null,
    audioBlob = null,
  ) => {
    const texto = textoManual || input;
    if (!texto.trim() && !imgFile && !audioBlob) return;

    // UI: Mostra o balão imediatamente
    const urlPreview = imgFile
      ? URL.createObjectURL(imgFile)
      : audioBlob
        ? URL.createObjectURL(audioBlob)
        : null;
    setMensagens((prev) => [
      ...prev,
      {
        id: Date.now(),
        texto,
        remetente: "usuario",
        imagem: imgFile ? urlPreview : null,
        audio: audioBlob ? urlPreview : null,
      },
    ]);
    setInput("");

    setTimeout(async () => {
      let novaResposta = "";
      let novoFluxo = fluxo;

      // FLUXO LINEAR SIMPLES
      if (fluxo === 0) {
        if (texto.toLowerCase().includes("anônimo") || isAnonimo) {
          setAnonimo(true);
          setDados((prev) => ({ ...prev, nome: "Anônimo" }));
          novaResposta =
            "Entendido! O que deseja registrar hoje? (Escolha uma opção abaixo)";
        } else {
          setDados((prev) => ({ ...prev, nome: texto }));
          novaResposta = `Prazer, ${texto}! O que deseja registrar hoje?`;
        }
        novoFluxo = 1;
      } else if (fluxo === 1) {
        setDados((prev) => ({ ...prev, tipo: texto }));
        novaResposta = `Certo. **Onde** aconteceu isso? (Você pode usar o GPS abaixo)`;
        novoFluxo = 2;
      } else if (fluxo === 2) {
        setDados((prev) => ({ ...prev, local: texto }));
        novaResposta = `Entendido. Agora, descreva **o que aconteceu**. \n\nVocê pode **segurar o microfone** para contar a história, digitar aqui ou mandar fotos:`;
        novoFluxo = 3;
      } else if (fluxo === 3) {
        if (texto === "CONFIRMADO") {
          const numProtocolo = Math.floor(
            Math.random() * 900000 + 100000,
          ).toString();

          try {
            let urlPublica = null;

            // Se houver áudio, esperamos o upload terminar para pegar a URL
            if (dados.relatoAudio) {
              urlPublica = await uploadParaStorage(dados.relatoAudio, "audios");
            }

            console.log(
              "Preparando inserção no banco com protocolo:",
              numProtocolo,
            );

            const { error } = await supabase.from("manifestacoes").insert([
              {
                protocolo: numProtocolo,
                nome: anonimo ? "Anônimo" : dados.nome || "Cidadão",
                tipo: dados.tipo || "Relato",
                localizacao: dados.local || "Não informado",
                relato: dados.relato || "Relato via áudio",
                anonimo: anonimo,
                arquivo_url: urlPublica || null, 
              },
            ]);

            if (error) {
              console.error("ERRO NO INSERT DO BANCO:", error.message);
              alert("Erro no Banco: " + error.message);
              return;
            }

            setDados((prev) => ({ ...prev, protocolo: numProtocolo }));
            setEtapa("protocolo");
          } catch (err) {
            console.error("ERRO GERAL:", err);
            alert("Erro crítico. Verifique o console (F12).");
          }
        }
        // ETAPA B: Se o usuário apenas digitou o texto do relato e deu Enter
        else {
          setDados((prev) => ({ ...prev, relato: texto }));
          novaResposta =
            "Perfeito, anotei seu relato. Você pode enviar mais detalhes ou clicar no botão verde abaixo para concluir o registro oficial.";
        }
      }

      setFluxo(novoFluxo);
      setMensagens((prev) => [
        ...prev,
        { id: Date.now() + 1, texto: novaResposta, remetente: "iza" },
      ]);
    }, 800);
  };

  const cores = {
    bg: altoContraste ? "bg-black" : "bg-gray-50",
    header: altoContraste
      ? "bg-black border-b border-yellow-400"
      : "bg-[#005594]",
    card: altoContraste
      ? "bg-black border-2 border-yellow-400 text-yellow-400"
      : "bg-white text-gray-800 shadow-2xl",
    botaoPrincipal: altoContraste
      ? "bg-yellow-400 text-black"
      : "bg-[#005594] text-white",
  };

  const gerarComprovante = () => {
    const doc = new jsPDF();

    // Função para limpar emojis (mantém letras, números e acentos)
    const limparTexto = (txt) =>
      txt ? txt.replace(/[^\w\sÀ-ÿ.,!?-]/gi, "").trim() : "";

    const tipoLimpo = limparTexto(dados.tipo);
    const nomeLimpo = limparTexto(anonimo ? "Anônimo" : dados.nome);
    const localLimpo = limparTexto(dados.local);
    const relatoLimpo = limparTexto(dados.relato);

    // --- CABEÇALHO FORMAL ---
    // Adicionando uma barra azul no topo
    doc.setFillColor(0, 85, 148);
    doc.rect(0, 0, 210, 40, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(255, 255, 255);
    doc.text("GOVERNO DO DISTRITO FEDERAL", 105, 15, { align: "center" });

    doc.setFontSize(12);
    doc.text("OUVIDORIA GERAL - SISTEMA IZA", 105, 25, { align: "center" });
    doc.text("COMPROVANTE DE REGISTRO", 105, 32, { align: "center" });

    // --- CORPO DO DOCUMENTO ---
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");

    // Moldura
    doc.setDrawColor(200, 200, 200);
    doc.rect(10, 45, 190, 240);

    // Informações Principais
    let y = 60;
    const col1 = 20;
    const col2 = 60;

    const adicionarLinha = (label, valor) => {
      doc.setFont("helvetica", "bold");
      doc.text(label, col1, y);
      doc.setFont("helvetica", "normal");
      doc.text(valor, col2, y);
      y += 10;
    };

    adicionarLinha("PROTOCOLO:", `#${dados.protocolo}`);
    adicionarLinha("DATA:", new Date().toLocaleString("pt-BR"));
    adicionarLinha("SOLICITANTE:", nomeLimpo);
    adicionarLinha("TIPO:", tipoLimpo);

    y += 5;
    doc.setFont("helvetica", "bold");
    doc.text("LOCALIZAÇÃO:", col1, y);
    y += 7;
    doc.setFont("helvetica", "normal");
    const localSplit = doc.splitTextToSize(localLimpo, 160);
    doc.text(localSplit, col1, y);
    y += localSplit.length * 6 + 5;

    doc.setDrawColor(0, 85, 148);
    doc.line(col1, y, 190, y);
    y += 10;

    doc.setFont("helvetica", "bold");
    doc.text("DESCRIÇÃO DO RELATO:", col1, y);
    y += 7;
    doc.setFont("helvetica", "normal");
    const relatoFinal =
      relatoLimpo || "Relato enviado via mídia (verificar no sistema).";
    const splitRelato = doc.splitTextToSize(relatoFinal, 170);
    doc.text(splitRelato, col1, y);

    // --- RODAPÉ ---
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    const rodapeY = 280;
    doc.text(
      "Este documento é um comprovante oficial gerado pela Assistente Virtual IZA.",
      105,
      rodapeY,
      { align: "center" },
    );
    doc.text(
      "Para consultar o andamento, acesse o portal da Ouvidoria DF com o número do protocolo.",
      105,
      rodapeY + 4,
      { align: "center" },
    );

    doc.save(`comprovante-iza-${dados.protocolo}.pdf`);
  };
  return (
    <div
      className={`min-h-screen ${cores.bg} transition-all flex flex-col`}
      style={{ fontSize: `${fontSize}px` }}
    >
      <header
        className={`${cores.header} text-white p-4 flex justify-between items-center sticky top-0 z-20 shadow-md`}
      >
        <h1 className="font-bold">Ouvidoria DF</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setAltoContraste(!altoContraste)}
            className="p-2 rounded-lg font-bold text-[10px] bg-white/20"
          >
            CONTRASTE
          </button>
          <button
            onClick={() => setFontSize(fontSize + 2)}
            className="bg-white/20 px-3 py-1 rounded-lg font-bold"
          >
            A+
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col max-w-lg mx-auto w-full p-4 overflow-hidden justify-center">
        {etapa === "inicio" ? (
          <div className="text-center w-full animate-fadeIn">
            <div
              className={`${cores.card} p-8 rounded-3xl border-t-[10px] border-[#FDB813]`}
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/2593/2593635.png"
                alt="IZA"
                className="w-20 h-20 mx-auto mb-4"
              />
              <h2 className="text-2xl font-black text-[#005594]">
                Oi, eu sou a IZA!
              </h2>
              <div className="text-left p-4 rounded-xl my-6 text-xs bg-gray-50 border border-gray-200">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={aceitoTermos}
                    onChange={(e) => setAceitoTermos(e.target.checked)}
                    className="mt-1 w-5 h-5"
                  />
                  <span>Aceito os termos da **LGPD**.</span>
                </label>
              </div>
              <button
                onClick={() => setEtapa("chat")}
                disabled={!aceitoTermos}
                className={`w-full py-4 rounded-2xl font-black ${!aceitoTermos ? "bg-gray-200" : cores.botaoPrincipal}`}
              >
                COMEÇAR
              </button>
            </div>
          </div>
        ) : etapa === "chat" ? (
          <div className="flex flex-col h-[85vh] w-full">
            <div className="flex-1 overflow-y-auto space-y-4 pr-2 pb-24 mt-4">
              {mensagens.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.remetente === "iza" ? "justify-start" : "justify-end"}`}
                >
                  <div
                    className={`max-w-[85%] p-4 rounded-2xl ${msg.remetente === "iza" ? "bg-white border-l-4 border-blue-500 shadow-sm" : "bg-[#005594] text-white"}`}
                  >
                    {msg.imagem && (
                      <img
                        src={msg.imagem}
                        alt="Anexo"
                        className="w-full rounded-lg mb-2"
                      />
                    )}
                    {msg.audio && (
                      <audio controls src={msg.audio} className="w-full mb-2" />
                    )}
                    <p className="whitespace-pre-line leading-relaxed">
                      {renderizarTexto(msg.texto)}
                    </p>
                  </div>
                </div>
              ))}

              {fluxo === 0 && (
                <div className="grid grid-cols-2 gap-2 mt-4">
                  <button
                    onClick={() => enviarMensagem("Identificar")}
                    className="bg-white border-2 border-blue-900 text-blue-900 py-3 rounded-xl font-bold"
                  >
                    Identificar
                  </button>
                  <button
                    onClick={() => enviarMensagem("Anônimo", true)}
                    className="bg-gray-800 text-white py-3 rounded-xl font-bold"
                  >
                    Anônimo
                  </button>
                </div>
              )}

              {fluxo === 1 &&
                mensagens[mensagens.length - 1].remetente === "iza" && (
                  <div className="grid grid-cols-1 gap-2 mt-2">
                    {["🚨 Reclamação", "👏 Elogio", "⚖️ Denúncia"].map(
                      (opt) => (
                        <button
                          key={opt}
                          onClick={() => enviarMensagem(opt)}
                          className="bg-white border-2 border-blue-900 text-blue-900 py-3 rounded-xl font-bold"
                        >
                          {opt}
                        </button>
                      ),
                    )}
                  </div>
                )}

              {fluxo === 2 &&
                mensagens[mensagens.length - 1].remetente === "iza" && (
                  <button
                    onClick={pegarLocalizacaoReal}
                    disabled={localizando}
                    className="w-full mt-2 py-4 rounded-xl font-black bg-blue-50 text-blue-900 border-2 border-blue-900 animate-pulse"
                  >
                    📍{" "}
                    {localizando ? "OBTENDO ENDEREÇO..." : "USAR MEU GPS REAL"}
                  </button>
                )}
              {fluxo === 3 &&
                (dados.relato || dados.relatoAudio) &&
                !gravando && (
                  <div className="p-4 animate-fadeIn">
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-3 mb-4 rounded-r-xl">
                      <p className="text-xs text-blue-800 font-bold">
                        IZA: Tudo pronto! revise seu relato acima e clique no
                        botão para finalizar.
                      </p>
                    </div>

                    <button
                      onClick={() => enviarMensagem("CONFIRMADO")}
                      className="w-full py-4 bg-green-600 text-white rounded-2xl font-black shadow-lg hover:bg-green-700 active:scale-95 transition-all"
                    >
                      ✅ FINALIZAR E GERAR PROTOCOLO
                    </button>
                    <p className="text-[10px] text-center mt-2 text-gray-500 uppercase tracking-widest">
                      Documento com validade jurídica
                    </p>
                  </div>
                )}
              <div ref={scrollRef} />
            </div>

            <div className="bg-white p-3 rounded-2xl shadow-2xl flex gap-2 items-center fixed bottom-4 max-w-lg w-[92%] mx-auto left-0 right-0 border border-gray-200">
              {/* CÂMERA: Desabilitada até o fluxo 3 */}
              <button
                onClick={() =>
                  fluxo === 3
                    ? fileInputRef.current.click()
                    : alert(
                        "A IZA ainda está te ouvindo! Envie a foto na etapa final do relato.",
                      )
                }
                className={`p-2 rounded-full text-xl transition-all ${fluxo === 3 ? "bg-gray-100 hover:bg-gray-200" : "opacity-20 grayscale"}`}
                title="Anexar foto"
              >
                📷
              </button>

              {/* MICROFONE: Desabilitado até o fluxo 3 */}
              <button
                onMouseDown={fluxo === 3 ? iniciarGravacao : null}
                onMouseUp={fluxo === 3 ? pararGravacao : null}
                className={`p-2 rounded-full text-xl transition-all ${
                  fluxo === 3
                    ? gravando
                      ? "wave-active text-white scale-125"
                      : "bg-gray-100 text-gray-600"
                    : "opacity-20 grayscale cursor-not-allowed"
                }`}
              >
                🎙️
              </button>

              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) enviarMensagem("📸 Imagem anexada", false, file);
                }}
                className="hidden"
                accept="image/*"
              />

              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && enviarMensagem()}
                placeholder={
                  fluxo === 3
                    ? "Descreva aqui o ocorrido..."
                    : "Responda a IZA..."
                }
                className="flex-1 p-2 outline-none"
                disabled={gravando}
              />

              <button
                onClick={() => enviarMensagem()}
                className={`px-4 py-2 rounded-xl font-bold ${cores.botaoPrincipal}`}
              >
                ENVIAR
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center w-full animate-fadeIn pb-10">
            <div
              className={`${cores.card} p-8 rounded-3xl border-t-[10px] border-green-500 shadow-2xl`}
            >
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl font-bold shadow-inner">
                ✓
              </div>
              <h2 className="text-xl font-black uppercase text-gray-800">
                Relato Enviado!
              </h2>

              <p className="text-blue-900 font-mono text-3xl my-6 py-4 bg-blue-50 rounded-2xl border-2 border-dashed border-blue-200">
                #{dados.protocolo}
              </p>

              {/* ORIENTAÇÃO PÓS-RELATO: Essencial para a experiência do usuário */}
              <div className="text-left bg-gray-50 p-5 rounded-2xl mb-8 border border-gray-200 shadow-sm">
                <h3 className="font-bold text-sm mb-3 text-blue-900 uppercase tracking-wider">
                  O que acontece agora?
                </h3>
                <ul className="text-xs space-y-3 text-gray-600">
                  <li className="flex gap-2">
                    <span>•</span> Seu relato foi encaminhado para a{" "}
                    <strong>Controladoria Geral do DF</strong>.
                  </li>
                  <li className="flex gap-2">
                    <span>•</span> O prazo de resposta inicial é de até{" "}
                    <strong>20 dias úteis</strong>.
                  </li>
                  <li className="flex gap-2">
                    <span>•</span> Guarde seu número ou baixe o PDF para
                    consultar o andamento no portal.
                  </li>
                </ul>
              </div>

              <div className="flex flex-col gap-4">
                {/* BOTÃO DO COMPROVANTE PDF */}
                <button
                  onClick={gerarComprovante}
                  className="w-full py-4 rounded-2xl font-bold bg-green-600 text-white flex items-center justify-center gap-2 hover:bg-green-700 active:scale-95 transition-all shadow-lg"
                >
                  📄 BAIXAR COMPROVANTE (PDF)
                </button>

                {/* BOTÃO DE RESET: Limpa tudo para uma nova denúncia */}
                <button
                  onClick={() => {
                    setEtapa("inicio");
                    setFluxo(0);
                    setDados({
                      nome: "",
                      tipo: "",
                      local: "",
                      relato: "",
                      protocolo: "",
                    });
                    setMensagens([
                      {
                        id: 1,
                        texto:
                          "Olá! Eu sou a **IZA**, sua assistente de ouvidoria. \n\nComo você prefere começar? \n\n1. **Digite seu nome** ou aperte **Anônimo**. \n2. Ou **segure o microfone** abaixo e me conte direto o que houve!",
                        remetente: "iza",
                      },
                    ]);
                  }}
                  className={`w-full py-4 rounded-2xl font-black shadow-md active:scale-95 transition-all ${cores.botaoPrincipal}`}
                >
                  NOVA OUVIDORIA
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
