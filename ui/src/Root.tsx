import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { Provider as ReduxProvider } from "react-redux";
import store from "./store";
import App from "./App";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const Root = () => {
  return (
    <MantineProvider theme={{ fontFamily: "Poppins" }}>
      <QueryClientProvider client={queryClient}>
        <ReduxProvider store={store}>
          <App />
          <ReactQueryDevtools initialIsOpen={false} />
        </ReduxProvider>
      </QueryClientProvider>
    </MantineProvider>
  );
};

export default Root;
