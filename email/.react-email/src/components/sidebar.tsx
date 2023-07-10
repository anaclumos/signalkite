import * as Collapsible from '@radix-ui/react-collapsible';
import classnames from 'classnames';
import { LayoutGroup, motion } from 'framer-motion';
import Link from 'next/link';
import * as React from 'react';
import { Heading } from './heading';
import { Logo } from './logo';

type SidebarElement = React.ElementRef<'aside'>;
type RootProps = React.ComponentPropsWithoutRef<'aside'>;

interface SidebarProps extends RootProps {
  navItems: string[];
  title?: string;
}

export const Sidebar = React.forwardRef<SidebarElement, Readonly<SidebarProps>>(
  ({ className, navItems, title, ...props }, forwardedRef) => {
    return (
      <aside
        ref={forwardedRef}
        className="flex min-w-[275px] max-w-[275px] flex-col gap-4 border-r border-slate-6 px-6"
        {...props}
      >
        <div className="flex h-[70px] items-center">
          <Logo />
        </div>

        <nav className="flex flex-col gap-4">
          <Collapsible.Root defaultOpen>
            <Collapsible.Trigger
              className={classnames('flex items-center gap-1', {
                'cursor-default': navItems && navItems.length === 0,
              })}
            >
              <svg
                className="text-slate-11"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19.25 17.25V9.75C19.25 8.64543 18.3546 7.75 17.25 7.75H4.75V17.25C4.75 18.3546 5.64543 19.25 6.75 19.25H17.25C18.3546 19.25 19.25 18.3546 19.25 17.25Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M13.5 7.5L12.5685 5.7923C12.2181 5.14977 11.5446 4.75 10.8127 4.75H6.75C5.64543 4.75 4.75 5.64543 4.75 6.75V11"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              <div className="flex items-center text-slate-11 transition duration-200 ease-in-out hover:text-slate-12">
                <Heading
                  as="h3"
                  color="gray"
                  size="2"
                  weight="medium"
                  className="transition duration-200 ease-in-out hover:text-slate-12"
                >
                  All emails
                </Heading>
                {navItems && navItems.length > 0 && (
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 15L8.5359 9.75L15.4641 9.75L12 15Z"
                      fill="currentColor"
                    />
                  </svg>
                )}
              </div>
            </Collapsible.Trigger>

            {navItems && navItems.length > 0 && (
              <Collapsible.Content className="relative mt-3">
                <div className="absolute left-2.5  h-full w-px bg-slate-6" />

                <div className="flex flex-col truncate py-2">
                  <LayoutGroup id="sidebar">
                    {navItems &&
                      navItems.map((item) => {
                        const isCurrentPage = title === item;
                        return (
                          <Link key={item} href={`/preview/${item}`}>
                            <motion.span
                              className={classnames(
                                'relative flex h-8 w-full items-center gap-2 rounded-md pl-4 text-[14px] font-medium text-slate-11 transition duration-200 ease-in-out',
                                {
                                  'text-cyan-11': isCurrentPage,
                                  'hover:text-slate-12': title !== item,
                                },
                              )}
                            >
                              {isCurrentPage && (
                                <motion.span
                                  layoutId="sidebar"
                                  className="absolute bottom-0 left-0 right-0 top-0 rounded-md bg-cyan-5"
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  exit={{ opacity: 0 }}
                                >
                                  <div className="absolute left-2.5 top-1 h-6 w-px bg-cyan-11" />
                                </motion.span>
                              )}
                              <svg
                                className="flex-shrink-0"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M7.75 19.25H16.25C17.3546 19.25 18.25 18.3546 18.25 17.25V9L14 4.75H7.75C6.64543 4.75 5.75 5.64543 5.75 6.75V17.25C5.75 18.3546 6.64543 19.25 7.75 19.25Z"
                                  stroke="currentColor"
                                  strokeOpacity="0.927"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M18 9.25H13.75V5"
                                  stroke="currentColor"
                                  strokeOpacity="0.927"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                              {item}
                            </motion.span>
                          </Link>
                        );
                      })}
                  </LayoutGroup>
                </div>
              </Collapsible.Content>
            )}
          </Collapsible.Root>
        </nav>
      </aside>
    );
  },
);

Sidebar.displayName = 'Sidebar';
