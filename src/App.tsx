import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { BackgroundDrawer } from "@/features/background-drawer/BackgroundDrawer";
import { defaultBackgroundDrawerItems } from "@/features/background-drawer/backgroundDrawer.data";

function App() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <main className="min-h-screen bg-zinc-100">
      <div className="fixed right-6 top-6 sm:right-8 sm:top-8">
        <Button className="h-12 rounded-full px-5 shadow-sm shadow-zinc-300" onClick={() => setIsDrawerOpen(true)}>
          Open background drawer
        </Button>
      </div>

      <BackgroundDrawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen} backgrounds={defaultBackgroundDrawerItems} />
    </main>
  );
}

export default App;
