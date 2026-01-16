import { BASE_URL } from "@/config/config"; 


export const apiRoutes = {
  login: {
    POST: {
      query: "Login",
      method: "POST",
      url: `${BASE_URL}/api/auth/login`,
    },
  },
  register:{
    POST: {
      query: "Register",
      method: "POST",
      url: `${BASE_URL}/auth`,
    }
  },
   verify:{
    PATCH:{
      query: 'VERIFYEMAIL',
      method: 'PATCH',
      url: `${BASE_URL}/user/verify`,
    }
  },
  findRoom: {
    GET: {
      query: "Hotel_list",
      method: "GET",
      url: `${BASE_URL}/rooms`,
    },
  },
  hotel: {
    GET: {
      query: "Hotel_list",
      method: "GET",
      url: `${BASE_URL}/products`,
    },
  },
   userList: {
    GET: {
      query: "user_list",
      method: "GET",
      url: `${BASE_URL}/api/auth`,
    },
  },
  findHotel: {
    GET: {
      query: "Hotel_list",
      method: "GET",
      url: `${BASE_URL}/hotels`,
    },
  },
  experience: {
    GET: {
      query: "experience_list",
      method: "GET",
      url: `${BASE_URL}/experience`,
    },
  },
  hourly: {
    GET: {
      query: "Hotel_list",
      method: "GET",
      url: `${BASE_URL}/hotels/find/hours`,
    },
  },
   orderList: {
    GET: {
      query: "order_list",
      method: "GET",
      url: `${BASE_URL}/order/orderlist`,
    },
  },
   orderListByid: {
    GET: {
      query: "order_listbyid",
      method: "GET",
      url: `${BASE_URL}/order/orderfindById`,
    },
  },
  hotelunavilableList:{
    GET: {
      query: "hotel_unavilable_list",
      method: "GET",
      url: `${BASE_URL}/hotels/hotelunavilableById`
    },
  },
  hotelunavilablecreate:{
    POST: {
      query: "hotel_unavilable_create",
      method: "POST",
      url: `${BASE_URL}/hotels/hotelunavilable`
    },
  },
  //display all dated for hotels
  hotelunavilabledataList:{
    GET: {
      query: "hotel_unavilable_create",
      method: "GET",
      url: `${BASE_URL}/hotels/find/hotelunavilableList`
    },
  },
  hotelCreate:{
    POST: {
      query: "hotel_create",
      method: "POST",
      url: `${BASE_URL}/hotels`
    },
  },
imageUplaod:{
    POST: {
      query: "image_uplaod",
      method: "POST",
      url: `${BASE_URL}/hotels/upload`
    },
  },
addhourly: {
  POST: {
      query: "hourly_add",
      method: "POST",
      url: `${BASE_URL}/rooms/addHours`
  }
},
addrooms:{
  POST: {
    query: "rooms_add",
    method: "POST",
    url: `${BASE_URL}/rooms`
  }
}

}

// http://localhost:8000/order/orderfindById/6
