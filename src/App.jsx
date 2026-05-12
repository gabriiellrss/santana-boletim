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
  Plus,
  Loader2,
  LayoutTemplate
} from 'lucide-react';

const aniversariantesJSON = [
  { "dia": "21/08", "nome": "Adeir Hilario Francisco Junior", "mes": 8 },
  { "dia": "10/10", "nome": "Adriana Pereira Correia Nunes", "mes": 10 },
  { "dia": "14/11", "nome": "Alessandra Souza de Lima do Rosario", "mes": 11 },
  { "dia": "02/08", "nome": "Amiel Conceicao da Silva", "mes": 8 },
  { "dia": "16/09", "nome": "Antonio Carlos Vilela", "mes": 9 },
  { "dia": "29/01", "nome": "Armando Luiz Soares Barbosa", "mes": 1 },
  { "dia": "06/09", "nome": "Arnaldo Rodrigues da Silva Junior", "mes": 9 },
  { "dia": "14/10", "nome": "Arthur Alves de Oliveira", "mes": 10 },
  { "dia": "27/03", "nome": "Carlos Vinicius Aguilera De Souza", "mes": 3 },
  { "dia": "11/04", "nome": "Catia Cirlene Ferreira de Souza Silva", "mes": 4 },
  { "dia": "16/08", "nome": "Cidicleia Santos Pereira", "mes": 8 },
  { "dia": "28/09", "nome": "Claudia Rocha da Silva", "mes": 9 },
  { "dia": "07/01", "nome": "Cobi Frezze", "mes": 1 },
  { "dia": "19/06", "nome": "Damiana Brasileiro do Nascimento", "mes": 6 },
  { "dia": "18/02", "nome": "Deusdethi de Oliveira", "mes": 2 },
  { "dia": "07/09", "nome": "Eliane Mara Assumpção", "mes": 9 },
  { "dia": "21/11", "nome": "Elieusa Souza", "mes": 11 },
  { "dia": "11/07", "nome": "Elisangela Melo De Lima", "mes": 7 },
  { "dia": "22/05", "nome": "Elzeni Azevedo da Silva", "mes": 5 },
  { "dia": "27/06", "nome": "Evilly Melo de Lima", "mes": 6 },
  { "dia": "11/02", "nome": "Fabiana Almeida de Oliveira", "mes": 2 },
  { "dia": "01/03", "nome": "Gabriel Rodrigo Silva de Santana", "mes": 3 },
  { "dia": "19/08", "nome": "Gabriel Rodrigues de Lima", "mes": 8 },
  { "dia": "24/08", "nome": "Gisele Santos Silva", "mes": 8 },
  { "dia": "26/03", "nome": "Gislene Regina De Oliveira", "mes": 3 },
  { "dia": "25/02", "nome": "Heitor Santana Frezze", "mes": 2 },
  { "dia": "15/08", "nome": "Igor Almeida do Nascimento", "mes": 8 },
  { "dia": "18/12", "nome": "Izabel Boani Prado", "mes": 12 },
  { "dia": "03/09", "nome": "Jackeline Gonçalves Oliveira", "mes": 9 },
  { "dia": "25/09", "nome": "Jaqueline Firmino Alves Santos", "mes": 9 },
  { "dia": "04/06", "nome": "Joana D`arc dos Santos", "mes": 6 },
  { "dia": "20/09", "nome": "Joao Correa De Alvarenga", "mes": 9 },
  { "dia": "18/05", "nome": "Jonas Assumpção Nascimento", "mes": 5 },
  { "dia": "03/05", "nome": "Jonas Leo Batista de Toledo", "mes": 5 },
  { "dia": "29/04", "nome": "Josania Maria Silva Nunes", "mes": 4 },
  { "dia": "10/05", "nome": "Kathleen Nicole Souza Do Rosario", "mes": 5 },
  { "dia": "10/10", "nome": "Kecilly Mirely Melo de Lima", "mes": 10 },
  { "dia": "02/11", "nome": "Kelvis Silva", "mes": 11 },
  { "dia": "17/04", "nome": "Leandra Souza De Lima Do Rosário", "mes": 4 },
  { "dia": "17/09", "nome": "Lethicia Lopes Da Silva Jacó", "mes": 9 },
  { "dia": "24/06", "nome": "Leticia Nascimento Silva", "mes": 6 },
  { "dia": "23/01", "nome": "Lorena Gonçalves Azevedo", "mes": 1 },
  { "dia": "05/03", "nome": "Luan Ricardo Souza Do Rosario", "mes": 3 },
  { "dia": "12/08", "nome": "Luan Costa Moreira", "mes": 8 },
  { "dia": "10/05", "nome": "Luis Carlos Da Costa E Silva", "mes": 5 },
  { "dia": "04/02", "nome": "Manuela Lima Rodrigues", "mes": 2 },
  { "dia": "10/08", "nome": "Marcely Caroline Souza Marques", "mes": 8 },
  { "dia": "26/08", "nome": "Marcia Oliveira Costa", "mes": 8 },
  { "dia": "15/09", "nome": "Marciano De Brito Santos", "mes": 9 },
  { "dia": "10/11", "nome": "Marcos Paulo Lopes Da Silva", "mes": 11 },
  { "dia": "26/06", "nome": "Maria Alves Rodrigues", "mes": 6 },
  { "dia": "21/05", "nome": "Maria do Socorro Ferreira da Silva", "mes": 5 },
  { "dia": "02/09", "nome": "Maria Simony Barros de Lima", "mes": 9 },
  { "dia": "12/05", "nome": "Marina Ferreira de Brito", "mes": 5 },
  { "dia": "22/03", "nome": "Marli Aparecida Lopes", "mes": 3 },
  { "dia": "03/12", "nome": "Mayara Alves Santos", "mes": 12 },
  { "dia": "04/12", "nome": "Melissa Asumpção Nascimento", "mes": 12 },
  { "dia": "28/08", "nome": "Mercia da Silva Castro", "mes": 8 },
  { "dia": "06/06", "nome": "Mirella Camile Souza Marques", "mes": 6 },
  { "dia": "20/11", "nome": "Nathalia Pereira Dos Santos", "mes": 11 },
  { "dia": "28/07", "nome": "Nelci De Araujo Delfino", "mes": 7 },
  { "dia": "13/11", "nome": "Neusa Maria Ribeiro Oliveira", "mes": 11 },
  { "dia": "27/02", "nome": "Nilza da Silva", "mes": 2 },
  { "dia": "13/12", "nome": "Norberto Aparecido do Rosario", "mes": 12 },
  { "dia": "25/07", "nome": "Paulo Fernando Silva Brito", "mes": 7 },
  { "dia": "24/06", "nome": "Pedro Luis Silva Brito", "mes": 6 },
  { "dia": "21/10", "nome": "Pietro Alves da Silva Oliveira", "mes": 10 },
  { "dia": "04/02", "nome": "Pietro Henrique Souza Rodrigues", "mes": 2 },
  { "dia": "04/05", "nome": "Rebeca Nascimento Di Carlo Barbosa Oliveira", "mes": 5 },
  { "dia": "10/04", "nome": "Renata Lima da Conceição", "mes": 4 },
  { "dia": "25/09", "nome": "Roberto Lima da Conceição", "mes": 9 },
  { "dia": "10/07", "nome": "Roniedson Silva", "mes": 7 },
  { "dia": "29/12", "nome": "Sandriene Rocha Silva", "mes": 12 },
  { "dia": "27/07", "nome": "Selina Ferreira de Brito", "mes": 7 },
  { "dia": "31/05", "nome": "Sergio Cardoso Oliveira", "mes": 5 },
  { "dia": "18/07", "nome": "Stella Mara Assumpção Nascimento", "mes": 7 },
  { "dia": "23/05", "nome": "Tatiana Santana Frezze", "mes": 5 },
  { "dia": "26/01", "nome": "Teresinha Fernandes de Oliveira Batista", "mes": 1 },
  { "dia": "15/12", "nome": "Thiago Fernandes Frezze", "mes": 12 },
  { "dia": "01/10", "nome": "Valdo Da Costa e Silva", "mes": 10 },
  { "dia": "03/07", "nome": "Vanessa Ferreira Silva Brito", "mes": 7 },
  { "dia": "28/05", "nome": "Vitor Almeida do Nascimento", "mes": 5 },
  { "dia": "17/11", "nome": "Washington De Brito Santos", "mes": 11 },
  { "dia": "08/08", "nome": "Yago Costa da Silva", "mes": 8 }
]

// --- COMPONENTES AUXILIARES (Movidos para fora do App para não perderem o foco) ---

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

const Loading = ({ texto = "Carregando...", corGiro = "text-indigo-600", corSombra = "bg-indigo-500", tamanho = "w-10 h-10", overlay = false }) => {
  const conteudo = (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative flex items-center justify-center">
        <div className={`absolute inset-0 rounded-full blur-xl opacity-40 animate-pulse ${corSombra}`}></div>
        <Loader2 className={`relative z-10 animate-spin ${tamanho} ${corGiro}`} />
      </div>
      {texto && <span className="text-slate-700 font-bold text-sm tracking-wide animate-pulse">{texto}</span>}
    </div>
  );
  if (overlay) return <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/30 backdrop-blur-md animate-in fade-in duration-300"><div className="bg-white/70 border border-white/50 p-8 rounded-[2rem] shadow-2xl flex flex-col items-center">{conteudo}</div></div>;
  return conteudo;
};

const InputClean = ({ label, name, placeholder, value, onChange }) => (
  <div className="flex flex-col">
    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 ml-1">{label}</label>
    <input 
      name={name} 
      value={value || ''} 
      onChange={onChange} 
      placeholder={placeholder} 
      className="w-full bg-white/80 border-0 shadow-inner rounded-xl px-4 py-3 text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all placeholder:text-slate-300" 
    />
  </div>
);

// --- COMPONENTE PRINCIPAL ---

export default function App() {
  const [abaAtiva, setAbaAtiva] = useState('editor'); 
  const [modalAtivo, setModalAtivo] = useState(null); 
  const [template, setTemplate] = useState('padrao'); 

  const [formData, setFormData] = useState({
    sabadoTema: '',
    sabadoPregador: '',
    domingoTema: '',
    domingoPregador: '',
    domingoLocal: '',
    quartaEstudo: '',
    quartaPregador: '',
    proximoSabadoPregador: ''
  });

  const [eventos, setEventos] = useState([]);
  const [novoEventoTexto, setNovoEventoTexto] = useState('');
  const [novoEventoData, setNovoEventoData] = useState('');
  
  const [boletim, setBoletim] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [copiado, setCopiado] = useState(false);

  useEffect(() => {
    const eventosSalvos = localStorage.getItem('boletim_eventos');
    let listaEventos = eventosSalvos ? JSON.parse(eventosSalvos) : [];
    const hoje = new Date().toISOString().split('T')[0];
    
    const eventosValidos = listaEventos.filter(ev => ev.expiracao === 'permanente' || ev.expiracao >= hoje);
    if (listaEventos.length !== eventosValidos.length || !eventosSalvos) {
      localStorage.setItem('boletim_eventos', JSON.stringify(eventosValidos));
    }
    setEventos(eventosValidos);

    const rascunho = localStorage.getItem('boletim_rascunho');
    if (rascunho) {
      setFormData(JSON.parse(rascunho));
    }
    
    const templateSalvo = localStorage.getItem('boletim_template');
    if (templateSalvo) setTemplate(templateSalvo);
  }, []);

  useEffect(() => {
    localStorage.setItem('boletim_rascunho', JSON.stringify(formData));
  }, [formData]);

  useEffect(() => {
    localStorage.setItem('boletim_template', template);
  }, [template]);

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
    setNovoEventoTexto(''); 
    setNovoEventoData('');
  };

  const handleRemoverEvento = (id) => {
    const novaLista = eventos.filter(ev => ev.id !== id);
    setEventos(novaLista);
    localStorage.setItem('boletim_eventos', JSON.stringify(novaLista));
  };

  const formatarData = (data) => data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  const adicionarDias = (data, dias) => { const n = new Date(data); n.setDate(n.getDate() + dias); return n; };
  const obterSegunda = (data) => { const d = new Date(data); const dia = d.getDay(); const diff = d.getDate() - dia + (dia === 0 ? -6 : 1); return new Date(d.setDate(diff)); };

  const buscarPorDoSol = async (dataSabado) => {
    const lat = -23.6815; 
    const lng = -46.6206;
    const dataISO = dataSabado.toISOString().split('T')[0];
    try {
      const res = await fetch(`https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lng}&date=${dataISO}&formatted=0`);
      const apiData = await res.json();
      const sunsetUtc = new Date(apiData.results.sunset);
      const horarioSP = sunsetUtc.toLocaleTimeString('pt-BR', { timeZone: 'America/Sao_Paulo', hour: '2-digit', minute: '2-digit' });
      return `\n🌥️ *Pôr do Sol - Sábado ${formatarData(dataSabado)}*\n⏰ ${horarioSP}h`;
    } catch (e) {
      return `\n🌥️ *Pôr do Sol - Sábado ${formatarData(dataSabado)}*\n⏰ 18h00 (Aprox.)`;
    }
  };

  const gerarBoletim = async () => {
    setCarregando(true); 
    setCopiado(false); 
    setAbaAtiva('resultado');
    
    const dataBase = obterSegunda(new Date());
    const datas = {
      inicio: dataBase, 
      fim: adicionarDias(dataBase, 6),
      quarta: adicionarDias(dataBase, 2), 
      sabado: adicionarDias(dataBase, 5),
      domingo: adicionarDias(dataBase, 6), 
      proximoSabado: adicionarDias(dataBase, 12)
    };

    let textoEventos = '\n';
    eventos.forEach(ev => textoEventos += `${ev.texto.replace('{DATA_DOMINGO}', formatarData(datas.domingo))}\n\n`);

    const niversMes = aniversariantesJSON.filter(p => p.mes === (dataBase.getMonth() + 1));
    let niversStr = `🟤 *Lista de Aniversariantes do mês*\n`;
    niversMes.length > 0 ? niversMes.forEach(p => niversStr += `${p.dia} - _${p.nome}_\n`) : niversStr += "Nenhum no mês.\n";

    const solStr = await buscarPorDoSol(datas.sabado);
    
    let boletimFinal = '';

    if (template === 'padrao') {
      const header = `⚠️ *Atenção para o nosso boletim!*\n\n🟡 *Cultos e programações* do dia ${formatarData(datas.inicio)} até ${formatarData(datas.fim)}\n`;
      const temaSabado = formData.sabadoTema ? `${formData.sabadoTema}\n` : '';
      const temaDomingo = formData.domingoTema ? `${formData.domingoTema}\n` : '';

      const cultos = `\n🙌 SÁBADO | ${formatarData(datas.sabado)}\n${temaSabado}_9h:_ Escola Sabatina\n_10h00:_ Culto de Adoração\nPregador(a): ${formData.sabadoPregador || 'A definir'}\n\n📖 DOMINGO | ${formatarData(datas.domingo)}\n${temaDomingo}Pregador(a): ${formData.domingoPregador || 'A definir'}\nLocal: ${formData.domingoLocal || 'A definir'}\n\n🙏 QUARTA | ${formatarData(datas.quarta)}\n_20h00:_ Culto de Oração\n_Estudo:_ ${formData.quartaEstudo || 'A definir'}\nPregador(a): ${formData.quartaPregador || 'A definir'}\n\n⏭️ Próximo Sábado | ${formatarData(datas.proximoSabado)}\nPregador(a): ${formData.proximoSabadoPregador || 'A definir'}\n`;

      boletimFinal = `${header}${cultos}${textoEventos}${niversStr}${solStr}`;

    } else if (template === 'compacto') {
      const header = `🚀 *BOLETIM SEMANAL* | _${formatarData(datas.inicio)} a ${formatarData(datas.fim)}_\n`;
      
      const temaSabado = formData.sabadoTema ? `\n${formData.sabadoTema}` : '';
      const temaDomingo = formData.domingoTema ? `\n${formData.domingoTema}` : '';
      const localDomingo = formData.domingoLocal ? `\n📍 ${formData.domingoLocal}` : '';

      const cultos = `\n*SÁBADO (${formatarData(datas.sabado)})*${temaSabado}\n⏰ 9h - Esc. Sabatina | 10h - Culto\n🎤 Resp: ${formData.sabadoPregador || 'A definir'}\n\n*DOMINGO (${formatarData(datas.domingo)})*${temaDomingo}${localDomingo}\n🎤 Resp: ${formData.domingoPregador || 'A definir'}\n\n*QUARTA (${formatarData(datas.quarta)})*\n📖 ${formData.quartaEstudo || 'A definir'}\n🎤 Resp: ${formData.quartaPregador || 'A definir'}\n\n*PRÓX. SÁBADO (${formatarData(datas.proximoSabado)})*\n🎤 Resp: ${formData.proximoSabadoPregador || 'A definir'}\n`;
      
      boletimFinal = `${header}${cultos}\n-- *AVISOS* --\n${textoEventos}-- *ANIVERSARIANTES* --\n${niversStr}${solStr}`;
    }

    setBoletim(boletimFinal);
    setCarregando(false);
  };

  const copiarTexto = () => { navigator.clipboard.writeText(boletim); setCopiado(true); };

  const formatarPreviewWhatsApp = (texto) => {
    if (!texto) return { __html: "O boletim aparecerá aqui após ser gerado." };
    const htmlFormatado = texto
      .replace(/\n/g, '<br/>')
      .replace(/\*(.*?)\*/g, '<strong>$1</strong>')
      .replace(/_(.*?)_/g, '<em>$1</em>')
      .replace(/~(.*?)~/g, '<del>$1</del>');
    return { __html: htmlFormatado };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-indigo-50 to-teal-50 pb-24 font-sans selection:bg-indigo-200">
      
      <header className="pt-10 pb-6 px-6 text-center">
        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-teal-500 tracking-tight">
          Boletim
        </h1>
        <p className="text-slate-500 text-sm mt-1">Crie informativos semanais rapidamente.</p>
      </header>

      <main className="px-4 max-w-md mx-auto">
        <div className={abaAtiva === 'editor' ? 'block animate-in fade-in' : 'hidden'}>
          
          <Card titulo="Modelo do Boletim" icone={<LayoutTemplate className="w-5 h-5 text-indigo-500" />}>
            <select
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
              className="w-full bg-white/80 border-0 shadow-inner rounded-xl px-4 py-3 text-slate-700 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all appearance-none cursor-pointer"
            >
              <option value="padrao">🌟 Padrão (Completo)</option>
              <option value="compacto">📱 Compacto (Direto ao ponto)</option>
            </select>
          </Card>

          <Card titulo="Sábado" icone={<CalendarDays className="w-5 h-5 text-indigo-500" />}>
            <div className="flex gap-2">
              <div className="flex-1">
                <InputClean label="Pregador" name="sabadoPregador" value={formData.sabadoPregador} onChange={handleInputChange} placeholder="Ex: Victor Matheus" />
              </div>
              <button onClick={() => setModalAtivo('sabado')} className="mt-5 bg-white shadow-sm border border-slate-200 text-slate-600 rounded-xl w-12 flex items-center justify-center hover:bg-slate-50 active:scale-95 transition-all">
                <Settings2 className="w-5 h-5" />
              </button>
            </div>
          </Card>

          <Card titulo="Domingo" icone={<BookOpen className="w-5 h-5 text-indigo-500" />}>
            <div className="flex gap-2">
              <div className="flex-1">
                <InputClean label="Pregador" name="domingoPregador" value={formData.domingoPregador} onChange={handleInputChange} placeholder="Ex: Luís Gonçalves" />
              </div>
              <button onClick={() => setModalAtivo('domingo')} className="mt-5 bg-white shadow-sm border border-slate-200 text-slate-600 rounded-xl w-12 flex items-center justify-center hover:bg-slate-50 active:scale-95 transition-all">
                <Settings2 className="w-5 h-5" />
              </button>
            </div>
          </Card>

          <Card titulo="Quarta-feira" icone={<Heart className="w-5 h-5 text-indigo-500" />}>
            <div className="flex gap-2">
              <div className="flex-1">
                <InputClean label="Pregador" name="quartaPregador" value={formData.quartaPregador} onChange={handleInputChange} placeholder="Ex: Pr. Peduti" />
              </div>
              <button onClick={() => setModalAtivo('quarta')} className="mt-5 bg-white shadow-sm border border-slate-200 text-slate-600 rounded-xl w-12 flex items-center justify-center hover:bg-slate-50 active:scale-95 transition-all">
                <Settings2 className="w-5 h-5" />
              </button>
            </div>
          </Card>

          <Card titulo="Próximo Sábado" icone={<SkipForward className="w-5 h-5 text-indigo-500" />}>
            <InputClean label="Pregador" name="proximoSabadoPregador" value={formData.proximoSabadoPregador} onChange={handleInputChange} placeholder="Ex: Wellington IASD" />
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
            <div 
              className="whitespace-pre-wrap text-[13px] text-slate-700 font-sans leading-relaxed bg-slate-50/50 p-4 rounded-2xl border border-slate-100 [&>strong]:font-bold [&>strong]:text-slate-900 [&>em]:italic"
              dangerouslySetInnerHTML={formatarPreviewWhatsApp(boletim)}
            />
          </div>
        </div>
      </main>

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
                  <textarea 
                    name={`${modalAtivo}Tema`} 
                    value={formData[`${modalAtivo}Tema`] || ''} 
                    onChange={handleInputChange} 
                    rows={3} 
                    placeholder={
                      modalAtivo === 'sabado' 
                        ? "Ex: *Programação Especial*\n_Dia mundial dos Desbravadores_" 
                        : "Ex: *Fim de Semana de Evangelismo*\n*NÃO HAVERÁ CULTO NA IGREJA LOCAL*"
                    }
                    className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none text-sm transition-all placeholder:text-slate-400" 
                  />
                </div>
              )}
              {modalAtivo === 'domingo' && (
                <InputClean label="Localização" name="domingoLocal" value={formData.domingoLocal} onChange={handleInputChange} placeholder="Ex: IASD Central Diadema" />
              )}
              {modalAtivo === 'quarta' && (
                <InputClean label="Livro/Estudo" name="quartaEstudo" value={formData.quartaEstudo} onChange={handleInputChange} placeholder="Ex: Livro Oração" />
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
          texto="Buscando pôr do sol..." 
          corGiro="text-teal-500" 
          corSombra="bg-teal-400" 
        />
      )}
    </div>
  );
}