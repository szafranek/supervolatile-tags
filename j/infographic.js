/*jslint white:true, plusplus:true, nomen:true, vars:true, browser:true */
/*global $ */
(function() {
    "use strict";

    window.Supervolatile = {};

    function setHeaderHeight() {
        var calendarHeight = $(".calendar").outerHeight(true);
        var header = $(".legend div");
        header.css("line-height", Math.floor(calendarHeight / header.length) + "px");
    }

    function monthlySummaries() {
        $(".calendar .posts div").each(function(index) {
            $(this).css("height", this.innerHTML);
        });
    }

    function setExpand() {
        var sourceSelector = "tr.metatag td.expander, tr.metatag td.name";
        $("table.main").delegate(sourceSelector, "click", function() {
            var source = $(this);
            var metatag = source.closest("tr").data("metatag");
            $(".tag." + metatag).toggle();

            var expanderCell = source.closest("tr").find(".expander");
            if (expanderCell.hasClass("collapser")) {
                $(sourceSelector).attr("title", "Expand");
                expanderCell.removeClass("collapser");
            } else {
                $(sourceSelector).attr("title", "Collapse");
                expanderCell.addClass("collapser");
            }
        });
    }

    function setShortcutsHeight() {
        $(".shortcuts").each(function(index) {
            $(this).css("height", this.innerHTML);
        });
    }

    function prepareRows() {
        var i, l;
        var allRows = document.querySelectorAll("table.main tbody tr");
        var tagsWithMetatags = document.createDocumentFragment();
        for (i = 0, l = allRows.length; i < l; i++) {
            tagsWithMetatags.appendChild(allRows[i].cloneNode(true));
        }
        window.Supervolatile.groupedRowsFragment = tagsWithMetatags;


        var tagRows = document.querySelectorAll("table.main tbody tr.tag");
        var tagRowsArr = Array.prototype.slice.call(tagRows);
        tagRowsArr.sort(function(a, b) {
            return b.querySelector("td.count").innerHTML - a.querySelector("td.count").innerHTML;
        });

        var tagsOnly = document.createDocumentFragment();
        tagRowsArr.forEach(function(row) {
            var clone = row.cloneNode(true);
            clone.style.display = "table-row";
            tagsOnly.appendChild(clone);
        });
        window.Supervolatile.ungroupedRowsFragment = tagsOnly;
    }

    function toggleGrouping() {
        var checkbox = $(".toggle input");
        checkbox.attr("checked", true);
        checkbox.click(function() {
            var tbody = document.querySelector("table.main tbody");
            tbody.innerHTML = "";
            if (!$(this).attr("checked")) {
                tbody.appendChild(window.Supervolatile.ungroupedRowsFragment.cloneNode(true));
            } else {
                tbody.appendChild(window.Supervolatile.groupedRowsFragment.cloneNode(true));
            }
        });
    }


    monthlySummaries();
    setHeaderHeight();
    setExpand();
    setShortcutsHeight();
    prepareRows();
    toggleGrouping();

}());
