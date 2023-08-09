import React from 'react'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import Layout from '@theme/Layout'
import Translate from '@docusaurus/Translate'
import Link from '@docusaurus/Link'
import styles from './index.module.css'
import clsx from 'clsx'
import { Globe } from '../components/Globe'

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext()
  return (
    <Layout title={`${siteConfig.title}`} description={`${siteConfig.tagline}`}>
      <main className={styles.main}>
        <div className={styles.hero}>
          <div className={styles.heroElement}>
            <h1>
              <Translate>Heimdall</Translate>
            </h1>

            <ul className={styles.features}>
              <li className={styles.bullet}>
                <Translate>Heimdall summarizes Hacker News in 30 Languages.</Translate>
              </li>
              <li className={styles.bullet}>
                <Translate>Trusted by Professionals at Apple, Microsoft, Amazon, and More.</Translate>
              </li>
              <li className={styles.bullet}>
                <Translate>No Hidden Fees. Completely Free.</Translate>
              </li>
            </ul>
            <Link to="/subscribe" className={clsx('button button--primary button--lg', styles.subscribeButton)}>
              <Translate>Subscribe</Translate>
            </Link>
            <Link to={'/today'} className={clsx('button button--secondary button--lg', styles.readFirstButton)}>
              <Translate>
            Read First
                </Translate>
            </Link>
          </div>
        </div>

        <div className={styles.background}>
          <Globe />
        </div>
      </main>
    </Layout>
  )
}
