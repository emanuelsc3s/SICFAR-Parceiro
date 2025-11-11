import jsPDF from 'jspdf';
import { LucideIcon } from 'lucide-react';

interface Beneficio {
  id: string;
  title: string;
  description: string;
  value: string;
  icon?: LucideIcon;
}

interface FormData {
  justificativa: string;
  urgencia: string;
  informacoesAdicionais: string;
}

interface VoucherData {
  voucherNumber: string;
  beneficios: Beneficio[];
  formData: FormData;
  qrCodeUrl: string;
  colaborador?: {
    nome: string;
    matricula: string;
    email: string;
  };
}

/**
 * Gera um PDF do voucher de benefício
 * @param data Dados do voucher
 * @returns PDF em formato base64
 */
export const generateVoucherPDF = (data: VoucherData): string => {
  const { voucherNumber, beneficios, formData, qrCodeUrl, colaborador } = data;
  
  // Cria um novo documento PDF (A4)
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  let yPosition = margin;

  // Cores do tema
  const primaryBlue = '#1E3A8A';
  const lightBlue = '#3B82F6';
  const bgBlue = '#EFF6FF';

  // ===== HEADER =====
  // Fundo azul do header
  doc.setFillColor(30, 58, 138); // #1E3A8A
  doc.rect(0, 0, pageWidth, 40, 'F');

  // Título
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('Voucher Gerado', pageWidth / 2, 15, { align: 'center' });

  // Subtítulo
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('Farmace Benefícios', pageWidth / 2, 23, { align: 'center' });

  // Data de geração
  doc.setFontSize(9);
  const dataGeracao = new Date().toLocaleDateString('pt-BR');
  doc.text(`Data de geração: ${dataGeracao}`, pageWidth - margin, 15, { align: 'right' });

  yPosition = 50;

  // ===== MENSAGEM DE PARABÉNS =====
  doc.setTextColor(31, 41, 55); // #1F2937
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Parabéns! Seu voucher foi aprovado!', pageWidth / 2, yPosition, { align: 'center' });
  
  yPosition += 8;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Utilize as informações abaixo para resgatar seus benefícios', pageWidth / 2, yPosition, { align: 'center' });

  yPosition += 15;

  // ===== CARD PRINCIPAL DO VOUCHER =====
  // Fundo azul claro
  doc.setFillColor(239, 246, 255); // #EFF6FF
  doc.setDrawColor(59, 130, 246); // #3B82F6
  doc.setLineWidth(0.5);
  doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, 55, 3, 3, 'FD');

  // Número do Voucher
  yPosition += 8;
  doc.setTextColor(107, 114, 128); // #6B7280
  doc.setFontSize(8);
  doc.text('Número do Voucher', margin + 5, yPosition);
  
  yPosition += 7;
  doc.setTextColor(30, 58, 138); // #1E3A8A
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(voucherNumber, margin + 5, yPosition);

  // QR Code (se disponível)
  if (qrCodeUrl) {
    try {
      const qrSize = 35;
      const qrX = pageWidth - margin - qrSize - 5;
      const qrY = yPosition - 5;
      
      // Fundo branco para o QR Code
      doc.setFillColor(255, 255, 255);
      doc.roundedRect(qrX - 2, qrY - 2, qrSize + 4, qrSize + 4, 2, 2, 'F');
      
      doc.addImage(qrCodeUrl, 'PNG', qrX, qrY, qrSize, qrSize);
      
      // Texto abaixo do QR Code
      doc.setFontSize(7);
      doc.setTextColor(107, 114, 128);
      doc.setFont('helvetica', 'normal');
      doc.text('Escaneie para validar', qrX + qrSize / 2, qrY + qrSize + 4, { align: 'center' });
    } catch (error) {
      console.error('Erro ao adicionar QR Code ao PDF:', error);
    }
  }

  // Informações do voucher
  yPosition += 10;
  doc.setFontSize(9);
  doc.setTextColor(107, 114, 128);
  doc.setFont('helvetica', 'normal');
  
  doc.text(`Benefícios: ${beneficios.length}`, margin + 5, yPosition);
  yPosition += 5;
  
  // Status
  doc.text('Status: ', margin + 5, yPosition);
  doc.setTextColor(6, 95, 70); // Verde escuro
  doc.setFont('helvetica', 'bold');
  doc.text('Aprovado', margin + 5 + doc.getTextWidth('Status: '), yPosition);
  
  yPosition += 5;
  doc.setTextColor(107, 114, 128);
  doc.setFont('helvetica', 'normal');
  
  // Validade
  const dataValidade = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR');
  doc.text(`Validade: ${dataValidade}`, margin + 5, yPosition);

  yPosition += 20;

  // ===== BENEFÍCIOS APROVADOS =====
  doc.setTextColor(31, 41, 55);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Benefícios Aprovados', margin, yPosition);
  
  yPosition += 8;

  // Lista de benefícios
  beneficios.forEach((beneficio, index) => {
    // Verifica se precisa de nova página
    if (yPosition > pageHeight - 40) {
      doc.addPage();
      yPosition = margin;
    }

    // Fundo cinza claro para cada benefício
    doc.setFillColor(249, 250, 251); // #F9FAFB
    doc.setDrawColor(30, 58, 138);
    doc.setLineWidth(0.3);
    doc.roundedRect(margin, yPosition - 4, pageWidth - 2 * margin, 12, 2, 2, 'FD');

    // Nome do benefício
    doc.setTextColor(31, 41, 55);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(beneficio.title, margin + 3, yPosition);

    // Valor
    doc.setTextColor(59, 130, 246);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(beneficio.value, pageWidth - margin - 3, yPosition, { align: 'right' });

    // Descrição
    yPosition += 5;
    doc.setTextColor(107, 114, 128);
    doc.setFontSize(8);
    doc.text(beneficio.description, margin + 3, yPosition);

    yPosition += 10;
  });

  // ===== DETALHES DA SOLICITAÇÃO =====
  if (formData.justificativa || formData.urgencia || formData.informacoesAdicionais) {
    yPosition += 5;

    // Verifica se precisa de nova página
    if (yPosition > pageHeight - 60) {
      doc.addPage();
      yPosition = margin;
    }

    // Linha divisória
    doc.setDrawColor(229, 231, 235);
    doc.setLineWidth(0.3);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    
    yPosition += 8;

    doc.setTextColor(31, 41, 55);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Detalhes da Solicitação', margin, yPosition);
    
    yPosition += 8;

    // Urgência
    if (formData.urgencia) {
      doc.setFontSize(9);
      doc.setTextColor(107, 114, 128);
      doc.setFont('helvetica', 'bold');
      doc.text('Urgência:', margin, yPosition);
      
      doc.setFont('helvetica', 'normal');
      doc.text(formData.urgencia, margin + 20, yPosition);
      yPosition += 6;
    }

    // Data
    doc.setFont('helvetica', 'bold');
    doc.text('Data:', margin, yPosition);
    doc.setFont('helvetica', 'normal');
    doc.text(dataGeracao, margin + 20, yPosition);
    yPosition += 8;

    // Justificativa
    if (formData.justificativa) {
      doc.setFont('helvetica', 'bold');
      doc.text('Justificativa:', margin, yPosition);
      yPosition += 5;
      
      doc.setFont('helvetica', 'normal');
      const justificativaLines = doc.splitTextToSize(formData.justificativa, pageWidth - 2 * margin - 5);
      doc.text(justificativaLines, margin + 3, yPosition);
      yPosition += justificativaLines.length * 5 + 3;
    }

    // Informações Adicionais
    if (formData.informacoesAdicionais) {
      doc.setFont('helvetica', 'bold');
      doc.text('Informações Adicionais:', margin, yPosition);
      yPosition += 5;
      
      doc.setFont('helvetica', 'normal');
      const infoLines = doc.splitTextToSize(formData.informacoesAdicionais, pageWidth - 2 * margin - 5);
      doc.text(infoLines, margin + 3, yPosition);
      yPosition += infoLines.length * 5;
    }
  }

  // ===== FOOTER =====
  const footerY = pageHeight - 20;
  
  // Linha divisória
  doc.setDrawColor(229, 231, 235);
  doc.setLineWidth(0.3);
  doc.line(margin, footerY, pageWidth - margin, footerY);

  // Texto do footer
  doc.setTextColor(107, 114, 128);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('Este voucher é válido apenas para os benefícios listados acima.', pageWidth / 2, footerY + 5, { align: 'center' });
  doc.text(`© ${new Date().getFullYear()} Farmace Benefícios - SICFAR RH`, pageWidth / 2, footerY + 10, { align: 'center' });

  // Retorna o PDF em base64
  return doc.output('dataurlstring');
};

