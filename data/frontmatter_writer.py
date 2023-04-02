# ---
# title: 
# subtitle:
# ---


# for all files in pages
import os
import frontmatter
from babel.dates import format_date

all_files = os.listdir('pages')

for file in all_files:
    # recursively add subfolders to all files
    if os.path.isdir('pages/' + file):
        for subfile in os.listdir('pages/' + file):
            all_files.append(file + '/' + subfile)

for file in all_files:
    # if file is a markdown file
    if file.endswith('.mdx'):
        # open file
        with open('pages/' + file, 'r') as f:
            # read file
            lines = f.readlines()
            # if file has frontmatter
            post = frontmatter.load(f)
            if post.metadata:
                # if file has title
                if 'title' in post.metadata:
                    # if file has subtitle
                    if 'subtitle' in post.metadata:
                        print('File ' + file + ' has frontmatter and title and subtitle')
                    else:
                        print('File ' + file + ' has frontmatter and title but no subtitle')
                else:
                    print('File ' + file + ' has frontmatter but no title')    
            else:
                date = file.split('.')[0]
                locale = file.split('.')[1]
                subtitle = format_date(date, format='long', locale=locale)
                # find the first line with ###
                title = ""
                for i, line in enumerate(lines):
                    if line.startswith('###'):
                        title = line.replace('###', '').strip()
                        break
                # write frontmatter
                post = frontmatter.Post(title=title, subtitle=subtitle)
                with open('pages/' + file, 'w') as f:
                    frontmatter.dump(post, f)
                print('File ' + file + ' has no frontmatter, added title and subtitle')
                

