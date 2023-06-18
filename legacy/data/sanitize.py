import os
import unicodedata

targets = ["./pages"]
COUNTER = 0

all_md_files = []

if __name__ == "__main__":
    for target in targets:
        if not os.path.isdir(target):
            continue
        for root, dirs, files in os.walk(target):
            for file in files:
                if file.endswith(".md") or file.endswith(".mdx"):
                    all_md_files.append(os.path.join(root, file))
    print("Found " + str(len(all_md_files)) + " MD and MDX files.")

    # NFC-normalize the file names
    import shutil

    for md_file in all_md_files:
        new_name = unicodedata.normalize("NFC", md_file)
        if new_name != md_file:
            shutil.move(md_file, new_name)
            md_file = new_name
        with open(md_file, "r") as f:
            lines = f.readlines()
        with open(md_file, "w") as f:
            for line in lines:
                line = unicodedata.normalize("NFC", line)
                f.write(line)

    for md_file in all_md_files:
        # ignore files with Template in the name
        if "template" in md_file.lower():
            continue
        with open(md_file, "r") as f:
            lines = f.readlines()
        with open(md_file, "w") as f:
            for line in lines:
                # Replace Rules
                if "####" in line:
                    line = "#### " + line.replace("####", "").strip()
                elif "###" in line:
                    # pull the ### to the front
                    line = "### " + line.replace("###", "").strip()
                elif "##" in line:
                    # pull the ## to the front
                    line = "## " + line.replace("##", "").strip()
                # remove all 'invisible' characters
                REPLACE_RULES = {
                    " ": " ",
                    "️": "",
                    "‍": "",
                    " ": " ",
                    " ": " ",
                    " ": " ",
                    " ": " ",
                    " ": " ",
                    " ": " ",
                    " ": " ",
                    " ": " ",
                    " ": " ",
                    " ": " ",
                    "（": "(",
                    "）": ")",
                    " ": " ",
                    "# # # ": "### ",
                    "‏": "",
                    "‍": "",
                    "### ## ": "### ",
                    "### #": "### ",
                    "## # ": "### ",
                    "\*": "*",
                    " | Hacker News": "",
                    " - The New York Times": "",
                    " | The New Yorker": "",
                    " - WSJ": "",
                    " | Max Woolf's Blog": "",
                    " — Alin Panaitiu": "",
                    " | IMG.LY Blog": "",
                    " - Tyler Cipriani": "",
                    " - Code Faster with Kite": "",
                    " | the art of technology": "",
                    " | Cloudflare": "",
                    " | TechCrunch": "",
                    " | Jesse Li": "",
                    " | GitHub Changelog": "",
                    " | MDN": "",
                    " | RheinardKorf.com": "",
                    " | Apple Developer Documentation": "",
                    " | Create Interactive Product Demos": "",
                    " | Medium": "",
                    " | Chris Xiao": "",
                    " | Malwarebytes Labs": "",
                    " | Scraping Fish": "",
                    " | Azure Blog and Updates": "",
                    " | Microsoft Azure": "",
                    " | The GitHub Blog": "",
                    " | 카카오": "",
                    " | LINE Developers": "",
                    " | Pinterest Newsroom": "",
                    " | by Analytics at Meta": "",
                    " | Deijin's Blog": "",
                    " | lunnova.dev": "",
                    " | Saeloun Blog": "",
                    " | CITIZEN WATCH Global Network": "",
                    " | LeoLabs": "",
                    " | Freedom Be With All": "",
                    " | School of AI": "",
                    " | Coursera": "",
                    " | Fortune": "",
                    " | USENIX": "",
                    " | Rayst": "",
                    " | Giza Project": "",
                    " | Financial Times": "",
                    " | Jacob Martin": "",
                    " | Deephaven": "",
                    " | IBM": "",
                    " | Pinecone": "",
                    " | Fontshare: Quality Fonts. Free.": "",
                    " | Codacy": "",
                    " | Microsoft 365 Blog": "",
                    " | Overview": "",
                    " | Roger Mexico's Oscillator": "",
                    " | The AI Search Engine You Control": "",
                    " | The Homepage Developers Deserve": "",
                    " | Docusaurus": "",
                    " | visualization components": "",
                    " | Roam Garden": "",
                    " | 5to9": "",
                    " | WebKit": "",
                    " | Framer": "",
                    " | Reuters": "",
                    " | Chatterhead Says": "",
                    " | Igalia": "",
                    " | hoho.com": "",
                    " | ExxonMobil": "",
                    " | The Guardian": "",
                    " | Barnabas Kendall": "",
                    " | Clockwise": "",
                    " | Blackmagic Design": "",
                    " | tseijp": "",
                    " | TigYog": "",
                    " | Massdriver Blog": "",
                    " | K리그 프로그래머": "",
                    " | Stanford News": "",
                    " | Cornell Chronicle": "",
                    " | Department of Energy": "",
                    " | TAXLY.KR (택슬리)": "",
                    "<br>": "<br/>",
                    '<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>': "",
                    "“": '"',
                    "”": '"',
                    "‘": "'",
                    "’": "'",
                    " • TechCrunch": "",
                    " | Jay Mody": "",
                    " | 중앙일보": "",
                    " | The New York Times": "",
                    "[단독] ": "",
                    "】": "]",
                    "【": "[",
                    "] (": "](",
                    "Show HN: ": "",
                    "Tell HN: ": "",
                    "Ask HN: ": "",
                    "Launch HN: ": "",
                    "HN: ": "",
                    "HN:": "",
                    "HN": "Discussion Service",
                    "Hackers News": "Discussion Service",
                    ")()": ")",
                    "N/A.": "",
                    "N/A": "",
                    ".-": ".\n-",
                    "\n\n-": "\n-",
                    ")-": ")\n\n-",
                }

                # if - in the line immediately followed by a non-space character, replace - with - (space)
                if (
                    len(line) > 2
                    and line[0] == "-"
                    and line[1] != " "
                    and line[1] != "-"
                ):
                    line = line.replace("-", "- ")

                for rule in REPLACE_RULES:
                    while rule in line:
                        COUNTER += 1
                        line = line.replace(rule, REPLACE_RULES[rule])
                    line = unicodedata.normalize("NFC", line)
                if (
                    len(line) > 5
                    and line.startswith("### ")
                    and line[4] != "["
                    and "](" in line
                    and "http" in line
                ):
                    line = line.replace("### ", "### [")
                if "### []" in line:
                    line = line.replace("### []", "### [")
                f.write(line)
    print("Replaced " + str(COUNTER) + " texts.")
