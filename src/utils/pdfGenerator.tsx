import { Document, Image, Page, StyleSheet, Text, View, pdf } from '@react-pdf/renderer';
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

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#F3F4F6',
    padding: 24,
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: '#111827'
  },
  header: {
    backgroundColor: '#1E3A8A',
    padding: 16,
    borderRadius: 10
  },
  headerTitle: {
    fontSize: 22,
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: 'bold'
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#DBEAFE',
    textAlign: 'center',
    marginTop: 4
  },
  headerMeta: {
    fontSize: 9,
    color: '#E5E7EB',
    textAlign: 'center',
    marginTop: 4
  },
  messageBox: {
    marginTop: 16,
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB'
  },
  messageTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#111827'
  },
  messageSubtitle: {
    fontSize: 10,
    textAlign: 'center',
    color: '#4B5563',
    marginTop: 4
  },
  card: {
    marginTop: 12,
    backgroundColor: '#EFF6FF',
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#3B82F6'
  },
  label: {
    fontSize: 9,
    color: '#6B7280'
  },
  voucherNumber: {
    fontSize: 22,
    color: '#1E3A8A',
    fontWeight: 'bold',
    marginTop: 4
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    flexWrap: 'wrap'
  },
  tag: {
    fontSize: 9,
    color: '#065F46',
    backgroundColor: '#D1FAE5',
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 4,
    paddingBottom: 4,
    borderRadius: 6,
    fontWeight: 'bold',
    marginRight: 8,
    marginBottom: 6
  },
  metaText: {
    fontSize: 9,
    color: '#4B5563',
    marginRight: 10,
    marginBottom: 6
  },
  qrRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12
  },
  qrWrapper: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    padding: 6,
    alignItems: 'center',
    justifyContent: 'center'
  },
  qr: {
    width: 80,
    height: 80
  },
  qrCaption: {
    fontSize: 8,
    color: '#6B7280',
    marginTop: 4,
    textAlign: 'center'
  },
  section: {
    marginTop: 14,
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB'
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8
  },
  benefitItem: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    backgroundColor: '#F9FAFB'
  },
  benefitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  benefitTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#111827',
    marginRight: 12
  },
  benefitValue: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#2563EB'
  },
  benefitDescription: {
    fontSize: 9,
    color: '#4B5563',
    marginTop: 4,
    lineHeight: 1.4
  },
  detailBlock: {
    marginTop: 8
  },
  detailLabel: {
    fontSize: 9,
    color: '#6B7280',
    fontWeight: 'bold'
  },
  detailText: {
    fontSize: 9,
    color: '#111827',
    marginTop: 2,
    lineHeight: 1.4
  },
  footer: {
    marginTop: 18,
    borderTopWidth: 1,
    borderColor: '#E5E7EB',
    paddingTop: 8,
    alignItems: 'center'
  },
  footerText: {
    fontSize: 8,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 2
  }
});

interface VoucherDocumentProps {
  data: VoucherData;
  dataGeracao: string;
  dataValidade: string;
}

const VoucherDocument = ({ data, dataGeracao, dataValidade }: VoucherDocumentProps) => {
  const { voucherNumber, beneficios, formData, qrCodeUrl, colaborador } = data;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header} fixed>
          <Text style={styles.headerTitle}>Voucher Gerado</Text>
          <Text style={styles.headerSubtitle}>Farmace Benefícios</Text>
          <Text style={styles.headerMeta}>Data de geração: {dataGeracao}</Text>
          {colaborador?.nome && (
            <Text style={styles.headerMeta}>
              {`Colaborador: ${colaborador.nome}${colaborador.matricula ? ` • Matrícula: ${colaborador.matricula}` : ''}`}
            </Text>
          )}
        </View>

        <View style={styles.messageBox}>
          <Text style={styles.messageTitle}>Parabéns! Seu voucher foi aprovado!</Text>
          <Text style={styles.messageSubtitle}>Utilize as informações abaixo para resgatar seus benefícios</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Número do Voucher</Text>
          <Text style={styles.voucherNumber}>{voucherNumber}</Text>

          <View style={styles.metaRow}>
            <Text style={styles.tag}>Aprovado</Text>
            <Text style={styles.metaText}>Benefícios: {beneficios.length}</Text>
            <Text style={styles.metaText}>Validade: {dataValidade}</Text>
          </View>

          {qrCodeUrl ? (
            <View style={styles.qrRow}>
              <View style={styles.qrWrapper}>
                <Image src={qrCodeUrl} style={styles.qr} />
                <Text style={styles.qrCaption}>Escaneie para validar</Text>
              </View>
              <View style={{ marginLeft: 12, flex: 1 }}>
                <Text style={styles.metaText}>Apresente este QR Code para validação e resgate.</Text>
                <Text style={styles.metaText}>Número do voucher: {voucherNumber}</Text>
              </View>
            </View>
          ) : null}
        </View>

        <View style={styles.section} wrap>
          <Text style={styles.sectionTitle}>Benefícios Aprovados</Text>
          {beneficios.map((beneficio, index) => (
            <View key={`${beneficio.id}-${index}`} style={styles.benefitItem}>
              <View style={styles.benefitHeader}>
                <Text style={styles.benefitTitle}>{beneficio.title}</Text>
                <Text style={styles.benefitValue}>{beneficio.value}</Text>
              </View>
              <Text style={styles.benefitDescription}>{beneficio.description}</Text>
            </View>
          ))}
          {beneficios.length === 0 ? <Text style={styles.metaText}>Nenhum benefício selecionado.</Text> : null}
        </View>

        {(formData.justificativa || formData.urgencia || formData.informacoesAdicionais) && (
          <View style={styles.section} wrap>
            <Text style={styles.sectionTitle}>Detalhes da Solicitação</Text>

            <View style={styles.detailBlock}>
              <Text style={styles.detailLabel}>Data</Text>
              <Text style={styles.detailText}>{dataGeracao}</Text>
            </View>

            {formData.urgencia ? (
              <View style={styles.detailBlock}>
                <Text style={styles.detailLabel}>Urgência</Text>
                <Text style={styles.detailText}>{formData.urgencia}</Text>
              </View>
            ) : null}

            {formData.justificativa ? (
              <View style={styles.detailBlock}>
                <Text style={styles.detailLabel}>Justificativa</Text>
                <Text style={styles.detailText}>{formData.justificativa}</Text>
              </View>
            ) : null}

            {formData.informacoesAdicionais ? (
              <View style={styles.detailBlock}>
                <Text style={styles.detailLabel}>Informações Adicionais</Text>
                <Text style={styles.detailText}>{formData.informacoesAdicionais}</Text>
              </View>
            ) : null}
          </View>
        )}

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>Este voucher é válido apenas para os benefícios listados acima.</Text>
          <Text style={styles.footerText}>© {new Date().getFullYear()} Farmace Benefícios - SICFAR RH</Text>
        </View>
      </Page>
    </Document>
  );
};

const blobToBase64 = async (blob: Blob): Promise<string> => {
  const buffer = await blob.arrayBuffer();

  if (typeof Buffer !== 'undefined') {
    const base64 = Buffer.from(buffer).toString('base64');
    return `data:application/pdf;base64,${base64}`;
  }

  const bytes = new Uint8Array(buffer);
  let binary = '';
  const chunkSize = 0x8000; // evita estouro de call stack para PDFs maiores

  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }

  const base64 = btoa(binary);
  return `data:application/pdf;base64,${base64}`;
};

/**
 * Gera um PDF do voucher de benefício em formato base64 usando @react-pdf/renderer
 * @param data Dados do voucher
 * @returns PDF em data URL base64
 */
export const generateVoucherPDF = async (data: VoucherData): Promise<string> => {
  const dataGeracao = new Date().toLocaleDateString('pt-BR');
  const dataValidade = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR');

  const document = <VoucherDocument data={data} dataGeracao={dataGeracao} dataValidade={dataValidade} />;
  const pdfInstance = pdf(document);
  const pdfBlob = await pdfInstance.toBlob();

  return blobToBase64(pdfBlob);
};
