$(document).ready(()=>{
    $('#email').change(function(){
        var email = $(this).val();
        if(!checkEmail(email)){
            $('#emailError').html('Email sai định dạng');
        }else{
            $('#emailError').html('');
        }
    });
    $('#password').change(function(){
        debugger;
        var pass = $(this).val();
        if(checkPassWord(pass)){
            $('#passError').html('Mật khẩu phải lớn hơn 4 ký tự');
        }else{
            $('#passError').html('');
        }
    });
    function checkPassWord(inputValue){
        debugger;
        return inputValue.length< 4;
    }
    function checkEmail(inputValue) {
        let regex= /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return regex.test(inputValue);
    }
});