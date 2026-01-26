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
import { Copy, FilePlusCorner } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const WalletView = () => {
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
    setLoading(true);
    try {
      // await new Promise((res) => setTimeout(() => res("hello"), 5000));
      setWalletIndex((walletIndex) => walletIndex! + 1);
      console.log(`set index to ${walletIndex}`);
      const wallet = await generateWallet(walletIndex!);
      toast.success("Wallet generated successfully!");

      setWallets((prev) => [...prev, wallet]);
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
          <div className="p-2">
            Enter your seed phares below or generate using ours
          </div>
          <Separator />
          <div className="p-2 flex flex-col gap-4">
            <h1 className="font-semibold text-xl">
              Your Secret Phrase (Mnemonic)
            </h1>
            <div className="py-2 flex gap-2">
              {mnemonic.split(" ").map((s) => (
                <span className="p-2 rounded border text-xl hover:bg-accent cursor-pointer">
                  {s}
                </span>
              ))}
            </div>
            <Button
              variant={"outline"}
              onClick={() => handleCopyPrivateKey(mnemonic)}
              className="w-fit"
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
            <div className="p-2">
              <form>
                <div className="flex flex-col gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="seedPhrase">Seed Phrase</Label>
                    <Input
                      id="seedPhrase"
                      type="text"
                      placeholder="Enter your seed phrase (or leave blank to generate)"
                    />
                  </div>
                </div>
              </form>
            </div>

            <Separator />

            {wallets.length === 0 ? (
              <div className="flex items-center justify-center p-2">
                <div className="flex p-2 justify-center items-center w-full gap-4">
                  <FilePlusCorner />
                  <span className="font-semibold text-xl capitalize">click on generate wallet to continue</span>
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
        <Button
          type="submit"
          className="w-fit hover:bg-accent cursor-pointer"
          variant={"outline"}
          onClick={handleGenerateWallet}
        >
          Generate Wallet
        </Button>
      </CardFooter>
    </Card>
  );
};
