import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ExtensionProvider } from "./context/ExtensionProvider"
import { AccountProvider } from "./context/AccountProvider"
import { Teleport } from "./Teleport"
import { ReactiveDotProvider } from "@reactive-dot/react"
import { config } from "./reactive-dot.config"
import { Suspense } from "react"

export default function LoginForm() {
  return (
    <ReactiveDotProvider config={config}>
      <Suspense>
        <div className="flex items-center justify-center mt-6">
          <Card className="w-full max-w-sm">
            <CardHeader>
              <CardTitle className="text-2xl text-center">
                PAPI Teleporter
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
      </Suspense>
    </ReactiveDotProvider>
  )
}
