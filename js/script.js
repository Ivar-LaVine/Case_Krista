// Инициализация данных по условию задачи

// Произвольные исходные данные
const firstMatrix = [
    [100, 43, 123, 1, 5],
    [100, 43, 432, 2, 5],
    [100, 44, 223, 3, 4],
    [200, 43, 44, 4, 4],
    [200, 22, 11234, 5, 3],
    [200, 22, 24, 6, 3],
    [200, 11, 1123, 7, 2],
    [400, 10, 4557, 8, 5],
    [400, 23, 2104, 9, 5]
]

// Количество строк
const rowCount = 10;

// Количество столбцов
const columnCount = 5;

// Алфавит (для заголовочных ячеек столбцов)
const alphabets = "ABCDE";

// Значение колонок выпадающего списка
const options = ["-----", "Критерий", "Сумма", "Макс.", "Мин.", "Конкат"]; 

// Функция создания основной секции с контентом
function createMainSection() {
    const section = document.createElement("section");
    section.id = "main-section";
    const pInput = document.createElement("p");
    pInput.textContent = "Исходные данные";
    section.append(pInput);
    createInputTable(section);
    createMeasureButtons(section);
    createGroupButton(section);
    const pOutput = document.createElement("p");
    pOutput.textContent = "Результат";
    const outputTable = document.createElement("div");
    outputTable.id = "output-table";
    section.append(pOutput, outputTable);
    document.body.prepend(section);
}
// Создание таблицы с исходными данными
function createInputTable(section) {
    const inputTable = document.createElement("div");
    inputTable.id = "input-table";
    for (let i = 0; i < rowCount; i++) {
        const row = document.createElement("div");
        for (let j = 0; j < columnCount; j++) {
            const element = document.createElement("input");
            if (i === 0) {
                // Устанавливаем заголовки таблиц по буквам из алфавита и запрещаем их редактировать (для верхней строки)
                element.readOnly = true;
                element.value = alphabets[j];
                element.style.textAlign = "center";
            } else {
                // Присваиваем ячейкам с данными произвольные значения
                // И именуем класс как "number", чтобы впоследствии 
                // Получить данные по имени класса
                element.value = firstMatrix[i - 1][j];
                element.className = "number";
            }
            row.append(element);
        }
        // Вкладываем таблицу в заранее подготовленный тэг в файле HTML
        // Для отображения на странице
        inputTable.append(row);
    }
    section.append(inputTable);
}

// Создание выпадающего списка и заполнение его значениями из переменной options
function createSelectList() {
    const select = document.createElement("select");
    for (let i = 0; i < options.length; i++) {
        const option = document.createElement("option");
        option.textContent = options[i];
        select.append(option);
    }
    return select;
}

// Создание кнопки "Сгруппировать"
function createGroupButton(section) {
    
    const buttonDiv = document.createElement("div");
    buttonDiv.style.justifyContent = "right";
    buttonDiv.id = "group-button";
    const button = document.createElement("button");
    button.textContent = "Сгруппировать";
    button.style.width = "150px";
    button.style.height = "40px";
    // Привязка события на клик по кнопке
    button.addEventListener("click", buttonClick);
    buttonDiv.append(button);
    section.append(buttonDiv);
}

// Отображение кнопок выпадающего списка вместе с кнопкой "Сгруппировать" 
function createMeasureButtons(section) {
    const measureButtons = document.createElement("div");
    measureButtons.style.justifyContent = "space-around";
    measureButtons.id = "measure-buttons";
    // Количество селектов = количество столбцов исходной таблицы
    for (let i = 0; i < columnCount; i++) {
        const tableHeader = document.createElement("p");
        const column = document.createElement("div");
        // Буква заголовка столбца с двоеточием
        tableHeader.textContent = `${alphabets[i]}:`;
        column.append(tableHeader);
        column.append(createSelectList());
        column.style.width = "140px";
        column.style.display = "flex";
        column.style.justifyContent = "space-around";
        measureButtons.append(column);
    }
    
    section.append(measureButtons);
}

// Получение массива выбранных пользователем значений во всех кнопках с выпадающим списком
function getSelectedMeasure() {
    const select = document.getElementsByTagName("select");
    let selectArray = [];
    for (let i = 0; i < columnCount; i++) {
        selectArray.push(select[i].options.selectedIndex);
    }
    return selectArray;
}


// https://stackoverflow.com/questions/3730510/javascript-sort-array-and-return-an-array-of-indices-that-indicates-the-positio
// Функция сортировки с запоминанием индекса поочередности значения выпадающего списка
// Для корректной работы необходимо чтобы "Критерий" проверялся первым
function sortWithIndeces(toSort) {
    for (let i = 0; i < toSort.length; i++) {
      toSort[i] = [toSort[i], i];
    }
    toSort.sort(function(left, right) {
      return left[0] < right[0] ? -1 : 1;
    });
    toSort.sortIndices = [];
    for (let j = 0; j < toSort.length; j++) {
      toSort.sortIndices.push(toSort[j][1]);
      toSort[j] = toSort[j][0];
    }
    return toSort;
}

// Получение данных из таблицы
function getInputData() {
    const numbers = document.getElementsByClassName("number");
    const matrix = [];
    for (let i = 0; i < rowCount - 1; i++) {
        const matrixColumn = [];
        for (let j = 0; j < columnCount; j++) {
            matrixColumn.push(numbers[j + i * (columnCount)].value);
        }
        matrix.push(matrixColumn);
    }
    return matrix;
}

// Функция для проверки выбранных выпадающих списков, возвращает false если не выбрано не одного значения
function checkSelectedMeasure(selectedMeasureArray) {
    let cnt = 0;
    selectedMeasureArray.forEach(item => {
        if (item === 0) cnt++;
    });
    if (cnt === columnCount) return false;
    return true;
}

// Клик по кнопке "Сгруппировать"
function buttonClick() {
    // Здесь происходит последовательный вызов необходимых для работы программы функций
    // Получение записанных данных в исходной таблице в виде двумерного массива (матрицы)
    const matrix = getInputData();
    // Получение выбранных значений выпадающих списков
    let selectedMeasureArray = getSelectedMeasure();
    // Проверка типов данных
    checkMatrixValidation(matrix, selectedMeasureArray)
    // Сортировка по индексам выбранных значений выпадающих списков
    let sortedArray = sortWithIndeces(getSelectedMeasure());
    // Получение матрицы с результатами обработки
    let resultMatrix = inputDataProcessing(matrix, selectedMeasureArray, sortedArray);
    // Очистка HTML тега с результирующей таблицей
    clearOutputTable();
    // Проверка выбранных значений
    if (checkSelectedMeasure(selectedMeasureArray)) {
        // Создание "шапки" с буквами результирующей таблицы
        createHeaderOutputTable(selectedMeasureArray);
        // Создание результирующей таблицы
        createOutputTable(resultMatrix, selectedMeasureArray);
    } else {
        alert("Выберите значение группировки");
    }
}

// Обработка данных
function inputDataProcessing(matrix, selectedMeasureArray, sortedArray) {
    let result = []; // Переменная для записи результата строк
    while (matrix.length > 0) {
        // Строка - буфер с результатом вычислений
        let buf = matrix[0];
        // Флаг для критерия
        let flag;
        // Начинаем счет с 1, поскольку нулевая строка лежит в буфере
        let i = 1;
        while (i < matrix.length) {
            // В начале обработки значения флага true
            flag = true;
            for (let j = 0; j < columnCount; j++) {
                // Получаем индекс значения в сортированном массиве
                let index = sortedArray.sortIndices[j];
                switch (selectedMeasureArray[index]) {
                    // 1 - "Критерий"
                    case 1: if (matrix[i][index] != buf[index]) flag &= false; break;
                    // 2 - "Сумма"
                    case 2: if (flag) buf[index] += matrix[i][index]; break;
                    // 3 - "Максимум"
                    case 3: if (flag && matrix[i][index] > buf[index]) buf[index] = matrix[i][index]; break;
                    // 4 - "Минимум"
                    case 4: if (flag && matrix[i][index] < buf[index]) buf[index] = matrix[i][index]; break;
                    // 5 - "Конкатенация"
                    case 5: if (flag) buf[index] += matrix[i][index].toString(); break;
                }
            }
            // Удаление строки, участвовавшей в группировке
            if (flag) {
                matrix.splice(i, 1);
                i--;
            }
            i++;
        }
        // Удаление строки, которая лежала в буфере
        matrix.splice(0, 1);
        // В результирующий массив добавляем строку с результатом
        result.push(buf);
    }   

    return result;
}

// Проверка типов данных
function checkMatrixValidation(matrix, selectedMeasureArray) {
    // Те элементы матрицы, в результате которые должны интерпретироваться как числа, 
    // Проверяются на то являются ли они числами. И если это не так, становятся равны нулю
    // Возможно я не прав и нужно преобразовывать строковые элементы в числа "a43" => 43; "abc431asdf324asdf1" => "4313241"; "a4a3a" => 43
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            switch (selectedMeasureArray[j]) {
                // 2 - "Сумма"
                // 3 - "Максимум"
                // 4 - "Минимум"
                case 2:
                case 3:
                case 4:
                    if (isNaN(matrix[i][j])) matrix[i][j] = 0;
                    else matrix[i][j] = Number(matrix[i][j]);
                    break;
            }
        }
    }
}

// Удаление результирующей таблицы
// Подсмотрел вот тут
// https://www.geeksforgeeks.org/remove-all-the-child-elements-of-a-dom-node-in-javascript/
function clearOutputTable() {
        let element = document.getElementById("output-table");
        let child = element.lastElementChild; 
        while (child) {
            element.removeChild(child);
            child = element.lastElementChild;
        }
}

// Создание заголовков результирующей таблицы
function createHeaderOutputTable(selectedMeasureArray) {
    const row = document.createElement("div");
    row.className = "row";
    for (let i = 0; i < columnCount; i++) {
        // Исключаем из результирующей таблицы столбцы со значением "-----"
        // 0 - "-----"
        if (selectedMeasureArray[i] > 0) {
            const column = document.createElement("div");
            const element = document.createElement("p");
            // Устанавливаем заголовки таблиц по буквам из алфавита и запрещаем их редактировать (для верхней строки)
            element.textContent = alphabets[i];
            element.style.textAlign = "center";
            column.append(element);
            row.append(column);
        }
    }
    document.getElementById("output-table").append(row);
}

// Создание и заполнение данными результирующей таблицы
function createOutputTable(resultArray, selectedMeasureArray) {
    // Строки
    for (let i = 0; i < resultArray.length; i++) {
        const row = document.createElement("div");
        row.className = "row";
        // Столбцы
        for (let j = 0; j < resultArray[i].length; j++) {
            // Исключаем из результирующей таблицы столбцы со значением "-----"
            // 0 - "-----"
            if (selectedMeasureArray[j] > 0) {
                const column = document.createElement("div");
                const element = document.createElement("p");
                element.textContent = resultArray[i][j];
                column.append(element);
                row.append(column);
            }
        }
        // Добавление в HTML тег
        document.getElementById("output-table").append(row);
    }
}

// Вызов конструктора
createMainSection();