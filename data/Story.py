class Story:
    id = 0
    timestamp = 0
    title = ""
    url = ""
    hn_url = ""
    content = ""
    summary = ""

    def __init__(self, id=id, timestamp=timestamp, title=title, url=url, hn_url=hn_url):
        self.id = id
        self.timestamp = timestamp
        self.title = title
        self.url = url
        self.hn_url = hn_url

    def __str__(self):
        return f"Title: {self.title}, URL: {self.url}"

    def __repr__(self):
        return self.__str__()

    def __eq__(self, other):
        return self.title == other.title and self.url == other.url

    def __hash__(self):
        return hash(self.title) + hash(self.url)

    def markdown(self):
        return f"""## [{self.title}]({self.url})\n\n{self.summary}\n- [Discuss on HN]({self.hn_url})"""
