import React from 'react'

import { Body, Container, Head, Heading, Hr, Html, Link, Preview } from '@react-email/components'

type NewsletterProps = {
  title?: string
  titleLink?: string
  content: {
    headline: string
    link: string
    bullets: string[]
    commentLink?: string
    commentBullets?: string[]
  }[]
  commentTitle?: string
  locale?: string
  dir?: string
  starbucks?: string
}

export const Newsletter = ({
  title = 'Hacker News Daily',
  titleLink = 'https://go.cho.sh/hn-cho-sh@TrackLink',
  content = [
    {
      headline: 'Google has a secret browser hidden inside the settings',
      link: 'https://matan-h.com/google-has-a-secret-browser-hidden-inside-the-settings/',
      bullets: [
        'A hidden browser has been found within the settings of Android apps.',
        'The browser can be accessed through the "Manage my account" section of the settings.',
        'It has no browsing history and automatically logs out of Google accounts.',
        'The browser has some potentially dangerous functions that could be exploited by malicious websites.',
        'It bypasses parental controls and can play YouTube videos, albeit with ads.',
        'The discovery has been reported to Google, who claims it is not a security vulnerability.',
      ],
      commentLink: 'https://news.ycombinator.com/item?id=36478206',
      commentBullets: [
        'The passage covers multiple topics related to security vulnerabilities, bug reporting, user behavior, threat modeling, and parental controls.',
        "It discusses the definition and scope of information security and the role of technology in children's lives.",
        'User behavior and intentions are crucial factors to consider when designing security measures.',
        'Ongoing evaluation and improvement are necessary for effective security measures.',
      ],
    },
    {
      headline: 'The hidden cost of air quality monitoring',
      link: 'https://www.airgradient.com/blog/hidden-costs-of-air-quality-monitoring/',
      bullets: [
        'Some air quality monitoring manufacturers are raising prices for customers through various tactics.',
        'These tactics include using proprietary sensor modules, creating ecosystems that lock users in, building monitors with short lifetimes, and having unclear data ownership policies.',
        'However, AirGradient, a self-funded startup, is taking a different approach.',
        'AirGradient prioritizes sustainability, honesty, and open-source monitors.',
        'Potential buyers are encouraged to ask specific questions about data ownership, data monetization, repairability, and spare parts availability before buying a monitor.',
      ],
      commentLink: 'https://news.ycombinator.com/item?id=36499905',
      commentBullets: [
        'Air quality monitoring is crucial for underserved communities, and AirGradient aims to provide affordable solutions.',
        'Some commenters question the accuracy and reliability of low-cost monitoring devices.',
        'The role of plants and trees in reducing air pollution is discussed, as well as regulations on gas-powered lawn equipment and the environmental impact of leaf blowers.',
        'Transitioning to electric-powered tools and vehicles is considered a solution for reducing air pollution.',
        'Users debate the features and integration of different air quality monitoring devices and platforms.',
        'Limitations of current systems and potential improvements are discussed.',
        'Migrant workers and blue-collar commuters face challenges accessing relevant air quality data.',
        'Water quality monitoring and the need for raising awareness to find solutions are also mentioned.',
      ],
    },
  ],
  locale = 'en',
  dir = 'ltr',
  commentTitle = 'HN Comments',
  starbucks = "Enjoy this newsletter? Tell your friends, and I'll buy Starbucks ☕ for all of you.",
}: NewsletterProps) => (
  <Html lang={locale} dir={dir}>
    <Head />
    <Preview>{content?.[0]?.bullets.join(' ') ?? title ?? 'Here is your weekly newsletter'}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading as="h1">{titleLink ? <Link href={titleLink}>{title}</Link> : title}</Heading>
        {content?.map((section, sectionIndex) => (
          <div key={`${sectionIndex}-section`}>
            <Hr style={hr} />
            <Link href={section.link}>
              <Heading as="h2" key={`${sectionIndex}-headline`}>
                {section.headline}
              </Heading>
            </Link>
            <ul
              style={{
                lineHeight: '1.5',
                color: '#484848',
                listStylePosition: 'outside',
                paddingInlineStart: '20px',
              }}
            >
              {section.bullets.map((bullet, bulletIndex) => (
                <li key={`${sectionIndex}-${bulletIndex}`}>{`${bullet}`}</li>
              ))}
            </ul>
            {section.commentLink && section.commentBullets && (
              <>
                <Link href={section.commentLink}>
                  <Heading as="h3" key={`${sectionIndex}-comment`}>
                    {commentTitle ?? 'Comments'}
                  </Heading>
                </Link>
                <ul
                  style={{
                    lineHeight: '1.5',
                    color: '#484848',
                    listStylePosition: 'outside',
                    paddingInlineStart: '20px',
                  }}
                >
                  {section?.commentBullets?.map((bullet, bulletIndex) => (
                    <li key={`${sectionIndex}-${bulletIndex}`}>{`${bullet}`}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
        ))}
        <Hr style={hr} />
        {starbucks.length > 0 && (
          <Link href="https://go.cho.sh/hn-cho-sh-bring-a-friend@TrackLink" style={footer}>
            {starbucks}
          </Link>
        )}
      </Container>
    </Body>
  </Html>
)

export default Newsletter

const main = {
  fontFamily:
    "ui-sans-serif, -apple-system, BlinkMacSystemFont, 'Pretendard', 'Apple Color Emoji', 'Segoe UI Emoji', system-ui, -system-ui, sans-serif",
}

const container = {
  margin: '0 auto',
  maxWidth: '600px',
}

const footer = {
  fontSize: '14px',
  color: '#b4becc',
}

const hr = {
  borderColor: '#dfe1e4',
  margin: '42px 0 26px',
}
