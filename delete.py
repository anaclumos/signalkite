import os

def delete_md_files_with_undefined(directory):
    """
    Delete all .md files that contain the string '- undefined' in the given directory.
    """
    for root, dirs, files in os.walk(directory):
        for filename in files:
            if filename.endswith(".md"):
                filepath = os.path.join(root, filename)
                with open(filepath, 'r', encoding='utf-8') as file:
                    content = file.read()
                    if "- undefined" in content:
                        print(f"Deleting {filepath}...")
                        os.remove(filepath)

if __name__ == "__main__":
    # You can modify the path to the directory you want to scan. 
    # For example, to start from the current directory use ".".
    directory_to_scan = "."  
    delete_md_files_with_undefined(directory_to_scan)
