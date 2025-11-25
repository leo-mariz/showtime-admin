import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/features/authentication/presentation/context/AuthContext";
import { AdminLayout } from "@/core/presentation/layouts/AdminLayout";
import { Toaster } from "@/core/presentation/components/ui/toaster";
import "./App.css";
import { AuthRemoteDataSource } from "@/features/authentication/data/datasources/AuthRemoteDataSource";
import { AuthLocalDataSource } from "@/features/authentication/data/datasources/AuthLocalDataSource";
import { UserProvider } from "@/core/users/presentation/context/UsersContext";
import { UsersRepository } from "@/core/users/data/repositories/UsersRepository";
import { ClientRepository } from "@/core/users/clients/data/repositories/ClientRepository";
import { ArtistIndividualRepository } from "@/core/users/artists/data/repositories/individual/ArtistIndividualRepository";
import { UserRemoteDataSource } from "@/core/users/data/datasources/UsersRemoteDataSource";
import { UserLocalDataSource } from "@/core/users/data/datasources/UsersLocalDataSource";
import { ClientRemoteDataSource } from "@/core/users/clients/data/datasources/ClientRemoteDataSource";
import { ClientLocalDataSource } from "@/core/users/clients/data/datasources/ClientLocalDataSource";
import { ArtistIndividualRemoteDataSource } from "@/core/users/artists/data/datasources/individual/ArtistIndividualRemoteDataSource";
import { ArtistIndividualLocalDataSource } from "@/core/users/artists/data/datasources/individual/ArtistIndividualLocalDataSource";


// Pages
import Login from "@/features/authentication/presentation/pages/Login";
import SetNewPassword from "@/features/authentication/presentation/pages/SetNewPassword";
import Dashboard from "@/features/dashboard/presentation/pages/Dashboard";
import Artists from "@/core/users/artists/presentation/pages/individual/Artists";
import Clients from "@/core/users/clients/presentation/pages/Clients";
import Events from "@/features/events/presentation/pages/Events";
import Payments from "@/features/payments/presentation/pages/Payments";
import NotFound from "@/core/presentation/pages/NotFound";
import { ListsProvider } from "./features/appLists/presentation/context/ListsContext";
import ListsPage from "./features/appLists/presentation/pages/ListsPage";
import { EventsProvider } from "./features/events/presentation/context/EventsContext";
import { EventTypesProvider } from "./features/events/presentation/context/EventTypesContext";
import { PaymentsProvider } from "./features/payments/presentation/context/PaymentsContext";
import { AdminUsersConfigProvider } from "./features/adminUsersConfig/presentation/context/AdminUsersConfigContext";
import AdminUsersConfigPage from "./features/adminUsersConfig/presentation/pages/AdminUsersConfigPage";

function App() {
  return (
    <Router>
      <AuthProvider remote={new AuthRemoteDataSource()}
          local={new AuthLocalDataSource()}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/set-new-password" element={<SetNewPassword />} />
          <Route
            path="/*"
            element={
              <AdminUsersConfigProvider>
                <AdminLayout>
                  <UserProvider
                    userRepository={new UsersRepository(new UserRemoteDataSource(), new UserLocalDataSource())}
                    clientRepository={new ClientRepository(new ClientRemoteDataSource(), new ClientLocalDataSource())}
                    artistRepository={new ArtistIndividualRepository(new ArtistIndividualRemoteDataSource(), new ArtistIndividualLocalDataSource())}
                  >
                    <ListsProvider>
                      <EventTypesProvider>
                        <EventsProvider>
                          <PaymentsProvider>
                            <Routes>
                              <Route path="/dashboard" element={<Dashboard />} />
                              <Route path="/artists" element={<Artists />} />
                              <Route path="/clients" element={<Clients />} />
                              <Route path="/events" element={<Events />} />
                              <Route path="/payments" element={<Payments />} />
                              <Route path="/admin-management" element={<AdminUsersConfigPage />} />
                              <Route path="/app-parameters" element={<ListsPage />} />
                              <Route path="*" element={<NotFound />} />
                            </Routes>
                          </PaymentsProvider>
                        </EventsProvider>
                      </EventTypesProvider>
                    </ListsProvider>
                  </UserProvider>
                </AdminLayout>
              </AdminUsersConfigProvider>
            }
          />
        </Routes>
        <Toaster />
      </AuthProvider>
    </Router>
  );
}


export default App;

// <Route path="/groups" element={<Groups />} />
// <Route path="/events" element={<Events />} />
// <Route path="/support" element={<Support />} />
// <Route path="/payments" element={<Payments />} />
// <Route path="/users" element={<Users />} />
// <Route path="/settings" element={<Settings />} /> 