import { Plus, Trash2 } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

import { ConfirmDialog } from "@/components/confirm-dialog"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { currentUser } from "@/services/mock-data"

const API_KEYS = [
  { id: "key_1", name: "CI pipeline", created: "2026-08-02", lastUsed: "2h ago" },
  { id: "key_2", name: "Local dev", created: "2026-06-14", lastUsed: "3 days ago" },
]

export default function SettingsPage() {
  const [twoFactor, setTwoFactor] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [revokeTarget, setRevokeTarget] = useState<string | null>(null)

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your profile, appearance, and security.</p>
      </div>

      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Workspace</CardTitle>
              <CardDescription>
                Your login routes you to this workspace automatically — it isn't user-configurable.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground">{currentUser.companyName}</p>
              <p className="text-xs text-muted-foreground">{currentUser.plan} plan</p>
            </CardContent>
          </Card>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              toast.success("Profile saved")
            }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" defaultValue={currentUser.name} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue={currentUser.email} />
                </div>
              </CardContent>
              <CardFooter className="justify-end gap-2">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
                <Button type="submit">Save changes</Button>
              </CardFooter>
            </Card>
          </form>
        </TabsContent>

        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Dark mode is the default — switch anytime.</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <Label>Theme</Label>
              <ThemeToggle />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              toast.success("Password updated")
            }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Password</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="current-password">Current password</Label>
                  <Input id="current-password" type="password" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="new-password">New password</Label>
                  <Input id="new-password" type="password" />
                </div>
              </CardContent>
              <CardFooter className="justify-end gap-2">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
                <Button type="submit">Update password</Button>
              </CardFooter>
            </Card>
          </form>

          <Card>
            <CardContent className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Two-factor authentication</p>
                <p className="text-xs text-muted-foreground">
                  Require a code at login in addition to your password.
                </p>
              </div>
              <Switch checked={twoFactor} onCheckedChange={setTwoFactor} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>API keys</CardTitle>
              <CardDescription>Used by integrations and CI to call the API on your behalf.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Last used</TableHead>
                    <TableHead className="text-right"> </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {API_KEYS.map((key) => (
                    <TableRow key={key.id}>
                      <TableCell className="text-foreground">{key.name}</TableCell>
                      <TableCell className="text-muted-foreground">{key.created}</TableCell>
                      <TableCell className="text-muted-foreground">{key.lastUsed}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label={`Revoke ${key.name}`}
                          onClick={() => setRevokeTarget(key.name)}
                        >
                          <Trash2 className="text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="justify-end">
              <Button variant="outline" size="sm" onClick={() => toast.success("New API key generated")}>
                <Plus /> Generate new key
              </Button>
            </CardFooter>
          </Card>

          <Card className="border-destructive/30">
            <CardHeader>
              <CardTitle className="text-destructive">Danger zone</CardTitle>
              <CardDescription>Permanently delete your account and all of its data.</CardDescription>
            </CardHeader>
            <CardFooter className="justify-end">
              <Button variant="destructive" onClick={() => setDeleteOpen(true)}>
                Delete account
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      <ConfirmDialog
        open={Boolean(revokeTarget)}
        onOpenChange={(open) => !open && setRevokeTarget(null)}
        title={`Revoke "${revokeTarget}"?`}
        description="Anything using this key will immediately lose access."
        confirmLabel="Revoke key"
        onConfirm={() => toast.success("API key revoked")}
      />

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete your account?"
        description="This permanently deletes your account and all associated data. This can't be undone."
        confirmLabel="Delete account"
        onConfirm={() => toast.error("Account deletion isn't enabled in this preview")}
      />
    </div>
  )
}
