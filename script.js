$(document).ready(function () {
    // تعريف الصوتيات باستخدام howler.js
    var correctSound = new Howl({
        src: ['clap.mp3']
    });

    var wrongSound = new Howl({
        src: ['wrong.mp3']
    });

    var team1 = {
        label: "الفريق الأول",
        name: "team1",
        score: 0,
        correctAnswers: 0,
        wrongAnswers: 0
    };

    var team2 = {
        label: "الفريق الثاني",
        name: "team2",
        score: 0,
        correctAnswers: 0,
        wrongAnswers: 0
    };
    var suspenseSound = new Howl({
        src: ['suspense.mp3'],
        loop: true // تشغيل الصوت في حلقة مستمرة
    });


    var currentTeam = team1; // Start with team1
    var questionsCount = 0;
    var Qscore = 10;
    var askedQuestionsCount = 0;
    var maxQuestions = 0;
    var currentTimer = null;
    var startTimerSound = new Audio('startTimerSound.mp3');
    var warningSound = new Audio('warningSound.mp3');
    var celebrationSound = new Audio('celebrationSound.mp3');

    var suspenseDelay = 5000; // زمن الانتظار التشويقي بالمللي ثانية (مثلاً 2000 مللي ثانية = 2 ثانية)

    //var warningTime = 13; // تحديد وقت التحذير بالأثواني (قبل انتهاء الوقت بـ5 ثواني)

    // عرض السؤال التالي
    function displayNextQuestion(team) {
        // تبديل الفريق
        //currentTeam = (currentTeam === 'team1') ? 'team2' : 'team1';

        // الحصول على عنصر السؤال النشط والغير نشط
        var activeContainer = $('.quiz-container.active');
        var nextContainer = $('.quiz-container.' + team.name);

        // إخفاء السؤال النشط وعرض السؤال التالي بعد تأخير قصير
        activeContainer.removeClass('active');
        setTimeout(function () {
            nextContainer.addClass('active');
        }, 0); // تأخير 300 مللي ثانية قبل العرض لتحسين التأثير
    }


    // محاكاة تغيير السؤال بعد النقر على زر التالي
    $('#next-question').click(function () {
        displayNextQuestion();
    });


    $('#save-team1-name').click(function () {
        var newName = $('#new-team1-name').val();
        if (newName.trim() !== '') {
            team1.label = newName;
            $('#editteam1').modal('hide');
            // Update label display wherever necessary
            $('.team1 .tname').text(newName);
        }
    });

    $('#save-team2-name').click(function () {
        var newName = $('#new-team2-name').val();
        if (newName.trim() !== '') {
            team2.label = newName;
            $('#editteam2').modal('hide');
            // Update label display wherever necessary
            $('.team2 .tname').text(newName);
        }
    });

    // التحقق من قيمة الحقل عند التغيير
    $('#maxqu').change(function () {
        var value = parseInt($(this).val());
        // إذا كان العدد غير زوجي، جعله زوجيًا بإضافة 1
        if (value % 2 !== 0) {
            $(this).val(value + 1);
        }
    });
    function switchTeam(start) {
        // Toggle between team1 and team2
        if (start) {
            $('#Start').hide();
            $('#file-input').hide();
            $('#file-info').hide();
            $('.controls').hide();
            $('#maxqu1').hide();
            $('.quiz-container-label').show();
            if (currentTeam.name === 'team1') {
                $('.quiz-container.team2').hide(); // Hide team1 container
                $('.quiz-container.team1').show(); // Show team2 container
            } else {
                $('.quiz-container.team1').hide(); // Hide team2 container
                $('.quiz-container.team2').show(); // Show team1 container
            }
        } else if (currentTeam.name === 'team1') {
            currentTeam = team2;
            $('.quiz-container.team1').hide(); // Hide team1 container
            $('.quiz-container.team2').show(); // Show team2 container
        } else if (currentTeam.name === 'team2') {
            currentTeam = team1;
            $('.quiz-container.team2').hide(); // Hide team2 container
            $('.quiz-container.team1').show(); // Show team1 container
        }
    }

    function updateTimer(timerElement, secondsLeft) {
        timerElement.attr('data-seconds-left', secondsLeft);
    }

    function startTimer(element, duration, onComplete) {
        clearInterval(currentTimer); // إيقاف أي مؤقت نشط سابقًا

        var warningTime = Math.floor(duration * 0.45); // حساب 20% من مدة السؤال
        var timeRemaining = duration;
        startTimerSound.play(); // تشغيل صوت بدء التايمر

        var timerElement = $('#timer-circle');
        var timerTextElement = $('#timer-text');
        timerTextElement.text(timeRemaining);

        currentTimer = setInterval(function () {
            var progress = (timeRemaining / duration) * 100;
            timerElement.css('--progress', progress + '%');

            if (timeRemaining <= warningTime) {
                timerElement.addClass('warning'); // تغيير نمط المؤقت للتحذير
                if (timeRemaining === warningTime) {

                    warningSound.play(); // تشغيل صوت التحذير
                }
            } else {
                timerElement.removeClass('warning');
            }

            timerTextElement.text(timeRemaining);
            timeRemaining--;

            if (timeRemaining < 0) {
                clearInterval(currentTimer);
                timerTextElement.text('انتهى الوقت!');
                if (typeof onComplete === 'function') {
                    onComplete();
                }
            }
        }, 1000);
    }

    function stopTimer() {
        if (currentTimer) {
            clearInterval(currentTimer);
        }
        // إيقاف الأصوات عند إيقاف التايمر
        startTimerSound.pause();
        startTimerSound.currentTime = 0;
        warningSound.pause();
        warningSound.currentTime = 0;
    }




    function stopTimer() {
        if (currentTimer) {
            clearInterval(currentTimer);
        }
        // إيقاف الأصوات عند إيقاف التايمر
        startTimerSound.pause();
        startTimerSound.currentTime = 0;
        warningSound.pause();
        warningSound.currentTime = 0;
    }
    function moveTimerToTeam(team) {
        if (team === 'team1') {
            $('#timer-container').appendTo('.quiz-container-label.team1');
        } else if (team === 'team2') {
            $('#timer-container').appendTo('.quiz-container-label.team2');
        }
    }
    function displayRandomQuestion(team, start) {
        if (askedQuestionsCount >= maxQuestions) {
            showWinner();
            return;
        }

        if (window.questions && window.questions.length > 0) {
            var randomIndex = Math.floor(Math.random() * window.questions.length);
            var randomQuestion = window.questions[randomIndex];

            var timerElement = (team.name === 'team1') ? $('#timer-team1') : $('#timer-team2');
            var questionTextElement = (team.name === 'team1') ? $('#question-text-team1') : $('#question-text-team2');
            var optionsListElement = (team.name === 'team1') ? $('#options-list-team1') : $('#options-list-team2');

            // Display question text and time
            var questionText = randomQuestion["Question"];
            questionTextElement.text(questionText);

            // Display options
            var options = [randomQuestion["OptionA"], randomQuestion["OptionB"], randomQuestion["OptionC"], randomQuestion["OptionD"]];
            var validOptions = options.filter(option => option !== undefined && option !== null && option !== "");

            if (validOptions.length === 4) {
                optionsListElement.addClass('four-options');
            } else {
                optionsListElement.removeClass('four-options');
            }

            optionsListElement.find('.option').each(function (index) {
                if (index < validOptions.length) {
                    $(this).text(validOptions[index]);
                    $(this).attr("data-answer", String.fromCharCode(65 + index)); // A, B, C, D
                    $(this).attr("data-correctanswer", randomQuestion["CorrectAnswer"]);
                    $(this).show(); // Show the option
                } else {
                    $(this).hide(); // Hide the option if it doesn't exist
                }
            });

            // Remove the displayed question from the list to avoid repetition
            window.questions.splice(randomIndex, 1);

            askedQuestionsCount++; // زيادة عداد الأسئلة المطروحة
            switchTeam(start); // Switch to the next team after displaying the question

            // Check if timer is enabled and set it
            var enableTimer = $('#enable-timer').is(':checked');
            if (enableTimer) {
                moveTimerToTeam(currentTeam.name);
                $('#timer-container').show();
                var seconds = parseInt(randomQuestion["Time"]) || 30; // Default to 30 seconds if no time specified
                startTimer(timerElement, seconds, function () {
                    // Timer complete action
                    wrongSound.play();
                    stopTimer(); // إيقاف المؤقت عند انتهاء الوقت
                    // Record as wrong answer if time runs out
                    if (team.name === 'team1') {
                        moveTimerToTeam('team2');
                        recordAnswer(team, false);
                        updatePanel(team);
                        displayRandomQuestion(team2, 0);
                    } else {
                        moveTimerToTeam('team1');
                        recordAnswer(team, false);
                        updatePanel(team);
                        displayRandomQuestion(team1, 0);
                    }
                });
            } else {
                timerElement.text(''); // Clear the timer text if not enabled
            }
        } else {
            // No questions available
            $('#question-text-team1').text('لا توجد أسئلة متاحة.');
            $('#question-text-team2').text('لا توجد أسئلة متاحة.');
            $('#options-list-team1 .option').hide(); // Hide options for team1
            $('#options-list-team2 .option').hide(); // Hide options for team2
            showWinner(); // Show the winner
        }
    }



    function showWinner() {
        var winner;
        if (team1.score > team2.score) {
            winner = team1.label;
        } else if (team2.score > team1.score) {
            winner = team2.label;
        } else {
            winner = "لا يوجد فائز، النتيجة متعادلة!";
        }

        $('#winner-message').html("المسابقة انتهت! الفائز هو " + "<br><div style='color: #d5e64f;'>" + winner + "</div>");
        $('#winner-celebration').fadeIn();
        // تشغيل صوت التهنئة عند عرض الفائز
        celebrationSound.play();

        $("#winner-modal").modal("show");
        // Generate confetti
        generateConfetti();
    }

    function generateConfetti() {
        var confettiContainer = $('.confetti');
        for (var i = 0; i < 100; i++) {
            var confettiPiece = $('<div class="confetti-piece"></div>');
            var colors = ['#ff0', '#f0f', '#0ff', '#ff0', '#0f0', '#00f', '#f00'];
            confettiPiece.css('background-color', colors[Math.floor(Math.random() * colors.length)]);
            confettiPiece.css('left', Math.random() * 100 + '%');
            confettiPiece.css('animation-delay', Math.random() * 3 + 's');
            confettiContainer.append(confettiPiece);
        }
    }

    function handleFile(file) {
        var reader = new FileReader();
        reader.onload = function (e) {
            var data = new Uint8Array(e.target.result);
            var workbook = XLSX.read(data, { type: 'array' });
            var firstSheetName = workbook.SheetNames[0];
            var worksheet = workbook.Sheets[firstSheetName];
            var questions = XLSX.utils.sheet_to_json(worksheet);
            // تخزين الأسئلة بشكل عام لاستخدامها في الكود الآخر
            window.questions = questions;

            // عرض عدد الأسئلة في الواجهة
            var questionsCount = questions.length;
            if (questionsCount % 2 !== 0) {
                // إذا كان العدد فرديًا، حذف آخر سؤال من window.questions لجعله زوجيًا
                window.questions.pop();
                questionsCount--;
            }
            $('#questions-count-value').text(questionsCount);
            $('#maxqu').val(questionsCount);
            $('#maxqu').attr('max', questionsCount); // تحديث قيمة max إلى عدد الأسئلة
            $('#file-info').show(); // إظهار العنصر الذي يحتوي على معلومات الملف
        };
        reader.readAsArrayBuffer(file); // قراءة الملف كـ ArrayBuffer
    }

    $('#file-input').change(function (e) {
        handleFile(e.target.files[0]); // Handle file upload
        var fileName = $(this).val().split('\\').pop();
        if (fileName) {
            $(this).siblings('label').text(fileName);
        } else {
            $(this).siblings('label').text('اختر ملف الأسئلة');
        }
        $('.custom-file-input1').hide();
        $('#Start').show();
        $('#file-info').show();
        $('#maxqu1').show();
        $('.controls').show();
    });



    $("#Start").click(function () {
        $('.quiz-container-label.team1 h3').text(team1.label);
        $('.team1 .tname').text(team1.label);
        $('.quiz-container-label.team2 h3').text(team2.label);
        $('.team2 .tname').text(team2.label);

        maxQuestions = parseInt($('#maxqu').val()) || window.questions.length;

        displayRandomQuestion(currentTeam, 1); // Display a random question for team1
        updatePanel(currentTeam, 1);
    });

    $("#options-list-team1").on("click", ".option", function () {
        var selectedAnswer = $(this).attr("data-answer");
        var correctAnswer = $(this).attr("data-correctanswer");

        // إيقاف العداد عند الإجابة
        stopTimer();
        // بدء تشغيل الصوت التشويقي
        suspenseSound.play();
        // تعطيل الأزرار
        disableOptions();
        $(this).addClass("btn-warning").removeClass('btn-primary');

        // إضافة التأثير التشويقي
        setTimeout(function () {
            $(".option[data-answer='" + selectedAnswer + "']").addClass("btn-primary").removeClass('btn-warning');
            suspenseSound.stop();
            // إضافة الفئة المناسبة بناءً على صحة الإجابة
            if (selectedAnswer === correctAnswer) {
                $(".option[data-answer='" + selectedAnswer + "']").addClass('badge-success').removeClass('badge-danger');
                correctSound.play();
                showConfetti();
            } else {
                $(".option[data-answer='" + selectedAnswer + "']").addClass('badge-danger').removeClass('badge-success');
                $(".option[data-answer='" + correctAnswer + "']").addClass('badge-success');
                wrongSound.play();
            }

            setTimeout(function () {
                hideConfetti();
                enableOptions(); // تفعيل الأزرار مرة أخرى
                recordAnswer(team1, selectedAnswer === correctAnswer);
                updatePanel(team1);
                displayRandomQuestion(team2, 0);
                $(".option").removeClass('badge-danger badge-success').addClass('btn-primary');
            }, Math.max(correctSound.duration(), wrongSound.duration()) * 1000); // انتظار انتهاء الصوت قبل الانتقال للسؤال التالي
        }, suspenseDelay); // تأخير عرض النتيجة بالمدة المحددة
    });


    $("#options-list-team2").on("click", ".option", function () {
        var selectedAnswer = $(this).attr("data-answer");
        var correctAnswer = $(this).attr("data-correctanswer");

        // إيقاف العداد عند الإجابة
        stopTimer();
        // بدء تشغيل الصوت التشويقي
        suspenseSound.play();
        // تعطيل الأزرار
        disableOptions();
        $(this).addClass("btn-warning").removeClass('btn-primary');

        // إضافة التأثير التشويقي
        setTimeout(function () {
            $(".option[data-answer='" + selectedAnswer + "']").addClass("btn-primary").removeClass('btn-warning');
            suspenseSound.stop();
            // إضافة الفئة المناسبة بناءً على صحة الإجابة
            if (selectedAnswer === correctAnswer) {
                $(".option[data-answer='" + selectedAnswer + "']").addClass('badge-success').removeClass('badge-danger');
                correctSound.play();
                showConfetti();
            } else {
                $(".option[data-answer='" + selectedAnswer + "']").addClass('badge-danger').removeClass('badge-success');
                $(".option[data-answer='" + correctAnswer + "']").addClass('badge-success');
                wrongSound.play();
            }

            setTimeout(function () {
                hideConfetti();
                enableOptions(); // تفعيل الأزرار مرة أخرى
                recordAnswer(team2, selectedAnswer === correctAnswer);
                updatePanel(team2);
                displayRandomQuestion(team1, 0);
                $(".option").removeClass('badge-danger badge-success').addClass('btn-primary');
            }, Math.max(correctSound.duration(), wrongSound.duration()) * 1000); // انتظار انتهاء الصوت قبل الانتقال للسؤال التالي
        }, suspenseDelay); // تأخير عرض النتيجة بالمدة المحددة
    });

    function disableOptions() {
        $(".option").prop('disabled', true);
    }

    function enableOptions() {
        $(".option").prop('disabled', false);
    }

    function showConfetti() {

        var confettiContainer = $('.confetti1');
        for (var i = 0; i < 100; i++) {
            var confettiPiece = $('<div class="confetti-piece"></div>');
            var colors = ['#ff0', '#f0f', '#0ff', '#ff0', '#0f0', '#00f', '#f00'];
            confettiPiece.css('background-color', colors[Math.floor(Math.random() * colors.length)]);
            confettiPiece.css('left', Math.random() * 100 + '%');
            confettiPiece.css('animation-delay', Math.random() * 3 + 's');
            $('#confetti-container').append(confettiPiece);
        }
        /*for (var i = 0; i < 100; i++) {
            var confetti = $('<div class="confetti1"></div>').css({
                left: Math.random() * 100 + 'vw',
                backgroundColor: 'rgb(' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ')'
            });
            $('#confetti-container').append(confetti);
        }*/
    }


    function hideConfetti() {
        $('#confetti-container').empty();
    }

    function recordAnswer(team, isCorrect) {
        if (isCorrect) {
            team.score += Qscore; // Increase score for each correct answer by a certain amount
            team.correctAnswers++;
        } else {
            team.wrongAnswers++;
        }
    }

    function updatePanel(team, first) {
        if (first) {
            if (team.name === 'team1') {
                $('.quiz-container-label.team1').css({ 'background': '#fff' });
                $('.quiz-container-label.team2').css({ 'background': '#9E9E9E' });
            } else if (team.name === 'team2') {
                $('.quiz-container-label.team2').css({ 'background': 'rgb(242 170 198)' });
                $('.quiz-container-label.team1').css({ 'background': '#9E9E9E' });
            }
        } else if (team.name === 'team1') {
            $("#team1-score").text(team.score);
            $("#team1-correct").text(team.correctAnswers);
            $("#team1-wrong").text(team.wrongAnswers);
            $('.quiz-container-label.team2').css({ 'background': '#fff' });
            $('.quiz-container-label.team1').css({ 'background': '#9E9E9E' });

        } else if (team.name === 'team2') {
            $("#team2-score").text(team.score);
            $("#team2-correct").text(team.correctAnswers);
            $("#team2-wrong").text(team.wrongAnswers);
            $('.quiz-container-label.team1').css({ 'background': '#fff' });
            $('.quiz-container-label.team2').css({ 'background': '#9E9E9E' });
        }
    }

    $('#end-quiz-button').click(function () {
        // عرض رسالة تأكيد
        var confirmEnd = confirm("هل تريد إنهاء المسابقة؟");
        
        if (confirmEnd) {
            // إذا وافق المستخدم، يتم تحديث الصفحة
            location.reload(); // إعادة تحميل الصفحة
        }
    });
});
