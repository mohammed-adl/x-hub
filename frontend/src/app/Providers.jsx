import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UserProvider } from "../contexts/UserContext.jsx";
// import { NotificationProvider } from "../contexts/NotificationContext.jsx";

const queryClient = new QueryClient();

export default function Providers({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        {children}
        {/* <NotificationProvider>{children}</NotificationProvider> */}
      </UserProvider>
    </QueryClientProvider>
  );
}
