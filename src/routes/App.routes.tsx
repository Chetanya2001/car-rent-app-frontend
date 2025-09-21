import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home/Home";
import Cars from "../pages/Cars/Cars";
import CarWizard from "../components/AddCarWizard/AddCarWizard";
import SearchedCars from "../pages/searchedCars/searchedCars";
import MyCars from "../pages/MyCars/MyCars";
import CarDetails from "../pages/CarDetails/CarDetails";
import VerifyEmail from "../pages/verify-email/verify-email";

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
      {/* other routes */}
    </Routes>
  </BrowserRouter>
);

export default AppRoutes;
