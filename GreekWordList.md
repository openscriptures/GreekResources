#	Greek Word List

The Greek word list is a compilation of Greek words from the New
Testament and the [Septuagint][1], meant to be used as an index to
related dictionaries and lexica.  The keys to the list are the
unaccented forms, supplemented by a .1, .2, .3 when necessary, to
distinguish words with the same spelling.  (There are only 138
instances where this is necessary.)  The fields allowed in an entry
are listed.

##	Fields

###	lemma

The lemma form adopted for the list has been chosen after comparing
alternatives listed in Strong’s Dictionary, [Liddell & Scott][2],
[MorphGNT][3] and [Abbott-Smith][4].  Other forms in the word list use
the "v" field to reference the primary lemma.  See below.

###	strong

The Strong number is noted, for New Testament words.

###	pos

The part of speech is listed using Packard parts of speech:

-	N = Noun
-	Np = Proper Noun
-	V = Verbs
-	A = Adjective
-	R = Pronouns
-	C = Conjunction
-	X = Particle
-	I = Interjection
-	M = Indeclinable Number
-	P = Preposition
-	D = Adverb

###	src

The source(s) the word is derived from are listed, mainly for New
Testament words.  Some words have been added to the Greek Word List,
for use as sources, when they don’t otherwise appear in scripture.

###	def

The definitions chosen for translation in the author’s own work are
listed.  These may or may not be useful, and can be discarded at will.
Simply replace `, "def": "[^"]+"` with an empty string.  Some of these
definitions are fresh and new; other are old and obsolete.

###	deriv

The derivatives of the word, mainly from the New Testament lexicon, are
meant to correspond roughly to the sources listed above.

###	v

The "v" field lists the key for the primary form of the word.  These
are used to avoid conflicts with multiple forms of the lemmas.

###	l

The "l" field lists the lookup form for [Liddell & Scott][2].  These
can be accessed at

	'http://www.perseus.tufts.edu/hopper/text?doc=Perseus%3Atext%3A1999.04.0057%3Aentry%3D' + encodeURIComponent(word)
	
Should the lookup fail, you can use the Perseus search, with

	'http://www.perseus.tufts.edu/hopper/resolveform?type=exact&lookup=' + encodeURIComponent(word) + '&lang=greek'

where `word` is the same text, or the betacode form of the lemma, when
there is no "l" or "m" field.

###	m

The "m" field is the lookup form for [Middle-Liddell][5], when there
is no LSJ listing.  These can be accessed at

	'http://www.perseus.tufts.edu/hopper/text?doc=Perseus%3Atext%3A1999.04.0058%3Aentry%3D' + encodeURIComponent(word)

##	Related Files

There are additional files mapping the lemmas of the [MorphGNT][3] to
the Greek Word List, and the word list to the keys of [Abbott-Smith][4].

August 15, 2016

[1]: http://ccat.sas.upenn.edu/gopher/text/religion/biblical/lxxmorph/
[2]: http://www.perseus.tufts.edu/hopper/text?doc=Perseus%3atext%3a1999.04.0057
[3]: https://github.com/morphgnt/sblgnt/tree/tisch-merge
[4]: https://github.com/translatable-exegetical-tools/Abbott-Smith
[5]: http://www.perseus.tufts.edu/hopper/text?doc=Perseus%3Atext%3A1999.04.0058
