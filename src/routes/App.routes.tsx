// src/routes/AppRoutes.tsx
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
import AdminRoute from "../components/AdminRoute/AdminRoute"; // Make sure path is correct

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
      <Route
        path="/admin/manage-cars"
        element={
          <AdminRoute>
            <ManageCars />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/manage-guests"
        element={
          <AdminRoute>
            <ManageGuests />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/manage-hosts"
        element={
          <AdminRoute>
            <ManageHosts />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/manage-bookings"
        element={
          <AdminRoute>
            <ManageBookings />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/manage-payments"
        element={
          <AdminRoute>
            <ManagePayments />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/manage-support"
        element={
          <AdminRoute>
            <ManageSupport />
          </AdminRoute>
        }
      />
    </Routes>
  </BrowserRouter>
);

export default AppRoutes;
