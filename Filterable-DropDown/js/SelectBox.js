'use strict';
const SelectBox = function(element, opts) {

    const el = element;
    const parent = el.parentNode;
    let wrapper;
    let dropdown;
    let filterOptions;
    let inputField;

    function init() {
        // el.outerHTML = '<!-- ' + el.outerHTML + ' -->';
        el.parentNode.removeChild(el);

        wrapper = document.createElement('div');
        wrapper.classList.add('select-wrapper');

        let mainInput = createInput();
        wrapper.append(mainInput);

        let listItems = createOptions();
        wrapper.append(listItems);

        parent.append(wrapper);

        dropdown = wrapper.querySelector('.value-list');
        filterOptions = [...dropdown.querySelectorAll('li')];
        inputField = wrapper.querySelector('.chosen-value');
        addListeners();
    }

    function createInput() {
        const input = document.createElement('input');
        input.classList.add('chosen-value');
        input.name = el.name;
        input.placeholder = opts.message;

        el.classList.forEach(selector => {
            input.classList.add(selector);
        });

        if (el.id) {
            input.id = el.id;
        }

        if (el.dataset) {
            for (let data in el.dataset) {
                input.dataset[data] = el.dataset[data];
            }
        }

        return input;
    }

    function createOptions() {
        const listOptions = document.createElement('ul');
        listOptions.classList.add('value-list');

        const options = el.querySelectorAll('option');
        options.forEach((option) => {
            if (option.value != '') {
                const item = document.createElement('li');
                item.classList.add('value-item');
                item.dataset.value = option.value;
                item.innerText = option.innerText;
                listOptions.append(item);
            }
        });
        return listOptions;
    }

    function addListeners() {
        inputField.addEventListener('input', filter);
        inputField.addEventListener('focus', focus);
        inputField.addEventListener('blur', blur);

        // console.dir(wrapper);
        // wrapper.lastChild.addEventListener('keydown', keyDown, false);

        filterOptions.forEach(option => {
            option.addEventListener('mousedown', selectOption);
        });
    }

    let currentIndex = 0;

    function keyDown(e) {
        e.preventDefault();
        console.log(e);
        if (e.keyCode == 37 || e.keyCode == 38) {
            if (currentIndex <= 0) {
                currentIndex = filterOptions.length - 1 ;
            } else {
                currentIndex--;
            }
        } else if (e.keyCode == 39 || e.keyCode == 40) {
            if (currentIndex >= filterOptions.length - 1) {
                currentIndex = 0;
            } else {
                currentIndex++;
            }
        }

        removeOptionsClass('focused');
        filterOptions[currentIndex].classList.add('focused');

        if( e.keyCode == 13 ){
            inputField.value = filterOptions[currentIndex].textContent;
            inputField.blur();
            dropdown.classList.remove('open');
        }
    }

    function removeOptionsClass(className) {
        filterOptions.forEach(filter => {
            filter.classList.remove(className);
        });
    }

    function selectOption(e) {
        e.preventDefault();
        inputField.value = e.target.innerText;
        inputField.blur();
        dropdown.classList.remove('open');
    }

    function filter(e) {
        e.preventDefault();
        let inputValue = this.value.toLowerCase();
        if (inputValue.length > 0) {
            for (let j = 0; j < filterOptions.length; j++) {
                if (!(inputValue === filterOptions[j].textContent.substring(0, inputValue.length).toLowerCase())) {
                    filterOptions[j].classList.add('closed');
                } else {
                    filterOptions[j].classList.remove('closed');
                }
            }
        } else {
            console.log('no length');
            removeOptionsClass('closed');
        }
    }

    function focus(e) {
        e.preventDefault();
        this.placeholder = 'Type to filter';
        dropdown.classList.add('open');
        removeOptionsClass('closed');
    }

    function blur(e) {
        e.preventDefault();
        this.placeholder = opts.message;
        dropdown.classList.remove('open');
    }

    init();
};
