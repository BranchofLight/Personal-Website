/**
 * TODO:
 * Make commands -> options work
 * -> Handle Enter press
 * -> Errors, successes, general(?)
 * Invisible caret demo: https://jsfiddle.net/smzpf9h6/
 * Add terminal functionality (tail - links and .txt, cd - maybe gimmick directory, ls)
 *                            -> create custom scrollbar for console
 *                            -> rm triggers a warning for admin
 *                            -> sudo asks for password, none work
 * TERMINAL TIP: to highlight just the command word attempt the following
 * -> when a valid command word is entered add coloring
 * -> then shrink input to size of word, and add another input adjacent to this
 * -> the new input, not noticeably a different one, then handles text normally
 * -> if backsapce is pressed on new input when value.length = 0 then delete it and go to previous
 * -> Example code: https://jsfiddle.net/m4revkoy/1/
 * Animate console opening (optional, if necessary)
 * Screen size support
 *    -> maximum character length for commands may change
 *    -> text size
 *    -> console size
 */
var starMap = document.querySelector('.star-map');
var resizeFunctions = []; // Calls all these on window resize

var createStars = function() {
  console.log("Creating stars.");

  // Calculates maximum diamater for the star map (circle) to fit the viewport (rectangle)
  var diagnol = Math.sqrt((document.body.offsetWidth**2) + (document.body.offsetHeight**2));
  diagnol = Math.round(diagnol) + Math.round(diagnol*0.1); // Requires some padding
  starMap.style.width = diagnol + "px";
  starMap.style.height = diagnol + "px";

  starMap.style.left = -1 * ((diagnol/2) - (document.body.offsetWidth/2)) + "px";
  starMap.style.top = -1 * ((diagnol/2) - (document.body.offsetHeight/2)) + "px";

  // Resets stars
  if (starMap.childNodes.length > 0) {
    starMap.innerHTML = "";
  }

  var stars = Math.round((diagnol**2)/3000);
  // Arbitrary limits for performance
  if (stars > 6000) {
    stars = 5000;
  } else if (stars < 100) {
    stars = 100;
  }

  for (let i = 0; i < stars; i++) {
  	var rPrime = Math.random() * ((diagnol/2)**2);
  	var theta  = Math.random() * (Math.PI*2);
    var x = Math.sqrt(rPrime)*Math.cos(theta);
    var y = Math.sqrt(rPrime)*Math.sin(theta);
    var p = document.createElement('p');
    p.innerText = ".";
    p.classList.add('star');
    p.classList.add('no-select');
    // Generates animation tag with random length and random delay
    p.style.animation = "sparkle " + Math.round(Math.random()*(10000-4000)+4000) + "ms linear " + Math.round(Math.random()*5) + "s infinite";
    p.style.top = y + diagnol/2-25 + "px";
    p.style.left = x + diagnol/2 + "px";
    starMap.appendChild(p);
  }
};

createStars();
resizeFunctions.push(createStars);

window.onresize = function() {
  for (let i = 0; i < resizeFunctions.length; i++) {
    resizeFunctions[i]();
  }
};

/**
 ***************************
 * GENERAL NOTE ABOUT TEXT *
 ***************************
 * If there is HTML inside of the text the writers will look
 * until a second closing tag (>) before resuming normal input
 */

var getPad = function(padding) {
  var str = "";
  for (let i = 0; i < padding; i++) {
    str += '&nbsp';
  }

  return str;
};

// Every element is a newline
var siteText = [
  "> <span class=\"command\">cd</span> '.\\scott-andrechek\\'",
  "> <span class=\"command\">tail</span> 'portfolio.txt'",
  "<span class=\"hyphenate\">I am currently a Computer Science student at Carleton University. Playing guitar, programming, board games and collecting vinyl records are how I typically spend my time. You can find some of my projects below. Feel free to try out this terminal as well. Thanks for stopping by!</span>",
  "> <span class=\"command\">ls</span>",
  "<span class=\"command\">Directory: root:\\scott-andrechek</span>",
  "Name                    Description",
  "----                    -----------",
  "<a href=\"https://github.com/abejfehr/justclock.in\" class=\"link\" target=\"_blank\">Just Clock In</a>"+getPad(11)+"A comprehensive time clock management solution",
  "<a href=\"https://github.com/BranchofLight/Focus\" class=\"link\" target=\"_blank\">Focus</a>"+getPad(19)+"AI vs AI implementation of the classic board game",
  "<a href=\"https://chrome.google.com/webstore/detail/steam-chat-auto-scroll/bcijdddmmglcfbbekdkepcainmnnomfl?hl=en-GB\" class=\"link\" target=\"_blank\">Steam Chat Auto Scroll</a>"+getPad(2)+"Fixes Steam's web chat scrolling issue",
  "<a href=\"https://github.com/BranchofLight/Chunk\" class=\"link\" target=\"_blank\">Chunk</a>"+getPad(19)+"A dynamic variable type for C++",
  "<a href=\"https://github.com/BranchofLight/Profanity-Logger\" class=\"link\" target=\"_blank\">Profanity Logger</a>"+getPad(8)+"Captures colourful language; not passwords",
  "<a href=\"https://github.com/BranchofLight\" class=\"link\" target=\"_blank\">More projects</a>"+getPad(11)+"My Github",
  "<a href=\"mailto:scottandrechek@gmail.com\" class=\"link\" target=\"_blank\">Email Address</a>"+getPad(11)+"Contact me",
  "<span class=\"link\">portfolio.txt</span>"+getPad(11)+"'tail' this to see my description again; try tailing other things!",
];

// Faux types text to console
var writeTextToConsole = function(text, wrapper) {
  var p = document.createElement('p');
  p.classList.add('text');
  document.querySelector('.console').appendChild(p);

  return (new Promise(function(resolve, reject) {
    var typeIndex = 0;
    var minStroke = 50;
    var maxStroke = 125;
    var strokeDelay = Math.round(Math.random() * maxStroke);
    var typerInterval = setInterval(function() {
      if (text.length <= typeIndex) {
        clearInterval(typerInterval);
        resolve();
      } else {
        if (text[typeIndex] === " ") {
          p.innerHTML += '&nbsp';
        } else if (text[typeIndex] === "<") {
          var end = text.substring(typeIndex+1).indexOf('<')+1+typeIndex;
          var temp = text.substring(typeIndex+end).indexOf('>')+typeIndex;
          end += temp;
          p.innerHTML = p.innerText + text.substring(typeIndex, end);
          typeIndex = end;
        } else {
          // This must be innerHTML for other HTML to render properly!
          p.innerHTML += text[typeIndex];
        }

        typeIndex += 1;
        strokeDelay = Math.round(Math.random() * (maxStroke-minStroke) + minStroke);
      }
    }, strokeDelay);
  }));
};

// Adds text all at once to console
var addTextToConsole = function(text) {
  return (new Promise(function(resolve, reject) {
    var p = document.createElement('p');
    p.classList.add('text');
    if (text.indexOf('<') >= 0) {
      p.innerHTML = text;
    } else {
      p.innerHTML = text.replace(/[\s*]/g, '&nbsp');
    }
    document.querySelector('.console').appendChild(p);
    resolve();
  }));
};

var lineDelay = 400;
var writeSiteText = function(index, callback) {
  if (index < siteText.length) {
    if (siteText[index][0] === ">") {
      writeTextToConsole(siteText[index])
      .then(function() {
        setTimeout(function() {
          writeSiteText(index+1, callback);
        }, lineDelay);
      });
    } else {
      addTextToConsole(siteText[index])
      .then(function() {
        setTimeout(function() {
          writeSiteText(index+1, callback);
        }, lineDelay);
      });
    }
    document.querySelector('.console').scrollTop = document.querySelector('.console').scrollHeight;
  } else {
    callback();
  }
};

var placeCaretAtEnd = function(el) {
  el.focus();
  if (typeof window.getSelection != "undefined"
          && typeof document.createRange != "undefined") {
      var range = document.createRange();
      range.selectNodeContents(el);
      range.collapse(false);
      var sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
  } else if (typeof document.body.createTextRange != "undefined") {
      var textRange = document.body.createTextRange();
      textRange.moveToElementText(el);
      textRange.collapse(false);
      textRange.select();
  }
}

writeSiteText(0, function() {
  var symbolSpan = document.createElement('span');
  symbolSpan.classList.add('text');
  symbolSpan.innerHTML = ">&nbsp";

  var usrCode = document.createElement('span');
  usrCode.classList.add('user-code');
  usrCode.setAttribute('contenteditable', true);

  var commandSpan = document.createElement('span');
  commandSpan.classList.add('value-span');
  commandSpan.classList.add('text');
  commandSpan.setAttribute('contenteditable', true);
  commandSpan.setAttribute('spellcheck', false);
  commandSpan.disabled = true;

  var optionsSpan = document.createElement('span');
  optionsSpan.classList.add('value-span');
  optionsSpan.classList.add('text');
  optionsSpan.setAttribute('contentEditable', true);
  optionsSpan.setAttribute('spellcheck', false);
  optionsSpan.disabled = true;

  var spanToDraw = commandSpan;

  var invalidKeys = [
    'ArrowRight', 'ArrowLeft', 'Delete',
  ];
  usrCode.addEventListener('keydown', function(e) {
    console.log(usrCode.innerText);
    if (invalidKeys.indexOf(e.key) > -1) {
      e.preventDefault();
    } else if (symbolSpan.offsetWidth + commandSpan.offsetWidth + optionsSpan.offsetWidth >= document.querySelector('.console').offsetWidth*0.9 && e.key !== 'Backspace') {
      e.preventDefault();
    } else if (spanToDraw === optionsSpan && optionsSpan.innerText.length === 0 && e.key === 'Backspace') {
      spanToDraw = commandSpan;
      commandSpan.classList.remove('command');
    }
  });

  // cat will be alias for tail
  // sudo will ask for pw, none will work
  // wget simply attempts to open the URL in a new tab
  // ls prints out directory again
  // git followed by anything opens my github
  var validCommands = [
    'sudo', 'tail', 'cat', 'cd', 'ls', 'wget', 'git'
  ];
  // These commands are valid, but throw an error
  var disabledCommands = [
    'rm', 'mkdir', 'ssh', 'telnet'
  ];

  usrCode.addEventListener('input', function(e) {
    var visibleLength = commandSpan.innerText.length + optionsSpan.innerText.length;
    if (visibleLength > usrCode.innerText.length) {
      // Remove last character
      spanToDraw.innerText = spanToDraw.innerText.substring(0, spanToDraw.innerText.length-1);
    } else {
      // Add newest character
      spanToDraw.innerText += usrCode.innerText[usrCode.innerText.length-1];
    }

    if (validCommands.indexOf(usrCode.innerText) > -1 && spanToDraw === commandSpan) {
    	commandSpan.classList.add('command');

      // Change visible span to write to
      spanToDraw = optionsSpan;
    }

    // Stops the caret animation while typing
    document.querySelector('.caret').classList.remove('active-caret');
    setTimeout(function() {
      // Starts it again after typing
      document.querySelector('.caret').classList.add('active-caret');
    }, 250);
  });

  // Create our custom caret
  var caret = document.createElement('div');
  caret.classList.add('caret');
  caret.classList.add('active-caret');

  // These listeners make sure user cannot go behind the space or caret
  usrCode.addEventListener('focus', function(e) {
    e.preventDefault();
    placeCaretAtEnd(usrCode);
    caret.style.visibility = "visible";
  });
  usrCode.addEventListener('focusout', function(e) {
    caret.style.visibility = "hidden";
  });
  usrCode.addEventListener('click', function(e) {
    e.preventDefault();
    placeCaretAtEnd(usrCode);
  });
  document.querySelector('.console').addEventListener('click', function(e) {
    e.preventDefault();
    placeCaretAtEnd(usrCode);
  });

  document.querySelector('.console').appendChild(symbolSpan);
  document.querySelector('.console').appendChild(commandSpan);
  document.querySelector('.console').appendChild(optionsSpan);
  document.querySelector('.console').appendChild(usrCode);
  document.querySelector('.console').appendChild(caret);

  var positionInput = function() {
    var rect = commandSpan.getBoundingClientRect();

    caret.style.top = rect.top + rect.height - 4 + "px";
    usrCode.style.top = rect.top + "px";
    usrCode.style.left = rect.left + "px";
  };

  document.querySelector('.console').scrollTop = document.querySelector('.console').scrollHeight;

  resizeFunctions.push(function() {
    while (symbolSpan.offsetWidth + commandSpan.offsetWidth + optionsSpan.offsetWidth >= document.querySelector('.console').offsetWidth*0.9) {
      usrCode.innerText = usrCode.innerText.substring(0, usrCode.innerText.length-1);
      if (optionsSpan.innerText.length > 0) {
        optionsSpan.innerText = optionsSpan.innerText.substring(0, optionsSpan.innerText.length-1);
      } else {
        commandSpan.innerText = commandSpan.innerText.substring(0, commandSpan.innerText.length-1);
      }
    }
  });

  var caretScrollCheck = function() {
    var scrollMax = document.querySelector('.console').scrollHeight - document.querySelector('.console').offsetHeight;
    // parseInt rounds down -- still need the negative padding on scroll max
    if (parseInt(document.querySelector('.console').scrollTop) >= scrollMax*0.98) {
      caret.style.visibility = "visible";
      placeCaretAtEnd(usrCode);
      positionInput();
    } else {
      caret.style.visibility = "hidden";
    }
  }

  resizeFunctions.push(function() {
    caretScrollCheck();
  });

  document.querySelector('.console').addEventListener('scroll', function() {
    caretScrollCheck();
  });

  // Should be scrolled down at this point, but check anyway
  caretScrollCheck();
});
