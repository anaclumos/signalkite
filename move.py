import os
import shutil
import sys

all_files = os.listdir('history')

# recursively add

for file in all_files:
    # if folder, add all files in folder
    if os.path.isdir('history/' + file):
        folder_files = os.listdir('history/' + file)
        for folder_file in folder_files:
            all_files.append(file + '/' + folder_file)

# So far the file name would be something like "06/18.en.mdx"
# If the filename is "06/18.en.mdx", we want to move it to "docs/2023/06/18.md"

# For all other locales, we want to move it to "i18n/[locale]/docusaurus-plugin-content-docs/current/2023/06/18.md"

for file in all_files:
    if os.path.isdir('history/' + file):
        continue

    # get the date. year is 2023
    year = 2023
    monthdate = file.split('.')[0]
    month = monthdate.split('/')[0]
    day = monthdate.split('/')[1]

    # get the locale
    locale = file.split('.')[1]

    # get the file name
    filename = file.split('.')[2]

    new_path = ''

    # get the new path
    if locale == 'en':
        new_path = 'docs/' + str(year) + '/' + month + '/' + day + '.md'
    else:
        # if 'i18n/locale' doesn't exist, ignore
        if not os.path.isdir('i18n/' + locale):
            continue
        new_path = 'i18n/' + locale + '/docusaurus-plugin-content-docs/current/' + str(year) + '/' + month + '/' + day + '.md'

    # move the file. create the folder if it doesn't exist
    if not os.path.isdir(os.path.dirname(new_path)):
        os.makedirs(os.path.dirname(new_path))
    shutil.move('history/' + file, new_path)

