---
title: Intro to Regex with Python
date: 2021-02-09
draft: false
description: "Getting started with regular expressions"
tags: ["python", "tutorial"]
---

## Table of Contents
```toc
```

<br/>

Data lives on our computers as files containing byte sequences or strings.
All automation eventually boils down to operations on data, be it analysis, or data extraction, or transformation.

Before you can do anything with data, you have to first _identify_ it in a very specific way. Your automation, no matter what its going to do, must first lock onto its data. 

You may be trying to identify:
- whether a specific word is found in a file
- all email addresses referenced in a file
- all questions in a file (sentences ending with `?`)
- all content contained in `<p>` tags in an html file

All of these cases describe some kind of text pattern.

Regular expressions are the definition of such patterns which allow you to lock onto any data that _matches_ the pattern.

---

## Regular Expression Anatomy

The [pythex.org](http://pythex.org) website is a great tool to help build and test regular expressions.

A regular expression is a string where certain characters reflect matching rules.

- `.` matches any character
- `\s` matches any whitespace in the set `[ \t\n\r\f\v ]`
- `\w` matches alphanumeric characters in the set `[0-9a-zA-Z_]`
- `@` matches the literal `@`
- `\.` matches the literal period `.`

There are certain grouping constructs available in regular expressions:

- Parentheses `( )` specify your _capture group_ by enclosing a pattern. Your _captures_ are whatever strings end up matching the pattern enclosed.
- Square brackets `[ ]` match any characters enclosed, with no regard to sequence.

With this knowledge, we can build a basic pattern to match email addresses contained in a string.

### Building an Email Matcher

The test string is:
```
Here are some emails. 
They can be strewn about in this string in any haphazard way. Like john.doe@outlook.com
Or harry.potter@hogwarts.edu.
Followed by ronWeasly@hogwarts.edu
```

The information we want to capture is _something_@_something_ followed by _.com_ or _.edu_.
This is our pattern which we can now start building formally.

To match any alphanumeric characters before and after the `@` symbol, we can start with the `\w` matcher, all enclosed in parentheses to indicate our capture group.

```
(\w@\w)
```

Trying that in [pythex](https://pythex.org/?regex=(%5Cw%40%5Cw)&test_string=Here%20are%20some%20emails.%20%0AThey%20can%20be%20strewn%20about%20in%20this%20string%20in%20any%20haphazard%20way.%20Like%20john.doe%40outlook.com%0AOr%20harry.potter%40hogwarts.edu.%0AFollowed%20by%20ronWeasly%40hogwarts.edu&ignorecase=0&multiline=0&dotall=0&verbose=0), you'll see that it's not exactly what we want.

The captured values are:
```
e@o
r@h
y@h
```

We need some way of saying _one or more_ characters.

These are provided to us as _quantifiers_:
- `*` matches 0 or more
- `+` matches 1 or more
- `?` matches 0 or 1

There are more quantifiers that let us specify exact, minimum or maximum occurrances.

If we change our regex to `(\w+@\w+)`, we see some progress!

```
doe@outlook
potter@hogwarts
ronWeasly@hogwarts
```

### Character Set Matcher

The period character is causing the first names to be left out, since `\w` only matches numbers, alphabets and underscores. We want _one or more alphanumeric characters or periods in any sequence_.

Since we have an `or`, we can now start using brackets `[ ]`, the character set matcher.

The period already has a special meaning, which is to match any character, so we need to _escape_ it with a backslash prefix. Our match set looks like `[\w\.]` which reads _any alphanuremic character or period_. The quantity is still singular.

If we add the `+` quantifier at the end, then `[\w\.]+` reads _one or more alphanumeric characters or periods in any sequence_. This gets us much closer.
```
john.doe@outlook
harry.potter@hogwarts
ronWeasly@hogwarts
```

### Character Sequence Matcher

To handle the `.com` and `.edu` part, we can specify another `or` set but using brackets doesn't work.
Brackets are for matching any singular character in the set, not an ordered sequence of characters.

In this case, we need a grouping mechanism that will let us match against optional ordered sequences of characters.

We can enclose our .com and .edu inside `(?: )` which is the non-capturing version of the regular parentheses.

`(?:\.com|\.edu)` reads _either .com or .edu_. The pipe `|` symbol stands for `or`. Since the `\.` part is common to both, we can place it before the group.

Our regex now looks like `([\.\w]+@\w+\.(?:com|edu))` and captures:

```
john.doe@outlook.com
harry.potter@hogwarts.edu
ronWeasly@hogwarts.edu
```

### Nested Captures

If we left out the `?:` part above, an interesting thing happens. We then have 2 capturing groups as seen [here](https://pythex.org/?regex=(%5B%5C.%5Cw%5D%2B%40%5Cw%2B%5C.(com%7Cedu))&test_string=Here%20are%20some%20emails.%20%0AThere%20can%20be%20strewn%20about%20in%20this%20string%20in%20any%20haphazard%20way.%20Like%20john.doe%40outlook.com%0AOr%20harry.potter%40hogwarts.edu.%0AFollowed%20by%20ronWeasly%40hogwarts.edu&ignorecase=0&multiline=0&dotall=0&verbose=0).

This reveals another cool aspect of regular expressions which is the ability to capture elements within a matched substring. By using `(?:com|edu)`, we are saying _presence of com or edu_ without actually storing the `com` or `edu` text as a captured results.

If we leave it out, then `com` and `edu` become distinct matched elements themselves. It doesn't affect our output that much because we still have the complete emails captured, but the extra captures don't look clean.

### Completing the Email Matcher

By modifying the last part a little bit, we can make it more generic and able to handle any domain ending sequence like `.us` or `.net`. 

We can describe the ending part as an ordered sequence of a period `\.` followed by any word `\w+`.

`([\.\w]+@\w+\.\w+)`

A little shorter, a little more clearer. The completed example is available [here](https://pythex.org/?regex=(%5B%5C.%5Cw%5D%2B%40%5Cw%2B%5C.%5Cw%2B)&test_string=Here%20are%20some%20emails.%20%0AThey%20can%20be%20strewn%20about%20in%20this%20string%20in%20any%20haphazard%20way.%20Like%20john.doe%40outlook.com%0AOr%20harry.potter%40hogwarts.edu.%0AFollowed%20by%20ronWeasly%40hogwarts.edu&ignorecase=0&multiline=0&dotall=0&verbose=0).


The next example introduces another useful regex matcher.

---

## Matching HTML Tags

Suppose we have an HTML file and want to extract all the content in `<p>` tags.

```html
<html>
    <head>
        <title>
        A Simple HTML Document
        </title>
    </head>
    <body>
        <p>This is a very simple HTML document</p>
        <p>It only has two paragraphs</p>
    </body>
</html>
```

In a real world scenario, it might be a page hundreds of lines long, and doing so manually would be immensely time consuming. Without regular expressions, your algorithm might be to read each line of the html file, check to see if there is a `<p>` string in the line, and start taking slices of each line until reaching a `</p>` string.

A regular expression can really help us here. Just like last time, we'll first try to describe our pattern in plain english.

We want to capture _all characters_ preceded by `<p>` and succeeded by `</p>`.

### Look Behind Assertions

The `(?<= )` group describes a look behind assertion. 

For example, in `the quick brown fox jumps over the lazy dog`, the regex `(?<=the)\s(\w+)` will match `quick` and `lazy`.

`(?<= )` reads _preceded by_ whatever is enclosed. The `\s` character denotes any singular whitespace, and is
not part of our capture group `(\w+)`.

These look behind assertions are very useful whenever you know the prefix of your capture group. For our HTML tag, it would be `(?<=<p>)`.


We want everything between the `<p>` and `</p>` tags. May I present the all capturer, `(.*)`.
If you just run this regex on anything, you'll match the entire string.

The closing tag can be expressed with the non-capturing group `(?:</p>)`.

[Here](https://pythex.org/?regex=(%3F%3C%3D%3Cp%3E)(.*)(%3F%3A%3C%2Fp%3E)&test_string=%3Chtml%3E%0A%20%20%20%20%3Chead%3E%0A%20%20%20%20%20%20%20%20%3Ctitle%3E%0A%20%20%20%20%20%20%20%20A%20Simple%20HTML%20Document%0A%20%20%20%20%20%20%20%20%3C%2Ftitle%3E%0A%20%20%20%20%3C%2Fhead%3E%0A%20%20%20%20%3Cbody%3E%0A%20%20%20%20%20%20%20%20%3Cp%3EThis%20is%20a%20very%20simple%20HTML%20document%3C%2Fp%3E%0A%20%20%20%20%20%20%20%20%3Cp%3EIt%20only%20has%20two%20paragraphs%3C%2Fp%3E%0A%20%20%20%20%3C%2Fbody%3E%0A%3C%2Fhtml%3E&ignorecase=0&multiline=0&dotall=0&verbose=0) is a link to the completed expression, including our html test string.

### Using Regular Expressions in Python

To use regular expressions in Python, we import the `re` module from the standard library.
The documentation is very heplful and can be found [here](https://docs.python.org/3/library/re.html).

```python
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
```

Running this script gives the following output, when the html is stored in `test.html` in the same directory:

```
> python paragraphs.py
This is a very simple HTML document

It only has two paragraphs
```

Witness the power of regular expressions! 

The task of identifying my data boiled down to this function call which does all the heavy lifting:
```python
re.findall(r"(?<=<p>)(.*)(?:</p>)", html)
```

Here the `r` prefixed string is a raw string which treats the backslash `\` character as a literal character instead of a special character. For example, `r"\n"` is literally a backslash followed by an n, not a newline character as a whole. It's best practice to write regular expressions as raw strings.

While these examples are not very complicated, I hope they helped touch on some great functionality provided by regular expressions. 

I use them in my work almost every day, and now you can start using them too!