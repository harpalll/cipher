// import nacl from "tweetnacl";
// import { generateMnemonic, mnemonicToSeedSync } from "bip39";
// import { derivePath } from "ed25519-hd-key";
// import { Keypair } from "@solana/web3.js";
// import type { Wallet } from "../types/index";
// import bs58 from "bs58";

// const mnemonic = generateMnemonic();
// const seed = mnemonicToSeedSync(mnemonic);

// export const generateWallet = (index: number): Wallet => {
//   const path = `m/44'/501'/${index}'/0'`; // derivation path
//   const derivedSeed = derivePath(path, seed.toString("hex")).key;
//   const { secretKey } = nacl.sign.keyPair.fromSeed(derivedSeed);
//   const keyPair = Keypair.fromSecretKey(secretKey);

//   console.log("\n");

//   const wallet: Wallet = {
//     publicKey: keyPair.publicKey.toBase58(),
//     privateKey: bs58.encode(secretKey),
//     mnemonic,
//     path,
//   };
//   console.log(wallet);

//   return wallet;
// };

// generateWallet(0);
// generateWallet(1);
// generateWallet(2);
import { generateMnemonic, mnemonicToSeed } from "@scure/bip39";
import { wordlist } from "@scure/bip39/wordlists/english.js";
import nacl from "tweetnacl";
import bs58 from "bs58";
import { Keypair } from "@solana/web3.js";
export const mnemonic = generateMnemonic(wordlist);

function derivePath(seed: Uint8Array, index: number): Uint8Array {
  const slice = seed.slice(0, 32);
  slice[0] = slice[0] + index;
  return slice;
}

export const generateWallet = async (index = 0) => {
  const seed = await mnemonicToSeed(mnemonic); // returns Uint8Array
  const derivedSeed = derivePath(seed, index); // Uint8Array

  const { secretKey } = nacl.sign.keyPair.fromSeed(derivedSeed);
  const keyPair = Keypair.fromSecretKey(secretKey);

  return {
    publicKey: keyPair.publicKey.toBase58(),
    privateKey: bs58.encode(secretKey),
    mnemonic,
    path: `m/44'/501'/${index}'/0'`,
  };
};
