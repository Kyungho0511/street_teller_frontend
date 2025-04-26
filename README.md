# NYC Street Teller

The NYC Street Teller is a digital realtor designed for future New York City residents. It recommends neighborhoods based on your preferred living conditions and ultimately suggests housing listings tailored to your needs. Integrated with a large language model (LLM) chatbot interface, it answers your questions about NYC neighborhoods and their living conditions, making it easy to choose the right house for you.
<br/>
* Live website **[Here](https://street-teller.netlify.app/)**


## Getting Started

1. Install [Node.js](https://nodejs.org/en/download) and [npm](https://www.npmjs.com/get-npm) 

2. Register for developer API key for the following:
    * [OpenAI](https://platform.openai.com/docs/overview)
    * [Mapbox](https://www.mapbox.com/developers)
    * [Cesium ion](https://cesium.com/learn/ion/cesium-ion-access-tokens/)

3. Add `Google Photorealistic 3D Tiles` asset to your [Cesium ion My Assets](https://ion.cesium.com/assets/) collection and remember its Id. 

3. Create a new `.env` file in the root directory of this project.

5. Add the API key and 3D Tiles Id to your `.env` file by copying the following and replacing the `<...>` with the correct corresponding key.
    ```env
    VITE_API_KEY_OPENAI=<OPENAI API KEY HERE>
    VITE_API_KEY_MAPBOX=<MAPBOX API KEY HERE>
    VITE_API_KEY_CESIUM=<CESIUM ION API KEY HERE>
    VITE_GOOGLE_3D_TILES_ID=<GOOGLE 3D TILES ID HERE>
    ```
    
6. Clone this repository and `cd` into the directory
  
7. Install all dependencies

   ```console
   $ npm install
   ```
   
8. Start the Frontend local server

    ```console
    $ vite
    ```

## Features

### Get personalized reports on NYC Neighborhoods
![LLM-human2](https://github.com/user-attachments/assets/9467ad22-5104-4e91-aaa2-e89424f9ac4c)
* LLM reports NYC Neighborhoods clusters based on your preferred living conditions.
* Review and choose Neighborhoods that suit your needs.

### View available Housing listings
<img width="1129" alt="Screenshot 2025-04-25 at 5 20 59 PM" src="https://github.com/user-attachments/assets/01ccab04-ed8e-4011-9723-9e610bd71134" />

### Explore NYC Neighborhoods with immersive viewer
<img width="1038" alt="Screenshot 2025-04-25 at 5 21 24 PM" src="https://github.com/user-attachments/assets/3c1570bd-bfe0-4998-a355-fc36bfbedb19" />


## Tech Stack

<p>
  <a href="https://www.typescriptlang.org/" target="_blank" rel="noreferrer"><img alt="TypeScript" src="https://img.shields.io/badge/-TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white" /></a>
  <a href="https://react.dev/" target="_blank" rel="noreferrer"><img alt="React" src="https://img.shields.io/badge/-React-45b8d8?style=flat-square&logo=react&logoColor=white" /></a>
  <a href="https://postcss.org/" target="_blank" rel="noreferrer"><img alt="PostCSS" src="https://img.shields.io/badge/-PostCSS-DD3A0A?style=flat-square&logo=postcss&logoColor=white" /></a>
  <a href="https://nodejs.org/en" target="_blank" rel="noreferrer"><img alt="Nodejs" src="https://img.shields.io/badge/-Node.js-43853d?style=flat-square&logo=Node.js&logoColor=white" /></a>
  <a href="https://expressjs.com/" target="_blank" rel="noreferrer"><img alt="express" src="https://img.shields.io/badge/-Express.js-333333?style=flat-square&logo=express&logoColor=white" /></a>
  <a href="https://www.postgresql.org/" target="_blank" rel="noreferrer"><img alt="PostgreSQL" src="https://img.shields.io/badge/-PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white" /></a>
  <a href="https://aws.amazon.com/pm/ec2/?trk=36c6da98-7b20-48fa-8225-4784bced9843&sc_channel=ps&ef_id=CjwKCAjwwqfABhBcEiwAZJjC3lPYvtsh_vuXDLKJ5y4pRHUYXYWp8PC23-6O7xW8elulfsaUJxF2WRoCk6QQAvD_BwE:G:s&s_kwcid=AL!4422!3!467723097970!e!!g!!amazon%20ec2!11198711716!118263955828&gbraid=0AAAAADjHtp9tiyXGXGbv66RTovGxBWNoj&gclid=CjwKCAjwwqfABhBcEiwAZJjC3lPYvtsh_vuXDLKJ5y4pRHUYXYWp8PC23-6O7xW8elulfsaUJxF2WRoCk6QQAvD_BwE" target="_blank" rel="noreferrer"><img alt="AmazonEC2" src="https://img.shields.io/badge/-Amazon EC2-FF9900?style=flat-square&logo=amazonec2&logoColor=white" /></a>
  <a href="https://platform.openai.com/docs/overview" target="_blank" rel="noreferrer"> <img alt="OpenAI" src="https://img.shields.io/badge/-OpenAI-412991?style=flat-square&logo=cesium&logoColor=white" /></a>
  <a href="https://cesium.com/" target="_blank" rel="noreferrer"> <img alt="Cesium" src="https://img.shields.io/badge/-Cesium-6CADDF?style=flat-square&logo=cesium&logoColor=white" /></a>
  <a href="https://www.mapbox.com/" target="_blank" rel="noreferrer"> <img alt="Mapbox" src="https://img.shields.io/badge/-Mapbox-333333?style=flat-square&logo=mapbox&logoColor=white" /></a>
  <a href="https://www.python.org/" target="_blank" rel="noreferrer"><img alt="python" src="https://img.shields.io/badge/-Python-3776AB?style=flat-square&logo=python&logoColor=white" /></a>
  <a href="https://geopandas.org/en/stable/" target="_blank" rel="noreferrer"> <img alt="geopandas" src="https://img.shields.io/badge/-GeoPandas-139C5A?style=flat-square&logo=geopandas&logoColor=white" /></a>
  <a href="https://www.npmjs.com/package/ml-kmeans" target="_blank" rel="noreferrer"><img alt="ml-kmeans.js" src="https://img.shields.io/badge/-ML kmeans.js-40AEF0?style=flat-square" /></a>
</p>

## Data Source

- [State of New York | Open Data](https://data.ny.gov/)
- [Census Bureau](https://www.census.gov/)
- [Open Street Map](https://www.openstreetmap.org/#map=5/38.01/-95.84)
