import { Badge } from "@/core/presentation/components/ui/badge";

export const UserInfoSection = ({ userInfo }: { userInfo: any }) => {
  if (!userInfo) return null;

  const isCpfUser = !!userInfo.cpfUser && !!userInfo.cpfUser.firstName;
  const isCnpjUser = !!userInfo.cnpjUser && !!userInfo.cnpjUser.fantasyName;

  return (
    <div>
      <h3 className="font-bold mb-4 text-lg">Informações do Usuário</h3>
      <div className="rounded-lg border p-4 bg-muted/50">
        <div className="grid grid-cols-2 gap-4">
          {isCpfUser && !isCnpjUser && (
            <>
              <div>
                <span className="font-medium">Nome:</span> {userInfo.cpfUser.firstName || 'Não informado'} {userInfo.cpfUser.lastName || ''}
              </div>
              <div>
                <span className="font-medium">CPF:</span> {userInfo.cpfUser.cpf || 'Não informado'}
              </div>
              <div>
                <span className="font-medium">Email:</span> {userInfo.email || 'Não informado'}
              </div>
              <div>
                <span className="font-medium">Telefone:</span> {userInfo.phoneNumber || 'Não informado'}
              </div>
              <div>
                <span className="font-medium">Status:</span> {userInfo.isActive ? <Badge className="bg-green-100 text-green-800">Ativo</Badge> : <Badge className="bg-red-100 text-red-800">Inativo</Badge>}
              </div>
            </>
          )}
          {isCnpjUser && !isCpfUser && (
            <>
              <div>
                <span className="font-medium">Nome Fantasia:</span> {userInfo.cnpjUser.fantasyName || 'Não informado'}
              </div>
              <div>
                <span className="font-medium">Razão Social:</span> {userInfo.cnpjUser.companyName || 'Não informado'}
              </div>
              <div>
                <span className="font-medium">CNPJ:</span> {userInfo.cnpjUser.cnpj || 'Não informado'}
              </div>
              <div>
                <span className="font-medium">Email:</span> {userInfo.email || 'Não informado'}
              </div>
              <div>
                <span className="font-medium">Telefone:</span> {userInfo.phoneNumber || 'Não informado'}
              </div>
              <div>
                <span className="font-medium">Status:</span> {userInfo.isActive ? <Badge className="bg-green-100 text-green-800">Ativo</Badge> : <Badge className="bg-red-100 text-red-800">Inativo</Badge>}
              </div>
            </>
          )}
          {!isCpfUser && !isCnpjUser && (
            <div className="col-span-2 text-center text-muted-foreground">Nenhuma informação de usuário encontrada.</div>
          )}
        </div>
      </div>
    </div>
  );
};
