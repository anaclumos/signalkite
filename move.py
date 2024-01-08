import os
import shutil

def move_files(lang):
    # Define source and destination directories
    source_dir = f'i18n/{lang}/docusaurus-plugin-content-docs/current/2023/09'
    dest_dir = f'archive/{lang}/2023/09'

    # Check if the source directory exists
    if not os.path.exists(source_dir):
        print(f"Source directory {source_dir} does not exist. Skipping.")
        return

    # Create the destination directory if it doesn't exist
    os.makedirs(dest_dir, exist_ok=True)

    # List all files in the source directory
    files = os.listdir(source_dir)

    # Move each file from the source to the destination directory
    for file in files:
        shutil.move(os.path.join(source_dir, file), os.path.join(dest_dir, file))
        print(f"Moved file {file} to {dest_dir}")

locales = [
    'ar', 'bn', 'cs', 'da', 'de', 'el', 'en', 'es', 'fi', 'fr', 'he', 'hi', 'hu', 
    'id', 'it', 'ja', 'ko', 'nl', 'nb', 'pl', 'pt', 'ro', 'ru', 'sk', 'sv', 'ta', 
    'th', 'tr', 'zh-Hans', 'zh-Hant',
]

# Running the function for each locale
for locale in locales:
    move_files(locale)

