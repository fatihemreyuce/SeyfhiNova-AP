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
import ServiceCategoryList from "./pages/service-category/service-category-list";
import ServiceCategoryDetail from "./pages/service-category/service-category-detail";
import ServiceCategoryCreate from "./pages/service-category/service-category-create";
import ServiceCategoryEdit from "./pages/service-category/service-category-edit";
import ServiceList from "./pages/service/service-list";
import ServiceDetail from "./pages/service/service-detail";
import ServiceCreate from "./pages/service/service-create";
import ServiceEdit from "./pages/service/service-edit";
import ServiceStatsList from "./pages/service-stats/service-stats-list";
import ServiceStatsDetail from "./pages/service-stats/service-stats-detail";
import ServiceStatsCreate from "./pages/service-stats/service-stats-create";
import ServiceStatsEdit from "./pages/service-stats/service-stats-edit";


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
							<Route path="/service-category" element={<ServiceCategoryList />} />
							<Route path="/service-category/create" element={<ServiceCategoryCreate />} />
							<Route path="/service-category/:id" element={<ServiceCategoryDetail />} />
							<Route path="/service-category/:id/edit" element={<ServiceCategoryEdit />} />
							<Route path="/service" element={<ServiceList />} />
							<Route path="/service/create" element={<ServiceCreate />} />
							<Route path="/service/:id" element={<ServiceDetail />} />
							<Route path="/service/:id/edit" element={<ServiceEdit />} />
							<Route path="/service-stats" element={<ServiceStatsList />} />
							<Route path="/service-stats/create" element={<ServiceStatsCreate />} />
							<Route path="/service-stats/:id" element={<ServiceStatsDetail />} />
							<Route path="/service-stats/:id/edit" element={<ServiceStatsEdit />} />
							</Route>
						</Route>
					</Routes>
				</BrowserRouter>
			</LoginProvider>
		</QueryProvider>
	);
}

export default App;
