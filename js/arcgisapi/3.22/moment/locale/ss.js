//>>built
(function(c,a){"object"===typeof exports&&"undefined"!==typeof module&&"function"===typeof require?a(require("../moment")):"function"===typeof define&&define.amd?define("moment/locale/ss",["../moment"],a):a(c.moment)})(this,function(c){return c.defineLocale("ss",{months:"Bhimbidvwane Indlovana Indlov'lenkhulu Mabasa Inkhwekhweti Inhlaba Kholwane Ingci Inyoni Imphala Lweti Ingongoni".split(" "),monthsShort:"Bhi Ina Inu Mab Ink Inh Kho Igc Iny Imp Lwe Igo".split(" "),weekdays:"Lisontfo Umsombuluko Lesibili Lesitsatfu Lesine Lesihlanu Umgcibelo".split(" "),
weekdaysShort:"Lis Umb Lsb Les Lsi Lsh Umg".split(" "),weekdaysMin:"Li Us Lb Lt Ls Lh Ug".split(" "),weekdaysParseExact:!0,longDateFormat:{LT:"h:mm A",LTS:"h:mm:ss A",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY h:mm A",LLLL:"dddd, D MMMM YYYY h:mm A"},calendar:{sameDay:"[Namuhla nga] LT",nextDay:"[Kusasa nga] LT",nextWeek:"dddd [nga] LT",lastDay:"[Itolo nga] LT",lastWeek:"dddd [leliphelile] [nga] LT",sameElse:"L"},relativeTime:{future:"nga %s",past:"wenteka nga %s",s:"emizuzwana lomcane",m:"umzuzu",
mm:"%d emizuzu",h:"lihora",hh:"%d emahora",d:"lilanga",dd:"%d emalanga",M:"inyanga",MM:"%d tinyanga",y:"umnyaka",yy:"%d iminyaka"},meridiemParse:/ekuseni|emini|entsambama|ebusuku/,meridiem:function(a,b,c){return 11>a?"ekuseni":15>a?"emini":19>a?"entsambama":"ebusuku"},meridiemHour:function(a,b){12===a&&(a=0);if("ekuseni"===b)return a;if("emini"===b)return 11<=a?a:a+12;if("entsambama"===b||"ebusuku"===b)return 0===a?0:a+12},dayOfMonthOrdinalParse:/\d{1,2}/,ordinal:"%d",week:{dow:1,doy:4}})});