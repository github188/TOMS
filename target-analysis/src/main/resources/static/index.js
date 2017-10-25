
window.onload(function(){
    $(".navul li").on("click",function(){
        var url  = $(this).data("url");
        $(this).addClass("navActive").siblings().removeClass("navActive");
        $("#iframeBox").prop("src" , url)
    })
})