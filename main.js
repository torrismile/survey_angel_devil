function convertJson() {
    var $formElement = $('#info-form');

    var unindexed_array = $formElement.serializeArray();
    var indexed_array = {};

    $.map(unindexed_array, function (n, i) {

        indexed_array[n['name']] = n['value'];
    });

    return indexed_array;
}

function sentMessage(message) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    console.log("Sending message: ", message);

    var raw = JSON.stringify(message);

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };
    console.log("Sending request: ", requestOptions);

    fetch("https://ubb0p6bsy0.execute-api.eu-central-1.amazonaws.com/default/send_email_myq", requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
}

function convertJsonQuestion() {

    var $questionForm = $('#survey-form');

    var unindexed_array = $questionForm.serializeArray();
    var indexed_array = {};

    $.map(unindexed_array, function (n, i) {

        indexed_array[n['name']] = n['value'];
    });

    return indexed_array;
}

// function buttonState() {
//     if (validateEmail() && validateName() && validateSurname()) {
//         // if the both email and password are validate
//         // then button should show visible
//         $("#btn").show();
//     } else {
//         // if both email and pasword are not validated
//         // button state should hidden
//         $("#btn").hide();
//     }
// }

// function validateEmail() {
//     // get value of input email
//     var email = $("#exampleInputEmail").val();
//     // use reular expression
//     var reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
//     if (reg.test(email)) {
//         return true;
//     } else {
//         return false;
//     }
// }

// function validateName() {
//     // get value of input email
//     var name = $("#exampleInputName").val();
//     // use reular expression
//     var reg = /^[a-zA-Z]*$/;
//     if (reg.test(name)) {
//         return true;
//     } else {
//         return false;
//     }
// }

// function validateSurname() {
//     // get value of input email
//     var name = $("#exampleInputSurname").val();
//     // use reular expression
//     var reg = /^[a-zA-Z]*$/;
//     if (reg.test(name)) {
//         return true;
//     } else {
//         return false;
//     }
// }

$(document).ready(function () {

    // $("#btn").hide();

    // $("#exampleInputName").keyup(function () {
    //     if (validateName()) {
    //         // if the email is validated
    //         // set input email border green
    //         $("#exampleInputName").css("border", "2px solid green");
    //         // and set label 
    //         $("#nameMsg").html("<p class='text-success'>Validated</p>");
    //     } else {
    //         // if the email is not validated
    //         // set border red
    //         $("#exampleInputName").css("border", "2px solid red");
    //         $("#nameMsg").html("<p class='text-danger'>Un-validated</p>");
    //     }
    //     // buttonState();
    // });

    // $("#exampleInputSurname").keyup(function () {
    //     if (validateSurname()) {
    //         // if the email is validated
    //         // set input email border green
    //         $("#exampleInputSurname").css("border", "2px solid green");
    //         // and set label 
    //         $("#surnameMsg").html("<p class='text-success'>Validated</p>");
    //     } else {
    //         // if the email is not validated
    //         // set border red
    //         $("#exampleInputSurname").css("border", "2px solid red");
    //         $("#surnameMsg").html("<p class='text-danger'>Un-validated</p>");
    //     }
    //     // buttonState();
    // });

    if (window.localStorage.getItem('userData') !== null) {
        $('.survey-form').removeClass('d-none');
        $('.info-form').addClass('d-none');
    }

    if (window.localStorage.getItem('userAnswer') !== null) {
        $('.well-done-content').removeClass('invisible');
        $('.survey-form').addClass('d-none');
        $('.info-form').addClass('d-none');
    }

    $('.btn-start').click(function (e) {

        // validateName();
        // validateSurname();

        let formJson = convertJson();

        var form = $('#info-form')[0];

        if (form.checkValidity() !== false) {

            e.preventDefault();
            e.stopPropagation();

            $('.survey-form').removeClass('d-none');
            $('.info-form').addClass('d-none');

            window.localStorage.setItem("userData", JSON.stringify(formJson));

        }
    })

    $('#btn-confirm').click(function (e) {

        var $questions = $('.questions');

        e.preventDefault();
        e.stopPropagation();

        if ($questions.find("input:radio:checked").length === $questions.length) {
            let answerJson = convertJsonQuestion();

            $('.well-done-content').removeClass('invisible');
            $('.survey-form').addClass('d-none');
            $('.info-form').addClass('d-none');

            window.localStorage.setItem("userAnswer", JSON.stringify(answerJson));

            let json1 = JSON.parse(window.localStorage.getItem('userData'));
            let json2 = JSON.parse(window.localStorage.getItem('userAnswer'));

            var valueOfPoints = $.map(json2, function (value) {
                return value;
            })

            var toNumbers = valueOfPoints.map(elem => parseInt(elem, 10));
            var sum = toNumbers.reduce((a, b) => a + b, 0);

            window.localStorage.setItem('sumImg', (sum));

            if (sum >= 9) {
                $('.devil').removeClass('d-none')
            } else {
                $('.angel').removeClass('d-none')

            }

            let merged = { ...json1, sum, "answers": json2 };
            console.log(merged);

            sentMessage(merged);
        } else {
            $('.alert-danger').removeClass('d-none');
        }
    })
})


