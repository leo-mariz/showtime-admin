import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/core/presentation/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/core/presentation/components/ui/card";
import { Separator } from "@/core/presentation/components/ui/separator";
import { Switch } from "@/core/presentation/components/ui/switch";
import { Label } from "@/core/presentation/components/ui/label";
import { Input } from "@/core/presentation/components/ui/input";
import { Button } from "@/core/presentation/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/core/presentation/components/ui/table";
import { Badge } from "@/core/presentation/components/ui/badge";
import { Plus, Edit, Trash2 } from "lucide-react";

const Settings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Configurações</h1>
        <p className="text-muted-foreground">
          Gerenciar configurações do sistema
        </p>
      </div>

      <Tabs defaultValue="system">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="system">Sistema</TabsTrigger>
          <TabsTrigger value="roles">Papéis e Permissões</TabsTrigger>
          <TabsTrigger value="logs">Logs de Auditoria</TabsTrigger>
          <TabsTrigger value="backup">Backup de Dados</TabsTrigger>
        </TabsList>

        <TabsContent value="system" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações Gerais</CardTitle>
              <CardDescription>
                Configurações gerais do sistema ShowTime
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Modo de Manutenção</h4>
                    <p className="text-sm text-muted-foreground">
                      Ativa o modo de manutenção, bloqueando o acesso ao site
                    </p>
                  </div>
                  <Switch id="maintenance-mode" />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Notificações por Email</h4>
                    <p className="text-sm text-muted-foreground">
                      Envia notificações por email para usuários
                    </p>
                  </div>
                  <Switch id="email-notifications" defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Aprovação Manual de Artistas</h4>
                    <p className="text-sm text-muted-foreground">
                      Requer aprovação manual para novos artistas
                    </p>
                  </div>
                  <Switch id="manual-approval" defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Logs Detalhados</h4>
                    <p className="text-sm text-muted-foreground">
                      Ativa logs detalhados para todas as operações
                    </p>
                  </div>
                  <Switch id="detailed-logs" defaultChecked />
                </div>
              </div>

              <div className="mt-6">
                <Button 
                  className="bg-gradient-showtime hover:opacity-90"
                >
                  Salvar Configurações
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Configurações de Pagamento</CardTitle>
              <CardDescription>
                Configurações para processamento de pagamentos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="api-key">Chave da API de Pagamento</Label>
                  <Input id="api-key" value="sk_test_****************************************" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="webhook">URL do Webhook</Label>
                  <Input id="webhook" value="https://api.showtime.com/webhooks/payment" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Ambiente de Teste</h4>
                    <p className="text-sm text-muted-foreground">
                      Usa o ambiente de teste para pagamentos
                    </p>
                  </div>
                  <Switch id="test-environment" defaultChecked />
                </div>
              </div>

              <div className="mt-6">
                <Button 
                  className="bg-gradient-showtime hover:opacity-90"
                >
                  Atualizar Configurações
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Papéis de Funcionários</CardTitle>
                <CardDescription>
                  Gerencie os papéis e permissões dos funcionários
                </CardDescription>
              </div>
              <Button className="bg-gradient-showtime hover:opacity-90">
                <Plus className="h-4 w-4 mr-2" />
                Criar Papel
              </Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-hidden rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Papel</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Usuários</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Administrador</TableCell>
                      <TableCell>Acesso total ao sistema</TableCell>
                      <TableCell>2</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
                          Ativo
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Suporte</TableCell>
                      <TableCell>Atendimento ao cliente e moderação</TableCell>
                      <TableCell>3</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
                          Ativo
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Moderador</TableCell>
                      <TableCell>Aprovação de artistas e eventos</TableCell>
                      <TableCell>1</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
                          Ativo
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Operador</TableCell>
                      <TableCell>Operações básicas do sistema</TableCell>
                      <TableCell>0</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                          Inativo
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-4">Definir Permissões</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">Gerenciamento de Usuários</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label>Visualizar usuários</Label>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>Criar usuários</Label>
                        <Switch />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>Editar usuários</Label>
                        <Switch />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>Excluir usuários</Label>
                        <Switch />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-medium">Gerenciamento de Eventos</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label>Visualizar eventos</Label>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>Criar eventos</Label>
                        <Switch />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>Editar eventos</Label>
                        <Switch />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>Cancelar eventos</Label>
                        <Switch />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <Button className="bg-gradient-showtime hover:opacity-90">
                    Salvar Permissões
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Logs de Auditoria</CardTitle>
              <CardDescription>
                Histórico de ações realizadas no sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-hidden rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data/Hora</TableHead>
                      <TableHead>Usuário</TableHead>
                      <TableHead>Ação</TableHead>
                      <TableHead>IP</TableHead>
                      <TableHead className="text-right">Detalhes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>19/05/2023, 10:30</TableCell>
                      <TableCell>admin@showtime.com</TableCell>
                      <TableCell>Login no sistema</TableCell>
                      <TableCell>192.168.1.1</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          Ver
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>18/05/2023, 16:45</TableCell>
                      <TableCell>maria@showtime.com</TableCell>
                      <TableCell>Aprovação de artista</TableCell>
                      <TableCell>192.168.1.2</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          Ver
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>18/05/2023, 14:22</TableCell>
                      <TableCell>admin@showtime.com</TableCell>
                      <TableCell>Alteração de configuração</TableCell>
                      <TableCell>192.168.1.1</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          Ver
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <div className="mt-6 flex gap-4">
                <Button 
                  variant="outline"
                >
                  Exportar Logs
                </Button>
                <Button 
                  variant="outline"
                >
                  Limpar Logs Antigos
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backup" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Backup de Dados</CardTitle>
              <CardDescription>
                Gerenciar backups do sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Backup Automático Diário</h4>
                    <p className="text-sm text-muted-foreground">
                      Realiza backup automático todos os dias
                    </p>
                  </div>
                  <Switch id="daily-backup" defaultChecked />
                </div>
                <Separator />
                <div>
                  <h4 className="font-medium mb-3">Backups Recentes</h4>
                  <div className="space-y-3">
                    <div className="showtime-card">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">Backup Completo</p>
                          <p className="text-sm text-muted-foreground">
                            19/05/2023, 03:00
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          Restaurar
                        </Button>
                      </div>
                    </div>
                    <div className="showtime-card">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">Backup Completo</p>
                          <p className="text-sm text-muted-foreground">
                            18/05/2023, 03:00
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          Restaurar
                        </Button>
                      </div>
                    </div>
                    <div className="showtime-card">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">Backup Completo</p>
                          <p className="text-sm text-muted-foreground">
                            17/05/2023, 03:00
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          Restaurar
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex gap-4">
                  <Button 
                    className="bg-gradient-showtime hover:opacity-90"
                  >
                    Criar Backup Manual
                  </Button>
                  <Button 
                    variant="outline"
                  >
                    Configurações Avançadas
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
