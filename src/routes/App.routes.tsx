import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home/Home";
import Cars from "../pages/Cars/Cars";

const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/cars" element={<Cars />} />
      {/* other routes */}
    </Routes>
  </BrowserRouter>
);

export default AppRoutes;
