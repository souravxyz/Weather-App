import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { Home } from "./components/home/Home";

const queryClient = new QueryClient();



export const App =()=> {
  return (
    <QueryClientProvider client={queryClient}>
      <Home />
    </QueryClientProvider>
  );
}

