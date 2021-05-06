const http = require("http");
const fs = require("fs");
const requests = require("requests");

const homefile = fs.readFileSync("index.html","utf-8");
const replaceval = (tempVal , orgval) => {
    const kelvin = 273.15;
    let temperature = tempVal.replace("{%temperature%}", orgval.main.temp-273.15);
  temperature = temperature.replace("{%tempMin%}", (orgval.main.temp_min-273.15));
  temperature = temperature.replace("{%tempMax%}", (orgval.main.temp_max-273.15));
  temperature = temperature.replace("{%city%}", (orgval.name));
  temperature = temperature.replace("{%country%}", (orgval.sys.country));
  temperature = temperature.replace("{%tempStatus%}", (orgval.weather[0].main));
  return temperature;
//   console.log(temperature);
  }


const server = http.createServer((req,res)=>{
    if(req.url=="/"){
        requests("http://api.openweathermap.org/data/2.5/weather?q=Delhi&appid=28acfb5125c018371bf990a497fe04a5")
    .on("data",(chunk)=>{
        // console.log(chunk);
        const objData=JSON.parse(chunk);
        const arrData=[objData];
        const realTimeData= arrData.map((val) => replaceval( homefile , val)).join("");
        res.write(realTimeData);
        // console.log(realTimeData);
    })
    .on("end",(err)=>{
        if (err) return console.log("connection closed due to errors", err);
        res.end();
    })
    }

    else {
        res.end("File not found.");
    }


});

const port = process.env.PORT || 5000
server.listen(port,"127.0.0.1",()=>{
    console.log("listening to the server http://127.0.0.1:"+port);
});
