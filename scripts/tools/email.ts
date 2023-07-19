import { Story } from '../type'

export const storyToHTML = (story: Story) => {
  return `

  <a
              href="${story.originLink}"
              data-id="react-email-link"
              target="_blank"
              style="color: #067df7; text-decoration: none"
              ><h2 data-id="react-email-heading">
              ${story.title}
              </h2>
              </a>
            <ul
              style="
                line-height: 1.5;
                color: #484848;
                list-style-position: outside;
                padding-inline-start: 20px;
              "
            >
              ${JSON.parse(story.summaryOrigin)
                .map((summary) => {
                  return `<li>${summary}</li>`
                })
                .join('')}
            </ul>
            <a
              href="https://news.ycombinator.com/item?id=36478206"
              data-id="react-email-link"
              target="_blank"
              style="color: #067df7; text-decoration: none"
              ><h3 data-id="react-email-heading">
              ${story.commentCount} comments
              </h3></a
            >
            <ul
              style="
                line-height: 1.5;
                color: #484848;
                list-style-position: outside;
                padding-inline-start: 20px;
              "
            >
              ${JSON.parse(story.summaryComment)
                .map((summary) => {
                  return `<li>${summary}</li>`
                })
                .join('')}
            </ul>
            <hr
              data-id="react-email-hr"
              style="
                width: 100%;
                border: none;
                border-top: 1px solid #eaeaea;
                border-color: #dfe1e4;
                margin: 42px 0 26px;
              "
            />
`
}

export const transformIntoHTML = (stories: Story[], title = 'HN') => {
  return `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html lang="en">
  <head data-id="__react-email-head">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  </head>
  <body
    data-id="__react-email-body"
    style="background-color:#ffffff;font-family:ui-sans-serif, -apple-system, BlinkMacSystemFont, &#x27;Pretendard&#x27;, &#x27;Apple Color Emoji&#x27;, &#x27;Segoe UI Emoji&#x27;, system-ui, -system-ui, sans-serif"
  >
    <table
      align="center"
      width="100%"
      data-id="__react-email-container"
      role="presentation"
      cellspacing="0"
      cellpadding="0"
      border="0"
      style="max-width: 600px; margin: 0 auto"
    >
      <tbody>
        <tr style="width: 100%">
          <td>
            <h1 data-id="react-email-heading">${title}</h1>
            <hr
              data-id="react-email-hr"
              style="
                width: 100%;
                border: none;
                border-top: 1px solid #eaeaea;
                border-color: #dfe1e4;
                margin: 42px 0 26px;
              "
            />
            ${stories.map((story) => storyToHTML(story)).join('')}
            <a
              href="https://github.com/anaclumos/heimdall"
              data-id="react-email-link"
              target="_blank"
              style="color: #b4becc; text-decoration: none; font-size: 14px"
              >Sunghyun Cho from ★ Starfish, Co.</a
            >
          </td>
        </tr>
      </tbody>
    </table>
  </body>
</html>
`
}
