import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Carrega variáveis de ambiente
dotenv.config();

const app = express();
const PORT = process.env.BACKEND_PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Aumenta o limite para aceitar PDFs em base64

// Configuração do transporter do nodemailer
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_API_HOST,
  port: parseInt(process.env.EMAIL_API_PORTA),
  secure: true, // true para porta 465
  auth: {
    user: process.env.EMAIL_API_USER,
    pass: process.env.EMAIL_API_SENHA,
  },
});

// Verifica a conexão SMTP ao iniciar o servidor
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Erro na configuração SMTP:', error.message);
    console.log('⚠️  O servidor continuará funcionando, mas emails podem falhar.');
    console.log('💡 Verifique as credenciais SMTP no arquivo .env');
  } else {
    console.log('✅ Servidor SMTP pronto para enviar emails');
  }
});

// Endpoint de health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Servidor de email está funcionando' });
});

// Endpoint para envio de email com voucher
app.post('/api/send-voucher-email', async (req, res) => {
  try {
    const { 
      destinatario, 
      nomeDestinatario,
      voucherNumber, 
      beneficios, 
      pdfBase64,
      formData 
    } = req.body;

    // Validações
    if (!destinatario || !voucherNumber || !pdfBase64) {
      return res.status(400).json({ 
        success: false, 
        message: 'Dados incompletos. Necessário: destinatario, voucherNumber e pdfBase64' 
      });
    }

    // Template HTML do email
    const htmlTemplate = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Voucher de Benefício Gerado</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Inter', Arial, sans-serif; background-color: #f3f4f6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 20px;">
    <tr>
      <td align="center">
        <!-- Container principal -->
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <!-- Header azul -->
          <tr>
            <td style="background: linear-gradient(to right, #1E3A8A, #2563EB); padding: 40px 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">
                🎉 Voucher Gerado com Sucesso!
              </h1>
              <p style="color: #BFDBFE; margin: 10px 0 0 0; font-size: 16px;">
                Farmace Benefícios
              </p>
            </td>
          </tr>

          <!-- Conteúdo -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="color: #1F2937; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Olá <strong>${nomeDestinatario || 'Colaborador'}</strong>,
              </p>
              
              <p style="color: #1F2937; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Seu voucher de benefício foi gerado com sucesso! 🎊
              </p>

              <!-- Card de informações do voucher -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(to right, #EFF6FF, #DBEAFE); border: 2px solid #3B82F6; border-radius: 8px; margin: 30px 0;">
                <tr>
                  <td style="padding: 25px;">
                    <p style="color: #6B7280; font-size: 12px; margin: 0 0 5px 0;">
                      Número do Voucher
                    </p>
                    <p style="color: #1E3A8A; font-size: 24px; font-weight: bold; margin: 0 0 15px 0;">
                      ${voucherNumber}
                    </p>
                    
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="color: #6B7280; font-size: 14px; padding: 5px 0;">
                          <strong>Benefícios:</strong> ${beneficios?.length || 0} item(ns)
                        </td>
                      </tr>
                      <tr>
                        <td style="color: #6B7280; font-size: 14px; padding: 5px 0;">
                          <strong>Status:</strong> <span style="background-color: #D1FAE5; color: #065F46; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600;">Aprovado</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="color: #6B7280; font-size: 14px; padding: 5px 0;">
                          <strong>Data de geração:</strong> ${new Date().toLocaleDateString('pt-BR')}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <p style="color: #1F2937; font-size: 16px; line-height: 1.6; margin: 20px 0;">
                O voucher em PDF está anexado a este email. Você pode imprimi-lo ou apresentá-lo digitalmente nos estabelecimentos parceiros.
              </p>

              <!-- Instruções -->
              <div style="background-color: #FEF3C7; border-left: 4px solid #F59E0B; padding: 15px; margin: 20px 0; border-radius: 4px;">
                <p style="color: #92400E; font-size: 14px; margin: 0; line-height: 1.6;">
                  <strong>📌 Importante:</strong> Guarde este voucher com segurança. Ele será necessário para resgatar seus benefícios.
                </p>
              </div>

              ${beneficios && beneficios.length > 0 ? `
              <div style="margin: 30px 0;">
                <h3 style="color: #1F2937; font-size: 18px; margin: 0 0 15px 0;">
                  Benefícios Aprovados:
                </h3>
                ${beneficios.map(b => `
                  <div style="background-color: #F9FAFB; padding: 12px; margin: 8px 0; border-radius: 6px; border-left: 3px solid #1E3A8A;">
                    <p style="color: #1F2937; font-size: 14px; font-weight: 600; margin: 0 0 4px 0;">
                      ${b.title}
                    </p>
                    <p style="color: #3B82F6; font-size: 13px; margin: 0;">
                      ${b.value}
                    </p>
                  </div>
                `).join('')}
              </div>
              ` : ''}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #F9FAFB; padding: 30px; text-align: center; border-top: 1px solid #E5E7EB;">
              <p style="color: #6B7280; font-size: 14px; margin: 0 0 10px 0;">
                Este é um email automático. Por favor, não responda.
              </p>
              <p style="color: #9CA3AF; font-size: 12px; margin: 0;">
                © ${new Date().getFullYear()} Farmace Benefícios - SICFAR RH
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    // Configuração do email
    const mailOptions = {
      from: `"SICFAR - Farmace Benefícios" <${process.env.EMAIL_API}>`,
      to: destinatario,
      subject: `✅ Voucher de Benefício Gerado - ${voucherNumber}`,
      html: htmlTemplate,
      attachments: [
        {
          filename: `Voucher_${voucherNumber}.pdf`,
          content: pdfBase64.split('base64,')[1], // Remove o prefixo data:application/pdf;base64,
          encoding: 'base64',
        },
      ],
    };

    // Envia o email
    const info = await transporter.sendMail(mailOptions);

    console.log('✅ Email enviado com sucesso:', info.messageId);
    
    res.json({ 
      success: true, 
      message: 'Email enviado com sucesso',
      messageId: info.messageId 
    });

  } catch (error) {
    console.error('❌ Erro ao enviar email:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro ao enviar email',
      error: error.message 
    });
  }
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor de email rodando na porta ${PORT}`);
  console.log(`📧 Configuração SMTP: ${process.env.EMAIL_API_HOST}:${process.env.EMAIL_API_PORTA}`);
});

