// Reaction GIFs used in AskOut component
import hug from "../assets/hug.gif";
import mochi from "../assets/mochi.gif";
import mochi2 from "../assets/mochi2.gif";
import missu from "../assets/missu.gif";
import peach from "../assets/peach.gif";
import sayYs from "../assets/sayYs.gif";
import yesss from "../assets/yesss.gif";
import cattype from "../assets/cat-type.gif";
import tcat from "../assets/typingcat.gif";
import ccat from "../assets/confcat.gif";

// Yes celebration GIFs
import yes1 from "../assets/yes/yes1.gif";
import yes2 from "../assets/yes/yes2.gif";
import yes3 from "../assets/yes/yes3.gif";
import yes4 from "../assets/yes/yes4.gif";
import yes5 from "../assets/yes/yes5.gif";
import yes6 from "../assets/yes/yes6.gif";
import yes7 from "../assets/yes/yes7.webp";
import yes8 from "../assets/yes/yes8.gif";
import yes9 from "../assets/yes/yes9.gif";

// Cat celebration GIFs
import cat1 from "../assets/cat/cat (1).gif";
import cat2 from "../assets/cat/cat (2).gif";
import cat3 from "../assets/cat/cat (3).gif";
import cat4 from "../assets/cat/cat (4).gif";
import cat5 from "../assets/cat/cat (5).gif";
import cat6 from "../assets/cat/cat (6).gif";
import cat7 from "../assets/cat/cat (7).gif";
import cat8 from "../assets/cat/cat (8).gif";
import cat9 from "../assets/cat/cat (9).gif";
import cat10 from "../assets/cat/cat (10).gif";
import cat11 from "../assets/cat/cat (11).gif";
import cat12 from "../assets/cat/cat (12).gif";
import cat13 from "../assets/cat/cat (13).gif";
import cat14 from "../assets/cat/cat (14).gif";
import cat15 from "../assets/cat/cat (15).gif";
import cat16 from "../assets/cat/cat (16).gif";
import cat17 from "../assets/cat/cat (17).gif";
import cat18 from "../assets/cat/cat (18).gif";
import cat19 from "../assets/cat/cat (19).gif";
import cat20 from "../assets/cat/cat (20).gif";
import cat21 from "../assets/cat/cat (21).gif";
import cat22 from "../assets/cat/cat (22).gif";
import cat23 from "../assets/cat/cat (23).gif";
import cat24 from "../assets/cat/cat (24).gif";
import cat25 from "../assets/cat/cat (25).gif";
import cat26 from "../assets/cat/cat (26).gif";
import cat27 from "../assets/cat/cat (27).gif";

// Login screen images
export const loginImages = {
    typingCat: tcat,
    confusedCat: ccat,
};

// AskOut reaction images
export const reactionImages = {
    hug,
    cattype,
    mochi,
    mochi2,
    missu,
    peach,
    sayYs,
    yesss,
};

// Yes celebration images
export const yesImages = [yes1, yes2, yes3, yes4, yes5, yes6, yes7, yes8, yes9];

// Cat celebration images
export const catImages = [
    cat1, cat2, cat3, cat4, cat5, cat6, cat7,
    cat8, cat9, cat10, cat11, cat12, cat13, cat14,
    cat15, cat16, cat17, cat18, cat19, cat20, cat21,
    cat22, cat23, cat24, cat25, cat26, cat27,
];

// All celebration images combined
export const celebrationImages = [...yesImages, ...catImages];

// All images for preloading (in order of importance)
export const allImages = [
    // Load login images first
    tcat,
    ccat,
    // Then reaction images
    hug,
    cattype,
    mochi,
    mochi2,
    missu,
    peach,
    sayYs,
    yesss,
    // Then celebration images
    ...celebrationImages,
];
