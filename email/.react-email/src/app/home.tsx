'use client';

import Link from 'next/link';
import { Button, Heading, Text } from '../components';
import { Shell } from '../components/shell';

export default function Home({ navItems }) {
  return (
    <Shell navItems={navItems}>
      <div className="mx-auto mt-56 max-w-md rounded-md border border-slate-6 p-8">
        <Heading as="h2" weight="medium">
          Welcome to the React Email preview!
        </Heading>
        <Text as="p" className="mb-4 mt-2">
          To start developing your next email template, you can create a{' '}
          <code>.jsx</code> or <code>.tsx</code> file under the "emails" folder.
        </Text>

        <Button asChild>
          <Link href="https://react.email/docs">Check the docs</Link>
        </Button>
      </div>
    </Shell>
  );
}
