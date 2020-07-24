import datetime
import os
from pathlib import Path

def main():
    title = input("New post title: ")
    dir_name = title.lower().replace(" ", "-")
    file_path = Path(__file__).parent / "content" / "blog" / dir_name / "index.md"
    prepareEmptyFile(title, file_path)
    print("Prepared file: " + str(file_path))

def prepareEmptyFile(title, file_path: Path):
    os.makedirs(file_path.parent)
    date = datetime.date.today().strftime("%Y-%m-%d")
    with open(file_path.absolute(), "w") as f:
        f.write("---\n")
        f.write(f"title: {title}\n")
        f.write(f"date: {date}\n")
        f.write(f"draft: true\n")
        f.write(f'description: ""\n')
        f.write(f"tags: []\n")
        f.write("---\n\n")

if __name__ == "__main__":
    main()
