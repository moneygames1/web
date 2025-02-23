"use client";

import { ReactNode } from "react";
import { WagmiProvider, createConfig, http } from "wagmi";
import { bsc } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { createPublicClient } from "viem";

const config = createConfig(
  getDefaultConfig({
    // Your dApp’s chains – now using BSC mainnet
    chains: [bsc],
    transports: {
      // RPC URL for BSC mainnet
      [bsc.id]: http("https://bsc-dataseed.binance.org"),
    },

    walletConnectProjectId: "c7d9f7345fd53467c65953c6918eb0ba",

    // Required App Info
    appName: "Money.Games",

    // Optional App Info
    appDescription: "Your App Description",
    appUrl: "https://themoney.games", // your app's URL
    appIcon: "https://family.co/logo.png", // your app's icon
  })
);

export const publicClient = createPublicClient({
  chain: bsc,
  transport: http("https://bsc-dataseed.binance.org"),
});

const queryClient = new QueryClient();

export const Web3Provider = ({ children }: { children: ReactNode }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider mode="light">{children}</ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
