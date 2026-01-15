import { useMutation } from "react-query";
import useAxios from "../useAxios";
import { apiRoutes } from "./route"; 

const {hotel , userList , orderList ,orderListByid,hotelunavilableList ,verify,register,addhourly,addrooms, hotelCreate,login, hotelunavilablecreate , hotelunavilabledataList , imageUplaod} = apiRoutes
// const { login, hotel, experience, hourly, findHotel, findRoom } = apiRoutes;

export const useUserLogin = () => {
  const { url, method } = login.POST;
  const callApi = useAxios();
  return useMutation<any, string, any>(async (data) => {
    const response = await callApi({
      method,
      url,
      data,
    });
    return response as any;
  });
};
//for fetch all hotels
export const useHotels = () => {
  const { url, method } = hotel.GET;

  console.log("URL is coming...");
  console.log(url);

  const callApi = useAxios();

  return useMutation<any, Error, any>(async (data) => {
    console.log("hotel data paramters is commminggggg");
    console.log(data);
    const response = await callApi({
      method,
      url,
      data,
    });

    return response as any;
  });
};

export const useUserList = () => {
  const { url, method } = userList.GET;


  const callApi = useAxios();

  return useMutation<any, Error, any>(async (data) => {
    console.log("hotel data paramters is commminggggg");
    console.log(data);
    const response = await callApi({
      method,
      url,
      data,
    });

    return response as any;
  });
};

export const useOrderList = () => {
  const { url, method } = orderList.GET;


  const callApi = useAxios();

  return useMutation<any, Error, any>(async (data) => {
    console.log("hotel data paramters is commminggggg");
    console.log(data);
    const response = await callApi({
      method,
      url,
      data,
    });

    return response as any;
  });
};
export const useOrderByList = () => {
  const { url, method } = orderListByid.GET;


  const callApi = useAxios();

  return useMutation<any, Error, any>(async (data) => {
    console.log("hotel data paramters is commminggggg");
    console.log(data);
   const response = await callApi({
    method,
    url: `${url}/${data.hotel_id}`,  // appends hotel_id to the URL
    data,
  });


    return response as any;
  });
};
export const useAnavilableList = () => {
  const { url, method } = hotelunavilableList.GET;


  const callApi = useAxios();

  return useMutation<any, Error, any>(async (data) => {
    console.log("hotel data paramters is commminggggg");
    console.log(data);
    const response = await callApi({
      method,
      url:`${url}/${data.hotel_id}`,
      data,
    });

    return response as any;
  });
};
export const useCreateunAnavilableHotels = () => {
  const { url, method } = hotelunavilablecreate.POST;


  const callApi = useAxios();

  return useMutation<any, Error, any>(async (data) => {
    console.log("hotel data paramters is commminggggg");
    console.log(data);
    const response = await callApi({
      method,
      url:`${url}/${data.hotel_id}`,
      data,
    });

    return response as any;
  });
};
export const useUnAnavilableHotelsList = () => {
  const { url, method } = hotelunavilabledataList.GET;
  const callApi = useAxios();

  return useMutation<any, Error, any>(async (data) => {
    console.log("hotel data paramters is commminggggg 111");
    console.log(data);
    const response = await callApi({
      method,
      url,
      data,
    });

    return response as any;
  });
};
export const useCreateHotel = () => {
  const { url, method } = hotelCreate.POST;
  const callApi = useAxios();

  return useMutation<any, Error, any>(async (data) => {
    console.log("hotel data paramters is commminggggg");
    console.log(data);
    const response = await callApi({
      method,
      url,
      data,
    });

    return response as any;
  });
};
export const useUplaodImage = () => {
  const { url, method } = imageUplaod.POST;
  const callApi = useAxios();

  return useMutation<any, Error, any>(async (data) => {
    console.log("hotel data paramters is commminggggg");
    console.log(data);
    const response = await callApi({
      method,
      url,
      data,
    });

    return response as any;
  });
};
export const useAddHours = () => {
  const { url, method } = addhourly.POST;
  const callApi = useAxios();

  return useMutation<any, Error, any>(async (data) => {
    console.log("hotel data paramters is commminggggg");
    console.log(data);
    const response = await callApi({
      method,
      url,
      data,
    });

    return response as any;
  });
};
export const useAddRooms = () => {
  const { url, method } = addrooms.POST;
  const callApi = useAxios();

  return useMutation<any, Error, any>(async (data) => {
    console.log("hotel data paramters is commminggggg");
    console.log(data);
    const response = await callApi({
      method,
      url,
      data,
    });

    return response as any;
  });
};
export const useRegisterUser = () => {
  const { url, method } = register.POST;
  const callApi = useAxios();

  return useMutation<any, Error, any>(async (data) => {
    
    const response = await callApi({
      method,
      url,
      data,
    });

    return response as any;
  });
};
export const useVerifyEmail = () => {
  const { url, method } = verify.PATCH;
  const callApi = useAxios();

  return useMutation<any, string, any>(async (data) => {
    const response = await callApi({
      method,
      url: `${url}${"?token="}${data?.token}`,
      data: data?.data,
    });
    return response as any;
  });
};

// export const useExperience = () => {
//   const { url, method } = experience.GET;

//   const callApi = useAxios();

//   return useMutation<IExperience, Error, any>(async (data) => {
//     const response = await callApi({
//       method,
//       url: `${url}${"?search="}${data.search}${"&limit="}${
//         data.limit
//       }${"&page="}${data.page}`,
//       data,
//     });

//     console.log("Response is coming...");
//     console.log(response);

//     return response as IExperience;
//   });
// };
// export const useHourlyHotel = () => {
//   const { url, method } = hourly.GET;

//   const callApi = useAxios();

//   return useMutation<any, Error, any>(async (data) => {
//     const response = await callApi({
//       method,
//       url,
//       data,
//     });
//     return response as any;
//   });
// };
// export const useFindHotel = () => {
//   const { url, method } = findHotel.GET;

//   const callApi = useAxios();
//   return useMutation<any, Error, any>(async (data: any) => {
//     console.log("find data is commingggg");
//     console.log(`${url}${"/"}${data.params}`);
//     const response = await callApi({
//       method,
//       url: `${url}${"/"}${data.params}`,
//       data,
//     });
//     return response as any;
//   });
// };
// export const useFindRoom = () => {
//   const { url, method } = findRoom.GET;

//   const callApi = useAxios();
//   return useMutation<any, Error, any>(async (data: any) => {
//     const response = await callApi({
//       method,
//       url: `${url}${"/"}${data.params}`,
//       data,
//     });
//     return response as any;
//   });
// };
