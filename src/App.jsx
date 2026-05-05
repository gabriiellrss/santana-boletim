import React, { useState, useEffect } from 'react';
import { 
  CalendarDays, 
  BookOpen, 
  Heart, 
  SkipForward, 
  Bell, 
  Settings2, 
  PenLine, 
  Sparkles, 
  Copy, 
  Check, 
  X, 
  Trash2, 
  Plus 
} from 'lucide-react';
import { Loader2 } from 'lucide-react';

// Dados estáticos de Eventos Padrão (ONDE O ERRO ESTAVA ACONTECENDO)
const eventosPadrao = [
  { 
    id: 'evangelismo', 
    expiracao: '2026-05-10', 
    texto: "🟡 *Fins de Semana de Evangelismo com Luís Gonçalves*\n19/09, Sexta as 19h30\n20/09, Sábado as 17h00\n21/09, Domingo as 19h30" 
  },
  { 
    id: 'classeBiblica', 
    expiracao: 'permanente', 
    texto: "📒 *Classe Bíblica* | {DATA_DOMINGO}\n_Horário:_ 18h00" 
  }
];

// Dados estáticos
const aniversariantesJSON = [
  { dia: "02/09", nome: "Maria Simony Barros de Lima", mes: 9 },
  { dia: "04/05", nome: "Irmão Teste de Maio", mes: 5 },
  { dia: "15/09", nome: "Marciano De Brito Santos", mes: 9 },
];

export default function App() {
  const [abaAtiva, setAbaAtiva] = useState('editor'); 
  const [modalAtivo, setModalAtivo] = useState(null); 

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

  useEffect(() => {
    const eventosSalvos = localStorage.getItem('boletim_eventos');
    let listaEventos = eventosSalvos ? JSON.parse(eventosSalvos) : eventosPadrao;
    const hoje = new Date().toISOString().split('T')[0];
    
    const eventosValidos = listaEventos.filter(ev => ev.expiracao === 'permanente' || ev.expiracao >= hoje);
    if (listaEventos.length !== eventosValidos.length || !eventosSalvos) {
      localStorage.setItem('boletim_eventos', JSON.stringify(eventosValidos));
    }
    setEventos(eventosValidos);

    const rascunho = localStorage.getItem('boletim_rascunho');
    if (rascunho) setFormData(JSON.parse(rascunho));
  }, []);

  useEffect(() => {
    localStorage.setItem('boletim_rascunho', JSON.stringify(formData));
  }, [formData]);

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleAdicionarEvento = () => {
    if (!novoEventoTexto.trim()) return;
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

  const Card = ({ titulo, icone, children }) => (
    <div className="bg-white/60 backdrop-blur-md border border-white/40 shadow-sm rounded-3xl p-5 mb-4">
      <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2 mb-3">
        {icone} <span className="tracking-tight">{titulo}</span>
      </h3>
      <div className="flex flex-col gap-3">
        {children}
      </div>
    </div>
  );

  const Loading = ({ 
    texto = "Carregando...", 
    corGiro = "text-indigo-600", // Cor do ícone girando
    corSombra = "bg-indigo-500", // Cor do brilho no fundo
    tamanho = "w-10 h-10", 
    overlay = false // Se for true, cobre a tela toda
  }) => {

    const conteudo = (
      <div className="flex flex-col items-center justify-center gap-4">
        {/* Container do ícone com brilho (glow effect) */}
        <div className="relative flex items-center justify-center">
          {/* Sombra pulsante de fundo */}
          <div className={`absolute inset-0 rounded-full blur-xl opacity-40 animate-pulse ${corSombra}`}></div>
          {/* Ícone giratório */}
          <Loader2 className={`relative z-10 animate-spin ${tamanho} ${corGiro}`} />
        </div>

        {/* Texto de carregamento */}
        {texto && (
          <span className="text-slate-700 font-bold text-sm tracking-wide animate-pulse">
            {texto}
          </span>
        )}
      </div>
    );

    // Se o overlay for verdadeiro, cria o fundo translúcido (Glassmorphism) na tela inteira
    if (overlay) {
      return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/30 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white/70 border border-white/50 p-8 rounded-[2rem] shadow-2xl flex flex-col items-center">
            {conteudo}
          </div>
        </div>
      );
    }

    // Retorna apenas o ícone livre se overlay for falso
    return conteudo;
  };

  const InputClean = ({ label, name, placeholder }) => (
    <div className="flex flex-col">
      <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 ml-1">{label}</label>
      <input 
        name={name} value={formData[name]} onChange={handleInputChange} placeholder={placeholder}
        className="w-full bg-white/80 border-0 shadow-inner rounded-xl px-4 py-3 text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all placeholder:text-slate-300"
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-indigo-50 to-teal-50 pb-24 font-sans selection:bg-indigo-200">
      
      {/* HEADER */}
      <header className="pt-10 pb-6 px-6 text-center">
        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-teal-500 tracking-tight">
          Boletim
        </h1>
        <p className="text-slate-500 text-sm mt-1">Crie informativos semanais rapidamente.</p>
      </header>

      <main className="px-4 max-w-md mx-auto">
        <div className={abaAtiva === 'editor' ? 'block animate-in fade-in' : 'hidden'}>
          
          <Card titulo="Sábado" icone={<CalendarDays className="w-5 h-5 text-indigo-500" />}>
            <div className="flex gap-2">
              <div className="flex-1">
                <InputClean label="Pregador" name="sabadoPregador" placeholder="Nome do pregador..." />
              </div>
              <button onClick={() => setModalAtivo('sabado')} className="mt-5 bg-white shadow-sm border border-slate-200 text-slate-600 rounded-xl w-12 flex items-center justify-center hover:bg-slate-50 active:scale-95 transition-all">
                <Settings2 className="w-5 h-5" />
              </button>
            </div>
          </Card>

          <Card titulo="Domingo" icone={<BookOpen className="w-5 h-5 text-indigo-500" />}>
            <div className="flex gap-2">
              <div className="flex-1">
                <InputClean label="Pregador" name="domingoPregador" placeholder="Nome do pregador..." />
              </div>
              <button onClick={() => setModalAtivo('domingo')} className="mt-5 bg-white shadow-sm border border-slate-200 text-slate-600 rounded-xl w-12 flex items-center justify-center hover:bg-slate-50 active:scale-95 transition-all">
                <Settings2 className="w-5 h-5" />
              </button>
            </div>
          </Card>

          <Card titulo="Quarta-feira" icone={<Heart className="w-5 h-5 text-indigo-500" />}>
            <div className="flex gap-2">
              <div className="flex-1">
                <InputClean label="Pregador" name="quartaPregador" placeholder="Nome do pregador..." />
              </div>
              <button onClick={() => setModalAtivo('quarta')} className="mt-5 bg-white shadow-sm border border-slate-200 text-slate-600 rounded-xl w-12 flex items-center justify-center hover:bg-slate-50 active:scale-95 transition-all">
                <Settings2 className="w-5 h-5" />
              </button>
            </div>
          </Card>

          <Card titulo="Próximo Sábado" icone={<SkipForward className="w-5 h-5 text-indigo-500" />}>
            <InputClean label="Pregador" name="proximoSabadoPregador" placeholder="Nome do pregador..." />
          </Card>

          <Card titulo="Eventos & Anúncios" icone={<Bell className="w-5 h-5 text-indigo-500" />}>
            <div className="bg-white/50 p-3 rounded-2xl border border-white/60 mb-2 transition-all focus-within:bg-white focus-within:shadow-sm">
              <textarea 
                value={novoEventoTexto} onChange={(e) => setNovoEventoTexto(e.target.value)} 
                placeholder="Ex: ⛺ *Acampamento*..." className="w-full bg-transparent border-0 focus:ring-0 text-sm resize-none text-slate-700 placeholder:text-slate-400 outline-none" rows={2}
              />
              <div className="flex justify-between items-center mt-2 border-t border-slate-200/50 pt-2">
                <input type="date" value={novoEventoData} onChange={(e) => setNovoEventoData(e.target.value)} className="bg-transparent text-xs text-slate-500 outline-none" />
                <button onClick={handleAdicionarEvento} className="bg-indigo-50 text-indigo-600 flex items-center gap-1 hover:bg-indigo-100 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors">
                  <Plus className="w-3 h-3" /> Add
                </button>
              </div>
            </div>
            
            <div className="space-y-2 mt-2">
              {eventos.map(ev => (
                <div key={ev.id} className="flex justify-between items-center bg-white/80 p-3 rounded-xl text-xs border border-slate-100 shadow-sm">
                  <span className="truncate max-w-[80%] text-slate-600 font-medium">{ev.texto.split('\n')[0]}</span>
                  <button onClick={() => handleRemoverEvento(ev.id)} className="text-red-400 hover:text-red-600 transition-colors p-1">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* ABA: RESULTADO */}
        <div className={abaAtiva === 'resultado' ? 'block animate-in fade-in' : 'hidden'}>
          <div className="bg-white/80 backdrop-blur-md rounded-3xl p-5 shadow-lg border border-white mb-6 relative">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide">Texto Finalizado</h3>
              {boletim && (
                <button onClick={copiarTexto} className={`px-4 py-2 flex items-center gap-2 rounded-full text-xs font-bold text-white transition-all shadow-md ${copiado ? 'bg-emerald-500 shadow-emerald-200' : 'bg-indigo-500 shadow-indigo-200 active:scale-95'}`}>
                  {copiado ? <><Check className="w-4 h-4" /> Copiado</> : <><Copy className="w-4 h-4" /> Copiar</>}
                </button>
              )}
            </div>
            <pre className="whitespace-pre-wrap text-[13px] text-slate-700 font-sans leading-relaxed bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
              {boletim || "O boletim aparecerá aqui após ser gerado."}
            </pre>
          </div>
        </div>
      </main>

      {/* NAVEGAÇÃO BOTTOM */}
      <nav className="fixed bottom-0 w-full bg-white/80 backdrop-blur-xl border-t border-slate-200/60 p-4 pb-safe flex justify-center gap-3">
        <button 
          onClick={() => setAbaAtiva('editor')} 
          className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold transition-all text-sm ${abaAtiva === 'editor' ? 'bg-indigo-100 text-indigo-700' : 'text-slate-500 hover:bg-slate-50'}`}
        >
          <PenLine className="w-5 h-5" /> Editar
        </button>
        <button 
          onClick={gerarBoletim} 
          className="flex-[1.5] flex items-center justify-center gap-2 bg-slate-900 text-white shadow-lg shadow-slate-300/50 py-3.5 rounded-2xl font-bold active:scale-95 transition-all text-sm"
        >
          <Sparkles className="w-5 h-5 text-indigo-300" />
          {carregando ? 'Gerando...' : 'Gerar Boletim'}
        </button>
      </nav>

      {/* MODAL DE OPÇÕES AVANÇADAS */}
      {modalAtivo && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center animate-in fade-in">
          <div className="bg-white w-full sm:max-w-sm rounded-t-3xl sm:rounded-3xl p-6 pb-10 shadow-2xl animate-in slide-in-from-bottom-10 border border-slate-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-xl text-slate-800 capitalize flex items-center gap-2">
                <Settings2 className="w-5 h-5 text-indigo-500" /> Detalhes: {modalAtivo}
              </h3>
              <button onClick={() => setModalAtivo(null)} className="bg-slate-100 hover:bg-slate-200 p-2 rounded-full text-slate-500 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex flex-col gap-4">
              {(modalAtivo === 'sabado' || modalAtivo === 'domingo') && (
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">Tema Especial</label>
                  <textarea name={`${modalAtivo}Tema`} value={formData[`${modalAtivo}Tema`]} onChange={handleInputChange} rows={3} className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none text-sm transition-all" />
                </div>
              )}
              {modalAtivo === 'domingo' && (
                <InputClean label="Localização" name="domingoLocal" />
              )}
              {modalAtivo === 'quarta' && (
                <InputClean label="Livro/Estudo" name="quartaEstudo" />
              )}
              <button disabled={carregando} onClick={() => setModalAtivo(null)} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl mt-4 shadow-md shadow-indigo-200 transition-all active:scale-95">
                Salvar e Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {carregando && (
        <Loading 
          overlay={true} 
          texto="Gerando Boletim..." 
          corGiro="text-teal-500" 
          corSombra="bg-teal-400" 
        />
      )}
    </div>
  );
}