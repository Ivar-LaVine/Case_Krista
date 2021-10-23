// Инициализация данных по условию задачи

// Произвольные исходные данные
const firstMatrix = [
    [100, 100, 100, 200, 200, 200, 200, 400, 400],
    [43, 43, 44, 43, 22, 22, 11, 10, 23],
    [123, 432, 223, 44, 11234, 24, 1123, 4557, 2104],
    [1, 2, 3, 4, 5, 6, 7, 8, 9],
    [5, 5, 4, 4, 3, 3, 2, 5, 5]
]

// Количество строк
const rowCount = 10;

// Количество столбцов
const columnCount = 5;

// Алфавит (для заголовочных ячеек столбцов)
const alphabets = "ABCDE";

// Значение колонок выпадающего списка
const options = ["-----", "Критерий", "Сумма", "Макс.", "Мин.", "Конкат"]; 


// Конструктор для формирования таблицы с исходными данными с кнопками
function constructor() {
    createInputTable();
    createMeasureButtons();
}

// Создание таблицы с исходными данными
function createInputTable() {
    for (let i = 0; i < columnCount; i++) {
        const column = document.createElement("div");
        for (let j = 0; j < rowCount; j++) {
            const row = document.createElement("div");
            const element = document.createElement("input");
            if (j === 0) {
                // Устанавливаем заголовки таблиц по буквам из алфавита и запрещаем их редактировать (для верхней строки)
                element.readOnly = true;
                element.value = alphabets[i];
                element.style.textAlign = "center";
            } else {
                // Присваиваем ячейкам с данными произвольные значения
                // И именуем класс как "number", чтобы впоследствии 
                // Получить данные по имени класса
                element.value = firstMatrix[i][j - 1];
                element.className = "number";
            }
            row.append(element);
            column.append(row);
        }
        // Вкладываем таблицу в заранее подготовленный тэг в файле HTML
        // Для отображения на странице
        document.getElementById("input-table").append(column);
    }
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

// Отображение кнопок выпадающего списка вместе с кнопкой "Сгруппировать" 
function createMeasureButtons() {
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
        document.getElementById("measure-buttons").append(column);
    }
    // Создание кнопки "Сгруппировать"
    const button = document.createElement("button");
    button.textContent = "Сгруппировать";
    button.style.width = "150px";
    button.style.height = "40px";
    // Привязка события на клик по кнопке
    button.addEventListener("click", buttonClick);
    document.getElementById("group-button").append(button);
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
    for (let i = 0; i < columnCount; i++) {
        const matrixColumn = [];
        for (let j = 0; j < rowCount - 1; j++) {
            matrixColumn.push(numbers[j + i * (rowCount - 1)].value);
        }
        matrix.push(matrixColumn);
    }
    return matrix;
}

// Клик по кнопке "Сгруппировать"
function buttonClick() {
    // Здесь происходит последовательный вызов необходимых для работы программы функций
    // Получение записанных данных в исходной таблице в виде двумерного массива (матрицы)
    const matrix = getInputData();
    // Получение выбранных значений выпадающих списков
    let selectedMeasureArray = getSelectedMeasure();
    // Сортировка по индексам выбранных значений выпадающих списков
    let sortedArray = sortWithIndeces(getSelectedMeasure());
    // Получение матрицы с результатами обработки
    let resultMatrix = inputDataProcessing(matrix, selectedMeasureArray, sortedArray);
    // Очистка HTML тега с результирующей таблицей
    clearOutputTable();
    if (resultMatrix) {
        // Если результат обработки положительный 
        // Создание "шапки" с буквами результирующей таблицы
        createHeaderOutputTable(selectedMeasureArray);
        // Создание результирующей таблицы
        createOutputTable(resultMatrix, selectedMeasureArray);
    } else {
        // Если результат обработки отрицательный 
        // Вывод пользователю сообщения
        alert("Выберите значения для группировки данных");
    }
}

// Обработка данных
function inputDataProcessing(matrix, selectedMeasureArray, sortedArray) {
    // Инициализация необходимых переменных
    let buf = []; // Переменная для хранения предыдущей строки матрицы
    let temp = []; // Переменная для обработанных данных
    let outputMatrix = []; // Переменная для записи результата строк
    // Заполнение переменных первой(нулевой) строкой
    for (let k = 0; k < columnCount; k++) { 
        temp[k] = matrix[k][0];
        buf[k] = matrix[k][0];
    }
    // Обработка матрицы 
    // Начинается с 1 поскольку в переменной buf находится значение нулевой строки
    for (let i = 1; i < rowCount - 1; i++) {
        // Инициализация флага для работы с суммой, конкатенацией и записью 
        // Обработанных даннных в результирующую матрицу
        let flag = true;
        for (let j = 0; j < columnCount; j++) {
            // Получаем индекс значения в сортированном массиве
            let index = sortedArray.sortIndices[j];
            switch (selectedMeasureArray[index]) {
                // 1 - "Критерий"
                case 1:
                    // В тот момент, когда текущее значение ячейки не равно 
                    // Предыдущему по значению "Критерий", происходит
                    // Запись обработанных данных в результирующую матрицу
                    if (matrix[index][i] != buf[index] && flag) { 
                        outputMatrix.push(temp.concat());
                        flag = false;
                        // Заполнение переменной для обработанных данных
                        // Текущими данными (для корректной работы значений меры)
                        for (let k = 0; k < columnCount; k++) temp[k] = matrix[k][i];
                    } else temp[index] = matrix[index][i];
                    break;
                // 2 - "Сумма"
                case 2:
                    if (flag) temp[index] = parseInt(temp[index]) + parseInt(matrix[index][i]);
                    break;
                // 3 - "Максимум"
                case 3:
                    if (parseInt(matrix[index][i]) > parseInt(temp[index])) temp[index] = matrix[index][i];
                    break;
                // 4 - "Минимум"
                case 4:
                    if (parseInt(matrix[index][i]) < parseInt(temp[index])) temp[index] = matrix[index][i];
                    break;
                // 5 - "Конкатенация"
                case 5:
                    if (flag) temp[index] += matrix[index][i].toString();
                    break;
            }
            // Переприсваивание буферной переменной
            buf[index] = matrix[index][i];
        }
    }
    // Инициализация счетчика
    let cnt = 0;
    for (let i = 0; i < selectedMeasureArray.length; i++) {
        // Подсчет выбранных значений, если они равны "-----" инкремент счетчика
        if (selectedMeasureArray[i] === 0) cnt++;
    }
    // Если все значения выпадающих списков равны "-----"
    // Таблицу выводить не нужно 
    if (cnt != selectedMeasureArray.length) {
        // Так как в переменной обработанных данных все еще хранится значение
        // И его необходимо получить. Делаем заглушку
        outputMatrix.push(temp.concat());
        // Выводим положительный результат в виде матрицы
        return outputMatrix;
    }
    // Следовательно вывод отрицательного результата
    return false;
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
constructor();