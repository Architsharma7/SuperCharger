import "../styles/globals.css";
import { ChakraProvider } from "@chakra-ui/react";
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { mainnet, polygon, polygonMumbai } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import Navbar from "../components/navbar";
import localFont from "@next/font/local";

const myFont = localFont({ src: "./CalSans-SemiBold.woff2" });

const CalibrationChain = {
  id: 314159,
  name: "Filecoin - Calibration testnet",
  network: "Filecoin - Calibration testnet",
  nativeCurrency: {
    decimals: 18,
    name: "Test Filecoin",
    symbol: "tFIL",
  },
  rpcUrls: {
    public: {
      http: ["https://api.calibration.node.glif.io/rpc/v1"],
    },
    default: {
      http: ["https://calibration.filfox.info/rpc/v1"],
    },
  },
  blockExplorers: {
    default: {
      name: "Filfox Explorer",
      url: "https://calibration.filfox.info",
    },
  },
  testnet: true,
};

const { chains, publicClient } = configureChains(
  [CalibrationChain],
  [alchemyProvider({ apiKey: process.env.ALCHEMY_ID }), publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "My RainbowKit App",
  projectId: "YOUR_PROJECT_ID",
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider>
      <WagmiConfig config={wagmiConfig}>
        <RainbowKitProvider chains={chains}>
          <main className={myFont.className}>
            <Navbar />
            <Component {...pageProps} />
          </main>
        </RainbowKitProvider>
      </WagmiConfig>
    </ChakraProvider>
  );
}

export default MyApp;
