import axios from "axios"

getTest()

function getTest(){
axios.get("http://localhost:8080/Controller?command=Refresh")
        .then(response =>console.log(response))
        .then(()=> setTimeout(getTest, 5000))
}