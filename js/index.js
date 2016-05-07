var carousel = (function() {
    var picturesDir = "images/";
    var pictures = [
        "2.jpg",
        "1.jpg",
        "3.jpg",
        "4.jpg",
        "5.jpg"
    ];
    var maxIndex = pictures.length;
    var currentIndex = 0;
    var isClicking = false;
    var delayTime = 3000;
    var isAutoPlaying = false;
    var intervalGuy;
    var buttonNodes;
    var pictureNodes;

    return {
        resizePictures: function() {
            var height = $(".carousel-button-list").css("height");
            $(".carousel-picture").css('height', height);
            return this;
        },
        autoPlay: function() {
            if (!isAutoPlaying) {
                isAutoPlaying = true;
                intervalGuy = setInterval(function(that) {
                    that.play();
                }, delayTime, this);
            }
            return this;
        },
        resumeAutoPlay: function() {
            this.autoPlay();
            return this;
        },
        stopAutoPlay: function() {
            if (isAutoPlaying) {
                isAutoPlaying = false;
                clearInterval(intervalGuy);
            }
            return this;
        },
        play: function(targetIndex = currentIndex + 1) {
            if (!isClicking && targetIndex != currentIndex) {
                isClicking = true;
                if (targetIndex >= maxIndex) {
                    targetIndex = 0;
                }
                if (targetIndex < 0) {
                    targetIndex = maxIndex - 1;
                }

                $(buttonNodes[currentIndex]).removeClass("carousel-button-active");
                $(buttonNodes[targetIndex]).addClass("carousel-button-active");
                $(pictureNodes[currentIndex]).stop(true, true).fadeOut("normal", function() {
                    currentIndex = targetIndex;
                    isClicking = false;
                    $(pictureNodes[targetIndex]).stop(true, true).fadeIn("slow");

                });
            }
        },
        init: function() {
            // create carousel content
            var pictureStr = "";
            var buttonStr = "";
            var carouselStr = "";
            $.each(pictures, function(index) {
                var src = picturesDir + pictures[index]
                if (index == 0) {
                    pictureStr += '<img class="carousel-picture carousel-picture-active" src="' + src + '" alt="' + src + '">';
                    buttonStr += '<img class="carousel-button carousel-button-active" src="' + src + '" alt="' + src + '">';
                } else {
                    pictureStr += '<img class="carousel-picture" src="' + src + '" alt="' + src + '">';
                    buttonStr += '<img class="carousel-button" src="' + src + '" alt="' + src + '">';
                }
            });
            carouselStr += '<div class="carousel-picture-list">' + pictureStr + '</div>';
            carouselStr += '<div class="carousel-button-list">' + buttonStr + '</div>';
            $(".carousel-container").html(carouselStr);

            // init nodes to be operated
            buttonNodes = $(".carousel-button").toArray();
            pictureNodes = $(".carousel-picture").toArray();

            // resize pictures for the same height
            setTimeout(function(that) {
                that.resizePictures().autoPlay();
            }, 10, this);

            // add listeners
            $(".carousel-button-list")
                .mouseover(function() {
                    carousel.stopAutoPlay();
                })
                .mouseout(function() {
                    carousel.resumeAutoPlay();
                });
            $(".carousel-button").each(function(index) {
                $(this).click(function() {
                    carousel.stopAutoPlay().play(index);
                });
            });
        }
    };
}());

window.onload = function() {
    carousel.init();
};

$(window).resize(function() {
    carousel.resizePictures();
});
