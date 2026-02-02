import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import type { Wallet } from "@/types/index";
import { generateMnemonic } from "@scure/bip39";
import { wordlist } from "@scure/bip39/wordlists/english.js";
import { ArrowUpRight, Copy, FilePlusCorner } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { getData, removeData, storeData } from "@/utils/storage";

type Currency = {
  name: string;
  coin_index: number | null;
  iconUrl: string;
  color: string;
};

const CURRENCIES: Currency[] = [
  {
    name: "Solana",
    coin_index: 501,
    iconUrl: "https://cryptologos.cc/logos/solana-sol-logo.png",
    color: "#9945FF",
  },
  {
    name: "Ethereum",
    coin_index: 60,
    iconUrl: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
    color: "#627EEA",
  },
];

export const WalletView = () => {
  const [mnemonic, setMnemonic] = useState("");
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(
    CURRENCIES[0],
  );

  useEffect(() => {
    const localStorageRetrival = async () => {
      const walletsLs = await getData("wallets", []);
      const menmonicLs = await getData("mnemonic", "");

      if (walletsLs) setWallets(walletsLs);
      if (menmonicLs) setMnemonic(menmonicLs);
    };
    localStorageRetrival();
  }, []);

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
          coin_index: selectedCurrency.coin_index,
          index: nextIndex,
        }),
      });

      const data = await response.json();
      console.log(data);

      if (!response.ok) throw new Error(data.error || "Unknown error");

      await storeData("mnemonic", newPhrase);
      await storeData("wallets", [...wallets, data]);

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

  const handleClearAll = async () => {
    setWallets([]);
    setMnemonic("");

    await removeData("wallets");
    await removeData("mnemonic");
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
            <div className="flex items-center gap-4">
              <Select
                value={selectedCurrency.coin_index?.toString()!}
                onValueChange={(value) => {
                  const currency = CURRENCIES.find(
                    (c) => c.coin_index!.toString() === value,
                  );

                  if (currency) {
                    setSelectedCurrency(currency);
                  }
                }}
              >
                <SelectTrigger className="w-full max-w-48">
                  <SelectValue placeholder="Select a currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Currencies</SelectLabel>
                    {CURRENCIES.map((currency) => (
                      <SelectItem
                        value={currency.coin_index?.toString()!}
                        key={currency.coin_index}
                      >
                        <img src={currency.iconUrl} width={20} height={20} />
                        {currency.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Button
                type="submit"
                className="w-fit hover:bg-accent cursor-pointer"
                variant={"outline"}
                onClick={handleGenerateWallet}
              >
                Generate Wallet
              </Button>

              <Button
                type="button"
                className="w-fit cursor-pointer hover:bg-destructive/80 justify-self-end"
                variant={"destructive"}
                onClick={handleClearAll}
              >
                Clear Wallets
              </Button>
            </div>
          </div>
          <Separator />
          <div className="p-2 flex flex-col gap-4 flex-wrap">
            <h1 className="font-semibold text-xl">
              Your Secret Phrase (Mnemonic)
            </h1>
            <div className="py-2 flex gap-2 flex-wrap">
              {mnemonic
                ? mnemonic.split(" ").map((s, index) => (
                    <span
                      className="p-2 rounded border text-xl hover:bg-accent cursor-pointer"
                      key={index}
                    >
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
          <div className="flex items-center justify-center">
            <Spinner />
          </div>
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
                      <CardTitle>
                        <div className="flex gap-4 items-center">
                          {wallet.path.includes("501") ? (
                            <img
                              src={CURRENCIES[0].iconUrl}
                              width={20}
                              height={20}
                            />
                          ) : (
                            <img
                              src={CURRENCIES[1].iconUrl}
                              width={20}
                              height={20}
                            />
                          )}
                          Wallet {index + 1}
                        </div>
                      </CardTitle>
                      <CardDescription className="capitalize text-sm">
                        {wallet.path.includes("501")
                          ? "solana wallet"
                          : "ethereum wallet"}
                      </CardDescription>
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
          {/* <div
            className="border p-2 flex gap-2 items-center rounded-lg"
            onClick={() => {
              location.replace("https://github.com/harpalll");
            }}
          >
            <a href="https://github.com/harpalll" className="underline">
              harpalll
            </a>
            <ArrowUpRight />
          </div> */}
          <a
            href="https://github.com/harpalll"
            target="_blank"
            rel="noopener noreferrer"
            className="border p-2 flex gap-2 items-center rounded-lg hover:bg-muted transition"
          >
            <span className="underline">harpalll</span>
            <ArrowUpRight />
          </a>
        </div>
      </CardFooter>
    </Card>
  );
};
