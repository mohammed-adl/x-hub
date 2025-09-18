import { Routes, Route, Navigate } from "react-router-dom";

import {
  Auth,
  Home,
  SignUp,
  LogIn,
  ResetPassword,
  // Notifications,
  // Profile,
  // Following,
  // Followers,
  // Tweet,
  // EditProfile,
  // DevicesLogs,
  // Search,
} from "../pages/index.js";

import {
  MainLayout,
  PublicRoute,
  ProtectedRoute,
} from "../components/index.js";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route path="/" element={<Auth />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/search" element={<Search />} />
          <Route path="/devices" element={<DevicesLogs />} />
          <Route path="/tweet/:id" element={<Tweet />} />
          {/* <Route path="/profile/edit" element={<EditProfile />} />
          <Route path="/:username" element={<Profile />} />
          <Route path="/:username/following" element={<Following />} />
          <Route path="/:username/followers" element={<Followers />} /> */}
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
