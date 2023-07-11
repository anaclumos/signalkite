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
        <button className="box-border flex items-center self-center justify-center w-20 h-5 px-4 py-4 font-sans text-sm text-center transition duration-300 ease-in-out border rounded-lg outline-none border-slate-6 text-slate-11 hover:border-slate-12 hover:text-slate-12">
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
            className="absolute flex items-center justify-center w-6 h-6 text-xs transition duration-300 ease-in-out rounded-full right-2 text-slate-11 hover:text-slate-12"
          >
            ✕
          </Popover.Close>
          <form onSubmit={onFormSubmit} className="mt-1">
            <label
              htmlFor="to"
              className="block mb-2 text-xs uppercase text-slate-10"
            >
              Recipient
            </label>
            <input
              autoFocus={true}
              className="w-full px-2 py-1 mb-3 text-sm transition duration-300 ease-in-out border rounded-lg outline-none appearance-none border-slate-6 bg-slate-3 text-slate-12 placeholder-slate-8 focus:ring-1 focus:ring-slate-12"
              onChange={(e) => setTo(e.target.value)}
              defaultValue={to}
              placeholder="you@example.com"
              type="email"
              id="to"
              required
            />
            <label
              htmlFor="subject"
              className="block mb-2 text-xs uppercase text-slate-10"
            >
              Subject
            </label>
            <input
              className="w-full px-2 py-1 mb-3 text-sm transition duration-300 ease-in-out border rounded-lg outline-none appearance-none border-slate-6 bg-slate-3 text-slate-12 placeholder-slate-8 focus:ring-1 focus:ring-slate-12"
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
