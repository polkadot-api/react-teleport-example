import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ExtensionProvider } from "./context/ExtensionProvider"
import { AccountProvider } from "./context/AccountProvider"
import { Teleport } from "./Teleport"
import AppWrapper from "./components/Layout/AppWrapper"

export default function App() {
  return (
    <AppWrapper>
      <div className="container mx-auto px-4 py-12">
        <Card className="w-full max-w-sm mx-auto bg-card/70 backdrop-blur-sm border-white/10">
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              TEER CrossChain Tool
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <ExtensionProvider>
              <AccountProvider>
                <Teleport />
              </AccountProvider>
            </ExtensionProvider>
          </CardContent>
        </Card>
      </div>
    </AppWrapper>
  )
}
