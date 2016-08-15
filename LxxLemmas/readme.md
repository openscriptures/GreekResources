#	readme

The files in LxxLemmas are written in JSON format, but structured to
conform to the text files of the [lxxmorph][1].  Because of the
opening brace in the JSON, the line numbers will be off by one
throughout.  The references in the lemma files are in OSIS form.  In
addition to the updated lemmas, we have included the key of the lemma
in the Greek Word List.  This will allow the keys to be included in the
Septuagint files, to allow access to the data in the Greek Word List.

Each verse in the lemma files is listed as an array of word objects,
containing the "key" and "lemma" fields.  So the array index will be
one less than the word number in the verse.  See GreekWordList.md for
more information about the purpose and contents of the word list.

Considerable work has been done comparing lemmas for various instances
of each word, throughout the Septuagint.  Split lemmas have been
recombined, and discrepancies among lemmas for the same word have been
reconciled.

May 31, 2016

[1]: http://ccat.sas.upenn.edu/gopher/text/religion/biblical/lxxmorph/