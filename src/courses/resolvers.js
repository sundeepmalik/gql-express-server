const getAllCourses = (root) => new Promise((resolve, reject) => {

    const courses = [
        {
            "courseId": "1",
            "courseName": "Java Microservices with Spring Boot"
        },
        {
            "courseId": "2",
            "courseName": "ReactJS and GraphQL"
        }
    ];
    
    return resolve(courses);
           
});

export default {
    Query: {
        courseList: getAllCourses
    }
};
