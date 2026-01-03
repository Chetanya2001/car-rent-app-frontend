import { useLocation, Navigate } from "react-router-dom";
import BookACar from "./BookACar";
import BookIntercity from "./BookIntercity";

export default function BookAcarRouter() {
  const { state } = useLocation();

  // Safety guard
  if (!state || !state.tripType) {
    return <Navigate to="/" replace />;
  }

  if (state.tripType === "intercity") {
    return <BookIntercity />;
  }

  return <BookACar />;
}
