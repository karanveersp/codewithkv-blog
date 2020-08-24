---
title: Python's repr and str methods
date: 2020-08-24
draft: false
description: "Examining object state"
tags: ["Python", "Beginner"]
---

_Knowledge is power_.

Every programmer comes to appreciate that after doing their share of debugging.

One of the best ways to gain knowledge about a system is to examine the state of the program at specific points of execution. 
Stepping through the program with a debugger is great but the age old practice of printing objects in a human readable format is also effective.

Most python developers would be familiar with the `__str__` method. It's the Python equivalent of the `toString()` method in Java.
Just like in Java, all Python objects extend a base Object class which has default implementations of common methods.

Here's an example of the default `__str__` method's return value:

```python
class Movie:
    def __init__(self, name, release_year):
        self.name = name
        self.release_year = release_year

cool_movie = Movie("The Revenant", 2015)
print(cool_movie)
```

```
<__main__.Movie object at 0x7fe3f13bcfa0>
```

It's not particularly helpful when you want to examine the state of the object. 

## A Readable Representation

Lets implement our own `__str__` method which overrides the default:

```python
def __str__(self):
    return f"Movie(name={self.name}, release_year={self.release_year})"
```

Adding this to the class changes the output of the print function to:

```
Movie(name=The Revenant, release_year=2015)
```

Much better! Now we know the object type as well as its state.

Notice you didn't have to actually invoke the `__str__` method. The
`print` function automatically calls the `__str__` method on the object passed.

There's also a `__repr__` method which can be called on objects:

```python
print(cool_movie.__repr__())
```
```
<__main__.Movie object at 0x7fe3f13dd4c0>
```

This is like our default str method. So why are there two methods that return the same kind of string?

## What's the difference?

The `repr` and `str` methods can both be used for debugging. However, like in many things in Python, a convention has emerged which adds some nuance to the purpose of each.

* The point of the `__str__` method is to return a _human readable_ string representation
of the object. It doesn't have to be a specific format, like we have it above with parentheses, and field names. Clarity is the main thing.

* The purpose of the `__repr__` method is also to return a human readable string, but it is expected to be more formal. In fact, the convention is to return a string which could be used to _construct_ the object in that state. 

So for our example, this would qualify as a good implementation of `__repr__`

```python
def __repr__(self):
    return f'Movie(name="{self.name}",release_year={self.release_year})'
```

Calling `print(cool_movie.__repr__())` now gives:

```
Movie(name="The Revenant",release_year=2015)
```

Note that we used the format string with single quotes, so we could wrap the name value with double quotes to say it's a string.

The returned value is also identical to what one would type to construct a Movie instance using keyword args.

## Evaluating a String into an Object

The cool thing is that the return value of the repr method can actually be passed to the `eval()` builtin function.

The `eval()` function is really interesting. It _evaluates_ the string passed to it as a Python expression, returning
whatever the expresion would return.

For example:

```python
eval("1 + 1")  # returns 2
```

We can then try:

```python
movie = eval(cool_movie.__repr__())
print(movie)  # Movie(name=The Revenant, release_year=2015)
```

First the `cool_movie.__repr__()` method is called, and it's return value is then passed into the `eval` function.
The string happens to be a call to the `Movie` class's constructor with specific arguments, returning a `Movie` instance.

Here we make use of both the repr and str methods, one explicit and the other implicit. The output is the return value of
the `__str__` method.

One more thing to note is that an overridden `__repr__` method is called implicitly by the `print` function if `__str__`
has _not_ been overriden.

So if our Movie class only had `__repr__` overriden, then that will be used to get the string representation. Try it!

It's good practice to override both.
When things go wrong with objects, their internal state often helps understanding the problem. Making that human readable is a
priority for the clean coder.

Well that's it for my first blog post. Happy coding!