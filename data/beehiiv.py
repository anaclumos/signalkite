import sys
from dotenv import load_dotenv
from datetime import datetime, timedelta
from pytz import timezone
from babel.dates import format_date
from dotenv import load_dotenv
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from time import sleep
import os
import frontmatter
from selenium.webdriver import Keys, ActionChains

load_dotenv()

chrome_options = Options()
options = [
    # "--headless",
    "--disable-gpu",
    "--window-size=1920,1200",
    "--ignore-certificate-errors",
    "--disable-extensions",
    "--no-sandbox",
    "--disable-dev-shm-usage",
]
for option in options:
    chrome_options.add_argument(option)

driver = webdriver.Chrome(
    options=chrome_options,
)


if __name__ == "__main__":
    utc = timezone("UTC")
    today = (
        datetime.now()
        .astimezone(utc)
        .replace(hour=0, minute=0, second=0, microsecond=0)
    )

    if len(sys.argv) > 1:
        today = datetime.strptime(sys.argv[1], "%Y-%m-%d").replace(
            hour=0, minute=0, second=0, microsecond=0
        )

    filename = f"pages/{today.strftime('%Y/%m')}/{today.strftime('%d')}.en.mdx"

    while not os.path.exists(filename):
        print("File not found, looking for yesterday's file")
        today = today - timedelta(days=1)
        filename = f"pages/{today.strftime('%Y/%m')}/{today.strftime('%d')}.en.mdx"

    post = ""
    with open(filename, "r") as f:
        post = frontmatter.load(f)
    markdown = post.content
    headline = post["top_news"]

    markdown = (
        markdown.replace("import { Steps } from 'nextra-theme-docs'", "")
        .replace("<Steps>", "")
        .replace("</Steps>", "")
        .replace("import CallToAction from '../../../components/CallToAction'", "")
        .replace("<CallToAction />", "")
        .replace("## " + format_date(today, format="long", locale="en"), "")
    )

    while "\n\n\n" in markdown:
        markdown = markdown.replace("\n\n\n", "\n\n")

    markdown = markdown.strip()

    driver.get("https://app.beehiiv.com/")

    # if there is a login button, login
    if driver.find_element("xpath", "//button[contains(text(), 'Sign in')]"):
        sleep(2)
        driver.find_element(By.ID, "email").send_keys(os.getenv("BEEHIIV_EMAIL"))
        driver.find_element(By.ID, "password").send_keys(os.getenv("BEEHIIV_PASSWORD"))
        driver.find_element("xpath", "//button[contains(text(), 'Sign in')]").click()

    sleep(2)

    driver.find_element("xpath", "//button[contains(text(), 'Start Writing')]").click()
    sleep(2)
    driver.find_element(By.NAME, "title").send_keys(Keys.BACKSPACE * 20)
    driver.find_element(By.NAME, "title").send_keys(
        headline if headline else format_date(today, format="long", locale="en")
    )
    sleep(2)
    writer = None
    try:
        writer = driver.find_element(By.CLASS_NAME, "is-empty")
    except:
        writer = driver.find_element(By.CLASS_NAME, "ProseMirror")

    markdown = markdown.replace("\n\n", "\n")
    finised_title = False

    for line in markdown.splitlines():
        # if the line starts with `### [`, parse it as a link
        if line.startswith("### "):
            writer.send_keys(Keys.ENTER)
            writer.send_keys(line)
        elif line.startswith("#### ["):
            writer.send_keys(Keys.ENTER)
            display, link = line.split("](")
            display = display.replace("[", "")
            link = link.replace(")", "")
            writer.send_keys("#### ")
            writer.send_keys(display)
            # select the link text
            driver.execute_script(
                """
                let link = arguments[0];
                let textArea = document.createElement("textarea");
                textArea.value = link;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand("copy");
                textArea.remove();
                """,
                link,
            )
            ActionChains(driver).move_to_element(writer).key_down(
                Keys.COMMAND
            ).key_down(Keys.SHIFT).send_keys(Keys.ARROW_LEFT).key_up(
                Keys.COMMAND
            ).key_up(
                Keys.SHIFT
            ).key_down(
                Keys.COMMAND
            ).send_keys(
                "v"
            ).key_up(
                Keys.COMMAND
            ).perform()
            writer.send_keys(Keys.ENTER)
            finised_title = True
        elif line.startswith("- "):
            if finised_title:
                writer.send_keys(line)
                writer.send_keys(Keys.ENTER)
                finised_title = False
            else:
                writer.send_keys(line.replace("- ", ""))
                writer.send_keys(Keys.ENTER)
        else:
            writer.send_keys(line)
            writer.send_keys(Keys.ENTER)
    sleep(1)
    driver.find_element("xpath", "//span[contains(text(), 'Send Test')]").click()
    sleep(4)
    driver.find_element("xpath", "//button[contains(text(), 'Send')]").click()
    sleep(1)
    driver.find_element("xpath", "//button[contains(text(), 'Schedule')]").click()
    sleep(4)
    driver.find_element("xpath", "//span[contains(text(), 'Publish Now')]").click()
    sleep(1)
    driver.find_element("xpath", "//button[contains(text(), 'Review')]").click()
    input("Press enter to continue")
