function setupAutoComplete( // eslint-disable-line no-unused-vars
        input, getAutocompleteOptions) {
    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
    var _currentFocus = -1;
    var _input = input;
    var _getAutocompleteOptions = getAutocompleteOptions;

    $(input)
        .parent()
        .toggleClass('autocomplete', true);

    /*execute a function when someone writes in the text field:*/
    input.addEventListener('input', function () {
        var val = this.value;
        if (!val) 
            return false;
        
        _getAutocompleteOptions(val, updateAutocompleteList); //do search
        return true;
    });

    /*execute a function presses a key on the keyboard:*/
    input.addEventListener('keydown', function (e) {
        var listDiv = document.getElementById(this.id + '-autocomplete-list');
        if (listDiv) //RD: why?
            listDiv = listDiv.getElementsByTagName('div');
        var down = 40,
            up = 38,
            enter = 13,
            tab = 9;
        switch (e.keyCode) {
            case down:
                _currentFocus++;
                addActive(listDiv);
                break;
            case up:
                _currentFocus--;
                addActive(listDiv);
                break;
            case enter:
            case tab:
                if (listDiv) {
                    // when list is active, prevent the form from being submitted
                    e.preventDefault();
                    if (_currentFocus > -1) {
                        // and simulate a click on the active item:
                        listDiv[_currentFocus].click();
                    } else if (listDiv.length == 1) {
                        // and simulate a click on the only item:
                        listDiv[0].click();
                    }
                }
                break;
        }
    });

    function updateAutocompleteList(completions) {

        if (!completions || completions.length < 0) 
            return false;
        
        /*create a DIV element that will contain the items (values):*/
        var listDiv = document.createElement('DIV');
        listDiv.setAttribute('id', _input.id + '-autocomplete-list');
        listDiv.setAttribute('class', 'autocomplete-items');

        /*for each item in the array...*/
        for (var i = 0; i < completions.length; i++) {
            /*create a DIV element for each matching element:*/
            var itemDiv = document.createElement('DIV');
            itemDiv.innerHTML = completions[i];
            /*execute a function when someone clicks on the item value (DIV element):*/
            itemDiv.addEventListener('click', function () {
                /*insert the value for the autocomplete text field:*/
                _input.value = this.innerHTML;
                /*close the list of autocompleted values or any other open lists of autocompleted values:*/
                closeAllLists();
            });
            listDiv.appendChild(itemDiv);
        }

        closeAllLists();
        _currentFocus = -1;
        /*append the DIV element as a child of the autocomplete container:*/
        _input
            .parentNode
            .appendChild(listDiv);
    }

    function addActive(listDiv) {
        /*a function to classify an item as "active":*/
        if (!listDiv) 
            return false;
        
        /*start by removing the "active" class on all items:*/
        removeActive(listDiv);
        if (_currentFocus >= listDiv.length) 
            _currentFocus = 0;
        if (_currentFocus < 0) 
            _currentFocus = (listDiv.length - 1);
        
        /*add class "autocomplete-active":*/
        listDiv[_currentFocus]
            .classList
            .add('autocomplete-active');
        listDiv[_currentFocus].scrollIntoViewIfNeeded();
    }

    function removeActive(listDiv) {
        /*a function to remove the "active" class from all autocomplete items:*/
        for (var i = 0; i < listDiv.length; i++) {
            listDiv[i]
                .classList
                .remove('autocomplete-active');
        }
    }

    function closeAllLists(excludeElement) {
        /*close all autocomplete lists in the document,
        except the one passed as an argument:*/
        var items = document.getElementsByClassName('autocomplete-items');
        for (var i = items.length - 1; i >= 0; i--) {
            if (excludeElement != items[i] && excludeElement != _input) {
                items[i]
                    .parentNode
                    .removeChild(items[i]);
            }
        }
    }

    /*execute a function when someone clicks in the document:*/
    document
        .addEventListener('click', function (e) {
            closeAllLists(e.target);
        });

}