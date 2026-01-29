import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import type { Wallet } from "@/types/index";
import { generateWallet, mnemonic } from "@/utils/wallet";
import { generateMnemonic } from "@scure/bip39";
import { wordlist } from "@scure/bip39/wordlists/english.js";
import {
  ArrowBigUpIcon,
  ArrowUpRight,
  Copy,
  FilePlusCorner,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Textarea } from "../ui/textarea";

export const WalletView = () => {
  const [mnemonic, setMnemonic] = useState("");
  const [walletIndex, setWalletIndex] = useState<number>(0);
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // useEffect(() => {
  //   const handleGenerateWallet = async () => {
  //     setLoading(true);
  //     try {
  //       // await new Promise((res) => setTimeout(() => res("hello"), 5000));
  //       setWalletIndex((walletIndex) => walletIndex! + 1);
  //       console.log(`set index to ${walletIndex}`);
  //       const wallet = await generateWallet(walletIndex!);
  //       toast.success("Wallet generated successfully!");
  //       setWallet(wallet);
  //     } catch (error) {
  //       toast.error("error generating wallet, Please try again.");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   handleGenerateWallet();
  // }, []);

  const handleGenerateWallet = async () => {
    let newPhrase = mnemonic;
    if (!newPhrase.trim()) {
      newPhrase = generateMnemonic(wordlist);
      setMnemonic(newPhrase);
    }

    setLoading(true);
    try {
      const nextIndex = wallets.length;
      const response = await fetch("/api/wallet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mnemonic: newPhrase,
          coin_index: 501, // solana only
          index: nextIndex,
        }),
      });

      const data = await response.json();
      console.log(data);

      if (!response.ok) throw new Error(data.error || "Unknown error");

      console.log(`set index to ${walletIndex}`);
      // const wallet = await generateWallet(walletIndex!);

      toast.success("Wallet generated successfully!");
      setWallets((prev) => [...prev, data]);
    } catch (error) {
      toast.error("error generating wallet, Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // const handleGenerateWallet = async () => {
  //   setLoading(true);
  //   try {
  //     setWalletIndex((walletIndex) => walletIndex! + 1);
  //     console.log(`set index to ${walletIndex}`);

  //     const wallet = await generateWallet(walletIndex!);
  //     console.log(`wallet generated: ${wallet}`);
  //     toast.success("Wallet generated successfully!");

  //     setWallet(wallet);
  //   } catch (error) {
  //     toast.error("error generating wallet, Please try again.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleCopyPrivateKey = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success("Copied to clipboard!");
  };

  return (
    <Card className="w-full max-w-7xl">
      <CardHeader>
        <CardTitle className="font-bold text-2xl">Generate Wallet</CardTitle>
        <CardDescription>
          <div className="p-2 flex flex-col gap-4">
            Enter your seed phares below or generate using ours
            <Textarea
              placeholder="enter your seed phrase"
              value={mnemonic}
              onChange={(e) => setMnemonic(e.target.value)}
              className="resize-none p-2"
              disabled={mnemonic.length > 0}
            />
            <Button
              type="submit"
              className="w-fit hover:bg-accent cursor-pointer"
              variant={"outline"}
              onClick={handleGenerateWallet}
            >
              Generate Wallet
            </Button>
          </div>
          <Separator />
          <div className="p-2 flex flex-col gap-4 flex-wrap">
            <h1 className="font-semibold text-xl">
              Your Secret Phrase (Mnemonic)
            </h1>
            <div className="py-2 flex gap-2 flex-wrap">
              {mnemonic
                ? mnemonic
                    .split(" ")
                    .map((s) => (
                      <span className="p-2 rounded border text-xl hover:bg-accent cursor-pointer">
                        {s}
                      </span>
                    ))
                : "click on generate wallet"}
            </div>
            <Button
              variant={"outline"}
              onClick={() => handleCopyPrivateKey(mnemonic)}
              className="w-fit"
              disabled={mnemonic.length === 0}
            >
              <Copy className="size-4" /> Copy Secret Phrase
            </Button>{" "}
          </div>
        </CardDescription>
      </CardHeader>
      <Separator />
      <CardContent>
        {loading ? (
          <Spinner />
        ) : (
          <div>
            {wallets.length === 0 ? (
              <div className="flex items-center justify-center p-2">
                <div className="flex p-2 justify-center items-center w-full gap-4">
                  <FilePlusCorner />
                  <span className="font-semibold text-xl capitalize">
                    click on generate wallet to continue
                  </span>
                </div>
              </div>
            ) : (
              <div className="p-2 flex flex-wrap justify-start gap-4">
                {wallets.map((wallet, index) => (
                  <Card className="max-w-sm" key={wallet.path}>
                    <CardHeader>
                      <CardTitle>Wallet {index + 1}</CardTitle>
                      <CardDescription>solana wallet</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="max-w-lg flex flex-col justify-between gap-4">
                        <div className="leading-none font-medium">
                          Public Key:
                          <span
                            className="block w-full text-md truncate"
                            title={wallet.publicKey}
                          >
                            {wallet.publicKey}{" "}
                          </span>
                        </div>
                        <div className="text-muted-foreground">
                          Private Key:{" "}
                          <span
                            className="block w-full text-sm truncate"
                            title={wallet.privateKey}
                          >
                            {wallet.privateKey}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex-col gap-2">
                      <Button
                        variant={"outline"}
                        onClick={() => handleCopyPrivateKey(wallet.privateKey)}
                      >
                        <Copy className="size-4" /> Copy Private Key
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <div className="flex gap-2 justify-center items-center">
          Crafted by
          <div className="border p-2 flex gap-2 items-center rounded-lg">
            <a href="https://github.com/harpalll" className="underline">
              harpalll
            </a>
            <ArrowUpRight />
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};
