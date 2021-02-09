import re

def main():
    with open("test.html", "rt") as f:
        html = f.read()

    paragrphs = get_paragraphs(html)
    [print(p + "\n") for p in paragrphs]

def get_paragraphs(html):
    return re.findall(r"(?<=<p>)(.*)(?:</p>)", html)


if __name__ == "__main__":
    main()
