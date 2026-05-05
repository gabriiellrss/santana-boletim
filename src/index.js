import fs from 'fs/promises';

// --- Funções Auxiliares de Data ---
// Formata a data para DD/MM
const formatarData = (data) => {
    return data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
};

// Descobre qual é a segunda-feira da semana da data fornecida
const obterSegundaFeiraDaSemana = (data) => {
    const dataClone = new Date(data);
    const diaDaSemana = dataClone.getDay(); // Retorna de 0 (Domingo) a 6 (Sábado)
    
    // Se hoje for domingo (0), volta 6 dias. Senão, volta os dias até chegar em 1 (segunda)
    const diferenca = dataClone.getDate() - diaDaSemana + (diaDaSemana === 0 ? -6 : 1);
    
    return new Date(dataClone.setDate(diferenca));
};

// Adiciona dias a uma data base
const adicionarDias = (data, dias) => {
    const novaData = new Date(data);
    novaData.setDate(novaData.getDate() + dias);
    return novaData;
};

// --- Funções Principais do Boletim ---[cite: 1]

function HeaderBoletim(dataInicio, dataFim) {
    return `⚠️ *Atenção para o nosso boletim!*\n\n🟡 *Cultos e programações* do dia ${formatarData(dataInicio)} até ${formatarData(dataFim)}\n`;
}

function CultosBoletim(datas, inputs) {
    let cultos = `🙌 SÁBADO | ${formatarData(datas.sabado)}\n`;
    cultos += `${inputs.sabado.tema}\n`;
    cultos += `_9h:_ Escola Sabatina\n_10h00:_ Culto de Adoração\nPregador(a): ${inputs.sabado.pregador}\n\n`;

    cultos += `📖 DOMINGO | ${formatarData(datas.domingo)}\n`;
    cultos += `${inputs.domingo.tema}\n`;
    cultos += `Pregador(a): ${inputs.domingo.pregador}\nLocal: ${inputs.domingo.local}\n\n`;

    cultos += `🙏 QUARTA | ${formatarData(datas.quarta)}\n`;
    cultos += `_20h00:_ Culto de Oração\n_Estudo:_ ${inputs.quarta.estudo}\nPregador(a): ${inputs.quarta.pregador}\n\n`;

    cultos += `⏭️ Próximo Sábado | ${formatarData(datas.proximoSabado)}\n`;
    cultos += `Pregador(a): ${inputs.proximoSabado.pregador}\n`;

    return cultos;
}

async function addEventos(datas) {
    try {
        const fileContent = await fs.readFile('./eventos.json', 'utf-8');
        const eventos = JSON.parse(fileContent);
        
        // Substitui a tag dinâmica pela data do domingo atual
        const classeBiblicaFormatada = eventos.classeBiblica.replace('{DATA_DOMINGO}', formatarData(datas.domingo));

        return `\n${eventos.evangelismo}\n\n${classeBiblicaFormatada}\n\n${eventos.escolaSabatina}\n\n${eventos.recolta}\n\n${eventos.pgs}\n`;
    } catch (error) {
        return "\n[Erro ao carregar eventos. Verifique o arquivo eventos.json]\n";
    }
}

async function aniversariantes(mesAtual) {
    try {
        const fileContent = await fs.readFile('./aniversariantes.json', 'utf-8');
        const lista = JSON.parse(fileContent);
        
        const aniversariantesDoMes = lista.filter(pessoa => pessoa.mes === mesAtual);
        
        let retorno = `\n🟤 *Lista de Aniversariantes do mês*\n`;
        aniversariantesDoMes.forEach(p => {
            retorno += `${p.dia} - _${p.nome}_\n`;
        });
        
        return retorno;
    } catch (error) {
        return "\n[Erro ao carregar aniversariantes]\n";
    }
}

async function porDoSol(dataSabado) {
    // Coordenadas de Diadema, SP
    const lat = -23.6815;
    const lng = -46.6206;
    // Formato de data YYYY-MM-DD para a API
    const dataISO = dataSabado.toISOString().split('T')[0];

    try {
        // API gratuita do Sunrise-Sunset
        const response = await fetch(`https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lng}&date=${dataISO}&formatted=0`);
        const data = await response.json();
        
        // A API retorna em UTC, precisamos converter para o fuso horário de SP
        const sunsetUtc = new Date(data.results.sunset);
        const horarioSP = sunsetUtc.toLocaleTimeString('pt-BR', { timeZone: 'America/Sao_Paulo', hour: '2-digit', minute: '2-digit' });
        
        return `\n🌥️ *Pôr do Sol - Sábado  ${formatarData(dataSabado)}*\n⏰ ${horarioSP}h`;
    } catch (error) {
        return `\n🌥️ *Pôr do Sol - Sábado  ${formatarData(dataSabado)}*\n⏰ Erro ao buscar horário`;
    }
}

// --- Orquestrador Principal ---[cite: 1]

export default async function Main(inputs) {
    // 1. Pega a data de "hoje" (ou a data que o usuário quiser testar)
    // Se inputs.dataHoje não existir, usa a data exata do sistema no momento (new Date())
    const dataAtual = inputs.dataHoje ? new Date(inputs.dataHoje) : new Date(); 
    
    // 2. Trava a "dataBase" na segunda-feira daquela semana
    const dataBase = obterSegundaFeiraDaSemana(dataAtual);
    const mesAtual = dataBase.getMonth() + 1;
    
    // 3. Calcula todos os outros dias somando a partir da segunda-feira
    const datas = {
        inicio: dataBase,                               // Segunda-feira (Ex: 11/05)
        fim: adicionarDias(dataBase, 6),                // Domingo (Ex: 17/05)
        quarta: adicionarDias(dataBase, 2),             // Quarta-feira (Ex: 13/05)
        sabado: adicionarDias(dataBase, 5),             // Sábado (Ex: 16/05)
        domingo: adicionarDias(dataBase, 6),            // Domingo (Ex: 17/05)
        proximoSabado: adicionarDias(dataBase, 12)      // Próximo Sábado (Ex: 23/05)
    };

    // 2. Gera cada bloco do boletim (mantemos a mesma lógica anterior)
    const headerStr = HeaderBoletim(datas.inicio, datas.fim);
    const cultosStr = CultosBoletim(datas, inputs);
    const eventosStr = await addEventos(datas);
    const niverStr = await aniversariantes(mesAtual);
    const solStr = await porDoSol(datas.sabado);

    // 3. Junta tudo e retorna o boletim final
    return `${headerStr}\n${cultosStr}${eventosStr}${niverStr}\n${solStr}`;
}

// --- Testando a Execução ---
const userInput = {
    // dataHoje: "2026-05-13T12:00:00", // DESCOMENTE PARA FORÇAR UM TESTE NO DIA 13/05. 
                                        // Se deixar comentado, ele usa a data real de hoje automaticamente!
    sabado: {
        tema: "*Programação Especial*\n_Dia mundial dos Desbravadores_",
        pregador: "Victor Matheus IASD Diadema"
    },
    domingo: {
        tema: "*Fim de Semana de Evangelismo com Luís Gonçalves*\n*NÂO HAVERÁ CULTO NA IGREJA LOCAL*",
        pregador: "Luís Gonçalves",
        local: "IASD Central Diadema"
    },
    quarta: {
        estudo: "Livro Oração",
        pregador: "Pr. Peduti"
    },
    proximoSabado: {
        pregador: "Wellington IASD Diadema"
    }
};

// Executa e imprime no console
Main(userInput).then(boletim => console.log(boletim));
// --- Testando a Execução ---
const userInput = {
    dataInicio: "2026-09-14", // Segunda-feira da semana desejada
    sabado: {
        tema: "*Programação Especial*\n_Dia mundial dos Desbravadores_",
        pregador: "Victor Matheus IASD Diadema"
    },
    domingo: {
        tema: "*Fim de Semana de Evangelismo com Luís Gonçalves*\n*NÂO HAVERÁ CULTO NA IGREJA LOCAL*",
        pregador: "Luís Gonçalves",
        local: "IASD Central Diadema"
    },
    quarta: {
        estudo: "Livro Oração",
        pregador: "Pr. Peduti"
    },
    proximoSabado: {
        pregador: "Wellington IASD Diadema"
    }
};

// Executa e imprime no console
Main(userInput).then(boletim => console.log(boletim));