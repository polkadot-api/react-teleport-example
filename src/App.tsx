import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ExtensionProvider } from "./context/ExtensionProvider"
import { AccountProvider } from "./context/AccountProvider"
import { Teleport } from "./Teleport"

export default function LoginForm() {
  return (
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
  )
}
