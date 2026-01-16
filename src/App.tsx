import { LoginProvider } from "./providers/login-state-provider";
import QueryProvider from "./providers/query-client-provider";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "./components/ui/sonner";
import ProtectedRoute from "./providers/protected-route";
import AdminLayout from "./components/admin-layout";
import LoginPage from "./pages/login/login-page";
import DashboardPage from "./pages/dashboard/dashboard-page";
import HomePageAboutList from "./pages/home-page-about/home-page-about-list";
import HomePageAboutDetail from "./pages/home-page-about/home-page-about-detail";
import HomePageAboutCreate from "./pages/home-page-about/home-page-about-create";
import HomePageAboutEdit from "./pages/home-page-about/home-page-about-edit";


function App() {
	return (
		<QueryProvider>
			<LoginProvider>
				<BrowserRouter>
					<Toaster />
					<Routes>
						<Route path="/login" element={<LoginPage />} />
						<Route path="/" element={<ProtectedRoute />}>
							<Route path="/" element={<AdminLayout />}>
								<Route path="/" element={<DashboardPage />} />
								<Route path="/home-page-about" element={<HomePageAboutList />} />
								<Route path="/home-page-about/create" element={<HomePageAboutCreate />} />
								<Route path="/home-page-about/:id" element={<HomePageAboutDetail />} />
								<Route path="/home-page-about/:id/edit" element={<HomePageAboutEdit />} />
							</Route>
						</Route>
					</Routes>
				</BrowserRouter>
			</LoginProvider>
		</QueryProvider>
	);
}

export default App;
