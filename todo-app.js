(function() {

  let listArray = [], //создаем пустой массив, где будут храниться задачи в виде объектов
      listName = 'list'; //создаем название списка дел по умолчанию


  //Создаем и возвращаем заголовок приложения
  function createAppTitle(title) {
    let appTitle = document.createElement('h2');
    appTitle.textContent = title;
    return appTitle;
  }

  //Создаем и возвращаем форму для создания списка дел + стилизация
  function createTodoItemForm() {
    let form = document.createElement('form');
    let input = document.createElement('input');
    let buttonWrapper = document.createElement('div');
    let button = document.createElement('button');


    // стилизация элементов на странице:
    form.classList.add('input-group', 'mb-3');
    input.classList.add('form-control');
    input.placeholder = 'Введите название нового дела';
    buttonWrapper.classList.add('input-group-append');
    button.classList.add('btn', 'btn-primary');
    button.setAttribute('disabled', '');
    button.textContent = 'Добавить дело';

    // делаем кнопку активной при вводе символов в инпут, за исключением пробелов, с помощью "trim()"
    input.addEventListener('input', function() {
      if (input.value.trim().length) {
        button.disabled = false;
      }
    });

    // добавляем элемены в форму
    buttonWrapper.append(button);
    form.append(input);
    form.append(buttonWrapper);

    // возращяем объект - но это не DOM элемент!!
    return {
      form,
      input,
      button,
    };
  }

  //Создаем и возвращаем список дел
  function createTodoList() {
    let list = document.createElement('ul');
    list.classList.add('list-group');
    return list;
  }


  // создание задачи:
  function createTodoItem(obj) {
    let item = document.createElement('li');

    //кнопки помещаем в элемент, который красиво покажет их в одной группе
    let buttonGroup = document.createElement('div');
    let doneButton = document.createElement('button');
    let deleteButton = document.createElement('button');

    //устанавливаем стили для элемента списка, а также для размещения кнопок
    //в его правой части с помощью flex
    item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
    item.textContent = obj.name;

    if (obj.done) item.classList.add('list-group-item-success');   // короткая запись if, устанавливаем done как false при создании задачи

    // стилизация кнопок
    buttonGroup.classList.add('btn-group', 'btn-group-sm');
    doneButton.classList.add('btn', 'btn-success');
    doneButton.textContent = 'Готово';
    deleteButton.classList.add('btn', 'btn-danger');
    deleteButton.textContent = 'Удалить';

    // добавляем обработчик на кнопку - изменение статуса
    doneButton.addEventListener('click', function() {
      obj.done = !obj.done;
      item.classList.toggle('list-group-item-success');

      saveList(listArray, listName); // сохраняем список дел
      console.log (listArray);
    });

    // добавляем обработчик на кнопку - удаление задачи
    deleteButton.addEventListener('click', function() {
      if (confirm('Вы уверены')) {
        for (let i = 0; i < listArray.length; i++) {
          if (listArray[i].id == obj.id) {
            listArray.splice(i,1);
          }
        }
        item.remove(); // удаление задачи

        saveList(listArray, listName); // сохраняем список дел
        console.log(listArray);
      }
    });

    // вкладываем кнопки в отдельный элемент, что бы они объеденились в один блок
    buttonGroup.append(doneButton);
    buttonGroup.append(deleteButton);
    item.append(buttonGroup);

    // приложению нужен доступ к самому элементу и кнопкам, чтобы обрабаттывать события нажатия
    return {
      item,
      doneButton,
      deleteButton
    };
  }

  // функция присвоения ID задаче
  function getNewID(arr) {
    let max = 0;
    for (const item of arr) {
      if (item.id > max) {
        max = item.id;
      }
    }
    return max + 1;
  }

  // функция создания приложения
  function createTodoApp(container, title = 'Список дел', mylistName) {

    let todoAppTitle = createAppTitle(title);
    let todoItemForm = createTodoItemForm();
    let todoList = createTodoList();
    // let todoItems = [createTodoItem('Сходить за хлебом'), createTodoItem('Купить молоко')];

    container.append(todoAppTitle);
    container.append(todoItemForm.form);
    container.append(todoList);
    // todoList.append(todoItems[0].item);
    // todoList.append(todoItems[1].item);

    listName = mylistName; // присвоение списку дел имени листа (мамы, папы, мое)

    let listData = localStorage.getItem(listName);

    // отображаем список дел из памяти
    if (listData!=='' && listData!==null) {
      listArray = JSON.parse(listData);
    }

    for (const element of listArray) {
      let todoItem = createTodoItem(element);
      todoList.append(todoItem.item);
    }




    // браузер создает событие submit на форме по нажатию на Enter или на кнопку создания дела
    todoItemForm.form.addEventListener('submit', function (e) {
      // эта строчка отменяет стандартное действие браузера при отправке формы - перезагрузку страницы
      e.preventDefault();

      // игнорируем создание элемента, если пользователь ничего не ввел в поле
      if (!todoItemForm.input.value) {
        return;
      }

      // переменная содержащая объект с задачей.
      let newObj = {
        id: getNewID(listArray),
        name: todoItemForm.input.value,
        done: false
      };

      let todoItem = createTodoItem(newObj);

      listArray.push(newObj); // добавляем задачу в массив с задачами

      // добавляем на страницу новую задачу
      todoList.append(todoItem.item);

      // обнуляем значение в поле, чтобы не пришлось стирать его вручную
      todoItemForm.input.value = '';
      todoItemForm.button.disabled = true; // делаем кнопку снова не активной

      saveList(listArray, listName); // сохраянем список дел
      console.log (listArray);
    });
  }

  // функция сохранения списка дел
  function saveList(arr, key) {
    localStorage.setItem(key, JSON.stringify(arr));
  }


  window.createTodoApp = createTodoApp; // создаем глобальный объект

})();


