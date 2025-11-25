import { Badge } from "@/core/presentation/components/ui/badge";
import { ProfessionalInfoEntity } from "@/core/users/artists/domain/entities/ProfessionalInfoEntity";
import { PlayCircle, Download } from "lucide-react";

export const ProfessionalInfoSection = ({ artistInfo }: { artistInfo: any }) => {
  if (!artistInfo) return null;
  const prof: ProfessionalInfoEntity = artistInfo.professionalInfo || {};
  return (
    <div>
      <h3 className="font-bold mb-2">Informações Profissionais</h3>
      <div className="rounded-lg border p-4 bg-muted/50">
      <div className="grid grid-cols-2 gap-4">
        <div><span className="font-medium">Nome Artístico:</span> {artistInfo.artistName || "Não informado"}</div>
        <div><span className="font-medium">Talentos:</span> {prof.specialty?.join(", ") || "Não informado"}</div>
        <div><span className="font-medium">Duração Mínima do Show:</span> {prof.minimumShowDuration || "Não informado"} minutos</div>
        <div><span className="font-medium">Gêneros Preferidos:</span> {prof.genrePreferences?.join(", ") || "Não informado"}</div>
        <div><span className="font-medium">Bio:</span> {prof.bio || "Não informado"}</div>
        <div><span className="font-medium">Aprovado:</span> {artistInfo.approved ? <Badge className="bg-green-100 text-green-800">Sim</Badge> : <Badge className="bg-yellow-100 text-yellow-800">Não</Badge>}</div>
        <div><span className="font-medium">Ativo:</span> {artistInfo.isActive ? <Badge className="bg-green-100 text-green-800">Sim</Badge> : <Badge className="bg-red-100 text-red-800">Não</Badge>}</div>
        <div><span className="font-medium">Data de Cadastro:</span> {artistInfo.dateRegistered ? new Date(artistInfo.dateRegistered).toLocaleDateString('pt-BR') : "Não informado"}</div>
      </div>
      {artistInfo.presentationMedias && Object.keys(artistInfo.presentationMedias).length > 0 && (
        <div className="col-span-2 mt-6">
          <span className="font-medium block mb-2">Mídias de Apresentação:</span>
          <div className="flex flex-wrap gap-4">
            {Object.entries(artistInfo.presentationMedias as Record<string, string>).map(([talento, url]) => (
              <div key={talento} className="flex flex-col items-center w-60">
                <span className="text-sm font-semibold mb-1">{talento}</span>
                <div className="flex gap-4 mt-2">
                  <button
                    onClick={() => window.open(url, "_blank")}
                    className="flex items-center justify-center p-2 rounded hover:bg-muted transition"
                    title="Visualizar"
                  >
                    <PlayCircle className="w-7 h-7 text-blue-600" />
                  </button>
                  <a
                    href={url}
                    download
                    className="flex items-center justify-center p-2 rounded hover:bg-muted transition"
                    title="Baixar"
                  >
                    <Download className="w-7 h-7 text-blue-600" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      </div>
    </div>
  );
};
