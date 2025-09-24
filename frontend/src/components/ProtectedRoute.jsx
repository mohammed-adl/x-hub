import { Outlet } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { useUser } from "../contexts";
import { SplashScreen } from "./ui";

import { handleGetUser } from "../fetchers";
import { initSocketConnection, disconnectSocket, socket } from "../socket";
import { authService } from "../services";

function ProtectedRoute() {
  const { user } = useUser();
  const { username } = useParams();
  const navigate = useNavigate();
  const hasRun = useRef(false);
  const [loading, setLoading] = useState(true);

  const validateToken = async () => {
    try {
      const isExpired = await authService.validateAccessToken();
      if (isExpired) {
        const body = await authService.callRefreshToken();
        if (body) authService.setTokens(body);
      }

      if (username && user && username !== user.username) {
        try {
          const body = await handleGetUser(username);
          if (body.user.username !== username) {
            navigate(`/home`);
          }
        } catch (err) {
          navigate("/home");
        }
      }

      initSocketConnection();
    } catch (err) {
      authService.logout();

      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    //Avoid react restrict mode race conditions
    if (hasRun.current) return;
    hasRun.current = true;

    if (!user) return;

    validateToken();

    return () => {
      disconnectSocket();
    };
  }, []);

  if (!user) return authService.logout();
  if (loading) return <SplashScreen />;

  return <Outlet />;
}

export default ProtectedRoute;
