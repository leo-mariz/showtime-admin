import { Card, CardContent, CardHeader, CardTitle } from "@/core/presentation/components/ui/card";
import { TopArtist } from "../../domain/entities/DashboardMetricsEntity";
import { Trophy, TrendingUp } from "lucide-react";
import { Avatar, AvatarFallback } from "@/core/presentation/components/ui/avatar";

interface TopArtistsCardProps {
  artists: TopArtist[];
}

export const TopArtistsCard = ({ artists }: TopArtistsCardProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const maxRevenue = Math.max(...artists.map(a => a.revenue));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          Top 5 Artistas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {artists.map((artist, index) => {
            const percentage = (artist.revenue / maxRevenue) * 100;
            
            return (
              <div key={artist.name} className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-gradient-showtime text-white font-bold">
                          {artist.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      {index === 0 && (
                        <div className="absolute -top-1 -right-1 bg-yellow-500 rounded-full p-0.5">
                          <Trophy className="h-3 w-3 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{artist.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {artist.eventsCount} evento{artist.eventsCount !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">{formatCurrency(artist.revenue)}</p>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      index === 0 ? "bg-yellow-500" : "bg-blue-600"
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

