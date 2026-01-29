import { mnemonicToSeedSync, validateMnemonic } from "@scure/bip39";
import { wordlist } from "@scure/bip39/wordlists/english.js";
import bs58 from "bs58";
import { Keypair } from "@solana/web3.js";
import { derivePath } from "ed25519-hd-key";
import { HDNodeWallet, ethers } from "ethers";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { mnemonic, index, coin_index } = body;

    if (!mnemonic) {
      return Response.json(
        { error: "Mnemonic phrase is required" },
        { status: 400 },
      );
    }

    if (!validateMnemonic(mnemonic, wordlist)) {
      return Response.json(
        { error: "Invalid mnemonic phrase" },
        { status: 400 },
      );
    }

    const walletIndex = index ? parseInt(index) : 0;
    const seed = mnemonicToSeedSync(mnemonic);
    let publicKey: string;
    let privateKey: string;
    let currency: string;
    let path: string;

    if (coin_index === 501) {
      currency = "Solana";
      path = `m/44'/501'/${walletIndex}'/0'`;

      const seedHex = Buffer.from(seed).toString("hex");
      const derived = derivePath(path, seedHex);

      const keypair = Keypair.fromSeed(derived.key);
      publicKey = keypair.publicKey.toBase58();
      privateKey = bs58.encode(keypair.secretKey);
    } else if (coin_index === 60) {
      currency = "Ethereum";
      path = `m/44'/60'/0'/0/${walletIndex}`;

      const hdNode = HDNodeWallet.fromSeed(seed);
      const derivedWallet = hdNode.derivePath(path);

      privateKey = derivedWallet.privateKey;
      publicKey = derivedWallet.address;
    } else {
      return Response.json(
        {
          error: "Unsupported path type",
        },
        {
          status: 400,
        },
      );
    }

    return Response.json({
      index: walletIndex,
      publicKey,
      privateKey,
      path,
      currency,
    });
  } catch (error) {
    console.error("Derivation error:", error);
    return Response.json({ error: "Failed to derive wallet" }, { status: 500 });
  }
}
