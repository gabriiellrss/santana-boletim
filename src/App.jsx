import React, { useState, useEffect } from 'react';

// Dados estáticos
const aniversariantesJSON = [
  { dia: "02/09", nome: "Maria Simony Barros de Lima", mes: 9 },
  { dia: "04/05", nome: "Irmão Teste de Maio", mes: 5 },
  { dia: "15/09", nome: "Marciano De Brito Santos", mes: 9 },
];

const eventosPadrao = [
  { id: 'evangelismo', expiracao: '2026-05-10', texto: "🟡 *Fins de Semana de Evangelismo com Luís Gonçalves*\n19/09, Sexta as 19h30\n20/09, Sábado as 17h00\n21/09, Domingo as 19h30" },
  { id: 'classeBiblica', expiracao: 'permanente', texto: "📒 *Classe Bíblica* | {DATA_DOMINGO}\n_Horário:_ 18h00" }
];

export default function App() {
  // --- ESTADOS DO APP ---
  const [abaAtiva, setAbaAtiva] = useState('editor'); // 'editor' ou 'resultado'
  const [modalAtivo, setModalAtivo] = useState(null); // 'sabado', 'domingo', 'quarta', 'proximoSabado'

  const [formData, setFormData] = useState({
    sabadoTema: '*Programação Especial*\n_Dia mundial dos Desbravadores_',
    sabadoPregador: 'Victor Matheus IASD',
    domingoTema: '*Fim de Semana de Evangelismo*\n*NÃO HAVERÁ CULTO NA IGREJA LOCAL*',
    domingoPregador: 'Luís Gonçalves',
    domingoLocal: 'IASD Central Diadema',
    quartaEstudo: 'Livro Oração',
    quartaPregador: 'Pr. Peduti',
    proximoSabadoPregador: 'Wellington IASD'
  });

  const [eventos, setEventos] = useState([]);
  const [novoEventoTexto, setNovoEventoTexto] = useState('');
  const [novoEventoData, setNovoEventoData] = useState('');
  
  const [boletim, setBoletim] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [copiado, setCopiado] = useState(false);

  // --- EFEITOS (Auto-Save e Carregamento) ---
  useEffect(() => {
    // Carrega eventos e remove vencidos
    const eventosSalvos = localStorage.getItem('boletim_eventos');
    let listaEventos = eventosSalvos ? JSON.parse(eventosSalvos) : eventosPadrao;
    const hoje = new Date().toISOString().split('T')[0];
    
    const eventosValidos = listaEventos.filter(ev => ev.expiracao === 'permanente' || ev.expiracao >= hoje);
    if (listaEventos.length !== eventosValidos.length || !eventosSalvos) {
      localStorage.setItem('boletim_eventos', JSON.stringify(eventosValidos));
    }
    setEventos(eventosValidos);

    // Carrega rascunho do formData para não perder o que foi digitado ao fechar o app
    const rascunho = localStorage.getItem('boletim_rascunho');
    if (rascunho) setFormData(JSON.parse(rascunho));
  }, []);

  // Salva o rascunho automaticamente sempre que o formData mudar
  useEffect(() => {
    localStorage.setItem('boletim_rascunho', JSON.stringify(formData));
  }, [formData]);

  // --- FUNÇÕES DE LÓGICA ---
  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleAdicionarEvento = () => {
    if (!novoEventoTexto.trim()) return;
    // O id deve ser estritamente uma string conforme padrão do sistema
    const novoEvento = {
      id: Date.now().toString(), 
      texto: novoEventoTexto,
      expiracao: novoEventoData || 'permanente'
    };
    const novaLista = [...eventos, novoEvento];
    setEventos(novaLista);
    localStorage.setItem('boletim_eventos', JSON.stringify(novaLista));
    setNovoEventoTexto(''); setNovoEventoData('');
  };

  const handleRemoverEvento = (id) => {
    const novaLista = eventos.filter(ev => ev.id !== id);
    setEventos(novaLista);
    localStorage.setItem('boletim_eventos', JSON.stringify(novaLista));
  };

  const formatarData = (data) => data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  const adicionarDias = (data, dias) => { const n = new Date(data); n.setDate(n.getDate() + dias); return n; };
  const obterSegunda = (data) => { const d = new Date(data); const dia = d.getDay(); const diff = d.getDate() - dia + (dia === 0 ? -6 : 1); return new Date(d.setDate(diff)); };

  const gerarBoletim = async () => {
    setCarregando(true); setCopiado(false); setAbaAtiva('resultado');
    
    const dataBase = obterSegunda(new Date());
    const datas = {
      inicio: dataBase, fim: adicionarDias(dataBase, 6),
      quarta: adicionarDias(dataBase, 2), sabado: adicionarDias(dataBase, 5),
      domingo: adicionarDias(dataBase, 6), proximoSabado: adicionarDias(dataBase, 12)
    };

    const header = `⚠️ *Atenção para o nosso boletim!*\n\n🟡 *Cultos e programações* do dia ${formatarData(datas.inicio)} até ${formatarData(datas.fim)}\n`;
    const temaSabado = formData.sabadoTema ? `${formData.sabadoTema}\n` : '';
    const temaDomingo = formData.domingoTema ? `${formData.domingoTema}\n` : '';

    const cultos = `\n🙌 SÁBADO | ${formatarData(datas.sabado)}\n${temaSabado}_9h:_ Escola Sabatina\n_10h00:_ Culto de Adoração\nPregador(a): ${formData.sabadoPregador}\n\n📖 DOMINGO | ${formatarData(datas.domingo)}\n${temaDomingo}Pregador(a): ${formData.domingoPregador}\nLocal: ${formData.domingoLocal}\n\n🙏 QUARTA | ${formatarData(datas.quarta)}\n_20h00:_ Culto de Oração\n_Estudo:_ ${formData.quartaEstudo}\nPregador(a): ${formData.quartaPregador}\n\n⏭️ Próximo Sábado | ${formatarData(datas.proximoSabado)}\nPregador(a): ${formData.proximoSabadoPregador}\n`;

    let textoEventos = '\n';
    eventos.forEach(ev => textoEventos += `${ev.texto.replace('{DATA_DOMINGO}', formatarData(datas.domingo))}\n\n`);

    const niversMes = aniversariantesJSON.filter(p => p.mes === (dataBase.getMonth() + 1));
    let niversStr = `🟤 *Lista de Aniversariantes do mês*\n`;
    niversMes.length > 0 ? niversMes.forEach(p => niversStr += `${p.dia} - _${p.nome}_\n`) : niversStr += "Nenhum no mês.\n";

    setBoletim(`${header}${cultos}${textoEventos}${niversStr}\n🌥️ *Pôr do Sol - Sábado*\n⏰ 18h00 (Aprox.)`);
    setCarregando(false);
  };

  const copiarTexto = () => { navigator.clipboard.writeText(boletim); setCopiado(true); };

  // --- COMPONENTES DE UI ---
  // Card Minimalista com Glassmorphism
  const Card = ({ titulo, icone, children }) => (
    <div className="bg-white/60 backdrop-blur-md border border-white/40 shadow-sm rounded-3xl p-5 mb-4">
      <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2 mb-3">
        {icone} {titulo}
      </h3>
      <div className="flex flex-col gap-3">
        {children}
      </div>
    </div>
  );

  // Input moderno e limpo
  const InputClean = ({ label, name, placeholder }) => (
    <div className="flex flex-col">
      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 ml-1">{label}</label>
      <input 
        name={name} value={formData[name]} onChange={handleInputChange} placeholder={placeholder}
        className="w-full bg-white/80 border-0 shadow-inner rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
      />
    </div>
  );

  // --- RENDERIZAÇÃO ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-indigo-50 to-teal-50 pb-24 font-sans selection:bg-indigo-200">
      
      {/* HEADER */}
      <header className="pt-10 pb-6 px-6 text-center">
        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-teal-500 tracking-tight">
          Boletim App
        </h1>
        <p className="text-slate-500 text-sm mt-1">Crie informativos semanais em segundos.</p>
      </header>

      {/* CONTEÚDO PRINCIPAL (Troca entre Editor e Resultado) */}
      <main className="px-4 max-w-md mx-auto">
        
        {/* ABA: EDITOR */}
        <div className={abaAtiva === 'editor' ? 'block' : 'hidden'}>
          
          <Card titulo="Sábado" icone="🙌">
            <div className="flex gap-2">
              <div className="flex-1">
                <InputClean label="Pregador" name="sabadoPregador" placeholder="Nome do pregador..." />
              </div>
              <button onClick={() => setModalAtivo('sabado')} className="mt-5 bg-white shadow-sm border border-slate-200 text-slate-600 rounded-xl px-4 flex items-center justify-center hover:bg-slate-50 active:scale-95 transition-all">
                ⚙️
              </button>
            </div>
          </Card>

          <Card titulo="Domingo" icone="📖">
            <div className="flex gap-2">
              <div className="flex-1">
                <InputClean label="Pregador" name="domingoPregador" placeholder="Nome do pregador..." />
              </div>
              <button onClick={() => setModalAtivo('domingo')} className="mt-5 bg-white shadow-sm border border-slate-200 text-slate-600 rounded-xl px-4 flex items-center justify-center hover:bg-slate-50 active:scale-95 transition-all">
                ⚙️
              </button>
            </div>
          </Card>

          <Card titulo="Quarta-feira" icone="🙏">
            <div className="flex gap-2">
              <div className="flex-1">
                <InputClean label="Pregador" name="quartaPregador" placeholder="Nome do pregador..." />
              </div>
              <button onClick={() => setModalAtivo('quarta')} className="mt-5 bg-white shadow-sm border border-slate-200 text-slate-600 rounded-xl px-4 flex items-center justify-center hover:bg-slate-50 active:scale-95 transition-all">
                ⚙️
              </button>
            </div>
          </Card>

          <Card titulo="Próximo Sábado" icone="⏭️">
            <InputClean label="Pregador do Próx. Sábado" name="proximoSabadoPregador" />
          </Card>

          <Card titulo="Eventos & Anúncios" icone="📅">
            <div className="bg-white/50 p-3 rounded-2xl border border-white/60 mb-2">
              <textarea 
                value={novoEventoTexto} onChange={(e) => setNovoEventoTexto(e.target.value)} 
                placeholder="Ex: ⛺ *Acampamento*..." className="w-full bg-transparent border-0 focus:ring-0 text-sm resize-none" rows={2}
              />
              <div className="flex justify-between items-center mt-2 border-t border-slate-200 pt-2">
                <input type="date" value={novoEventoData} onChange={(e) => setNovoEventoData(e.target.value)} className="bg-transparent text-xs text-slate-500 outline-none" />
                <button onClick={handleAdicionarEvento} className="bg-indigo-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg">Add +</button>
              </div>
            </div>
            
            <div className="space-y-2 mt-2">
              {eventos.map(ev => (
                <div key={ev.id} className="flex justify-between items-center bg-white/80 p-2 rounded-xl text-xs border border-slate-100 shadow-sm">
                  <span className="truncate max-w-[80%]">{ev.texto.split('\n')[0]}</span>
                  <button onClick={() => handleRemoverEvento(ev.id)} className="text-red-400 font-bold px-2">X</button>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* ABA: RESULTADO */}
        <div className={abaAtiva === 'resultado' ? 'block' : 'hidden'}>
          <div className="bg-white/80 backdrop-blur-md rounded-3xl p-5 shadow-lg border border-white mb-6 relative">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-slate-800">Preview do WhatsApp</h3>
              {boletim && (
                <button onClick={copiarTexto} className={`px-4 py-1.5 rounded-full text-xs font-bold text-white transition-all ${copiado ? 'bg-emerald-500' : 'bg-indigo-500'}`}>
                  {copiado ? '✅ Copiado' : '📋 Copiar'}
                </button>
              )}
            </div>
            <pre className="whitespace-pre-wrap text-[13px] text-slate-700 font-sans leading-relaxed">
              {boletim || "O boletim aparecerá aqui após ser gerado."}
            </pre>
          </div>
        </div>
      </main>

      {/* NAVEGAÇÃO BOTTOM (Fixo na parte de baixo) */}
      <nav className="fixed bottom-0 w-full bg-white/70 backdrop-blur-xl border-t border-slate-200 p-4 pb-safe flex justify-center gap-4">
        <button 
          onClick={() => setAbaAtiva('editor')} 
          className={`flex-1 py-3 rounded-2xl font-bold transition-all ${abaAtiva === 'editor' ? 'bg-indigo-100 text-indigo-700' : 'text-slate-500'}`}
        >
          📝 Editar
        </button>
        <button 
          onClick={gerarBoletim} 
          className="flex-[1.5] bg-gradient-to-r from-indigo-600 to-teal-500 shadow-lg shadow-indigo-200 text-white py-3 rounded-2xl font-bold active:scale-95 transition-all"
        >
          {carregando ? '...' : '✨ Gerar Boletim'}
        </button>
      </nav>

      {/* MODAL DE OPÇÕES AVANÇADAS */}
      {modalAtivo && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center animate-in fade-in">
          <div className="bg-white w-full sm:max-w-sm rounded-t-3xl sm:rounded-3xl p-6 pb-10 shadow-2xl animate-in slide-in-from-bottom-10">
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-bold text-xl text-slate-800 capitalize">Detalhes: {modalAtivo}</h3>
              <button onClick={() => setModalAtivo(null)} className="bg-slate-100 p-2 rounded-full text-slate-500 font-bold">X</button>
            </div>
            
            <div className="flex flex-col gap-4">
              {/* Campos dinâmicos baseados no dia selecionado */}
              {(modalAtivo === 'sabado' || modalAtivo === 'domingo') && (
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase">Tema Especial</label>
                  <textarea name={`${modalAtivo}Tema`} value={formData[`${modalAtivo}Tema`]} onChange={handleInputChange} rows={3} className="bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none text-sm" />
                </div>
              )}
              {modalAtivo === 'domingo' && (
                <InputClean label="Localização" name="domingoLocal" />
              )}
              {modalAtivo === 'quarta' && (
                <InputClean label="Livro/Estudo" name="quartaEstudo" />
              )}
              <button onClick={() => setModalAtivo(null)} className="w-full bg-slate-800 text-white font-bold py-3 rounded-xl mt-2">Pronto</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}