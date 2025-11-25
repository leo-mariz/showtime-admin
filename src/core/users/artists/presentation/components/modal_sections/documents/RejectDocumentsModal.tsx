import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/core/presentation/components/ui/dialog";
import { Button } from "@/core/presentation/components/ui/button";
import { DocumentsEntity } from "@/core/users/artists/domain/entities/individual/DocumentsEntity";
import React from "react";


interface RejectDocumentsModalProps {
  open: boolean;
  onClose: () => void;
  onReject: () => void;
  docTypes: { key: string; label: string }[];
  documents: DocumentsEntity[];
  selectedToReject: string[];
  setSelectedToReject: (value: string[]) => void;
  observations: Record<string, string>;
  setObservations: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  loading?: boolean;
  feedbackMessage?: { type: 'success' | 'error'; text: string } | null;
}

export function RejectDocumentsModal({
  open,
  onClose,
  onReject,
  docTypes,
  documents,
  selectedToReject,
  setSelectedToReject,
  observations,
  setObservations,
  loading = false,
  feedbackMessage = null,
}: RejectDocumentsModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Rejeitar Documentos</DialogTitle>
        </DialogHeader>
        <p className="mb-4">Selecione os documentos a serem rejeitados e adicione uma observação para cada um:</p>
        {feedbackMessage && (
          <div className={`mb-3 text-sm rounded px-3 py-2 ${feedbackMessage.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {feedbackMessage.text}
          </div>
        )}
        <form onSubmit={e => { e.preventDefault(); onReject(); }}>
          <div className="space-y-3 mb-4">
            {docTypes.map(type => {
              const doc = documents.find(d => d.documentType === type.key && d.status === 1);
              if (!doc) return null;
              return (
                <div key={type.key} className="flex flex-col gap-1 border rounded p-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedToReject.includes(type.key)}
                      onChange={e => {
                        setSelectedToReject(
                          e.target.checked
                            ? [...selectedToReject, type.key]
                            : selectedToReject.filter(k => k !== type.key)
                        );
                      }}
                    />
                    <span>{type.label}</span>
                  </label>
                  {selectedToReject.includes(type.key) && (
                    <textarea
                      className="border rounded p-1 text-sm mt-1"
                      placeholder="Observação (opcional)"
                      value={observations[type.key] || ''}
                      onChange={e => setObservations((obs: any) => ({ ...obs, [type.key]: e.target.value }))}
                    />
                  )}
                </div>
              );
            })}
          </div>
          <DialogFooter className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>Cancelar</Button>
            <Button type="submit" variant="destructive" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2"><span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>Rejeitando...</span>
              ) : 'Rejeitar Selecionados'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
