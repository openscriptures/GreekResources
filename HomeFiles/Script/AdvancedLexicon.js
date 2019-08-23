/**
 * @fileOverview The JavaScript controller for the Advanced Greek Lexicon.
 * @version 1.0
 * @author David
 */
(function() {
    //*************************************************************************
    // Lexicon functions.
    //*************************************************************************
	var perseusLink = document.getElementById('link'),
		partOfSpeech = {
			"N": "Noun",
			"Np": "Proper Noun",
			"A": "Adjective",
			"R": "Pronoun",
			"C": "Conjunction",
			"X": "Particle",
			"I": "Interjection",
			"M": "Indeclinable Number",
			"P": "Preposition",
			"D": "Adverb",
			"V": "Verb"
		};
    // Utility to find the position of an element.
    function position(element) {
        var pos = {top: 0, left: 0};
        while (element) {
            pos.top += element.offsetTop;
            pos.left += element.offsetLeft;  
            element = element.offsetParent;
        }
        return pos;
    }
	// Marks up the popup.
	function popMark(id) {
		var markup = id;
		markup += '. <span class="lemma">' + greekWordList[id]['lemma'] + '</span>';
		if (greekWordList[id]['def']) {
			markup += '<br />' + defMark(greekWordList[id]['def']);
		}
		return markup;
	}
    // Manages the popup.
	var popup = function() {
		var entry = document.getElementById("entry"),
			pop = document.createElement('div');
		pop.id = 'popup';
		document.body.appendChild(pop);
		// Shows the popup.
		function showPopup(link) {
			var id = link.innerHTML;
			pop.innerHTML = popMark(id);
			var pos = position(link);
			pop.style.top = pos.top + link.offsetHeight + 10 + 'px';
			pop.style.left = pos.left + 'px';
			pop.style.display = 'block';
		}
		// Hides the popup.
		function hidePopup() {
			pop.style.display = 'none';
		}
		return {
			show: function(link) {
				showPopup(link);
			},
			hide: function() {
				hidePopup();
			}
		};
	}();
	// Constructs the Perseus link.
	function makeLink(id) {
		var word, link = '<a href="http://www.perseus.tufts.edu/hopper/';
		if (greekWordList[id].l) {
			word = greekWordList[id].l;
			link += 'text?doc=Perseus%3Atext%3A1999.04.0057%3Aentry%3D' + encodeURIComponent(word) + '" target="_blank">' + word + '</a> (LSJ)';
		} else if (greekWordList[id].m) {
			word = greekWordList[id].m;
			link += 'text?doc=Perseus%3Atext%3A1999.04.0058%3Aentry%3D' + encodeURIComponent(word) + '" target="_blank">' + word + '</a> (ML)';
		} else {
			word = beta(greekWordList[id].lemma);
			link += 'resolveform?type=exact&lookup=' + encodeURIComponent(word) + '&lang=greek" target="_blank">' + word + '</a>';
		}
    	return '<br /><b>Betacode</b>: <input type="text" value="' + word + '" /> <b>Perseus</b>: ' + link;
    }
	// Marks up the definitions.
	function defMark(list) {
		var defs = list.split(", "), i, pattern = /([^,]+) \(([^,]+)\)/, result;
		for (i in defs) {
			if ((result = pattern.exec(defs[i])) !== null) {
				defs[i] = '<span class="def">' + result[1] + '</span> (' +  result[2] + ')';
			} else {
				defs[i] = '<span class="def">' + defs[i] + '</span>';
			}
		}
		return defs.join(", ");
	}
	// Marks up parts of speech.
	function posMark(list) {
		var parts = list.split(" "), names = [], i;
		for (i in parts) {
			names.push(partOfSpeech[parts[i]]);
		}
		return names.join(", ");
	}
	// Marks up the links.
	function linkMark(list, id) {
		var items = list.split(", "), i;
		for (i in items) {
			if (items[i].charAt(0) !== "H") {
				items[i] = '<a href="#">' + items[i] + '</a>';
			}
			//TODO Lookup for Hebrew links.
		}
		return items.join(", ");
	}
	// Marks up the entry.
	function entryMarkup(id) {
		var markup = '<p>' + id, word = beta(greekWordList[id]['lemma']);
		markup += '. <span class="lemma">' + greekWordList[id]['lemma'] + '</span>';
		if (greekWordList[id]['src']) {
			markup += ' (from <span class="src">' + linkMark(greekWordList[id]['src'], id) + ')</span>';
		}
		//TODO Develop a strategy for transliteration.
		if (greekWordList[id]['pos']) {
			markup += ' <span class="pos">' + posMark(greekWordList[id]['pos']) + '</span>';
		}
		if (greekWordList[id]['strong']) {
			markup += ' <span class="strong"><b>Strong</b>: ' + greekWordList[id]['strong'] + '</span>';
		}
		if (greekWordList[id]['def']) {
			markup += '<br />' + defMark(greekWordList[id]['def']);
		}
		if (greekWordList[id]['deriv']) {
			markup += '<br /><b>Derivatives</b>:  <span class="deriv">' + linkMark(greekWordList[id]['deriv'], id) + '</span>';
		}
		markup += makeLink(id);
		markup += '</p>';
		return markup;
	}
	//*************************************************************************
	// Word List management.
	//*************************************************************************
	// Construct the index array for the entry list.
	var indexArray = function() {
		var list = [], id;
		for (id in greekWordList) {
			list.push(id);
		}
		return list;
	}();
	// Locate the position of a given key.
	function locateKey(key) {
		var start = 0, end = indexArray.length, half;
		while (end - start > 1) {
			half = Math.round((start + end) / 2);
			if (key < indexArray[half]) {
				end = half;
			} else {
				start = half;
			}
		}
		return key == indexArray[start] ? start : end;
	}
	//*************************************************************************
	// Greek word management.
	//*************************************************************************
	// Remove accents from words.
	var unaccentWord = function() {
		var unaccent = {
			"Ϊ": "Ι", "Ϋ": "Υ", "ϊ": "ι", "ϋ": "υ", "ϔ": "ϒ", "ἀ": "α", "ἁ": "α",
			"ἂ": "α", "ἃ": "α", "ἄ": "α", "ἅ": "α", "ἆ": "α", "ἇ": "α", "Ἀ": "Α",
			"Ἁ": "Α", "Ἂ": "Α", "Ἃ": "Α", "Ἄ": "Α", "Ἅ": "Α", "Ἆ": "Α", "Ἇ": "Α",
			"ἐ": "ε", "ἑ": "ε", "ἒ": "ε", "ἓ": "ε", "ἔ": "ε", "ἕ": "ε", "Ἐ": "Ε",
			"Ἑ": "Ε", "Ἒ": "Ε", "Ἓ": "Ε", "Ἔ": "Ε", "Ἕ": "Ε", "ἠ": "η", "ἡ": "η",
			"ἢ": "η", "ἣ": "η", "ἤ": "η", "ἥ": "η", "ἦ": "η", "ἧ": "η", "Ἠ": "Η",
			"Ἡ": "Η", "Ἢ": "Η", "Ἣ": "Η", "Ἤ": "Η", "Ἥ": "Η", "Ἦ": "Η", "Ἧ": "Η",
			"ἰ": "ι", "ἱ": "ι", "ἲ": "ι", "ἳ": "ι", "ἴ": "ι", "ἵ": "ι", "ἶ": "ι",
			"ἷ": "ι", "Ἰ": "Ι", "Ἱ": "Ι", "Ἲ": "Ι", "Ἳ": "Ι", "Ἴ": "Ι", "Ἵ": "Ι",
			"Ἶ": "Ι", "Ἷ": "Ι", "ὀ": "ο", "ὁ": "ο", "ὂ": "ο", "ὃ": "ο", "ὄ": "ο",
			"ὅ": "ο", "Ὀ": "Ο", "Ὁ": "Ο", "Ὂ": "Ο", "Ὃ": "Ο", "Ὄ": "Ο", "Ὅ": "Ο",
			"ὐ": "υ", "ὑ": "υ", "ὒ": "υ", "ὓ": "υ", "ὔ": "υ", "ὕ": "υ", "ὖ": "υ",
			"ὗ": "υ", "Ὑ": "Υ", "Ὓ": "Υ", "Ὕ": "Υ", "Ὗ": "Υ", "ὠ": "ω", "ὡ": "ω",
			"ὢ": "ω", "ὣ": "ω", "ὤ": "ω", "ὥ": "ω", "ὦ": "ω", "ὧ": "ω", "Ὠ": "Ω",
			"Ὡ": "Ω", "Ὢ": "Ω", "Ὣ": "Ω", "Ὤ": "Ω", "Ὥ": "Ω", "Ὦ": "Ω", "Ὧ": "Ω",
			"ὰ": "α", "ά": "α", "ὲ": "ε", "έ": "ε", "ὴ": "η", "ή": "η", "ὶ": "ι",
			"ί": "ι", "ὸ": "ο", "ό": "ο", "ὺ": "υ", "ύ": "υ", "ὼ": "ω", "ώ": "ω",
			"ᾀ": "α", "ᾁ": "α", "ᾂ": "α", "ᾃ": "α", "ᾄ": "α", "ᾅ": "α", "ᾆ": "α",
			"ᾇ": "α", "ᾈ": "Α", "ᾉ": "Α", "ᾊ": "Α", "ᾋ": "Α", "ᾌ": "Α", "ᾍ": "Α",
			"ᾎ": "Α", "ᾏ": "Α", "ᾐ": "η", "ᾑ": "η", "ᾒ": "η", "ᾓ": "η", "ᾔ": "η",
			"ᾕ": "η", "ᾖ": "η", "ᾗ": "η", "ᾘ": "Η", "ᾙ": "Η", "ᾚ": "Η", "ᾛ": "Η",
			"ᾜ": "Η", "ᾝ": "Η", "ᾞ": "Η", "ᾟ": "Η", "ᾠ": "ω", "ᾡ": "ω", "ᾢ": "ω",
			"ᾣ": "ω", "ᾤ": "ω", "ᾥ": "ω", "ᾦ": "ω", "ᾧ": "ω", "ᾨ": "Ω", "ᾩ": "Ω",
			"ᾪ": "Ω", "ᾫ": "Ω", "ᾬ": "Ω", "ᾭ": "Ω", "ᾮ": "Ω", "ᾯ": "Ω", "ᾰ": "α",
			"ᾱ": "α", "ᾲ": "α", "ᾳ": "α", "ᾴ": "α", "ᾶ": "α", "ᾷ": "α", "Ᾰ": "Α",
			"Ᾱ": "Α", "Ὰ": "Α", "Ά": "Α", "ᾼ": "Α", "ι": "ι", "ῂ": "η", "ῃ": "η",
			"ῄ": "η", "ῆ": "η", "ῇ": "η", "Ὲ": "Ε", "Έ": "Ε", "Ὴ": "Η", "Ή": "Η",
			"ῌ": "Η", "ῐ": "ι", "ῑ": "ι", "ῒ": "ι", "ΐ": "ι", "ῖ": "ι", "ῗ": "ι",
			"Ῐ": "Ι", "Ῑ": "Ι", "Ὶ": "Ι", "Ί": "Ι", "ῠ": "υ", "ῡ": "υ", "ῢ": "υ",
			"ΰ": "υ", "ῤ": "ρ", "ῥ": "ρ", "ῦ": "υ", "ῧ": "υ", "Ῠ": "Υ", "Ῡ": "Υ",
			"Ὺ": "Υ", "Ύ": "Υ", "Ῥ": "Ρ", "ῲ": "ω", "ῳ": "ω", "ῴ": "ω", "ῶ": "ω",
			"ῷ": "ω", "Ὸ": "Ο", "Ό": "Ο", "Ὼ": "Ω", "Ώ": "Ω", "ῼ": "Ω"
		}
		return function(word) {
			function transform(match) {
				return unaccent.hasOwnProperty(match) ? unaccent[match] : match;
			}
			return word.replace(/./g, transform);
		};
	}();
	//*************************************************************************
	// Greek input.
	//*************************************************************************
	var greekKeydown = function(callback) {
		var map = [
			{"192": "\u1fef", "49": "\u0031", "50": "\u0032", "51": "\u0033",
				"52": "\u0034", "53": "\u0035", "54": "\u0036", "55": "\u0037",
				"56": "\u0038", "57": "\u0039", "48": "\u0030", "109": "\u002d", 
				"189": "\u002d", "61": "\u003d", "107": "\u003d", "187": "\u003d",
				"81": "\u037e", "87": "\u03c2", "69": "\u03b5", "82": "\u03c1",
				"84": "\u03c4", "89": "\u03c5", "85": "\u03b8", "73": "\u03b9",
				"79": "\u03bf", "80": "\u03c0", "219": "\u005b", "221": "\u005d",
				"220": "\u005c", "65": "\u03b1", "83": "\u03c3", "68": "\u03b4",
				"70": "\u03c6", "71": "\u03b3", "72": "\u03b7", "74": "\u03be",
				"75": "\u03ba", "76": "\u03bb", "222": "\u1ffd", "90": "\u03b6",
				"88": "\u03c7", "67": "\u03c8", "86": "\u03c9", "66": "\u03b2",
				"78": "\u03bd", "77": "\u03bc", "188": "\u002c", "190": "\u002e",
				"191": "\u00af", "32": "\u0020"},
			{"192": "\u1fc0", "49": "\u0021", "50": "\u0040", "51": "\u0023",
				"52": "\u0024", "53": "\u0025", "54": "\u1fc0", "55": "\u0026",
				"56": "\u002a", "57": "\u0028", "48": "\u0029", "109": "\u005f", 
				"189": "\u005f", "61": "\u002b", "107": "\u002b", "187": "\u002b",
				"81": "\u0387", "87": "\u03a3", "69": "\u0395", "82": "\u03a1",
				"84": "\u03a4", "89": "\u03a5", "85": "\u0398", "73": "\u0399",
				"79": "\u039f", "80": "\u03a0", "219": "\u007b", "221": "\u007d",
				"220": "\u007c", "65": "\u0391", "83": "\u03a3", "68": "\u0394",
				"70": "\u03a6", "71": "\u0393", "72": "\u0397", "74": "\u039e",
				"75": "\u039a", "76": "\u039b", "59": "\u00a8", "186": "\u00a8",
				"222": "\u02BC", "90": "\u0396", "88": "\u03a7", "67": "\u03a8", "86": "\u03a9",
				"66": "\u0392", "78": "\u039d", "77": "\u039c", "188": "\u1ffe",
				"190": "\u1fbf", "191": "\u02d8", "32": "\u00A0"},
			{"53": "\u2020", "57": "\u0375", "48": "\u0374", "73": "\u037a",
				"83": "\u00A7", "66": "\u2022", "78": "\u2013", "77": "\u2014",
				"32": "\u00A0"},
			{"53": "\u2021", "78": "\u2002", "77": "\u2003", "32": "\u00A0"}
		];
		// Get and process the keycode.
		function key(e) {
			e = e ? e : event;
			var keycode = e.keyCode;
			if (keycode > 105 || (keycode < 96 && keycode > 47) || keycode === 32) {
				var mod = (e.shiftKey) ? 1 : 0;
				mod += (e.altKey) ? 2 : 0;
				mod += (e.ctrlKey) ? 4 : 0;
				if (mod < 4) {
					if (e.preventDefault) {e.preventDefault();}
					return map[mod][keycode];
				}
			} else if (keycode === 13) {
				return "enter";
			}
			return false;
		}
		// Insert text into an element.
		function textInsert(elem, text) {
			if (elem.selectionStart || elem.selectionStart === 0) {
				var start = elem.selectionStart;
				var end = elem.selectionEnd;
				var newText = elem.value.substring(0, start);
				newText += text;
				newText += elem.value.substring(end, elem.value.length);
				elem.value = newText;
				elem.selectionStart = start + text.length;
				elem.selectionEnd = elem.selectionStart;
			} else if (document.selection) { // IE
				var textRange = document.selection.createRange();
				textRange.text = text;
			} else {
				elem.value += text;
			}
		}
		// Return the keydown handler.
		return function(event) {
			var output = key(event);
			if (output === "enter") {
				callback(this.value, true);
				return false;
			} else if (output) {
				textInsert(this, output);
				callback(this.value);
				return false;
			}
			callback(this.value);
			return true;
		};
	};
    //*************************************************************************
    // Interface management.
    //*************************************************************************
	(function() {
		var index = document.getElementById("index"),
			entry = document.getElementById("entry");
		// Sets up the links.
		function linkWork() {
			var links = entry.getElementsByTagName("a"), i, len = links.length;
			for (i = 0; i < len; i++) {
				if (links[i].getAttribute("href") == "#") {
					links[i].onmouseover = function() {
						popup.show(this);
					};
					links[i].onmouseout = popup.hide;
					links[i].onclick = function() {
						popup.hide();
						index.value = this.innerHTML;
						history.add();
					};
				}
			}
		}
		// Displays the entry.
		function displayEntry(id) {
			lookAhead.style.display = 'none';
			entry.innerHTML = entryMarkup(id);
			linkWork();
			index.select();
		}
		// Tracks the navigation history.
		var history = function() {
			var entries = [], item = -1, last = -1, pos;
			function addEntry(id) {
				id = id ? id : index.value;
				item++;
				if (item < last) {
					entries.splice(item, last - item + 1, id);
				} else {
					entries[item] = id;
				}
				last = item;
				displayEntry(id);
			}
			function backward() {
				if (item > 0) {
					item--;
					index.value = entries[item];
					displayEntry(index.value);
				} else {
					pos = locateKey(unaccentWord(index.value));
					if (pos > 0) {
						index.value = indexArray[pos - 1];
						addEntry();
					}
				}
			}
			function forward() {
				if (item < last) {
					item++;
					index.value = entries[item];
					displayEntry(index.value);
				} else {
					pos = locateKey(unaccentWord(index.value));
					if (pos < indexArray.length - 1) {
						index.value = indexArray[pos + 1];
						addEntry();
					}
				}
			}
			return {
				add: function(id) {
					addEntry(id);
				},
				back: function() {
					backward();
				},
				fore: function() {
					forward();
				}
			};
		}();
		// Implement look ahead dropdown.
		var lookAhead = document.getElementById("lookAhead");
		// Utility function to clear child nodes from an element.
		function clearNodes(elem) {
			while (elem.childNodes.length > 0) {
				elem.removeChild(elem.firstChild);
			}
		};
		// Constructs a list item for the look ahead dropdown.
		function lookLine(id) {
			var text = greekWordList[id].lemma,
				item = document.createElement('li');
			if (greekWordList[id].def) {
				text += ' - ' + greekWordList[id]['def'];
			}
			item.appendChild(document.createTextNode(text));
			item.setAttribute('title', id);
			item.addEventListener("click", function() {
				history.add(this.title);
				lookAhead.style.display = 'none';
			}, false)
			return item;
		};
		// Sets up the look ahead dropdown.
		function lookDropdown(listPos) {
			clearNodes(lookAhead);
			var ed = document.createElement('div');
			// Append look ahead lines.
			var list = document.createElement('ul');
			var i, lim = (listPos + 10 > indexArray.length) ? indexArray.length : listPos + 10;
			for (i = listPos; i < lim; i++) {
				list.appendChild(lookLine(indexArray[i]));
			}
			ed.appendChild(list);
			lookAhead.appendChild(ed);
			// Display the dropdown.
			var pos = position(index);
			lookAhead.style.top = pos.top + index.offsetHeight + 'px';
			lookAhead.style.left = pos.left + 'px';
			lookAhead.style.display = 'block';
		}
		// Word output: callback function for greekKeydown.
		function wordOutput(word, isEnter) {
			var num = parseFloat(word), pos, id;
			if (num) {
				id = idLookupList[num];
			} else {
				pos = locateKey(unaccentWord(word));
				id = indexArray[pos];
			}
			if (isEnter) {
				history.add(id);
			} else {
				lookDropdown(pos);
			}
		}
		index.onkeydown = greekKeydown(wordOutput);
		document.getElementById("back").onclick = history.back;
		document.getElementById("fore").onclick = history.fore;
		index.select();
	})();
})();