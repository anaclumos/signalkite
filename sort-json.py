import os

# read all files in i18n
all_files = os.listdir('i18n')
for file in all_files:
    # if dir, add all child files
    if os.path.isdir('i18n/' + file):
        # full path
        all_files += [file + '/' + child for child in os.listdir('i18n/' + file)]
        continue

# for only jsons, read file, sort by key, write back
import json
for file in all_files:
    if file.endswith('.json'):
        with open('i18n/' + file, 'r') as f:
            content = f.read()
        # sort by key
        content = json.dumps(json.loads(content), sort_keys=True, indent=4, separators=(',', ': '), ensure_ascii=False)
        with open('i18n/' + file, 'w') as f:
            f.write(content)

