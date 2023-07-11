import * as Popover from '@radix-ui/react-popover';
import * as React from 'react';
import { inter } from '../app/layout';
import { Button } from './button';
import { Text } from './text';

export const Send = ({ markup }: { markup: string }) => {
  const [to, setTo] = React.useState('');
  const [subject, setSubject] = React.useState('Testing React Email');
  const [isSending, setIsSending] = React.useState(false);

  const onFormSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      setIsSending(true);

      const response = await fetch('https://react.email/api/send/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to,
          subject,
          html: markup,
        }),
      });

      if (response.status === 429) {
        const { error } = await response.json();
        alert(error);
      }
    } catch (e) {
      alert('Something went wrong. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button className="box-border flex h-5 w-20 items-center justify-center self-center rounded-lg border border-slate-6 px-4 py-4 text-center font-sans text-sm text-slate-11 outline-none transition duration-300 ease-in-out hover:border-slate-12 hover:text-slate-12">
          Send
        </button>
      </Popover.Trigger>
      <Popover.Anchor />
      <Popover.Portal>
        <Popover.Content
          align="end"
          className={`-mt-10 w-80 rounded-lg border border-slate-6 bg-black p-3 font-sans text-slate-11 ${inter.variable}`}
        >
          <Popover.Close
            aria-label="Close"
            className="absolute right-2 flex h-6 w-6 items-center justify-center rounded-full text-xs text-slate-11 transition duration-300 ease-in-out hover:text-slate-12"
          >
            ✕
          </Popover.Close>
          <form onSubmit={onFormSubmit} className="mt-1">
            <label
              htmlFor="to"
              className="mb-2 block text-xs uppercase text-slate-10"
            >
              Recipient
            </label>
            <input
              autoFocus={true}
              className="mb-3 w-full appearance-none rounded-lg border border-slate-6 bg-slate-3 px-2 py-1 text-sm text-slate-12 placeholder-slate-8 outline-none transition duration-300 ease-in-out focus:ring-1 focus:ring-slate-12"
              onChange={(e) => setTo(e.target.value)}
              defaultValue={to}
              placeholder="you@example.com"
              type="email"
              id="to"
              required
            />
            <label
              htmlFor="subject"
              className="mb-2 block text-xs uppercase text-slate-10"
            >
              Subject
            </label>
            <input
              className="mb-3 w-full appearance-none rounded-lg border border-slate-6 bg-slate-3 px-2 py-1 text-sm text-slate-12 placeholder-slate-8 outline-none transition duration-300 ease-in-out focus:ring-1 focus:ring-slate-12"
              onChange={(e) => setSubject(e.target.value)}
              defaultValue={subject}
              placeholder="My Email"
              type="text"
              id="subject"
              required
            />
            <input
              type="checkbox"
              className="appearance-none checked:bg-blue-500"
            />
            <div className="flex items-center justify-between">
              <Text className="inline-block" size="1">
                Powered by{' '}
                <a
                  className="transition duration-300 ease-in-out hover:text-slate-12"
                  href="https://resend.com"
                  target="_blank"
                  rel="noreferrer"
                >
                  Resend
                </a>
              </Text>
              <Button
                type="submit"
                disabled={subject.length === 0 || to.length === 0 || isSending}
                className="disabled:border-transparent disabled:bg-slate-11"
              >
                Send
              </Button>
            </div>
          </form>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};
