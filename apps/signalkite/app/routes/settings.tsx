import { Button } from "@/components/button"
import { Checkbox, CheckboxField } from "@/components/checkbox"
import { Divider } from "@/components/divider"
import { Label } from "@/components/fieldset"
import { Heading, Subheading } from "@/components/heading"
import { Input } from "@/components/input"
import { Select } from "@/components/select"
import { Text } from "@/components/text"
import { Textarea } from "@/components/textarea"
import { Address } from "./address"

export default function Settings() {
  return (
    <form method="post" className="mx-auto max-w-4xl">
      <Heading>Settings</Heading>
      <Divider className="my-10 mt-6" />

      <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
        <div className="space-y-1">
          <Subheading>Organization Name</Subheading>
          <Text>This will be displayed on your public profile.</Text>
        </div>
        <div>
          <Input
            aria-label="Organization Name"
            name="name"
            defaultValue="Catalyst"
          />
        </div>
      </section>

      <Divider className="my-10" soft />

      <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
        <div className="space-y-1">
          <Subheading>Organization Bio</Subheading>
          <Text>
            This will be displayed on your public profile. Maximum 240
            characters.
          </Text>
        </div>
        <div>
          <Textarea aria-label="Organization Bio" name="bio" />
        </div>
      </section>

      <Divider className="my-10" soft />

      <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
        <div className="space-y-1">
          <Subheading>Organization Email</Subheading>
          <Text>This is how customers can contact you for support.</Text>
        </div>
        <div className="space-y-4">
          <Input
            type="email"
            aria-label="Organization Email"
            name="email"
            defaultValue="info@example.com"
          />
          <CheckboxField>
            <Checkbox name="email_is_public" defaultChecked />
            <Label>Show email on public profile</Label>
          </CheckboxField>
        </div>
      </section>

      <Divider className="my-10" soft />

      <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
        <div className="space-y-1">
          <Subheading>Address</Subheading>
          <Text>This is where your organization is registered.</Text>
        </div>
        <Address />
      </section>

      <Divider className="my-10" soft />

      <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
        <div className="space-y-1">
          <Subheading>Currency</Subheading>
          <Text>The currency that your organization will be collecting.</Text>
        </div>
        <div>
          <Select aria-label="Currency" name="currency" defaultValue="cad">
            <option value="cad">CAD - Canadian Dollar</option>
            <option value="usd">USD - United States Dollar</option>
          </Select>
        </div>
      </section>

      <Divider className="my-10" soft />

      <div className="flex justify-end gap-4">
        <Button type="reset" plain>
          Reset
        </Button>
        <Button type="submit">Save changes</Button>
      </div>
    </form>
  )
}
