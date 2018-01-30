/**
 * TODO:
 */
var resizeFunctions = []; // Calls all these on window resize

var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');
var stars = [];

var calcDimensions = function() {
  // canvas.style.width = document.body.offsetWidth + "px";
  // canvas.style.height = document.body.offsetHeight + "px";
  canvas.setAttribute('width', document.body.offsetWidth);
  canvas.setAttribute('height', document.body.offsetHeight);

  if (stars.length > 0) {
    stars = [];
    init();
  }
};

calcDimensions();

var clear = function() {
  ctx.fillStyle = '#051121';
  ctx.fillRect(0, 0, canvas.getAttribute('width'), canvas.getAttribute('height'));
};

var init = function() {
  var h = canvas.getAttribute('height');
  var w = canvas.getAttribute('width');
  for (let i = 0; i < h*w/100; ++i) {
    stars.push({
      distance: Math.random() * Math.sqrt((w / 2) ** 2 + (h / 2) ** 2),
      angle: Math.random() * 2 * Math.PI,
      opacity: Math.random(),
    });
  };

  clear();
};

var step = function(timestamp) {
  clear();

  var h = canvas.getAttribute('height');
  var w = canvas.getAttribute('width');
  var starSpeed = 0.01;
  for (let i = 0; i < stars.length; ++i) {
    const center = {
      x: w / 2,
      y: h / 2,
    };

    const x = center.x + Math.cos(stars[i].angle + timestamp * starSpeed / 1000) * stars[i].distance;
    const y = center.y + Math.sin(stars[i].angle + timestamp * starSpeed / 1000) * stars[i].distance;

    const o = stars[i].opacity;
    ctx.fillStyle = `rgba(225, 225, 225, ${(Math.sin(stars[i].opacity * timestamp / 500) + 1) / 2})`;
    ctx.fillRect(x, y, 1, 1);
  }

  window.requestAnimationFrame(step);
};

init();

window.requestAnimationFrame(step);
resizeFunctions.push(calcDimensions);

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

var portfolioText = 'I am a recent Computer Science graduate of Carleton University. Playing guitar, programming and watching hockey are how I typically spend my time. You can find some of my projects and contact info below. Feel free to try out this terminal as well. Thanks for stopping by!';

var siteText = [
  "> <span class=\"command\">cd</span> scott-andrechek",
  "> <span class=\"command\">tail</span> portfolio.txt",
  "<span class=\"text portfolio\">" + portfolioText + "</span>",
  "> <span class=\"command\">ls</span>",
  "<span class=\"command\">Directory: root:\\scott-andrechek</span>",
  "Name                    Description",
  "----                    -----------",
];

var link = function(title, url, description) {
  return {
    'title': title,
    'url': url,
    'desc': description,
  };
};

var linksList = [
  link('Just Clock In', 'https://github.com/abejfehr/justclock.in', 'A comprehensive time clock management solution'),
  link('Focus', 'https://github.com/BranchofLight/Focus', 'AI vs AI implementation of the classic board game'),
  link('Steam Chat Auto Scroll', 'https://chrome.google.com/webstore/detail/steam-chat-auto-scroll/bcijdddmmglcfbbekdkepcainmnnomfl?hl=en-GB', 'Fixes Steam\'s web chat scrolling issue'),
  link('Chunk', 'https://github.com/BranchofLight/Chunk', 'A dynamic variable type for C++'),
  link('Profanity Logger', 'https://github.com/BranchofLight/Profanity-Logger', 'Captures colourful language; not passwords'),
  link('More projects', 'https://github.com/BranchofLight/', 'My GitHub'),
  link('Email address', 'mailto:scottandrechek@gmail.com', 'Contact me'),
  link('portfolio.txt', '', '\'tail\' this to see my description again; try tailing other things!'),
];

var addLinksToSiteText = function() {
  for (let i = 0; i < linksList.length; i++) {
    var l = "";
    if (linksList[i].url.length > 0) {
      l = '<a href="' + linksList[i].url + '" target="_blank"';
    } else {
      l = '<span';
    }

    l += ' class="link">'
    var padTo = 24;
    l += linksList[i].title + ((linksList[i].url.length > 0) ? '</a>' : '</span>') + getPad(24 - linksList[i].title.length) + linksList[i].desc;
    siteText.push(l);
  }
}();

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
// cssClass is optional, adds to text class
var addTextToConsole = function(text, cssClass) {
  return (new Promise(function(resolve, reject) {
    var p = document.createElement('p');
    if (cssClass) { p.classList.add(cssClass); }
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
    scrollToBtm();
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

  scrollToBtm();
}

var scrollToBtm = function() {
  document.querySelector('.console').scrollTop = document.querySelector('.console').scrollHeight;
};

writeSiteText(0, function() {
  var inputDiv;
  var symbolSpan;
  var usrCode = document.createElement('span');
  var commandSpan;
  var optionsSpan;

  var maxInputRatio = 0.8;

  usrCode.classList.add('user-code');
  usrCode.setAttribute('contenteditable', true);
  usrCode.innerText = "";

  var createSpans = function() {
    inputDiv = document.createElement('div');
    symbolSpan = document.createElement('span');
    commandSpan = document.createElement('span');
    optionsSpan = document.createElement('span');

    symbolSpan.classList.add('text');
    symbolSpan.innerHTML = ">&nbsp";

    commandSpan.classList.add('value-span');
    commandSpan.classList.add('text');
    // commandSpan.setAttribute('contenteditable', true);
    commandSpan.setAttribute('spellcheck', false);
    commandSpan.disabled = true;
    commandSpan.innerText = "";

    optionsSpan.classList.add('value-span');
    optionsSpan.classList.add('text');
    // optionsSpan.setAttribute('contentEditable', true);
    optionsSpan.setAttribute('spellcheck', false);
    optionsSpan.disabled = true;
    optionsSpan.innerText = "";

    inputDiv.appendChild(symbolSpan);
    inputDiv.appendChild(commandSpan);
    inputDiv.appendChild(optionsSpan);

    attachClickListener();
  };

  var attachClickListener = function() {
    inputDiv.addEventListener('click', function(e) {
      e.preventDefault();
      placeCaretAtEnd(usrCode);
    });
  };

  createSpans();

  var spanToDraw = commandSpan;

  var invalidKeys = [
    'ArrowRight', 'ArrowLeft', 'Delete',
  ];

  usrCode.addEventListener('keydown', function(e) {
    if (invalidKeys.indexOf(e.key) > -1) {
      e.preventDefault();
    } else if (e.key === 'Enter') {
      e.preventDefault();

      if (commandSpan.innerText.length > 0) {
        ga('send', {
          hitType: 'event',
          eventCategory: 'Command',
          eventAction: 'EnterKey',
          eventLabel: commandSpan.innerText,
        });
      }

      if ((validCommands.indexOf(usrCode.innerText) > -1 || disabledCommands.indexOf(usrCode.innerText) > -1) && optionsSpan.innerText.length === 0) {
        commandSpan.classList.add('command');
      }
      invokeCommand();
      positionInput();
    } else if (symbolSpan.offsetWidth + commandSpan.offsetWidth + optionsSpan.offsetWidth >= document.querySelector('.console').offsetWidth*maxInputRatio && e.key !== 'Backspace') {
      e.preventDefault();
    } else if (spanToDraw === optionsSpan && optionsSpan.innerText.length === 0 && e.key === 'Backspace') {
      spanToDraw = commandSpan;
      commandSpan.classList.remove('command');
    } else if (e.key === ' ' && (validCommands.indexOf(usrCode.innerText) > -1 || disabledCommands.indexOf(usrCode.innerText) > -1) && spanToDraw === commandSpan) {
      commandSpan.classList.add('command');

      // Change visible span to write to
      spanToDraw = optionsSpan;
    }
  });

  var commandsObj = function(name, paramater, description) {
    return {
      'name': name,
      'param': paramater,
      'desc': description,
    };
  };

  var commandsTxt = [
    commandsObj('tail', 'My link titles, text files', 'Prints out text files and navigates to my links. Alias for \'cat\'.'),
    commandsObj('cat', 'My link titles, text files', 'Prints out text files and navigates to my links. Alias for \'tail\'.'),
    commandsObj('cd', 'Directories', 'Navigates to directories. No other directories exist at this time.'),
    commandsObj('ls', 'Optional: -h', 'Prints out current directory\'s files. -h shows hidden files.'),
    commandsObj('wget', 'External URLs', 'Navigates to specified link in a new tab.'),
    commandsObj('git', 'None', 'Navigates to my GitHub.'),
    commandsObj('man', 'Commands', 'Prints out description of specified command.'),
    commandsObj('exit', 'None', 'Closes this terminal.'),
  ];

  var validCommands = function() {
    var arr = [];
    for (let i = 0; i < commandsTxt.length; i++) {
      arr.push(commandsTxt[i].name);
    }

    return arr;
  }();

  // These commands are valid, but throw an error
  var disabledCommands = [
    'rm', 'mkdir', 'ssh', 'mount', 'unmount', 'sudo'
  ];

  var invokeCommand = function() {
    var input = usrCode.innerText;
    var command = input.split(' ')[0];
    var options = input.substring(input.indexOf(command) + command.length + 1);

    var newLine = function() {
      var c = document.querySelector('.console');
      c.appendChild(document.createElement('br'));
      createSpans();

      c.appendChild(inputDiv);

      scrollToBtm();

      spanToDraw = commandSpan;

      usrCode.innerText = "";

      positionInput();
    };

    if (validCommands.indexOf(command) > -1) {
      if (command === 'tail' || command === 'cat') {
        if (options === 'commands.txt') {
          // Calculations for padding
          var longestName = 0;
          var longestParam = 0;
          for (let i = 0; i < commandsTxt.length; i++) {
            if (commandsTxt[i].name.length > longestName) {
              longestName = commandsTxt[i].name.length;
            }
            if (commandsTxt[i].param.length > longestParam) {
              longestParam = commandsTxt[i].param.length;
            }
          }
          var writeCommandsTxt = function(index, callback) {
            if (index < commandsTxt.length) {
              var n = '<span class="command">' + commandsTxt[index].name + '</span>';
              var p = getPad(longestName+1-commandsTxt[index].name.length) + '<span class="link">' + commandsTxt[index].param + '</span>';
              var d = getPad(longestParam+1-commandsTxt[index].param.length) + '<span class="text">' + commandsTxt[index].desc + '</span>';
              addTextToConsole(n + p + d)
              .then(function() {
                scrollToBtm();
                setTimeout(function() {
                  writeCommandsTxt(index+1, callback);
                }, lineDelay);
              });
            } else {
              callback();
            }
          }

          writeCommandsTxt(0, newLine);
        } else if (options === 'portfolio.txt') {
          addTextToConsole('<span class=\"text portfolio\">' + portfolioText + '</span>');
          newLine();
        } else {
          var url = "";
          for (let i = 0; i < linksList.length; i++) {
            if (linksList[i].title.toLowerCase() === options.toLowerCase()) {
              url = linksList[i].url;
            }
          }

          // Handle email separately
          if (url.length > 0 && url.indexOf('mailto:') < 0) {
            newLine();
            document.querySelector('a[href="' + url + '"]').click();
          } else if (url.indexOf('mailto:') > -1) {
            addTextToConsole(url.substring('mailto:'.length));
            newLine();
          } else {
            addTextToConsole('Cannot \'' + command + '\' \'' + options + '\'', 'error');
            newLine();
          }
        }
      } else if (command === 'git') {
        newLine();
        document.querySelector('a[href="https://github.com/BranchofLight/"]').click();
      } else if (command === 'ls') {
        if (options === '-h') {
          var output = [
            "<span class=\"command\">Directory: root:\\scott-andrechek</span>",
            "Name                    Description",
            "----                    -----------",
            "<span class=\"link\">commands.txt</span>" + getPad(24-"commands.txt".length) + "A hidden list of all commands",
          ];
          for (let i = 0; i < output.length; i++) {
            addTextToConsole(output[i]);
          }
          newLine();
        } else {
          caret.style.visibility = 'hidden';
          writeSiteText(4, newLine);
        }
      } else if (command === 'cd') {
        addTextToConsole('Cannot find path \'' + options + '\' because it does not exist.', 'error');
        newLine();
      } else if (command === 'wget') {
        if (options.length === 0) {
          addTextToConsole('No URL specified.', 'error');
          newLine();
        } else if (options.substring(0, 7) !== 'http://' && options.substring(0, 8) !== 'https://') {
          addTextToConsole('Please add either \'http://\' or \'https://\' to the beginning of the link');
          newLine();
        } else {
          addTextToConsole('Navigating to \'' + options + '\'');
          var dummy = document.createElement('a');
          dummy.target = '_blank';
          dummy.href = options;
          dummy.click();
          newLine();
        }
      } else if (command === 'man') {
        var isValid = false;
        for (let i = 0; i < commandsTxt.length; i++) {
          if (options === commandsTxt[i].name) {
            isValid = true;
            var n = '<span class="command">' + commandsTxt[i].name + '</span>';
            var p = getPad(2) + '<span class="link">' + commandsTxt[i].param + '</span>';
            var d = getPad(2) + '<span class="text">' + commandsTxt[i].desc + '</span>';
            addTextToConsole(n + p + d);
            break;
          }
        }
        if (!isValid) {
          addTextToConsole('Unknown command \'' + options + '\'', 'error');
        }

        newLine();
      } else if (command === 'exit') {
        var fadeOut = function(el, timeToFade, steps, stepsLeft) {
          if (stepsLeft === undefined) stepsLeft = steps;
          if (el.style.opacity.length === 0) {
            el.style.opacity = 1;
          }
          el.style.opacity = parseFloat(el.style.opacity) - (1/steps);
          if (stepsLeft-1 === 0) {
            el.style.opacity = 0;
            el.remove();
          }
          setTimeout(function() {
            fadeOut(el, timeToFade, steps, stepsLeft-1);
          }, timeToFade / steps);
        };

        fadeOut(document.querySelector('.console'), 2500, 50);
      }
    } else if (disabledCommands.indexOf(command) > -1) {
      addTextToConsole('Sorry, you do not have permission to use \'' + command + '\'.', 'error');

      scrollToBtm();

      newLine();
    } else {
      addTextToConsole('Unknown command \'' + usrCode.innerText + '\'', 'error');
      newLine();
    }
  };

  // Create our custom caret
  var caret = document.createElement('div');
  caret.classList.add('caret');
  caret.classList.add('active-caret');

  usrCode.addEventListener('input', function(e) {
    var visibleLength = commandSpan.innerText.length + optionsSpan.innerText.length;
    if (visibleLength > usrCode.innerText.length) {
      // Remove last character
      spanToDraw.innerText = spanToDraw.innerText.substring(0, spanToDraw.innerText.length-1);
    } else {
      // Add newest character
      spanToDraw.innerText += usrCode.innerText[usrCode.innerText.length-1];
    }

    positionCaretX();

    // Stops the caret animation while typing
    caret.classList.remove('active-caret');
    setTimeout(function() {
      // Starts it again after typing
      caret.classList.add('active-caret');
    }, 250);
  });

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

  document.querySelector('.console').appendChild(inputDiv);
  document.querySelector('.console').appendChild(usrCode);
  document.querySelector('.console').appendChild(caret);

  var positionInput = function() {
    var rect = commandSpan.getBoundingClientRect();

    usrCode.style.top = rect.top + "px";
    usrCode.style.left = rect.left + "px";
    caret.style.top = rect.top + rect.height - 4 + "px";
    positionCaretX();
  };

  var positionCaretX = function() {
    var rect = optionsSpan.getBoundingClientRect();
    caret.style.left = rect.right + "px";
  };

  scrollToBtm();

  resizeFunctions.push(function() {
    while (symbolSpan.offsetWidth + commandSpan.offsetWidth + optionsSpan.offsetWidth >= document.querySelector('.console').offsetWidth*maxInputRatio) {
      usrCode.innerText = usrCode.innerText.substring(0, usrCode.innerText.length-1);
      if (optionsSpan.innerText.length > 0) {
        optionsSpan.innerText = optionsSpan.innerText.substring(0, optionsSpan.innerText.length-1);
      } else {
        commandSpan.innerText = commandSpan.innerText.substring(0, commandSpan.innerText.length-1);
      }
    }
  });

  var caretScrollCheck = function() {
    var c = document.querySelector('.console');
    var scrollMax = c.scrollHeight - c.offsetHeight;
    // parseInt rounds down -- still need the negative padding on scroll max
    // Also makes sure that the last element is indeed an input
    if (parseInt(c.scrollTop) >= scrollMax*0.98 && c.children[c.children.length-1].nodeName === 'DIV') {
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
