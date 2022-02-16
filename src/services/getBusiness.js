import axios from 'axios';

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

  export default getBusiness;