import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/auth/Login";

const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<Login />} />
      {/* other routes */}
    </Routes>
  </BrowserRouter>
);

export default AppRoutes;
