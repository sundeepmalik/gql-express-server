import request from 'request-promise-native';

const booksApiUrl = 'http://localhost:8080';

const getAllBooksFromBooksApi = () => request({
    json: true,
    method: 'GET',
    headers: {
        'X-REQUESTOR-ID': 'GQL-EXPRESS-SERVER'
    },
    url: `${ booksApiUrl }/books`
});

const getBookByIdFromBooksApi = (bookId) => request({
    json: true,
    method: 'GET',
    headers: {
        'X-REQUESTOR-ID': 'GQL-EXPRESS-SERVER'
    },
    url: `${ booksApiUrl }/book/bookId/${ bookId }`

});

const getAllBooks = async (root) => {

    try {
        const response = await getAllBooksFromBooksApi();
        return response;
    } catch(error) {
        console.log('error = ' + error);
        return error;
    }
};

const getBookById = async (root, {bookId}) => {
    try {
        const response = await getBookByIdFromBooksApi(bookId);
        console.log('response  ===================== ' + JSON.stringify(response));
        return response;
    } catch(error) {
        console.log('error = ' + error);
        return error;
    }
}

export default {
    Query: {
        bookList: getAllBooks,
        book: getBookById
    }
};
