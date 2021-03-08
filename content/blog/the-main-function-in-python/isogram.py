def is_isogram(s):
    letters_without_duplicates = set(s.lower())
    return len(s) == len(letters_without_duplicates)

# s = input("Enter a word: ")
# if is_isogram(s):
#     print(f"'{s}' is an isogram")
# else:
#     print("Not an isogram")
# print(__name__)