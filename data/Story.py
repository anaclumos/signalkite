from title import titlize_chicago_style


class Story:
    id = 0
    timestamp = 0
    locale = "en"
    title = ""
    hn_title = ""
    original_title = ""
    url = ""
    hn_url = ""
    content = ""
    hn_content = ""
    hn_summary = ""
    summary = ""
    score = 0

    def __init__(
        self, id=id, timestamp=timestamp, title=title, url=url, hn_url=hn_url, content=content, summary=summary
    ):
        self.id = id
        self.timestamp = timestamp
        self.title = title
        self.url = url
        self.hn_url = hn_url
        self.content = content
        self.summary = summary

    def __init__(
        self,
        id=id,
        timestamp=timestamp,
        title=title,
        url=url,
        hn_url=hn_url,
        content=content,
        summary=summary,
        hn_title=hn_title,
        original_title=original_title,
        score=score,
        hn_content=hn_content,
        hn_summary=hn_summary,
    ):
        self.id = id
        self.timestamp = timestamp
        self.title = title
        self.url = url
        self.hn_url = hn_url
        self.content = content
        self.summary = summary
        self.hn_title = hn_title
        self.original_title = original_title
        self.score = score
        self.hn_content = hn_content
        self.hn_summary = hn_summary

    def __str__(self):
        return f"Title: {self.title}, URL: {self.url}"

    def __repr__(self):
        return self.__str__()

    def __eq__(self, other):
        return self.title == other.title and self.url == other.url

    def __hash__(self):
        return hash(self.title) + hash(self.url)

    def markdown(self):
        title = (self.hn_title) if self.hn_title else self.title
        if not self.summary.endswith(".") and not self.summary.endswith("!") and not self.summary.endswith("?"):
            self.summary += "."

        hn = f"[HN]({self.hn_url})." if self.hn_url else ""
        article = f"[Original]({self.url})." if self.url else ""
        return f"""

        ### {title}

{self.summary}
{article}

{self.hn_summary}
{hn}

"""


Stories = list[Story]
