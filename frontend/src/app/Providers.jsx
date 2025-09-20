import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  UserProvider,
  MessageProvider,
  NotificationProvider,
} from "../contexts";

const queryClient = new QueryClient();

export default function Providers({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <MessageProvider>
          <NotificationProvider>{children}</NotificationProvider>
        </MessageProvider>
      </UserProvider>
    </QueryClientProvider>
  );
}
