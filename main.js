const Data = {topic: 'example', price: 'example', location: 'example', provider: 'example'};

var searchApp = new Vue ({
    el: '#search',
    data: {
        courses: [],
        Data: Data,
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

if('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js');
};