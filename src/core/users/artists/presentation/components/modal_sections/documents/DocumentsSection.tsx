import { useState } from "react";
import { Badge } from "@/core/presentation/components/ui/badge";
import { DocumentsEntity } from "@/core/users/artists/domain/entities/individual/DocumentsEntity";
import { AddressInfoEntity } from "@/core/addresses/entities/AddressInfoEntity";
import { Eye, Download, CheckCircle, XCircle } from "lucide-react";
import { ApproveDocumentsModal } from "./ApproveDocumentsModal";
import { RejectDocumentsModal } from "./RejectDocumentsModal";
import { useUsers } from "@/core/users/presentation/context/UsersContext";
import { useToast } from "@/core/presentation/components/ui/use-toast";

const LABELS_PT: Record<string, string> = {
  documentOption: "Tipo do Documento",
  idNumber: "Número do Documento",
  address: "Endereço",
  observation: "Observação",
  // outros campos se necessário
};

const FIELDS_BY_TYPE: Record<string, string[]> = {
  Identity: ["documentOption", "idNumber", "observation"],
  Residence: ["documentOption", "address", "observation"],
  Curriculum: ["documentOption", "observation"],
  Antecedents: ["documentOption", "observation"],
};

export const DocumentsSection = ({
  uid,
}: {
  uid: string;
}) => {
  const { users } = useUsers();
  const artist = users.find(u => u.artistInfo?.uid === uid);
  const documents = artist?.artistInfo?.documents || [];
  const docTypes = [
    { key: 'Identity', label: 'Identidade' },
    { key: 'Residence', label: 'Comprovante de Residência' },
    { key: 'Curriculum', label: 'Currículo' },
    { key: 'Antecedents', label: 'Certidão de Antecedentes' },
  ];

  // UI State
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedToReject, setSelectedToReject] = useState<string[]>([]);
  const [observations, setObservations] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const { approveAllDocuments, rejectSelectedDocuments, reload } = useUsers();
  const { toast } = useToast();

  // Lógica para verificar se todos os documentos foram enviados
  const allSent = docTypes.every(type => documents.some(d => d.documentType === type.key && d.url));
  // Lógica para verificar se todos os documentos estão aprovados
  const allApproved = docTypes.every(type => {
    const doc = documents.find(d => d.documentType === type.key);
    return doc && doc.status === 2;
  });

  // Funções fake para simular ações
  const handleApproveAll = async () => {
    setLoading(true);
    try {
      await approveAllDocuments(uid, documents);
      toast({ title: "Sucesso", description: "Documentos aprovados com sucesso!", variant: "default" });
      setShowApproveModal(false);
    } catch (e) {
      toast({ title: "Erro", description: "Erro ao aprovar documentos.", variant: "destructive" });
    } finally {
      setShowApproveModal(false);
      setLoading(false);
    }
  };

  const handleRejectSelected = async () => {
    setLoading(true);
    try {
      await rejectSelectedDocuments(uid, documents, selectedToReject, observations);
      toast({ title: "Sucesso", description: "Documentos rejeitados/aprovados com sucesso!", variant: "default" });
      setShowRejectModal(false);
      setSelectedToReject([]);
      setObservations({});
    } catch (e) {
      toast({ title: "Erro", description: "Erro ao rejeitar documentos.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const InfoRow = ({ label, value }: { label: string; value: string | JSX.Element | undefined }) => (
    <div className="flex gap-2 py-0.5">
      <span className="font-medium min-w-[120px]">{label}</span> {value || <span className="text-muted-foreground">Não informado</span>}
    </div>
  );

  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  return (
    <div>
      <h3 className="font-bold mb-4 text-lg">Documentos</h3>
      <div className="rounded-lg border p-4 bg-muted/50 space-y-4">
        {docTypes.map((type) => {
          const doc = documents.find(d => d.documentType === type.key);
          return (
            <div key={type.key} className="rounded border p-3 bg-white/80 mb-2">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-lg">{type.label}</span>
                <span>
                  {doc ? (
                    doc.status === 2 ? <Badge className="bg-green-100 text-green-800">Aprovado</Badge> :
                    doc.status === 3 ? <Badge className="bg-red-100 text-red-800">Rejeitado</Badge> :
                    doc.status === 1 ? <Badge className="bg-yellow-100 text-yellow-800">Pendente de Aprovação</Badge> :
                    <Badge className="bg-gray-100 text-gray-800">Pendente</Badge>
                  ) : <Badge className="bg-gray-100 text-gray-800">Não enviado</Badge>}
                </span>
              </div>
              {doc && doc.url && (
                <div className="flex flex-col items-center mb-2">
                  <div className="relative w-40 h-40 flex items-center justify-center bg-muted rounded overflow-hidden border">
                    <img
                      src={doc.url}
                      alt={type.label}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="flex gap-3 mt-2">
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-blue-600 hover:underline text-xs"
                      title="Visualizar"
                    >
                      <Eye className="w-4 h-4" /> Visualizar
                    </a>
                    <a
                      href={doc.url}
                      download
                      className="flex items-center gap-1 text-blue-600 hover:underline text-xs"
                      title="Baixar"
                    >
                      <Download className="w-4 h-4" /> Baixar
                    </a>
                  </div>
                </div>
              )}
              {doc && (
                <div className="mt-2 text-sm text-muted-foreground space-y-1">
                  {FIELDS_BY_TYPE[type.key].map((field) => {
                    if (field === "address") {
                      console.log("Documento recebido:", doc.address);
                      return doc.address ? (
                        <InfoRow key={field} label={LABELS_PT[field]} value={formatAddress(doc.address)} />
                      ) : null;
                    }
                    return (
                      <InfoRow
                        key={field}
                        label={LABELS_PT[field] || field}
                        value={typeof doc[field] === "string" ? doc[field] : undefined}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
      {/* Botões de ação */}
      {allApproved ? (
        <div className="flex gap-3 mt-8 mb-6">
          <button
            className="flex items-center gap-2 px-4 py-2 rounded bg-yellow-600 text-white hover:bg-yellow-700 transition"
            // onClick={() => ...}
            disabled={loading}
          >
            {/* Ícone de suspender */}
            <XCircle className="w-5 h-5" /> Suspender
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2 rounded bg-red-800 text-white hover:bg-red-900 transition"
            // onClick={() => ...}
            disabled={loading}
          >
            {/* Ícone de banir */}
            <XCircle className="w-5 h-5" /> Banir
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-2 mt-8 mb-6 items-center">
          <div className="flex gap-3">
            <button
              className={`flex items-center gap-2 px-4 py-2 rounded 
                ${!allSent || loading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700 transition'
                }`}
              onClick={() => setShowApproveModal(true)}
              disabled={!allSent || loading}
            >
              <CheckCircle className="w-5 h-5" /> Aprovar Todos
            </button>
            <button
              className={`flex items-center gap-2 px-4 py-2 rounded 
                ${!allSent || loading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-red-600 text-white hover:bg-red-700 transition'
                }`}
              onClick={() => setShowRejectModal(true)}
              disabled={!allSent || loading}
            >
              <XCircle className="w-5 h-5" /> Rejeitar
            </button>
          </div>
          {!allSent && (
            <span className="text-sm text-muted-foreground mt-2 text-center">
              Esperando o envio dos documentos
            </span>
          )}
        </div>
      )}
      {/* Modal de confirmação de aprovação */}
      <ApproveDocumentsModal
        open={showApproveModal}
        onClose={() => setShowApproveModal(false)}
        onApprove={handleApproveAll}
        loading={loading}
      />

      {/* Modal de rejeição */}
      <RejectDocumentsModal
        open={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        onReject={handleRejectSelected}
        docTypes={docTypes}
        documents={documents}
        selectedToReject={selectedToReject}
        setSelectedToReject={setSelectedToReject}
        observations={observations}
        setObservations={setObservations}
        loading={loading}
        feedbackMessage={feedbackMessage}
      />
    </div>
  );
};

function formatAddress(address: AddressInfoEntity) {
  if (!address) return '-';
  // Monte as partes do endereço, ignorando campos vazios
  const parts = [
    [address.logradouro, address.number, address.complement].filter(Boolean).join(' '),
    address.bairro,
    address.localidade,
    address.uf,
    address.cep,
  ].filter(Boolean);

  return parts.join(', ');
}

function formatLabel(label: string) {
  // Converte camelCase ou snake_case para Título Capitalizado
  return label
    .replace(/([A-Z])/g, ' $1')
    .replace(/_/g, ' ')
    .replace(/^./, str => str.toUpperCase());
}
