import { Card, CardContent, CardHeader, CardTitle } from "@/core/presentation/components/ui/card";
import { Badge } from "@/core/presentation/components/ui/badge";
import { Users, AlertCircle, CheckCircle2, UserCheck } from "lucide-react";

interface ArtistIncompleteBreakdown {
  section: string;
  count: number;
  artists: string[];
}

interface ArtistsSectionProps {
  total: number;
  active: number;
  incomplete: number;
  incompleteBreakdown: ArtistIncompleteBreakdown[];
  topArtists: Array<{ name: string; revenue: number; eventsCount: number }>;
}

export const ArtistsSection = ({
  total,
  active,
  incomplete,
  incompleteBreakdown,
  topArtists
}: ArtistsSectionProps) => {
  const completionRate = total > 0 ? ((total - incomplete) / total * 100).toFixed(1) : 0;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-purple-600" />
            Artistas
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Métricas Principais */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-purple-50 dark:bg-purple-950/20 rounded-lg p-4">
              <div className="text-sm text-muted-foreground">Total Cadastrados</div>
              <div className="text-3xl font-bold text-purple-600 mt-1">{total}</div>
            </div>
            <div className="bg-green-50 dark:bg-green-950/20 rounded-lg p-4">
              <div className="text-sm text-muted-foreground">Ativos (Perfil Completo)</div>
              <div className="text-3xl font-bold text-green-600 mt-1">{active}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {completionRate}% de conclusão
              </div>
            </div>
            <div className="bg-orange-50 dark:bg-orange-950/20 rounded-lg p-4">
              <div className="text-sm text-muted-foreground">Informações Incompletas</div>
              <div className="text-3xl font-bold text-orange-600 mt-1">{incomplete}</div>
            </div>
          </div>

          {/* Breakdown de Informações Incompletas */}
          {incomplete > 0 && (
            <div className="space-y-3 mb-6">
              <h4 className="font-semibold text-sm flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-orange-600" />
                Detalhamento de Seções Incompletas
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {incompleteBreakdown.map((item, idx) => (
                  <div
                    key={idx}
                    className="border rounded-lg p-3 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">{item.section}</span>
                      <Badge variant="outline" className="bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300">
                        {item.count}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {item.artists.slice(0, 2).join(", ")}
                      {item.artists.length > 2 && "..."}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Top Artistas */}
          <div className="border-t pt-4">
            <h4 className="font-semibold text-sm flex items-center gap-2 mb-3">
              <UserCheck className="h-4 w-4 text-blue-600" />
              Top 5 Artistas
            </h4>
            <div className="space-y-2">
              {topArtists.map((artist, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center text-sm font-bold text-purple-600 dark:text-purple-400">
                      {idx + 1}
                    </div>
                    <div>
                      <div className="font-medium">{artist.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {artist.eventsCount} eventos
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-green-600">
                      R$ {artist.revenue.toLocaleString('pt-BR')}
                    </div>
                    <div className="text-xs text-muted-foreground">receita</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

