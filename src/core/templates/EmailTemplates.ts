/**
 * Templates de Email para o Showtime Admin
 * Seguindo o padrão do projeto (templates estilizados em HTML)
 */

export interface AdminInviteData {
  recipientName: string;
  adminRole: string;
  invitedBy: string;
}

export interface AdminFirstAccessData {
  recipientName: string;
  adminRole: string;
  temporaryPassword: string;
  loginUrl: string;
  invitedBy: string;
}

export class EmailTemplates {
  /**
   * Estilos CSS compartilhados entre os templates
   */
  private static getCommonStyles(): string {
    return `
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f5f5f5;
        }
        .email-container {
          background-color: #ffffff;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 30px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 24px;
        }
        .content {
          padding: 30px;
        }
        .highlight {
          background: #f5f7ff;
          padding: 15px;
          border-left: 4px solid #667eea;
          margin: 20px 0;
          border-radius: 5px;
        }
        .credentials-box {
          background: #fff;
          padding: 20px;
          border: 2px solid #667eea;
          border-radius: 8px;
          margin: 20px 0;
        }
        .credential-item {
          margin: 15px 0;
          padding: 10px;
          background: #f5f7ff;
          border-radius: 5px;
        }
        .credential-label {
          color: #666;
          font-size: 0.9em;
          margin-bottom: 5px;
        }
        .credential-value {
          font-family: 'Courier New', monospace;
          font-size: 1.1em;
          color: #667eea;
          font-weight: bold;
          word-break: break-all;
        }
        .role {
          color: #667eea;
          font-weight: bold;
          font-size: 1.1em;
        }
        .warning-box {
          background: #fff3cd;
          border-left: 4px solid #ffc107;
          padding: 15px;
          margin: 20px 0;
          border-radius: 5px;
          color: #856404;
        }
        .security-tips {
          background: #e7f3ff;
          border-left: 4px solid #2196F3;
          padding: 15px;
          margin: 20px 0;
          border-radius: 5px;
        }
        .security-tips h4 {
          margin-top: 0;
          color: #1976D2;
        }
        .button {
          display: inline-block;
          padding: 12px 30px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white !important;
          text-decoration: none;
          border-radius: 5px;
          margin: 20px 0;
          font-weight: bold;
        }
        .button-container {
          text-align: center;
          margin: 30px 0;
        }
        .footer {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #ddd;
          font-size: 0.9em;
          color: #666;
        }
        .footer-note {
          font-size: 0.85em;
          color: #999;
          margin-top: 10px;
        }
      </style>
    `;
  }

  /**
   * Template: Convite para admin existente (sem credenciais)
   */
  static adminInvite(data: AdminInviteData): string {
    return `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        ${this.getCommonStyles()}
      </head>
      <body>
        <div class="email-container">
          <div class="header">
            <h1>🎉 Bem-vindo à Equipe!</h1>
          </div>
          <div class="content">
            <p>Olá <strong>${data.recipientName}</strong>,</p>
            
            <p>Você foi adicionado como administrador no sistema <strong>Showtime Admin</strong>!</p>
            
            <div class="highlight">
              <p><strong>Sua função:</strong> <span class="role">${data.adminRole}</span></p>
              <p><strong>Adicionado por:</strong> ${data.invitedBy}</p>
            </div>
            
            <p>Como administrador, você terá acesso às funcionalidades administrativas do sistema de acordo com as permissões da sua função.</p>
            
            <p>Você pode fazer login usando suas credenciais existentes no sistema.</p>
            
            <p>Se você tiver alguma dúvida ou precisar de ajuda, não hesite em entrar em contato com nossa equipe de suporte.</p>
            
            <div class="footer">
              <p>Atenciosamente,<br>
              <strong>Equipe Showtime Admin</strong></p>
              <p class="footer-note">
                Este é um email automático, por favor não responda diretamente a esta mensagem.
              </p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Template: Convite para novo admin com credenciais de primeiro acesso
   */
  static adminFirstAccess(data: AdminFirstAccessData): string {
    return `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        ${this.getCommonStyles()}
      </head>
      <body>
        <div class="email-container">
          <div class="header">
            <h1>🎉 Bem-vindo ao Showtime Admin!</h1>
          </div>
          <div class="content">
            <p>Olá <strong>${data.recipientName}</strong>,</p>
            
            <p>Você foi convidado para fazer parte da equipe administrativa do <strong>Showtime Admin</strong> com a função de <span class="role">${data.adminRole}</span>.</p>
            
            <p><strong>Convidado por:</strong> ${data.invitedBy}</p>
            
            <div class="credentials-box">
              <h3 style="margin-top: 0; color: #667eea;">🔐 Suas Credenciais de Acesso</h3>
              
              <div class="credential-item">
                <div class="credential-label">Senha Temporária:</div>
                <div class="credential-value">${data.temporaryPassword}</div>
              </div>
            </div>
            
            <div class="warning-box">
              <strong>⚠️ IMPORTANTE:</strong><br>
              Por motivos de segurança, <strong>você será obrigado a alterar sua senha no primeiro login</strong>. 
              A senha temporária é válida apenas para o primeiro acesso.
            </div>
            
            <div class="button-container">
              <a href="${data.loginUrl}" class="button">Acessar o Sistema</a>
            </div>
            
            <div class="security-tips">
              <h4>🛡️ Dicas de Segurança:</h4>
              <ul style="margin: 10px 0; padding-left: 20px;">
                <li>Crie uma senha forte com pelo menos 8 caracteres</li>
                <li>Use uma combinação de letras maiúsculas, minúsculas, números e símbolos</li>
                <li>Não compartilhe suas credenciais com ninguém</li>
                <li>Guarde sua senha em um local seguro</li>
              </ul>
            </div>
            
            <p>Como <span class="role">${data.adminRole}</span>, você terá acesso às funcionalidades administrativas do sistema de acordo com as permissões da sua função.</p>
            
            <p>Se você tiver alguma dúvida ou precisar de ajuda, não hesite em entrar em contato com nossa equipe de suporte.</p>
            
            <div class="footer">
              <p>Atenciosamente,<br>
              <strong>Equipe Showtime Admin</strong></p>
              <p class="footer-note">
                Este é um email automático contendo informações sensíveis. Por favor, não encaminhe esta mensagem.
              </p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}


