import os
import babel.dates
import datetime

all_files = os.listdir('i18n')


for file in all_files:
    if os.path.isdir('i18n/' + file):
        folder_files = os.listdir('i18n/' + file)
        for folder_file in folder_files:
            all_files.append(file + '/' + folder_file)

for file in all_files:
    if not file.endswith('.md'):
        continue
    print('Processing ' + file)
    # sk/docusaurus-plugin-content-docs/current/2023/03/28.md
    locale = file.split('/')[0]
    if locale == 'zh-Hans':
        locale = 'zh'
    if locale == 'zh-Hant':
        locale = 'zh'
    day = int(file.split('/')[5].split('.')[0])
    month = int(file.split('/')[4])
    year = int(file.split('/')[3])
    datename = str(year) + '-' + str(month).zfill(2) + '-' + str(day).zfill(2)
    date = datetime.date(year, month, day)
    print('Locale: ' + locale)
    verbose = babel.dates.format_date(date, format='long', locale=locale)
    # within the file, replace '## verbose' with '# date'
    print('Converting ' + file + ' to ' + datename)
    with open('i18n/'+file, 'r') as f:
        content = f.read()
    content = content.replace('## ' + verbose, '# ' + datename)
    content = content.replace('\n### ', '\n## ')
    print(file)
    with open('i18n/'+file, 'w') as f:
        f.write(content)
