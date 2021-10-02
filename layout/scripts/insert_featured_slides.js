import {normalizeText} from "./modules/utility_methods.js";

const PATH_TO_GALLERY = "/images/demo/gallery/"

function insert_featured_slide_for_source(genre, sourceNames) {
    $(sourceNames).each(function (i, sourceName) {
        let pathToSource = PATH_TO_GALLERY + genre + "/" + sourceName.toLowerCase();
        let h2Text = normalizeText(sourceName);

        $('#featured_slide_Content').append(
            $('<li>').addClass("featured_slide_Image").append(
                $('<a>').attr('href', "/pages/gallery/" + genre + "/" + sourceName.toLowerCase() + ".html").append(
                    $('<img>').attr('src', pathToSource + "/homepage.jpg")
                        .attr('alt', sourceName)),
                $('<div>').addClass("introtext").append(
                    $('<h2>').text(h2Text),
                    $('<p>').text("For more works visit category ").append(
                        $('<a>').attr('href', "/pages/gallery/" + genre + "/index.html").text(genre.capitalize())
                    )
                )
            )
        )
    });
}

function load_featured_slide_dependency() {
    console.debug("Reloading featured slides dependency")
    $('#featured_slide_').s3Slider({
        timeOut: 4000
    });
    console.debug("Featured slides dependency reloaded")
}

window.insert_homepage_slides_for = function insert_homepage_slides_for(arrayOfArguments) {
    console.debug("Inserting homepage slides")
    $(".wrapper.col2").load("/pages/homepage_slides.html",
        function () {
            $(arrayOfArguments).each(function (index, line) {
                let genre = line[0];
                let sourceNames = line[1];
                insert_featured_slide_for_source(genre, sourceNames)
            });

            $('#featured_slide_Content').append(
                $('<li>').addClass("clear featured_slide_Image")
            );
            console.debug("Homepage slides inserted")

            load_featured_slide_dependency();
        })
}