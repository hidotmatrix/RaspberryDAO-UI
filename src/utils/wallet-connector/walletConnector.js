import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets } from "@rainbow-me/rainbowkit";
import { chain, configureChains, createClient } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";

export const { chains, provider } = configureChains(
  [
    // chain.mainnet,
    // chain.polygon,
    // chain.rinkeby,
    chain.polygonMumbai,
    // chain.goerli,
    // chain.optimism,
    // chain.arbitrum,
  ],
  [
    alchemyProvider({ alchemyId: process.env.REACT_APP_ALCHEMY_API_KEY }), // zUssq5K8tyjkpvaNDtbVYjHmjcchOgXF
    publicProvider(),
  ]
);

export const { connectors } = getDefaultWallets({
  appName: "My RainbowKit App",
  chains,
});

export const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});
