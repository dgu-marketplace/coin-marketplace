$(document).ready(function() {

    // Logout button
    $('body').on('click', '.logout-button', function(e) {
        e.preventDefault();
        $.ajax({
            url: $(this).attr('href'),
            type: 'GET',
            success: function(response) {
                window.location.href = response.redirect_url;
            },
            error: function(error) {
                console.log(error);
            }
        });
    });
    // Login form
    $('#login-form').on('submit', function(e) {
        e.preventDefault();
        var formData = new FormData(this);
        $.ajax({
            url: $(this).attr('action'),
            type: $(this).attr('method'),
            data: formData,
            processData: false,
            contentType: false,
            success: function(data) {
                if (data.success) {
                    window.location.href = data.redirect_url;
                } else {
                    if (data.error_msg === '로그인 실패! 아이디 또는 비밀번호가 잘못되었습니다.') {
                        // 아이디가 존재하지 않을 때 회원가입 여부 모달
                        $('#signupModal').modal('show');
                    } else {
                        $('#errorModalBody').text(data.error_msg);
                        $('#errorModal').modal('show');
                    }
                }
            },
            error: function(error) {
                console.log(error);
            }
        });
    });

    $('#find-password-button').click(function(e) {
        window.location.href = '/search_password';
    });

    // Password search form
    $('#search_password-form').on('submit', function(event) {
        event.preventDefault();
        $.ajax({
            url: '/search-password',
            data: $('form').serialize(),
            type: 'POST',
            success: function(response) {
                if (response.success) {
                    alert('비밀번호 힌트: ' + response.password_hint);
                } else {
                    $('#errorMessage').text(response.error_msg);
                    $('#errorModal').modal('show');
                }
            },
            error: function(error) {
                console.log(error);
            }
        });
    });

    // Signup form
    $('#signup-form').on('submit', function(event) {
        event.preventDefault();
        $.ajax({
            url: '/signup',
            data: $(this).serialize(),
            type: 'POST',
            success: function(response) {
                if (response.success) {
                    window.location.href = response.redirect_url;
                } else {
                    alert(response.error_msg);
                }
            },
            error: function(error) {
                console.log(error);
            }
        });
    });


});