var myBooks = Alloy.Collections.books;

var book = Alloy.createModel('books', {
	title: 'Great Expectations', 
	author: 'Charles Dickens'
});

myBooks.add(book);
book.save();

function showBook(event) {
	var selectedBook = event.source;
	var args = {
		title: selectedBook.title,
		author: selectedBook.author
	};
	var bookview = Alloy.createController("bookdetails", args).getView();
	
	if (OS_IOS) {
		$.navGroupWin.openWindow(bookview);
	}
	if (OS_ANDROID) {
		bookview.open();
	}
}

function addBook(){
    var myAddBook = Alloy.createController("addbook",{}).getView();
    if (OS_IOS) {
        $.navGroupWin.openWindow(myAddBook);
    }
    if (OS_ANDROID) {
        myAddBook.open();
    }
}

if(OS_IOS) {
	$.navGroupWin.open();
}
if (OS_ANDROID) {
	$.index.open();
}

Ti.include(
	'/specs/enabled.js',
	'/specs/specs.js'
);