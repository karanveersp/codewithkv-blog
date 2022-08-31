---
title: Binary Ops and Gene Compression in Go
date: 2022-08-31
draft: false
description: "A compression algorithm using binary operations"
tags: ["go", "algorithms", "tutorial"]
---

## Table of Contents

```toc
```

<br/>

I've been reading
[Classic Computer Science Problems in Python](https://www.manning.com/books/classic-computer-science-problems-in-python?query=classic%20comp)
by David Kopec to review CS algorithms.

One of the first problems is gene compression where the goal is to encode a
string of nucleotides ("ACGTA...") into binary to reduce it's size in memory.

Compressed data is great because there's less stuff to download and upload,
while receiving the same information content.

The property of nucleotides being limited to the set of four letters 'A', 'C',
'G' and 'T' makes it suitable to encode it using simple integers - 0, 1, 2, 3.
Storing numbers is more memory-efficient than storing strings, which are
collections of bytes representing unique characters in UTF-8 or ASCII.

While the book implements the compression/decompression algorithm in Python, I
thought it would be a good learning exercise to write it in Go and provide an
overview of binary numbers.

## Binary Basics

We normally use base 10 integer values to represent numbers in most situations.
However, base 10 is unwieldy when you want to model data using hardware such as
switches in an on/off state. But base 2 can easily be modeled using switches,
and is a natural fit for computers.

| Decimal | Base 2 Expansion                                                              | Binary |
| ------- | ----------------------------------------------------------------------------- | ------ |
| 0       | 0 (2<sup>0</sup>)                                                             | 0      |
| 1       | 1 (2<sup>0</sup>)                                                             | 1      |
| 2       | 1 (2<sup>1</sup>) + 0 (2<sup>0</sup>)                                         | 10     |
| 3       | 1 (2<sup>1</sup>) + 1 (2<sup>0</sup>)                                         | 11     |
| ...     | ...                                                                           | ...    |
| 7       | 1 (2<sup>2</sup>) + 1 (2<sup>1</sup>) + 1 (2<sup>0</sup>)                     | 111    |
| 8       | 1 (2<sup>3</sup>) + 0 (2<sup>2</sup>) + 0 (2<sup>1</sup>) + 0 (2<sup>0</sup>) | 1000   |

The coefficients of the powers give the binary representation of the decimal
number.

## Binary Ops in Go

We can have some fun with binary in Go. Binary literals are written with a `0b`
prefix such as `0b101`.

[Binary ops playground](https://go.dev/play/p/Xu9huKk148O)

```go
package main

import "fmt"

func main() {
	fmt.Println(0b11) // 3

	fmt.Println(0b11 == 3)   // true
	fmt.Println(0b1000 == 8) // true

	// Left shift moves the bits to the left, introducing 0s on the right,
	// increasing the number
	fmt.Println(0b10 << 1)         // 4 i.e 100
	fmt.Println(0b1 << 2)          // also 4
	fmt.Println(0b1<<2 == 0b10<<1) // true

	// Right shift moves the bits to the right, losing columns and reducing the number.
	fmt.Println(0b011>>1 == 1)  // true
	fmt.Println(0b1111 >> 2)    // 3 i.e. 11
	fmt.Println(0b1110>>2 == 3) // true

	// ANDing with & produces a 1 where both columns are 1, else 0.
	fmt.Println(0b110&0b100 == 0b100) // true
	fmt.Println(0b01&0b00 == 0)       // true

	// ORing with | produces a 1 where either column or both are 1, else 0.
	fmt.Println(0b11|0b01 == 0b11)    // true
	fmt.Println(0b100|0b011 == 0b111) // true

	// ExclusiveORing with ^ produces a 1 only where columns are unequal, else 0.
	fmt.Println(0b11^0b00 == 0b11)  // true
	fmt.Println(0b100^0b101 == 0b1) // true
}
```

## Gene Compression Algorithm

Binary operations really shine when applied to the gene compression problem.

Lets get started.

```
mkdir geneCompression
cd geneCompression
```

Create a `main.go` file with a type `CompressedGene`.

```go
package main

type CompressedGene struct {
    bits int
}
```

We'll create a constructor function, and a `compress` private method that's
called within the constructor to store the gene as the bits field.

```go
func (cg *CompressedGene) compress(gene string) error {
	cg.bits = 1 // sentinel value so we can store 00 and 01 as first nucleotide
	for _, nucleotide := range strings.ToUpper(gene) {
		cg.bits = cg.bits << 2 // left shift by 2 to introduce 00
		switch nucleotide {
		case 'A':
			cg.bits |= 0b00
		case 'C':
			cg.bits |= 0b01
		case 'G':
			cg.bits |= 0b10
		case 'T':
			cg.bits |= 0b11
		default:
			return fmt.Errorf("Invalid nucleotide: %c", nucleotide)
		}
	}
	return nil
}

// NewCompressedGene provides a compressed gene struct reference.
func NewCompressedGene(gene string) (*CompressedGene, error) {
	cg := CompressedGene{}
	err := cg.compress(gene)
	if err != nil {
		return nil, err
	}
	return &cg, nil
}
```

For compression, we start out with a `1` as a sentinel value. Starting with `0`
would make us lose genes if we added `00` or `01` as the first elements since
leading zeros are ignored in binary expressions.

A left shift is performed to create two columns to store the gene. We use the
_or equals_ `|=` operator to change the value of the rightmost bits according to
the gene and store it.

Decompression will be the inverse of the compression method.

```go
// Decompress expands the bits into a string.
func (cg *CompressedGene) Decompress() (string, error) {
	gene := ""

	// bitLength - 1 to ignore sentinel value
	for i := 0; i < bitLength(cg.bits)-1; i += 2 {
		rightShifted := cg.bits >> i
		fmt.Printf("Rightshifted by %d - %b\n", i, rightShifted)

		// get the two rightmost bits
		rightPair := rightShifted & 0b11

		switch rightPair {
		case 0b00:
			gene += "A"
		case 0b01:
			gene += "C"
		case 0b10:
			gene += "G"
		case 0b11:
			gene += "T"
		default:
			return "", fmt.Errorf("Invalid bits: %d", rightPair)
		}
	}
	return reverse(gene), nil
}

func bitLength(n int) int {
	return int(math.Floor(math.Log2(float64(n))) + 1)
}

func reverse(s string) string {
	r := []rune(s)
	for i, j := 0, len(r)-1; i < len(r)/2; i, j = i+1, j-1 {
		r[i], r[j] = r[j], r[i]
	}
	return string(r)
}
```

We use the `bitLength` helper function to determine the number of bits in the
integer value, and the `reverse` function to reverse the expanded string. Since
we are going right to left, turning bits into genes, the string we build is the
reverse of the original. That's why the final step of reversing the string is
needed.

We can test everything works as expected!

```go
func main() {
	gene := "ACGT"
	fmt.Printf("Original gene: %s\n", gene)
	compressed, err := NewCompressedGene(gene)
	if err != nil {
		log.Fatalln(err)
	}
	fmt.Printf("Bits: %b\n", compressed.bits)
	decompressed, err := compressed.Decompress()
	if err != nil {
		log.Fatalln(err)
	}
	fmt.Printf("Matches original gene: %v\n", decompressed == gene)
}
```

```sh
go run main.go
Original gene: ACGT
Bits: 100011011
Rightshifted by 0 - 100011011
Rightshifted by 2 - 1000110
Rightshifted by 4 - 10001
Rightshifted by 6 - 100
Matches original gene: true
```

The only issue with this algorithm is that it fails for large string sequences.

If you change the `gene` value, and rerun - we'll get quite unexpected results.

```go
func main() {
	gene := strings.Repeat("TAGGGATTAACCGTTATATATATATAGCCATGGATCGATTATATAGGGATTAACCGTTATATATATATAGCCATGGATCGATTATA", 100)
	compressed, err := NewCompressedGene(gene)
	if err != nil {
		log.Fatalln(err)
	}
	fmt.Printf("Bits: %b\n", compressed.bits)
	decompressed, err := compressed.Decompress()
	if err != nil {
		log.Fatalln(err)
	}
	fmt.Printf("Matches original gene: %v\n", decompressed == gene)
}
```

Large gene strings will cause this algorithm problems because our `bits int`
field will easily overflow once we reach its 64 bit limit! The `int` type in go
is 32 bits or 64 bits depending on the underlying system. But we definitely
don't want that limitation, so we'll have to leverage the mighty `big.Int`.

## Using `big.Int`

The `big.Int` type won't support the binary operation symbols like `&` and `<<`
but it comes with methods that do the same thing. We can use `Or`, `And`, `Lsh`
(left shift), and `Rsh` (right shift) methods for our logic.

```go
// CompressedGene models a compressed format gene sequence
type CompressedGene struct {
	bits *big.Int
}

func (c *CompressedGene) compress(gene string) error {
	c.bits = big.NewInt(1) // sentinel value

	for _, nucleotide := range strings.ToUpper(gene) {
		c.bits.Lsh(c.bits, 2)
		switch nucleotide {
		case 'A':
			c.bits.Or(c.bits, big.NewInt(0b00))
		case 'C':
			c.bits.Or(c.bits, big.NewInt(0b01))
		case 'G':
			c.bits.Or(c.bits, big.NewInt(0b10))
		case 'T':
			c.bits.Or(c.bits, big.NewInt(0b11))
		default:
			return fmt.Errorf("Invalid nucleotide: %c", nucleotide)
		}
	}
	return nil
}

// Decompress expands the compressed bit sequence into
// a string of nucleotides A,C,G,T.
func (c *CompressedGene) Decompress() (string, error) {
	gene := ""

	// bitlen - 1 to ignore sentinel value
	for i := 0; i < c.bits.BitLen()-1; i += 2 {
		rightShifted := &big.Int{} // local value to not mutate the original
		rightShifted.Rsh(c.bits, uint(i))
		// Getting the two, rightmost bits.
		rightBits := (rightShifted.And(rightShifted, big.NewInt(0b11))).Uint64()
		switch rightBits {
		case 0b00:
			gene += "A"
		case 0b01:
			gene += "C"
		case 0b10:
			gene += "G"
		case 0b11:
			gene += "T"
		default:
			return "", fmt.Errorf("Invalid bits: %d", rightBits)
		}
	}
	return reverse(gene), nil
}
```

The constructor remains the same.

Let's adjust the main function to print out the byte sizes so we can judge the
value of this compression algorithm.

```go
func main() {
	s := strings.Repeat("TAGGGATTAACCGTTATATATATATAGCCATGGATCGATTATATAGGGATTAACCGTTATATATATATAGCCATGGATCGATTATA", 100)
	c, err := NewCompressedGene(s)
	if err != nil {
		log.Fatalln(err)
	}
	fmt.Printf("String bytes: %d\n", len([]byte(s)))
	fmt.Printf("Compressed bytes: %d\n", len(c.bits.Bytes()))
	d, err := c.Decompress()
	if err != nil {
		log.Fatalln(err)
	}
	fmt.Printf("Matches original gene: %v\n", d == s)
}
```

```
go run main.go
String bytes: 8600
Compressed bytes: 2151
true
```

There we go! We saved quite a bit of memory by encoding the genes to a big int.
By implementing this algorithm in Go, we've learned about Go's `big.Int` type
and applying binary operations to encode data for compression.

For me, this was a fun demonstration of just how interesting computing problems
can be, and the ingenious ways in which they can be solved.

I can't wait to discover and implement the rest of the algorithms in the book!
