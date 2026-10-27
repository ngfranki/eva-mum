export type Place={name:string;latitude:number;longitude:number;gps?:boolean};
export type Weather={temperature:number;code:number;wind:number;day:boolean;at:number;timezone:string;sunrise:number;sunset:number};
export const weatherFilms=['sunny','cloudy','rain','wind','snow','snow-heavy','fog','hot','sunrise','sunset','night-clear','storm'] as const;
export function validCoordinates(lat:unknown,lon:unknown){return typeof lat==='number'&&Number.isFinite(lat)&&Math.abs(lat)<=90&&typeof lon==='number'&&Number.isFinite(lon)&&Math.abs(lon)<=180}
const codes=[0,1,2,3,45,48,51,53,55,56,57,61,63,65,66,67,71,73,75,77,80,81,82,85,86,95,96,99];
export function parseWeather(data:any):Weather{
 const c=data?.current,u=data?.current_units;
 if(!c||!Number.isFinite(c.temperature_2m)||Math.abs(c.temperature_2m)>100||!Number.isFinite(c.wind_speed_10m)||c.wind_speed_10m<0||!codes.includes(c.weather_code)||![0,1].includes(c.is_day)||!Number.isFinite(c.time)||u?.temperature_2m!=='°C'||u?.wind_speed_10m!=='km/h')throw Error('天氣資料未完整，請稍後再試。');
 if(typeof data.timezone!=='string')throw Error('未能確認當地時區。');
 try{new Intl.DateTimeFormat('zh-HK',{timeZone:data.timezone}).format()}catch{throw Error('未能確認當地時區。')}
 return {temperature:c.temperature_2m,code:c.weather_code,wind:c.wind_speed_10m,day:c.is_day===1,at:c.time*1000,timezone:data.timezone,sunrise:Number(data.daily?.sunrise?.[0])*1000,sunset:Number(data.daily?.sunset?.[0])*1000};
}
export function weatherLabel(code:number){if(code===0)return '晴朗';if(code<3)return '部分多雲';if(code===3)return '多雲';if(code===45||code===48)return '有霧';if(code>=95)return '雷雨';if([71,73,75,77,85,86].includes(code))return '下雪';if([56,57,66,67].includes(code))return '凍雨';return '下雨'}
export function weatherFilm(w:Weather):typeof weatherFilms[number]{
 if(w.code>=95||w.wind>=50)return 'storm';
 if([75,86].includes(w.code))return 'snow-heavy';
 if([71,73,77,85].includes(w.code))return 'snow';
 if([51,53,55,56,57,61,63,65,66,67,80,81,82].includes(w.code))return 'rain';
 if([45,48].includes(w.code))return 'fog';
 if(w.wind>=20)return 'wind';
 if(w.code===3)return 'cloudy';
 if(!w.day)return 'night-clear';
 if(w.temperature>=32)return 'hot';
 if(Math.abs(w.at-w.sunrise)<45*60000)return 'sunrise';
 if(Math.abs(w.at-w.sunset)<45*60000)return 'sunset';
 return w.code===2?'cloudy':'sunny';
}
export function weatherStale(w:Weather,now=Date.now()){return now-w.at>90*60000||w.at>now+20*60000}
export function weatherUrl(place:Place){if(!validCoordinates(place.latitude,place.longitude))throw Error('位置不正確');const params=new URLSearchParams({latitude:String(place.latitude),longitude:String(place.longitude),current:'temperature_2m,weather_code,is_day,wind_speed_10m',daily:'sunrise,sunset',timezone:'auto',timeformat:'unixtime',forecast_days:'1'});return 'https://api.open-meteo.com/v1/forecast?'+params}
export const suggestedPlaces:Place[]=[
 {name:'馬灣',latitude:22.35,longitude:114.06},{name:'葵芳',latitude:22.356,longitude:114.128},{name:'九龍',latitude:22.32,longitude:114.17},{name:'香港島',latitude:22.27,longitude:114.18},{name:'新界',latitude:22.43,longitude:114.13},
 {name:'東京',latitude:35.68,longitude:139.76},{name:'札幌',latitude:43.06,longitude:141.35},{name:'上士幌',latitude:43.23,longitude:143.3},{name:'富良野',latitude:43.34,longitude:142.38},{name:'美瑛',latitude:43.59,longitude:142.47},{name:'二世古',latitude:42.8,longitude:140.69},{name:'旭川',latitude:43.77,longitude:142.36}];
