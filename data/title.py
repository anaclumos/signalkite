import re

# Define conjunctions, articles, and prepositions
conjunctions = ["for", "and", "nor", "but", "or", "yet", "so"]

articles = ["a", "an", "the"]

prepositions = [
    "aboard",
    "about",
    "above",
    "across",
    "after",
    "against",
    "along",
    "amid",
    "among",
    "anti",
    "around",
    "as",
    "at",
    "before",
    "behind",
    "below",
    "beneath",
    "beside",
    "besides",
    "between",
    "beyond",
    "but",
    "by",
    "concerning",
    "considering",
    "despite",
    "down",
    "during",
    "except",
    "excepting",
    "excluding",
    "following",
    "for",
    "from",
    "in",
    "inside",
    "into",
    "like",
    "minus",
    "near",
    "of",
    "off",
    "on",
    "onto",
    "opposite",
    "over",
    "past",
    "per",
    "plus",
    "regarding",
    "round",
    "save",
    "since",
    "than",
    "through",
    "to",
    "toward",
    "towards",
    "under",
    "underneath",
    "unlike",
    "until",
    "up",
    "upon",
    "versus",
    "via",
    "with",
    "within",
    "without",
]

lower_case_set = set(conjunctions + articles + prepositions)

# Define special cases
specials = [
    "ZEIT",
    "ZEIT Inc.",
    "Vercel",
    "Vercel Inc.",
    "CLI",
    "API",
    "HTTP",
    "HTTPS",
    "JSX",
    "DNS",
    "URL",
    "now.sh",
    "now.json",
    "vercel.app",
    "vercel.json",
    "CI",
    "CD",
    "CDN",
    "package.json",
    "package.lock",
    "yarn.lock",
    "GitHub",
    "GitLab",
    "CSS",
    "Sass",
    "JS",
    "JavaScript",
    "TypeScript",
    "HTML",
    "WordPress",
    "Next.js",
    "Node.js",
    "Webpack",
    "Docker",
    "Bash",
    "Kubernetes",
    "SWR",
    "TinaCMS",
    "UI",
    "UX",
    "TS",
    "TSX",
    "iPhone",
    "iPad",
    "watchOS",
    "iOS",
    "iPadOS",
    "macOS",
    "PHP",
    "composer.json",
    "composer.lock",
    "CMS",
    "SQL",
    "C",
    "C#",
    "GraphQL",
    "GraphiQL",
    "JWT",
    "JWTs",
]

# Define regular expression pattern
word = "[^\\s'’\\(\\)!?;:\"-]"
regex = re.compile(f"(?:(?:(\\s?(?:^|[.\\(\\)!?;:\"-])\\s*)({word}))|({word}))({word}*[’']*{word}*)", re.IGNORECASE)

# Define the function to titlize the string
def titlize_chicago_style(text, options=None):
    if options is None:
        options = {}

    text = text.lower()

    def replacer(match):
        lead, forced, lower, rest = match.groups()
        is_last_word = match.end() == len(text)
        if not forced:
            full_lower = (lower or "") + (rest or "")
            if full_lower in lower_case_set and not is_last_word:
                return match.group(0)
        return (lead or "") + (lower or forced).capitalize() + (rest or "")

    # Apply the regex and replace matches
    text = regex.sub(replacer, text)

    # Handle special cases
    for special in specials:
        text = re.sub(rf"\b{re.escape(special.lower())}\b", special, text, flags=re.IGNORECASE)

    # Handle custom special cases
    custom_specials = options.get("special", [])
    for special in custom_specials:
        text = re.sub(rf"\b{re.escape(special.lower())}\b", special, text, flags=re.IGNORECASE)

    return text
