import { BankAccountEntity } from "@/core/users/artists/domain/entities/BankAccountEntity";

export const BankInfoSection = ({ bankAccount }: { bankAccount: BankAccountEntity | undefined }) => {
  if (!bankAccount) return null;
  return (
    <div>
      <h3 className="font-bold mb-2">Informações Bancárias</h3>
      <div className="rounded-lg border p-4 bg-muted/50">
        <div className="grid grid-cols-2 gap-4">
          <div><span className="font-medium">Titular:</span> {bankAccount.fullName || "Não informado"}</div>
          <div><span className="font-medium">CPF/CNPJ:</span> {bankAccount.cpfOrCnpj || "Não informado"}</div>
          <div><span className="font-medium">Banco:</span> {bankAccount.bankName || "Não informado"}</div>
          <div><span className="font-medium">Agência:</span> {bankAccount.agency || "Não informado"}</div>
          <div><span className="font-medium">Conta:</span> {bankAccount.accountNumber || "Não informado"}</div>
          <div><span className="font-medium">Tipo de Conta:</span> {bankAccount.accountType || "Não informado"}</div>
          <div><span className="font-medium">Pix:</span> {bankAccount.pixType || "Não informado"} - {bankAccount.pixKey || "Não informado"}</div>
        </div>
      </div>
    </div>
  );
};
