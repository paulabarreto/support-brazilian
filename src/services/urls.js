import * as endpoints from '../endpoints';
import * as urls from '../constants';

const urlService = (endpoint) => {
    let url;
    let production = true;
    if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
        production = false;
    }
    switch(endpoint) {
        case endpoints.GetBusiness:
        url = production ===  true ? `${urls.PRODUCTION_API_URL}/${endpoints.GetBusiness}`
                                    : `${urls.LOCAL_API_URL}/${endpoints.GetBusiness}`;
        break;
        case endpoints.GetUsers:
        url = production ===  true ? `${urls.PRODUCTION_API_URL}/${endpoints.GetUsers}`
                                    : `${urls.LOCAL_API_URL}/${endpoints.GetUsers}`;
        break;
        case endpoints.GetBusinessCount:
        url = production ===  true ? `${urls.PRODUCTION_API_URL}/${endpoints.GetBusinessCount}`
                                    : `${urls.LOCAL_API_URL}/${endpoints.GetBusinessCount}`;
        break;
        case endpoints.GetFavourites:
        url = production ===  true ? `${urls.PRODUCTION_API_URL}/${endpoints.GetFavourites}`
                                    : `${urls.LOCAL_API_URL}/${endpoints.GetFavourites}`;
        case endpoints.GetCoordinates:
        url = production ===  true ? `${urls.PRODUCTION_API_URL}/${endpoints.GetCoordinates}`
                                    : `${urls.LOCAL_API_URL}/${endpoints.GetCoordinates}`;
        break;
        default:
        break;
    }
    return url;
};
  
  export default urlService;