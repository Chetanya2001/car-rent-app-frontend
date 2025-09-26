import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home/Home";
import Cars from "../pages/Cars/Cars";
import CarWizard from "../components/AddCarWizard/AddCarWizard";
import SearchedCars from "../pages/searchedCars/searchedCars";
import MyCars from "../pages/MyCars/MyCars";
import CarDetails from "../pages/CarDetails/CarDetails";
import VerifyEmail from "../pages/verify-email/verify-email";
import ManageCars from "../pages/admin/manageCars/manageCars";
import ManageGuests from "../pages/admin/manageGuests/manageGuest";
import ManageHosts from "../pages/admin/manageHosts/manageHosts";
import ManageBookings from "../pages/admin/manageBookings/manageBookings";
import ManagePayments from "../pages/admin/managePayments/managePayments";
import ManageSupport from "../pages/admin/manageSupport/manageSupport";

const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/cars" element={<Cars />} />
      <Route path="/add-car" element={<CarWizard />} />
      <Route path="/searched-cars" element={<SearchedCars />} />
      <Route path="/my-cars" element={<MyCars />} />
      <Route path="/car-details/:id" element={<CarDetails />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/admin/manage-cars" element={<ManageCars />} />
      <Route path="/admin/manage-guests" element={<ManageGuests />} />
      <Route path="/admin/manage-hosts" element={<ManageHosts />} />
      <Route path="/admin/manage-bookings" element={<ManageBookings />} />
      <Route path="/admin/manage-payments" element={<ManagePayments />} />
      <Route path="/admin/manage-support" element={<ManageSupport />} />
    </Routes>
  </BrowserRouter>
);

export default AppRoutes;
