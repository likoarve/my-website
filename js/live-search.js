$( document ).ready(() => {
    $('#search').keyup(function() {
        var searchField = $('#search').val();
	    var myExp = new RegExp(searchField, "i");

        $.getJSON('speakers.json', (data) => {
            var output = "";

            $.each(data, (key, val) => {
                if ((val.name.search(myExp) != -1) || (val.bio.search(myExp) != -1)) {
                    var div = `<div id="speaker">`;
                    div += `<img src="/img/${val.shortname}.jpg" alt="speaker">`;
                    div += `<h3>${val.name}</h3>`;
                    div += `<h4>${val.reknown}</h4>`;
                    div += `<p>${val.bio}</p>`;
                    div += "</div>";

                    output += div;
                }
            });

            $("#search-result").html(output);
        });
    });
});

