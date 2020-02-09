var searchApp = new Vue ({
    el: '#search',
    data: {
        courses: [],
        searchBar: '',
    },
    methods: {
        loadCourses: function() {
            fetch('http://localhost:3000/courses').then(
                function (response) {
                    response.json().then(
                        function (text) {
                            searchApp.courses = text;
                    });
            })
        },
        reset: function() {
            this.searchBar = [];
        }
    },
    computed: {
        topics: function () { // return an array of all the topics
            return [...new Set(this.courses.map(x => x.Topic))]
            },
        locations: function () {
            return [...new Set(this.courses.map(x => x.Location))]
        },
        filteredList() {
            return this.courses.filter(courses => {
            return courses.Topic.toLowerCase().includes(this.searchBar.toLowerCase())
            })
        }
    }
})

var courses = [
    {
        image: "img1",
        topic: "Math",
        price: "100",
        location: "Hendon",
        provider: "Hendon Maths Group"
    },
    {
        image: "img2",
        topic: "Math",
        price: "80",
        location: "Colindale",
        provider: "Maths Tuition"
    },
    {
        image: "img3",
        topic: "Art",
        price: "90",
        location: "Brent Cross",
        provider: "Art Club"
    },
    {
        image: "img4",
        topic: "Math",
        price: "120",
        location: "Golders Green",
        provider: "Maths Tuition"
    },
    {
        image: "img5",
        topic: "English",
        price: "110",
        location: "Hendon",
        provider: "English Tuition"
    },
    {
        image: "img6",
        topic: "Chemistry",
        price: "90",
        location: "Colindale",
        provider: "Science Club"
    },
    {
        image: "img7",
        topic: "English",
        price: "90",
        location: "Brent Cross",
        provider: "English Tuition"
    },
    {
        image: "img8",
        topic: "English",
        price: "130",
        location: "Golders Green",
        provider: "English Tuition"
    },
    {
        image: "img9",
        topic: "Biology",
        price: "120",
        location: "Hendon",
        provider: "Science Club"
    },
    {
        image: "img10",
        topic: "Chemistry",
        price: "140",
        location: "Golders Green",
        provider: "Science Club"
    }
]

const courseApp = new Vue({
    el: '#content',
    data: {
        courses: courses
    }
})

let imagesToLoad = document.querySelectorAll('img[data-src]');
const loadImages = (image) => {
    image.setAttribute('src', image.getAttribute('data-src'));
    image.onload = () => {
        image.removeAttribute('data-src');
    };
};

if('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((items, observer) => {
        items.forEach((item) => {
            if(item.isIntersecting) {
                loadImages(item.target);
                observer.unobserve(item.target);
            }
        });
    });
    imagesToLoad.forEach((img) => {
        observer.observe(img);
    });
} else {
    imagesToLoad.forEach((img) => {
            loadImages(img);
    });
}