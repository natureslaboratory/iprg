// Helper functions

const getMaxWordCount = (element) => {
    let classList = element.classList;
    for (let index = 0; index < classList.length; index++) {
        if (classList[index].includes("cw-")) {
            return parseInt(classList[index].split("-")[1]);
        }
    }

    return 500;
}

const convertStringToArray = (str) => {
    return str.split(" ");
}

const sanitiseArray = (strArray) => {
    return strArray.filter(d => d != "");
}

const getCleanStringArray = (str) => {
    const strArray = convertStringToArray(str);
    return sanitiseArray(strArray);
}

const isStringWithinWordCount = (str, maxCount) => {
    const cleanStrArray = getCleanStringArray(str);
    let count = cleanStrArray.length;
    return count <= maxCount;
}

const getCountElement = (counterWrapper) => {
    const children = counterWrapper.children;
    for (let index = 0; index < children.length; index++) {
        const child = children[index];
        if (child.classList.contains("count")) {
            return child;
        }
    }
}

const trimStringToMaxCount = (str, maxCount) => {
    const cleanStrArray = getCleanStringArray(strArray);
    const trimmedStrArray = cleanStrArray.slice(0, maxCount);
    const newStr = trimmedStrArray.join(" ");
    return newStr;
}

const createCounter = (maxCount) => {
    let counterWrapper = document.createElement("p");
    counterWrapper.innerHTML = `Word Count: <span class="count">0</span>/<span>${maxCount}</span>`;
    return counterWrapper
}

const insertCounter = (wordsCounted, counterWrapper) => {
    wordsCounted.parentNode.insertBefore(counterWrapper, wordsCounted.nextSibling);
}

// End of helper functions


const updateWordCount = (e, counterWrapper) => {
    let count = 0;
    let maxCount = getMaxWordCount(e.target);

    if (isStringWithinWordCount(e.target.value, maxCount)) {
        count = getCleanStringArray(e.target.value).length;
    } else {
        e.target.value = trimStringToMaxCount(e.target.value, maxCount);
        count = maxCount;
    }

    let countElement = getCountElement(counterWrapper);
    countElement.innerHTML = count;
}

export const implementWordCount = () => {
    let wordCountElements = document.getElementsByClassName("countWords");
    
    for (let index = 0; index < wordCountElements.length; index++) {
        const wordsCounted = wordCountElements[index];
        if (wordsCounted.tagName != "TEXTAREA") {
            continue;
        }

        let maxCount = getMaxWordCount(wordsCounted);
        let counterWrapper = createCounter(maxCount);
        insertCounter(wordsCounted, counterWrapper);
        
        wordsCounted.addEventListener('input', (e) => updateWordCount(e, counterWrapper));
    }
}