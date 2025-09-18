import { BrowserRouter } from "react-router-dom";
import { Providers, AppRoutes } from "./app/index";
import { SplashWrapper, ToasterProvider } from "./components";

export default function App() {
  return (
    <>
      <SplashWrapper>
        <ToasterProvider />
        <Providers>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </Providers>
      </SplashWrapper>
    </>
  );
}
