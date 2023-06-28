# Scripts

These are the scripts that maintain Heimdall.

```bash
yarn rw exec updateHackerNewsLinks
yarn rw exec populateLinkSummaryBody
yarn rw exec generateGptLinkSummary
```

## Rules

- Requesting to Hacker News should run once every hour, since the data will not change frequently.
- Populating the link summary body should run every 10 minutes.
- Immediately following, requesting to OpenAI should run in a small batch, often. This is to
  avoid rate limiting. Such as every 10 minutes but with a batch size of 5.
