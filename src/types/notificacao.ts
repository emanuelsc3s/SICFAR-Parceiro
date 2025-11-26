// Interface para notificações de solicitações de autoatendimento
export interface NotificacaoSolicitacao {
  id: string;
  matricula: string;
  colaborador: string;
  solicitacao: 'Férias' | 'Atestado Médico' | 'Declaração' | 'Alteração de Dados' | 'Saída Antecipada' | 'Transferência' | 'Mudança de Horário' | 'Vale-Transporte' | 'Benefícios';
  status: 'Aprovada' | 'Pendente' | 'Rejeitada';
  datasolicitacao: string;
  lida: boolean;
  // Campos para avaliação do RH
  setor?: string;
  cargo?: string;
  descricaoSolicitacao?: string;
  justificativaAvaliacao?: string;
  avaliadorNome?: string;
  dataAvaliacao?: string;
}

// Função para gerar notificações de exemplo
export const gerarNotificacoesExemplo = (): NotificacaoSolicitacao[] => {
  return [
    {
      id: '1',
      matricula: '001234',
      colaborador: 'Emanuel Silva',
      solicitacao: 'Férias',
      status: 'Aprovada',
      datasolicitacao: '2024-01-15',
      lida: false,
      setor: 'Tecnologia da Informação',
      cargo: 'Gerente de TI',
      descricaoSolicitacao: 'Férias de 30 dias a partir de 01/02/2024',
      justificativaAvaliacao: 'Aprovado conforme planejamento de férias da equipe',
      avaliadorNome: 'Ricardo Mendes',
      dataAvaliacao: '2024-01-16'
    },
    {
      id: '2',
      matricula: '001235',
      colaborador: 'Maria Santos',
      solicitacao: 'Atestado Médico',
      status: 'Pendente',
      datasolicitacao: '2024-01-18',
      lida: false,
      setor: 'Recursos Humanos',
      cargo: 'Analista de RH',
      descricaoSolicitacao: 'Atestado médico de 3 dias por motivo de consulta'
    },
    {
      id: '3',
      matricula: '001236',
      colaborador: 'João Oliveira',
      solicitacao: 'Saída Antecipada',
      status: 'Aprovada',
      datasolicitacao: '2024-01-20',
      lida: true,
      setor: 'Financeiro',
      cargo: 'Contador',
      descricaoSolicitacao: 'Saída às 15h para consulta médica',
      justificativaAvaliacao: 'Aprovado mediante apresentação de comprovante',
      avaliadorNome: 'Ana Beatriz',
      dataAvaliacao: '2024-01-20'
    },
    {
      id: '4',
      matricula: '001237',
      colaborador: 'Ana Costa',
      solicitacao: 'Transferência',
      status: 'Pendente',
      datasolicitacao: '2024-01-22',
      lida: false,
      setor: 'Vendas',
      cargo: 'Vendedora',
      descricaoSolicitacao: 'Transferência para filial Centro - motivo pessoal'
    },
    {
      id: '5',
      matricula: '001238',
      colaborador: 'Carlos Pereira',
      solicitacao: 'Mudança de Horário',
      status: 'Rejeitada',
      datasolicitacao: '2024-01-23',
      lida: true,
      setor: 'Produção',
      cargo: 'Operador',
      descricaoSolicitacao: 'Mudança do turno noturno para diurno',
      justificativaAvaliacao: 'Rejeitado devido à necessidade operacional do turno noturno',
      avaliadorNome: 'Marcos Silva',
      dataAvaliacao: '2024-01-24'
    },
    {
      id: '6',
      matricula: '001239',
      colaborador: 'Juliana Alves',
      solicitacao: 'Declaração',
      status: 'Aprovada',
      datasolicitacao: '2024-01-24',
      lida: false,
      setor: 'Administrativo',
      cargo: 'Assistente Administrativo',
      descricaoSolicitacao: 'Declaração de vínculo empregatício para financiamento',
      justificativaAvaliacao: 'Declaração emitida conforme solicitação',
      avaliadorNome: 'Carla Dias',
      dataAvaliacao: '2024-01-24'
    },
    {
      id: '7',
      matricula: '001240',
      colaborador: 'Roberto Lima',
      solicitacao: 'Benefícios',
      status: 'Pendente',
      datasolicitacao: '2024-01-25',
      lida: false,
      setor: 'Logística',
      cargo: 'Motorista',
      descricaoSolicitacao: 'Inclusão de dependente no plano de saúde'
    },
    {
      id: '8',
      matricula: '001241',
      colaborador: 'Fernanda Souza',
      solicitacao: 'Alteração de Dados',
      status: 'Aprovada',
      datasolicitacao: '2024-01-26',
      lida: true,
      setor: 'Marketing',
      cargo: 'Designer',
      descricaoSolicitacao: 'Atualização de endereço residencial',
      justificativaAvaliacao: 'Dados atualizados no sistema',
      avaliadorNome: 'Paula Ribeiro',
      dataAvaliacao: '2024-01-26'
    },
    {
      id: '9',
      matricula: '001242',
      colaborador: 'Paulo Rodrigues',
      solicitacao: 'Vale-Transporte',
      status: 'Pendente',
      datasolicitacao: '2024-01-27',
      lida: false,
      setor: 'Atendimento',
      cargo: 'Atendente',
      descricaoSolicitacao: 'Alteração de vale-transporte por mudança de endereço'
    },
    {
      id: '10',
      matricula: '001243',
      colaborador: 'Beatriz Martins',
      solicitacao: 'Férias',
      status: 'Rejeitada',
      datasolicitacao: '2024-01-28',
      lida: false,
      setor: 'Qualidade',
      cargo: 'Analista de Qualidade',
      descricaoSolicitacao: 'Férias de 15 dias a partir de 05/02/2024',
      justificativaAvaliacao: 'Período solicitado conflita com auditoria programada',
      avaliadorNome: 'Fernando Costa',
      dataAvaliacao: '2024-01-29'
    }
  ];
};

