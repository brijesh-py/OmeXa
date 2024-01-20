import quill from "./quilljs.js";

(function () {
  // Sidebar Selectors
  const sidebarOpen = document.querySelector(".sidebarOpen");
  const sidebarClose = document.querySelector(".sidebarClose");
  const sidebar = document.querySelector(".sidebar");
  const newTask = document.querySelector(".newTask");

  //   Task Output Container
  const taskContainer = document.querySelector(".taskContainer");

  //   New Task Form Input Container
  const newTaskInputContainer = document.querySelector(
    ".newTaskInputContainer"
  );
  const form = document.querySelector("form");
  const formInput = form.querySelector("input");
  const taskContentEditorToggler = document.querySelector(
    ".taskContentEditorToggler"
  );
  const taskContentEditor = document.querySelector(".taskContentEditor");

  //   Vew Task
  const singleTaskOutputContainer = document.querySelector(
    ".singleTaskOutputContainer"
  );
  const taskTitleOutput = document.querySelector(".taskTitle");
  const taskContentOutput = document.querySelector(".taskContent");

  // Open Sidebar
  sidebarOpen.addEventListener("click", () => {
    sidebar.classList.toggle("hidden");
  });

  //   Close Sidebar
  sidebarClose.addEventListener("click", () => {
    sidebar.classList.toggle("hidden");
  });

  //   Task content editor toggler
  taskContentEditorToggler.addEventListener("click", () => {
    taskContentEditor.classList.toggle("hidden");
    let togglerIcon = taskContentEditorToggler.querySelector("i");
    if (togglerIcon.className == "fa-solid fa-circle-down") {
      togglerIcon.className = "fa-solid fa-circle-up";
    } else {
      togglerIcon.className = "fa-solid fa-circle-down";
    }
  });

  newTask.addEventListener("click", () => {
    newTaskInputContainer.className =
      "bottom-[80px] md:bottom-4 absolute newTaskInputContainer";
    singleTaskOutputContainer.className =
      "h-[75vh] my-3 singleTaskOutputContainer hidden";
  });

  const fetchTask = () => {
    // fetch("https://jsonplaceholder.typicode.com/todos")
    //   .then((res) => res.json())
    //   .then((response) => {
    //     for (const task in response) {
    //       createTask(response[task]);
    //     }
    //   });
    taskContainer.innerHTML = null;
    const getTask = storage.getTaskMethod().sort();
    for (let task in getTask) {
      createTask(getTask[task], task);
    }
    changeTitleOrUrl();
    toolsToggler();
    renameTask();
    deleteTask();
  };

  const copyCode = () => {
    let codes = taskContentOutput.querySelectorAll("pre");
    if (codes) {
      codes.forEach((pre) => {
        const btn = pre.querySelector(".copyCode");
        btn.addEventListener("click", () => {
          const code = pre.querySelector("code");
          navigator.clipboard.writeText(code.innerText);
        });
      });
    }
  };

  const loadCodeConfig = () => {
    let codes = taskContentOutput.querySelectorAll("pre");
    if (codes) {
      codes.forEach((code, index) => {
        const holdCode = code.innerHTML;
        const copyContainer = document.createElement("div");
        copyContainer.innerHTML = `<div class='bg-slate-800 hover:bg-slate-900 rounded shadow-xl copyCode px-3 py-2 cursor-pointer absolute right-1 text-white'><i class="fa-solid fa-copy"></i></div>`;
        code.setAttribute(
          "class",
          "p-2 bg-slate-800 relative overflow-scroll shadow-xl rounded"
        );
        code.innerHTML = `<code class='language-javascript'>${holdCode}</code>`;
        code.prepend(copyContainer);
      });
    }
    let prism = document.createElement("script");
    prism.src = "./prism.js";
    document.body.appendChild(prism);
    prism.remove();
    copyCode();
  };

  const changeTitleOrUrl = () => {
    let task = document.querySelectorAll(".taskContainer li.task");
    task.forEach((Element, index) => {
      const title = Element.querySelector("a");
      title.addEventListener("click", () => {
        singleTaskOutputContainer.className =
          "h-[75vh] my-3 singleTaskOutputContainer";
        document.title = title.dataset.title;
        taskTitleOutput.innerHTML = title.dataset.title;
        taskContentOutput.innerHTML = storage.getContent(index);
        newTaskInputContainer.className =
          "bottom-[80px] md:bottom-4 absolute hidden newTaskInputContainer";
        document.querySelector("#loadPrismJs").innerHTML = "";
        loadCodeConfig();
        sidebar.classList.toggle("hidden");
      });
    });
  };

  const toolsToggler = () => {
    const task = document.querySelectorAll(".taskContainer li.task");
    task.forEach((Element, index) => {
      const tool = Element.querySelector(".tool");
      tool.addEventListener("click", () => {
        Element.querySelector(".tools").classList.toggle("hidden");
      });
    });
  };

  const renameTask = () => {
    const task = document.querySelectorAll(".taskContainer li.task");
    task.forEach((Element, index) => {
      const renameTask = Element.querySelector(".tools .renameTask ");
      renameTask.addEventListener("click", () => {
        let taskTitleRename =
          document.querySelectorAll("li.task a")[renameTask.dataset.key];
        if (taskTitleRename.contentEditable == "true") {
          taskTitleRename.contentEditable = "false";
          const holdTask = [];
          holdTask.push(...storage.getTaskMethod());
          holdTask.filter((element, index) => {
            if (index == renameTask.dataset.key) {
              return (element.task = taskTitleRename.textContent);
            }
            return element;
          });
          storage.updateTaskMethod(holdTask);
        } else {
          taskTitleRename.contentEditable = "true";
        }
      });
    });
  };

  const deleteTask = () => {
    const task = document.querySelectorAll(".taskContainer li.task");
    task.forEach((Element, index) => {
      const deleteTask = Element.querySelector(".tools .deleteTask");
      deleteTask.addEventListener("click", () => {
        const holdTask = [...storage.getTaskMethod()];
        const updatedTask = holdTask.filter((element, index) => {
          return index !== parseInt(deleteTask.dataset.key);
        });
        storage.updateTaskMethod(updatedTask);
      });
    });
  };

  let holdUserId = "";
  //   Create Task & Load in Task output Container
  const createTask = (task, key) => {
    const taskElement = document.createElement("li");
    if (holdUserId != task.timeLine) {
      holdUserId = task.timeLine;
      const taskTimeLineElement = document.createElement("li");
      taskTimeLineElement.className = "px-2 text-slate-400 mt-3";
      taskTimeLineElement.innerHTML = `${holdUserId}`;
      taskContainer.appendChild(taskTimeLineElement);
    }
    taskElement.className =
      "border cursor-pointer border-slate-800 hover:border-slate-500 my-2 py-1 rounded text-white hover:bg-slate-800 flex justify-between px-2 task relative";
    taskElement.dataset.key = key;
    taskElement.tools = `<div
        class="absolute p-3 bg-slate-900 shadow border border-slate-700 right-1 w-40 top-9 rounded tools hidden z-40">
        <a data-key='${key}' class="p-2 renameTask rounded hover:bg-slate-800 mb-2 border-slate-800 border flex justify-around items-center" >
            <i class="fa-regular fa-pen-to-square"></i>Rename Task</a>
        <a data-key='${key}' class="p-2 deleteTask rounded hover:bg-orange-700 bg-orange-800 mb-2 border-slate-800 border flex justify-around items-center">
            <i class="fa-solid fa-trash-can"></i>Delete Task</a>
        </div>
    `;
    taskElement.innerHTML = `<a class="me-1 h-5 overflow-hidden w-60" data-title="${task.task}">${task.task}</a>
        <div class="tool">
        <i class="fa-solid fa-ellipsis" title="More"></i>
        </div>
        ${taskElement.tools}
    `;
    taskContainer.appendChild(taskElement);
  };

  //   set task
  const setTaskForm = () => {
    if (formInput.value.length >= 5) {
      storage.setTaskMethod({
        task: formInput.value,
        timeLine: config.getTimeLine(),
        taskContent: document.querySelector(".ql-editor").innerHTML,
      });
      formInput.value = null;
      document.querySelector(".ql-editor").innerHTML = null;
    }
  };

  //   form submit add new task
  form.addEventListener("submit", (events) => {
    events.preventDefault();
    setTaskForm();
  });

  // form input hit enter button after add new task
  formInput.addEventListener("keydown", (events) => {
    if (events.key === "Enter") {
      setTaskForm();
    }
  });

  class Storage {
    constructor() {
      this.holdTask = [];
    }

    setTaskMethod(task) {
      holdUserId = "";
      taskContainer.innerHTML = null;
      this.holdTask.push(task);
      this.holdTask.push(...this.getTaskMethod());
      localStorage.setItem("storage", JSON.stringify(this.holdTask));
      this.holdTask = [];
      fetchTask();
    }

    getTaskMethod() {
      let getTask = JSON.parse(localStorage.getItem("storage"));
      if (getTask) {
        return getTask;
      }
      return [];
    }

    updateTaskMethod(updatedTask) {
      localStorage.setItem("storage", JSON.stringify(updatedTask));
      fetchTask();
    }
    getContent(taskId) {
      return this.getTaskMethod()[taskId].taskContent;
    }
  }
  class Config {
    constructor() {}

    getTimeLine() {
      const dateObj = new Date();
      const daysObj = {
        0: "Sun",
        1: "Mon",
        2: "Tue",
        3: "Wed",
        4: "Thu",
        5: "Fri",
        6: "Sat",
      };
      const date = new Date().getDate();
      const monthObj = {
        0: "Jan",
        1: "Feb",
        3: "Mar",
        4: "Apr",
        5: "May",
        6: "Jun",
        7: "Jul",
        8: "Aug",
        9: "Sep",
        10: "Oct",
        11: "Nov",
        12: "Dec",
      };
      const year = new Date().getFullYear();
      return `${date} ${monthObj[dateObj.getMonth()]} ${year}`;
    }
  }
  const storage = new Storage();
  const config = new Config();
  fetchTask();
})();
