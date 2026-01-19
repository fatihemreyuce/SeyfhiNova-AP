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
import SliderList from "./pages/slider/slider-list";
import SliderDetail from "./pages/slider/slider-detail";
import SliderCreate from "./pages/slider/slider-create";
import SliderEdit from "./pages/slider/slider-edit";
import PartnerList from "./pages/partner/partner-list";
import PartnerDetail from "./pages/partner/partner-detail";
import PartnerCreate from "./pages/partner/partner-create";
import PartnerEdit from "./pages/partner/partner-edit";
import ReferanceList from "./pages/referance/referance-list";
import ReferanceDetail from "./pages/referance/referance-detail";
import ReferanceCreate from "./pages/referance/referance-create";
import ReferanceEdit from "./pages/referance/referance-edit";
import CircularList from "./pages/circular/circular-list";
import CircularDetail from "./pages/circular/circular-detail";
import CircularCreate from "./pages/circular/circular-create";
import CircularEdit from "./pages/circular/circular-edit";
import FaqList from "./pages/faq/faq-list";
import FaqDetail from "./pages/faq/faq-detail";
import FaqCreate from "./pages/faq/faq-create";
import FaqEdit from "./pages/faq/faq-edit";
import NotificationList from "./pages/notification/notification-list";
import NotificationDetail from "./pages/notification/notification-detail";
import NotificationCreate from "./pages/notification/notification-create";
import NotificationEdit from "./pages/notification/notification-edit";
import NotificationSubList from "./pages/notification-sub/notification-sub-list";
import NotificationSubDetail from "./pages/notification-sub/notification-sub-detail";
import NotificationSubCreate from "./pages/notification-sub/notification-sub-create";
import OfficialPageDetail from "./pages/official-page/official-page-detail";
import OfficialPageEdit from "./pages/official-page/official-page-edit";
import UsefulInformationList from "./pages/useful-information/useful-information-list";
import UsefulInformationDetail from "./pages/useful-information/useful-information-detail";
import UsefulInformationCreate from "./pages/useful-information/useful-information-create";
import UsefulInformationEdit from "./pages/useful-information/useful-information-edit";
import ContactList from "./pages/contact/contact-list";
import ContactDetail from "./pages/contact/contact-detail";
import ContactCreate from "./pages/contact/contact-create";
import UserList from "./pages/user/user-list";
import UserDetail from "./pages/user/user-detail";
import UserCreate from "./pages/user/user-create";
import UserEdit from "./pages/user/user-edit";


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
							<Route path="/slider" element={<SliderList />} />
							<Route path="/slider/create" element={<SliderCreate />} />
							<Route path="/slider/:id" element={<SliderDetail />} />
							<Route path="/slider/:id/edit" element={<SliderEdit />} />
							<Route path="/partner" element={<PartnerList />} />
							<Route path="/partner/create" element={<PartnerCreate />} />
							<Route path="/partner/:id" element={<PartnerDetail />} />
							<Route path="/partner/:id/edit" element={<PartnerEdit />} />
							<Route path="/referance" element={<ReferanceList />} />
							<Route path="/referance/create" element={<ReferanceCreate />} />
							<Route path="/referance/:id" element={<ReferanceDetail />} />
							<Route path="/referance/:id/edit" element={<ReferanceEdit />} />
							<Route path="/circular" element={<CircularList />} />
							<Route path="/circular/create" element={<CircularCreate />} />
							<Route path="/circular/:id" element={<CircularDetail />} />
							<Route path="/circular/:id/edit" element={<CircularEdit />} />
							<Route path="/faq" element={<FaqList />} />
							<Route path="/faq/create" element={<FaqCreate />} />
							<Route path="/faq/:id" element={<FaqDetail />} />
							<Route path="/faq/:id/edit" element={<FaqEdit />} />
							<Route path="/notification" element={<NotificationList />} />
							<Route path="/notification/create" element={<NotificationCreate />} />
							<Route path="/notification/:id" element={<NotificationDetail />} />
							<Route path="/notification/:id/edit" element={<NotificationEdit />} />
							<Route path="/notification-sub" element={<NotificationSubList />} />
							<Route path="/notification-sub/create" element={<NotificationSubCreate />} />
							<Route path="/notification-sub/:id" element={<NotificationSubDetail />} />
							<Route path="/official-page" element={<OfficialPageDetail />} />
							<Route path="/official-page/edit" element={<OfficialPageEdit />} />
							<Route path="/useful-information" element={<UsefulInformationList />} />
							<Route path="/useful-information/create" element={<UsefulInformationCreate />} />
							<Route path="/useful-information/:id" element={<UsefulInformationDetail />} />
							<Route path="/useful-information/:id/edit" element={<UsefulInformationEdit />} />
							<Route path="/contact" element={<ContactList />} />
							<Route path="/contact/create" element={<ContactCreate />} />
							<Route path="/contact/:id" element={<ContactDetail />} />
							<Route path="/user" element={<UserList />} />
							<Route path="/user/create" element={<UserCreate />} />
							<Route path="/user/:id" element={<UserDetail />} />
							<Route path="/user/:id/edit" element={<UserEdit />} />
							</Route>
						</Route>
					</Routes>
				</BrowserRouter>
			</LoginProvider>
		</QueryProvider>
	);
}

export default App;
