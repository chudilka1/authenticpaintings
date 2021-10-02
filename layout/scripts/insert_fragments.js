import {normalizeText} from "./modules/utility_methods.js";

const BASE_PATH_TO_GALLERY = "/images/demo/gallery/"

function setTitle(title) {
    sessionStorage.setItem("title", title)
}

function setGenre(genre) {
    sessionStorage.setItem("genre", genre)
}

function setCollectionName(collectionName) {
    sessionStorage.setItem("collectionName", collectionName)
}

function getTitle() {
    return sessionStorage.getItem("title");
}

function getGenre() {
    return sessionStorage.getItem("genre");
}

function getCollectionName() {
    return sessionStorage.getItem("collectionName");
}

window.insert_head_common = function insert_head_common() {
    $.get("/pages/head_common.html", function (data) {
        $('head').append(data);
    });
}

window.insert_head_pretty_photo = function insert_head_pretty_photo() {
    $.get("/pages/head_pretty_photo.html", function (data) {
        $('head').append(data);
    });
}

window.insert_header = function insert_header() {
    $(".wrapper.col1").load("/pages/header.html");
}

window.insert_footer = function insert_footer() {
    $(".wrapper.col5").load("/pages/footer.html");
}

window.insert_gallery_thumbnails = function insert_gallery_thumbnails(genre, collectionName) {
    let title = normalizeText(collectionName);

    setTitle(title);
    setGenre(genre);
    setCollectionName(collectionName);

    $(".wrapper.col4").load("/pages/gallery/gallery_thumbnails.html",
        function () {
            $(".wrapper.col4 h2").text(title); // change h2 of thumbnails collection
            populate_gallery_table_for(genre, collectionName);
            prepend_gallery_hrefs_with_path_to_images(genre, collectionName);
            prepend_gallery_img_source_with_path_to_images(genre, collectionName);
            load_pretty_photo();
        });
}

function prepend_gallery_hrefs_with_path_to_images(genre, collectionName) {
    $('.wrapper.col4 li a').attr('href', function (i, href) { // prepend path for images
        return BASE_PATH_TO_GALLERY + genre + "/" + collectionName + href;
    });
}

function prepend_gallery_img_source_with_path_to_images(genre, collectionName) {
    $('.wrapper.col4 li a img').attr('src', function (i, src) { // prepend path for images
        return BASE_PATH_TO_GALLERY + genre + "/" + collectionName + src;
    });
}

function load_pretty_photo() {
    $("a[rel^='prettyPhoto']").prettyPhoto({
        theme: 'dark_rounded',
        overlay_gallery: false,
        social_tools: false
    });
}

function populate_gallery_table_for(genre, collectionName) {
    $.getJSON(BASE_PATH_TO_GALLERY + genre + "/" + collectionName + "/" + collectionName + ".json")
        .done(function (data) {
            $('#title').text(data.title);
            $('#author').text(data.author);
            $('#size').text(data.size);
            $('#materials').text(data.materials);
            $('#year').text(data.year);
        })
        .fail(function () {
            console.error("No description was found for [" + collectionName + "]");
        });
}

window.insert_genre_tiles_for = function insert_genre_tiles_for(genre, sourceNames) {
    $(".wrapper.col4").load("/pages/genre_tiles.html",
        function () {
            $('.gallery h2').text(genre);
            $(sourceNames).each(function (index, sourceName) {
                let pathToSource = BASE_PATH_TO_GALLERY + genre + "/" + sourceName;
                $('.gallery ul').append(
                    $('<li>').append(
                        $('<a>').attr('href', window.location.pathname.replace("index.html", sourceName + ".html"))
                            .attr('title', sourceName).append(
                            $('<img>').attr('src', pathToSource + "/full_174.jpeg")
                                .attr('alt', sourceName))));
            })
        });
}

// access to details page is possible only from gallery page (with fragments)
// so by this time the arguments should be saved in localStorage
window.populate_details_page = function populate_details_page(title, genre, collectionName) {
    $.getJSON(BASE_PATH_TO_GALLERY + genre + "/" + collectionName + "/" + collectionName + ".json")
        .done(function (data) {
            $('#title').text(data.title);
            $('#author').text("Author: " + data.author);
            $('#size').text("Size (cm): " + data.size);
            $('#materials').text("Materials: " + data.materials);
            $('#year').text("Year: " + data.year);
            $('#description').text("Description: " + data.description);
        })
        .fail(function () {
            console.error("No description was found for [" + collectionName + "]");
        });
}