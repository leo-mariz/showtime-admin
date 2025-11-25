import { EmailEntity } from "@/features/support/domain/entities/EmailEntity";
import { EmailTemplates } from "@/core/templates/EmailTemplates";

export interface IEmailService {
  sendEmail(email: EmailEntity): Promise<boolean>;
  sendAdminInviteEmail(params: {
    recipientEmail: string;
    recipientName: string;
    adminRole: string;
    invitedBy: string;
  }): Promise<boolean>;
  sendAdminFirstAccessEmail(params: {
    recipientEmail: string;
    recipientName: string;
    adminRole: string;
    temporaryPassword: string;
    loginUrl: string;
    invitedBy: string;
  }): Promise<boolean>;
}

/**
 * Função auxiliar para enviar email via Firebase Function
 * Similar à abordagem Netlify Functions
 */
async function sendEmailViaFunction(data: {
  from: string;
  to: string | string[];
  subject: string;
  html: string;
}) {
  // URL da Firebase Function
  // Em desenvolvimento local, usa o emulador
  // Em produção, usa a URL da function deployada
  const functionUrl = import.meta.env.DEV
    ? "http://127.0.0.1:5001/showtime-a1385/us-central1/sendEmail"
    : `https://us-central1-${import.meta.env.VITE_FIREBASE_PROJECT_ID || "showtime-a1385"}.cloudfunctions.net/sendEmail`;

  try {
    const response = await fetch(functionUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Erro ao enviar email: ${response.statusText}`
      );
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Erro ao enviar email:", error);
    throw error;
  }
}

export class EmailService implements IEmailService {
  /**
   * Envia um email genérico usando a entidade EmailEntity
   */
  async sendEmail(email: EmailEntity): Promise<boolean> {
    try {
      const result = await sendEmailViaFunction({
        from: email.from || "Showtime Admin <noreply@showtime.com>",
        to: email.to || [],
        subject: email.subject,
        html: email.isHtml ? email.body : `<p>${email.body}</p>`,
      });

      // Verifica se houve erro na resposta da API
      if (result.error) {
        console.error("Erro ao enviar email:", result.error);
        return false;
      }

      // Verifica se os dados foram retornados corretamente
      if (!result.data || !result.data.id) {
        console.error("Resposta inválida da API de email");
        return false;
      }

      console.log("Email enviado com sucesso:", result.data.id);
      return true;
    } catch (error) {
      console.error("Erro ao enviar email:", error);
      return false;
    }
  }

  /**
   * Envia email de convite para admin já existente (sem credenciais)
   */
  async sendAdminInviteEmail(params: {
    recipientEmail: string;
    recipientName: string;
    adminRole: string;
    invitedBy: string;
  }): Promise<boolean> {
    try {
      const result = await sendEmailViaFunction({
        from: "Showtime Admin <noreply@showtime.com>",
        to: params.recipientEmail,
        subject: `Você foi adicionado como ${params.adminRole} no Showtime Admin`,
        html: EmailTemplates.adminInvite({
          recipientName: params.recipientName,
          adminRole: params.adminRole,
          invitedBy: params.invitedBy,
        }),
      });

      // Verifica se houve erro na resposta da API
      if (result.error) {
        console.error("Erro ao enviar email de convite:", result.error);
        return false;
      }

      // Verifica se os dados foram retornados corretamente
      if (!result.data || !result.data.id) {
        console.error("Resposta inválida da API de email");
        return false;
      }

      console.log("Email de convite enviado com sucesso:", result.data.id);
      return true;
    } catch (error) {
      console.error("Erro ao enviar email de convite para admin:", error);
      return false;
    }
  }

  /**
   * Envia email de convite para novo admin com credenciais de primeiro acesso
   */
  async sendAdminFirstAccessEmail(params: {
    recipientEmail: string;
    recipientName: string;
    adminRole: string;
    temporaryPassword: string;
    loginUrl: string;
    invitedBy: string;
  }): Promise<boolean> {
    try {
      const result = await sendEmailViaFunction({
        from: "Showtime Admin <noreply@showtime.com>",
        to: params.recipientEmail,
        subject: "Bem-vindo ao Showtime Admin - Credenciais de Acesso",
        html: EmailTemplates.adminFirstAccess({
          recipientName: params.recipientName,
          adminRole: params.adminRole,
          temporaryPassword: params.temporaryPassword,
          loginUrl: params.loginUrl,
          invitedBy: params.invitedBy,
        }),
      });

      // Verifica se houve erro na resposta da API
      if (result.error) {
        console.error(
          "Erro ao enviar email de primeiro acesso:",
          result.error
        );
        return false;
      }

      // Verifica se os dados foram retornados corretamente
      if (!result.data || !result.data.id) {
        console.error("Resposta inválida da API de email");
        return false;
      }

      console.log(
        "Email de primeiro acesso enviado com sucesso:",
        result.data.id
      );
      return true;
    } catch (error) {
      console.error(
        "Erro ao enviar email de primeiro acesso para admin:",
        error
      );
      return false;
    }
  }
}

export const emailService = new EmailService();