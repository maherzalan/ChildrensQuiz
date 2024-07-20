function saveresult(data) {
    $('#result-btn').prop('disabled', 1);
    $('#js-result').append(data);
}
function getranduser() {
    var n = Math.floor((Math.random() * $('#js-users li').length) + 1);
    var v = $('#js-users li:nth-child(' + n + ')').html();
    if (v !== undefined)
        var html = '<li  class="h2  text-danger">' + v + '</li>';
    else
        return!1;
    $('#js-users li:nth-child(' + n + ')').remove();
    return html;
}
function getrandprize() {
    var n = Math.floor((Math.random() * $('#js-prizes li').length) + 1);
    var v = $('#js-prizes li:nth-child(' + n + ')').html();
    if (v !== undefined)
        var html = '<li >' + v + '</li>';
    else
        return 1;
    $('#js-prizes li:nth-child(' + n + ')').remove();
    $('#go').html('محاولة اخرى');
    return html;
}
function readusers() {
    $.get('data/users.txt', function (data) {
        var lines = data.split("\n");
        lines.forEach(function (line, elem) {
            setTimeout(function () {
                $('#js-users').append(" <li class=\"col-md-6  my-1 \">" + " " + line + "</li>");
            }, 250 * elem);
        });
    });
}
function readprizes() {
    $.get('data/prizes.txt', function (data) {
        var lines = data.split("\n");
        lines.forEach(function (line, elem) {
            setTimeout(function () {
                var l = line.split("|");
                var img = l[1];
                var name = l[0];
                var item = "<li class=\"col-md-6 h5 text-info  my-1\">\n" + "<div class=\"card  \" style=\" -webkit-box-shadow: none; box-shadow: none; border: 0\"><img src=\"images/prize/" + img + "\" class=\"\" alt=\"" + name + "\">\n" + "  <div class=\"card-body\">\n" + "      <h5 class=\"card-text mt-0 mb-1\">" + name + "</h5>\n" + "  </div></div>\n" + "    </li>";
                $('#js-prizes').append(item).slideDown();
            }, 100 * elem);
        });
    });
}
function adduser(name) {
    if (name.val() !== "") {
        var item = " <li class=\"col-md-12 h2  my-1 \">" + name.val() + "</li>";
        name.val('').focus();
        $('#js-users').append(item).slideDown();
    }
}
function adduser2(name) {
    if (name.val() !== "") {
        var item = " <li class=\"col-md-12 h2  my-1 \">" + name.val() + "</li>";
        name.val('').focus();
        $('#js-users2').append(item).slideDown();
    }
}
function addusers(name) {
    var lines = name.val().split("\n");
    lines.forEach(function (line, elem) {
        setTimeout(function () {
            if (line !== '') {
                var item = " <li class=\"col-md-12 h2 my-1 \">" + line + "</li>";
                $('#js-users').append(item).slideDown();
            }
        }, 100 * elem);
    });
}
function addusers2(name) {
    var lines = name.val().split("\n");
    lines.forEach(function (line, elem) {
        setTimeout(function () {
            if (line !== '') {
                var item = " <li class=\"col-md-12 h2  my-1 \">" + line + "</li>";
                $('#js-users2').append(item).slideDown();
            }
        }, 100 * elem);
    });
}
function addprize(name, src) {
    if (name !== "") {
        var item = "<li class=\"col-md-6 h5 text-info  my-1\">" + "<div class=\"card \" style=\" -webkit-box-shadow: none; box-shadow: none; border: 0\">\n" + " <img src=\"" + src + "\" class=\"card-img-top \" alt=\"" + name + "\">\n" + " <div class=\"card-body\">\n" + "  <h5 class=\"card-text mt-0 mb-1\">" + name + "</h5>\n" + " </div>\n" + "</div>" + "</li>";
        $('#js-prizes').append(item).slideDown();
    }
}

function readImg(input, imgid) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $('#' + imgid).attr('src', e.target.result);
        };
        reader.readAsDataURL(input.files[0]);
    }
}
$("#imgupload1,#imgupload2").change(function () {
    readImg(this, $(this).attr('imgid'));
});

function editusername1(name, src) {
    if (name !== "") {
        $('#nuser1').text(name);
    }
    if (src !== "") {
        $('#userimges1').attr('src', src);
    }
}
function editusername2(name, src) {
    if (name !== "") {
        $('#nuser2').text(name);
    }
    if (src !== "") {
        $('#userimges2').attr('src', src);
    }
}

function readrandnumber1() {
    var n1 = [];
    $.each($("#mynum1 option:selected"), function () {
        n1.push($(this).val());

    });
    return n1[Math.floor(Math.random() * n1.length)];
}
function readrandnumber2() {
    var n2 = [];
    $.each($("#mynum2 option:selected"), function () {
        n2.push($(this).val());

    });
    return n2[Math.floor(Math.random() * n2.length)];
}
function ckecknumsbeffor() {
    var n1 = [];
    var n2 = [];
    $.each($("#mynum1 option:selected"), function () {
        n1.push($(this).val());
    });
    $.each($("#mynum2 option:selected"), function () {
        n2.push($(this).val());
    });
    return n1.length && n2.length;
}

function addusererror(name) {
    var item = " <li class=\"col-md-12 h6 \" style=\"    border-bottom: 1px dotted;    padding-bottom: 10px;\">" + name + "</li>";
    $('#js-errors').append(item).slideDown();

}
function adduser1error(name) {
    var item = " <li class=\"col-md-12 h6 \" style=\"    border-bottom: 1px dotted;    padding-bottom: 10px;\">" + name + "</li>";
    $('#js-errorsuser1').append(item).slideDown();

}
function adduser2error(name) {
    var item = " <li class=\"col-md-12 h6 \" style=\"    border-bottom: 1px dotted;    padding-bottom: 10px;\">" + name + "</li>";
    $('#js-errorsuser2').append(item).slideDown();

}