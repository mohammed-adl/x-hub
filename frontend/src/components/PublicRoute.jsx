import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../contexts";

function PublicRoute() {
  const { user } = useUser();

  if (user) return <Navigate to="/home" replace />;
  return <Outlet />;
}

export default PublicRoute;
