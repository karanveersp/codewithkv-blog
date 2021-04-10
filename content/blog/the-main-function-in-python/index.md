---
title: The Main Function in Python
date: 2021-03-08
draft: false
description: "Organizing a stand-alone executable script"
tags: ["python", "tutorial"]
---


## Table of Contents
```toc
```
<br/>

# Introduction

Python is an interpreted language which means that anything fed to the Python interpreter will be instantly interpreted or executed.
For very simple scripts, that's all we need.

For example, here's a script that takes an input string and returns whether the string is an isogram.
An isogram is a word with no repeating letters, no matter the letter case. 

`Yuri` and `Jim` are isograms.
`Jerry` and `Bob` are not isograms.

```python
# isogram.py

s = input("Enter a word: ")
letters_without_duplicates = set(s.lower())
if len(s) == len(letters_without_duplicates):
    print(f"'{s}' is an isogram")
else:
    print("Not an isogram")
```

Here's a sample execution

```sh
> python isogram.py
Enter a word: Yuri
'Yuri' is an isogram
> python isogram.py
Enter a word: Bob
Not an isogram
```

In the script, we are grabbing input from the terminal and storing it into the variable `s`.

Since we want the test to be case insensitive, we can get the all lowercase version of the string by calling `s.lower()`.
The result of `s.lower()` is passed to the `set()` function which returns a `set`. A set is like a list where all duplicates are removed.

We then compare the length of our original string `s` and the `set` of all letters. If equal, we have an isogram.

What if you want to test whether a string is an isogram from some other script?

You could copy paste these lines into that script but then you've duplicated the logic in two places which is not good practice. If the logic ever needs to change to allow case sensitive isogram tests, then that change now has to be made in two places instead of one.

A good way to organize the steps to do something in a reusable way is to put those steps inside a named _function_.

```python
def is_isogram(s):
    letters_without_duplicates = set(s.lower())
    return len(s) == len(letters_without_duplicates)

s = input("Enter a word: ")
if is_isogram(s):
    print(f"'{s}' is an isogram")
else:
    print("Not an isogram")
```

Notice how putting the isogram testing inside a function
makes the main logic of the program more readable.

But something strange happens when one tries to import the `is_isogram` function into another script to use it.

```python
# other.py

import isogram

print(isogram.is_isogram("Yuri"))
```

One sees the prompt `Enter a word` show up!

```sh
> python other.py
Enter a word:    
```

This brings us to something every python developer should be aware of.

Whenever you import something, all the _top level_ statements in that module are executed by the interpreter.

Top level means everything that is not under a class or a function. In `isogram.py`, the function definition, the input assigment into s and the conditional statements are all top level so they are executed.

The function definition is something we want the python interpreter to know about since we want to eventually use that function. But we don't want the input part to run when we import the module.

To solve this problem, we use a _main function_.

<br/>

# The Main Function

Python, unlike other languages, doesn't force the programmer to use a main function as a program's entry point. But we can easily design our scripts along that convention.

Sometimes we just want to be able to import a function or a variable from another python script for re-use, but without actually running the main work of that script.

To do this, the script needs some way of knowing the _context_ of its own execution. 

_Am I being used to import stuff?_
_Am I being run as the main process?_

Python provides the `__name__` special variable to answer this question.


```python
> python
Python 3.9.1 (tags/v3.9.1:1e5d33e, Dec  7 2020, 17:08:21) [MSC v.1927 64 bit (AMD64)] on win32
Type "help", "copyright", "credits" or "license" for more information.
>>> __name__
'__main__'
```

The variable just holds a string indicating the context.

Lets add a `print(__name__)` statement at the bottom of `isogram.py` and `other.py` and comment out all other statements except the function definition and import statement.

```python
def is_isogram(s):
    letters_without_duplicates = set(s.lower())
    return len(s) == len(letters_without_duplicates)

# s = input("Enter a word: ")
# if is_isogram(s):
#     print(f"'{s}' is an isogram")
# else:
#     print("Not an isogram")
print(__name__)
```

```py
import isogram
# print(isogram.is_isogram("isogram"))

print(__name__)
```

If you run `isogram.py` directly, you'll see

```sh
> python isogram.py
__main__
```

Running `other.py` gives
```sh
> python other.py
isogram
__main__
```

Since the import statement runs before the print, `isogram` is being printed by `isogram.py` and `__main__` is printed from `other.py`.

_`__name__` will be `__main__` only inside the script you're directly passing to the python interpreter!_

We can now use it to establish our main function. The main function only runs when we directly invoke the script by passing it to the python interpreter.

```python
def main():
    s = input("Enter a word: ")
    if is_isogram(s):
        print(f"'{s}' is an isogram")
    else:
        print("Not an isogram")

def is_isogram(s):
    letters_without_duplicates = set(s.lower())
    return len(s) == len(letters_without_duplicates)

if __name__ == "__main__":
    main()  # runs only when script directly invoked!
```

By this simple change, we can run `other.py` and see the expected output.

```python
# other .py
import isogram
print(isogram.is_isogram("Yuri")) # prints True
```

<br/>

# Script Scaffolding

Whenever creating a python script that contains anything that may be imported in the future for re-use by other scripts, always use this standard layout:

```python
# scaffolding.py

# import statements


def main():
    pass # placeholder
    # what the script does when directly invoked


# helper functions

# def a():
    #...


# def b():
    # ...

# ...


if __name__ == "__main__":
    main()
```

With this script layout, one can avoid the unexpected side effects of top level statements when importing the module.