let langs = {
  "de": {
    "columns": {
      "name": "Name",
      "col": "Lieblingsfarbe",
      "dob": "Geburtsdatum",
      "dwit": "Total Arbeitstage",
      "available": "verfügbar",
    },
    "groups": {
      "item": "Element",
      "items": "Elemente",
    },
    "pagination": {
      "counter": {
        "showing": "Zeilen",
        "of": "von",
        "rows": "sichtbar",
      },
      "page_title": "Zeige Seite",
      "first": "Erste",
      "first_title": "Erste Seite",
      "last": "Letzte",
      "last_title": "Letzte Seite",
      "prev": "Vorherige",
      "prev_title": "Vorherige Seite",
      "next": "Nächste",
      "next_title": "Nächste Seite",
    },
  },
  "en-gb": {
    "columns": {
      "name": "Name",
      "col": "Favourite Color",
      "dob": "Date Of Birth",
      "dwit": "Days worked in total",
      "available": "Available",
    },
    "groups": {
      "item": "Item",
      "items": "Items",
    },
    "pagination": {
      "counter": {
        "showing": "Rows",
        "of": "of",
        "rows": "visible",
      },
      "page_title": "Show Page",
      "first": "First",
      "first_title": "First Page",
      "last": "Last",
      "last_title": "Last Page",
      "prev": "Prev",
      "prev_title": "Prev Page",
      "next": "Next",
      "next_title": "Next Page",
    },
  },
  "fr": {
    "columns": {
      "name": "Nom",
      "col": "Couleur préféré",
      "dob": "Date de naissance",
      "dwit": "Total jours de travail",
      "available": "Disponible",
    },
    "groups": {
      "item": "élément",
      "items": "éléments",
    },
    "pagination": {
      "counter": {
        "showing": "Lignes",
        "of": "de",
        "rows": "visible",
      },
      "page_title": "Montre page",
      "first": "Première",
      "first_title": "Première Page",
      "last": "Dernière",
      "last_title": "Dernière Page",
      "prev": "Précédente",
      "prev_title": "Page précédente",
      "next": "Prochaine",
      "next_title": "Prochaine Page",
    },
  }
};

//define data
var tabledata = 0;

var calculateSumPerPage = function (values, data, calcParams) {
  //values - array of column values
  //data - all table data
  //calcParams - params passed from the column definition object

  var calc = 0;
  let dataOfThisPage = data.filter(e => e.current_page === "true");

  for (let i = 0; i < dataOfThisPage.length; i++) {
    calc += dataOfThisPage[i].dwit;
  }

  return calc;
}

function updateVisiblity() {
  let intervalId = window.setTimeout(() => {
    if (document.querySelector(".tabulator-table")) {
      setValues();

      for (let el of document.querySelectorAll(".tabulator-paginator")) {
        el.addEventListener("click", () => setValues());
      }

      let pageSizeSelector = document.querySelector(".pagination-size");

      pageSizeSelector.addEventListener("change", () => {
        let pageSize = pageSizeSelector.selectedOptions[0].value;
        localStorage.setItem("pageSize", pageSize);
        table.setPageSize(pageSize);
        setValues();
      });

      document.querySelector(".language").value = localStorage.getItem(
          "language");
      table.setLocale(localStorage.getItem("language"));

      clearInterval(intervalId);
    }
  }, 100)
}

function setValues() {
  localStorage.setItem("page", table.getPage());
  let visibleElements = document.querySelector(".tabulator-table").childNodes;

  for (let el of table.getRows()) {
    el.update({
      "current_page": `${Array.from(visibleElements).includes(el.getElement())}`
    })
  }

  table.recalc();
}

function handleCheckBoxSelected() {
  let checkedBoxes = groupByCheckboxes.filter(e => e.checked).map(e => e.value);

  if (checkedBoxes.length === 0) {
    location.reload();
    return;
  }

  checkedBoxes.unshift("current_page");
  table.setGroupValues([[true], false]);
  table.setGroupBy(checkedBoxes);
  table.setPageSize(true);
}

let lang = localStorage.getItem("language");

//define table
var table = new Tabulator("#example-table", {
  height: "100%", // set height of table (in CSS or here), this enables the Virtual DOM and improves render speed dramatically (can be any valid css height value),
  ajaxURL: "data.json",
  ajaxResponse: function (url, params, response) {
    for (let el of response) {
      el["name"] += ` (${el["name"].replace(/[^A-Z0-9]/g, '')})`;
    }
    return response;
  },
  layout: "fitData", //fit columns to data (optional),
  pagination: true, //enable pagination
  reactiveData: true,
  paginationMode: "local", //enable local pagination
  paginationSize: localStorage.getItem("pageSize"),
  paginationInitialPage: localStorage.getItem("page"),
  paginationCounter: "rows", //add pagination row counter
  columns: [
    {
      title: langs[lang ? lang : "en"].columns.name,
      field: "name",
      headerSort: false
    },
    {
      title: langs[lang ? lang : "en"].columns.col,
      field: "col",
      headerSort: false
    },
    {
      title: langs[lang ? lang : "en"].columns.dob,
      field: "dob",
      headerSort: false
    },
    {
      title: langs[lang ? lang : "en"].columns.dwit,
      field: "dwit",
      topCalc: calculateSumPerPage,
      headerSort: false
    },
    {
      title: langs[lang ? lang : "en"].columns.available,
      field: "available",
      formatter: "html",
      hozAlign: "center",
      headerSort: false
    },
    {
      title: "Current Page",
      field: "current_page",
      headerSort: false,
      visible: false
    }
  ],
  langs: langs
});

document.querySelector(".pagination-size").value = localStorage.getItem(
    "pageSize");
document.querySelector(".language").addEventListener("change", (e) => {
  localStorage.setItem("language", e.target.value);
  location.reload();
});

let groupByCheckboxes = Array.from(document.getElementsByClassName("group-by"));
for (let el of groupByCheckboxes) {
  el.addEventListener("change", () => handleCheckBoxSelected());
}

document.getElementById("download-data").addEventListener("click", () => {
  table.download("pdf", "data.pdf", {
    autoTable: { //advanced table styling
      headerStyles: {
        fillColor: JSON.parse(document.querySelector(".select-color").value)
      },
      columnStyles: {
        id: {fillColor: 255}
      },
    },
  });
});

updateVisiblity();