import { Toaster } from "@/components/ui/sonner";
import { WalletView } from "@/components/wallet/WalletView";
import { SolanaLogo } from "./components/SolanaLogo";

function App() {
  return (
    <>
      <Toaster invert={true} />
      {/* <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme"> */}
      <div className="bg-white flex gap-2 min-h-screen flex-col">
        <nav className="p-2">
          <div className="flex gap-2 items-center">
            <SolanaLogo height={30} width={30} />
            <span className="text-3xl font-bold">Cipher</span>
          </div>
        </nav>
        {/* <Button variant="outline">Button</Button>
      <Button variant="outline" size="icon" aria-label="Submit">
        <ArrowUpIcon />
      </Button> */}
        <div className="flex justify-center items-center">
          <WalletView />
        </div>
        {/* <Button variant="outline" onClick={() => toast("My first toast")}>
          Show Toast
        </Button> */}
      </div>

      {/* <div>
          <ModeToggle />
        </div> */}
      {/* </ThemeProvider> */}
    </>
  );
}

export default App;
