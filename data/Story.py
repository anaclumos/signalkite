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
    summary = ""

    def __init__(self, id=id, timestamp=timestamp, title=title, url=url, hn_url=hn_url, content=content, summary=summary):
        self.id = id
        self.timestamp = timestamp
        self.title = title
        self.url = url
        self.hn_url = hn_url
        self.content = content
        self.summary = summary

    def __str__(self):
        return f"Title: {self.title}, URL: {self.url}"

    def __repr__(self):
        return self.__str__()

    def __eq__(self, other):
        return self.title == other.title and self.url == other.url

    def __hash__(self):
        return hash(self.title) + hash(self.url)

    def markdown(self):
        prefix = f"[{self.hn_title if self.hn_title else 'Hacker News'}]({self.hn_url})""" + f", [{self.original_title if self.original_title else 'Original'}]({self.url})." if self.url else "."
        return f"""### {self.title}\n\n{prefix}\n{self.summary}"""


Stories = list[Story]
