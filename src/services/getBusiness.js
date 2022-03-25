import axios from 'axios';

const qs = require('qs');

const arrayBufferToBase64 = (buffer) => {
  var binary = '';
  var bytes = [].slice.call(new Uint8Array(buffer));
  bytes.forEach((b) => binary += String.fromCharCode(b));
  return window.btoa(binary);
};

const getBusiness = async(url) => {
    try {
      const resp = await axios.get(url,
      {headers: {
         authorization: ' xxxxxxxxxx' ,
         'Content-Type': 'application/json'
      }})
      const base64Flag = 'data:image/jpeg;base64,';
      let list = [];
      list = resp.data.data.map(res => {
        const imageStr = arrayBufferToBase64(res.image.data.data);
        return {
          ...res,
          image: base64Flag + imageStr
        }
      })
      
      return list;
    } catch(error) {
      console.error(`Error: ${error}`)
    }
  }

  const getFavourites = async(url, ids) => {
    try {
      const resp =  await axios.get(url, {
        params: {
          ids: ids
        },
        headers: {
          authorization: ' xxxxxxxxxx' ,
          'Content-Type': 'application/json'
        },
        paramsSerializer: params => {
          return qs.stringify(params)
        }
        
      })
      const base64Flag = 'data:image/jpeg;base64,';

      const list = resp.data.data.map(res => {
        const imageStr = arrayBufferToBase64(res.image.data.data);
        return {
          ...res,
          image: base64Flag + imageStr,
          favourite: true
        }
      })
      return list;
    } catch(error) {
      console.log(error)
    }
  }

  const getFavouritesList = async (url, user) => {
    try{
      const faves = await axios.get(`${url}/${user.email}`)
      return faves.data
    } catch (error) {
      return `Error: ${error}`;
    }
  }

  const getBusinessCount = async (url, user) => {
    try{
      const count = await axios.get(url)
      const businessCount = count.data.data;
      return businessCount
    } catch (error) {
      return `Error: ${error}`;
    }
  }

  const getAllCoordinates = async (url) => {
    try{
      const resp = await axios.get(url)
      const coordinates = resp && resp.data ? resp.data.data : [];
      return coordinates
    } catch (error) {
      //TODO ADD ERROR HANDLING
      return [];
    }
  }

  export { getBusiness, getFavourites, getFavouritesList, getBusinessCount, getAllCoordinates };