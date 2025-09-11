export const LIVE: number = 0;
export const CHOPSTICKS: number = 1;
export const ZOMBIENET: number = 2;


export const ENDPOINTS = ZOMBIENET;

export const KAH_WS_URL = ENDPOINTS === LIVE
  ? "wss://sys.ibp.network/asset-hub-kusama"
  : ENDPOINTS === CHOPSTICKS
    ? "ws://localhost:8000"
    : "ws://localhost:9010";
export const ITK_WS_URL = ENDPOINTS === LIVE
  ? "wss://kusama.api.integritee.network"
  : ENDPOINTS === CHOPSTICKS
    ? "ws://localhost:8001"
    : "ws://localhost:9144";
export const PAH_WS_URL = ENDPOINTS === LIVE
  ? "wss://sys.ibp.network/asset-hub-polkadot"
  : ENDPOINTS === CHOPSTICKS
    ? "ws://localhost:8002"
    : "ws://localhost:9910";
export const ITP_WS_URL = ENDPOINTS === LIVE
  ? "wss://polkadot.api.integritee.network"
  : ENDPOINTS === CHOPSTICKS
    ? "ws://localhost:8003"
    : "ws://localhost:9244";
export const KSM_WS_URL = ENDPOINTS === LIVE
  ? "wss://rpc.ibp.network/kusama"
  : ENDPOINTS === CHOPSTICKS
    ? "skipped"
    : "ws://localhost:9945";
export const DOT_WS_URL = ENDPOINTS === LIVE
  ? "wss://rpc.ibp.network/polkadot"
  : ENDPOINTS === CHOPSTICKS
    ? "skipped"
    : "ws://localhost:9942";

