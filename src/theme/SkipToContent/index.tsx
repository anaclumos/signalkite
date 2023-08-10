import React from 'react';
import SkipToContent from '@theme-original/SkipToContent';
import type SkipToContentType from '@theme/SkipToContent';
import type {WrapperProps} from '@docusaurus/types';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { useShare } from '@site/static/hooks/useShare';

type Props = WrapperProps<typeof SkipToContentType>;

export default function SkipToContentWrapper(props: Props): JSX.Element {

  const {i18n} = useDocusaurusContext();

  useShare(i18n.currentLocale);

  return (
    <>
      <SkipToContent {...props} />
    </>
  );
}
