## API Documentation

This sample project will give you a small RESTful API to build your template against. It is built using JavaScript/Node.js (our language of choice), ExpressJS (a small, lightweight web MVC framework) & Mongoose (a MongoDB object modelling library).

**List Users**
----
Returns a list of Users

* **URL**

  `/users`

* **Method:**

  `GET`

*  **URL Params**

  None

* **Data Params**

  None

* **Success Response:**

  * **Code:** 200 <br />
    **Content:**

    ```javascript
    [{
      "_id": "57b330de848a005e48f5de94",
      "gender": "female",
      "name": {
        "title": "ms",
        "first": "olivia",
        "last": "young"
      },
      "location": {
        "street": "1119 grove road",
        "city": "Mountmellick",
        "state": "rhode island",
        "zip": 88061
      },
      "email": "olivia.young@example.com",
      "username": "crazykoala938",
      "password": "malibu",
      "salt": "78TEnNQ1",
      "md5": "9bebcc9d890f8c9e04c9e40fc1f41476",
      "sha1": "36d6a69cabff0ad780a3dcceb4e94d44edb62fc6",
      "sha256": "9e39c873967f52d67e8d052aad87daf4b63d5464a27de982b64abfe9b208efc8",
      "registered": 1411100094,
      "dob": 818810543,
      "phone": "011-475-1126",
      "cell": "081-725-2254",
      "PPS": "4335321T",
      "picture": {
        "large": "https://randomuser.me/api/portraits/women/20.jpg",
        "medium": "https://randomuser.me/api/portraits/med/women/20.jpg",
        "thumbnail": "https://randomuser.me/api/portraits/thumb/women/20.jpg"
      },
      "__v": 0
    }, {
      "_id": "57b330de848a005e48f5de95",
      "gender": "female",
      "name": {
        "title": "ms",
        "first": "susanne",
        "last": "russell"
      },
      "location": {
        "street": "6896 grafton street",
        "city": "Naas",
        "state": "louisiana",
        "zip": 25003
      },
      "email": "susanne.russell@example.com",
      "username": "ticklishswan833",
      "password": "reader",
      "salt": "Qp38szSx",
      "md5": "57f8e3404f1926bf3fa50c152f037a33",
      "sha1": "43bf7f8fe85e46957cdcb33be61f19dfe9014317",
      "sha256": "c12980f91c86dae1ba9d4d880e8d51645e59f95c6b3d1f28854891d6587b39b5",
      "registered": 1345063087,
      "dob": 481147180,
      "phone": "061-032-9311",
      "cell": "081-609-1066",
      "PPS": "7348900T",
      "picture": {
        "large": "https://randomuser.me/api/portraits/women/69.jpg",
        "medium": "https://randomuser.me/api/portraits/med/women/69.jpg",
        "thumbnail": "https://randomuser.me/api/portraits/thumb/women/69.jpg"
      },
      "__v": 0
    }]
    ```

* **Error Response:**

* **Code:** 500 INTERNAL SERVER ERROR <br />
  **Content:**

  ```javascript
  { "error": "Error listing users" }
  ```

* **Sample Call:**

  ```javascript
  $.ajax({
    url: "/users",
    dataType: "json",
    type : "GET",
    success : function(r) {
      console.log(r);
    }
  });
  ```


**Show User**
----
  Returns JSON data about a single user.

* **URL**

  `/users/:id`

* **Method:**

  `GET`

*  **URL Params**

   **Required:**

   `id=[string]`

* **Data Params**

  None

* **Success Response:**

  * **Code:** 200 <br />
    **Content:**

    ```javascript
    {
      "_id": "57b330de848a005e48f5de94",
      "gender": "female",
      "name": {
        "title": "ms",
        "first": "olivia",
        "last": "young"
      },
      "location": {
        "street": "1119 grove road",
        "city": "Mountmellick",
        "state": "rhode island",
        "zip": 88061
      },
      "email": "olivia.young@example.com",
      "username": "crazykoala938",
      "password": "malibu",
      "salt": "78TEnNQ1",
      "md5": "9bebcc9d890f8c9e04c9e40fc1f41476",
      "sha1": "36d6a69cabff0ad780a3dcceb4e94d44edb62fc6",
      "sha256": "9e39c873967f52d67e8d052aad87daf4b63d5464a27de982b64abfe9b208efc8",
      "registered": 1411100094,
      "dob": 818810543,
      "phone": "011-475-1126",
      "cell": "081-725-2254",
      "PPS": "4335321T",
      "picture": {
        "large": "https://randomuser.me/api/portraits/women/20.jpg",
        "medium": "https://randomuser.me/api/portraits/med/women/20.jpg",
        "thumbnail": "https://randomuser.me/api/portraits/thumb/women/20.jpg"
      },
      "__v": 0
    }
    ```

* **Error Response:**

  * **Code:** 500 INTERNAL SERVER ERROR <br />
    **Content:**

    ```javascript
    { "error": "Error reading user" }
    ```

* **Sample Call:**

  ```javascript
  $.ajax({
    url: "/users/1",
    dataType: "json",
    type : "GET",
    success : function(r) {
      console.log(r);
    }
  });
  ```
**Create user**
----
Create a new user

* **URL**

  `/users/createuser`

* **Method:**

  `POST`

*  **URL Params**

  None

* **Data Params**

  ```javascript
  {
    gender: String,
    name: {
      title: String,
      first: String,
      last: String
    },
    location: {
      street: String,
      city: String,
      state: String,
      zip: Number
    },
    email: String,
    username: String,
    password: String,
    salt: String,
    md5: String,
    sha1: String,
    sha256: String,
    registered: Number,
    dob: Number,
    phone: String,
    cell: String,
    PPS: String,
    picture: {
      large: String,
      medium: String,
      thumbnail: String
    }
  }
  ```

* **Success Response:**

  * **Code:** 200 <br />
    **Content:**

    ```javascript
    {
      createStatus: "user created" , 
      userId: object
    }
    ```
    **If user already existed:**
    ```javascript
    {
      createStatus: "user existed"
    }
    ```
    
* **Error Response:**

* **Code:** 500 INTERNAL SERVER ERROR <br />
  **Content:**

  ```javascript
  { error: Error checking duplicate users: }
  ```

* **Sample Call:**

  ```javascript
  var settings = {
    "async": true,
    "crossDomain": true,
    "url": "http://localhost:8000/users/createuser",
    "method": "POST",
    "headers": {
      "content-type": "application/json",
      "cache-control": "no-cache",
      "postman-token": "953268b4-c11a-759b-9b3e-20237960c834"
    },
    "processData": false,
    "data": "{\r\n    \"gender\": \"female\",\r\n    \"name\": {\r\n      \"title\": \"mi\",\r\n      \"first\": \"alis\",\r\n      \"last\": \"re\"\r\n    },\r\n    \"location\": {\r\n      \"street\": \"1097 the aven\",\r\n      \"city\": \"Newbrid\",\r\n      \"state\": \"oh\",\r\n      \"zip\": 287\r\n    },\r\n    \"email\": \"alison.reid@example.c\",\r\n    \"username\": \"tinywolf7\",\r\n    \"password\": \"rock\",\r\n    \"salt\": \"lypI10\",\r\n    \"md5\": \"bbdd6140e188e3bf68ae7ae67345df\",\r\n    \"sha1\": \"4572d25c99aa65bbf0368168f65d9770b7cacf\",\r\n    \"sha256\": \"ec0705aec7393e2269d4593f248e649400d4879b2209f11bb2e012628115a4\",\r\n    \"registered\": 12371768,\r\n    \"dob\": 9328719,\r\n    \"phone\": \"031-541-91\",\r\n    \"cell\": \"081-647-46\",\r\n    \"PPS\": \"330224\",\r\n    \"picture\": {\r\n      \"large\": \"https://randomuser.me/api/portraits/women/60.j\",\r\n      \"medium\": \"https://randomuser.me/api/portraits/med/women/60.j\",\r\n      \"thumbnail\": \"https://randomuser.me/api/portraits/thumb/women/60.j\"\r\n    }\r\n}"
  }

  $.ajax(settings).done(function (response) {
    console.log(response);
  });
  ```

**Delete user**
----
Delete a user

* **URL**

  `/users/deleteuser/:id`

* **Method:**

  `GET`

*  **URL Params**

  **Required:**
  `id=[string]`

* **Data Params**

  None

* **Success Response:**

  * **Code:** 200 <br />
    **Content:**

    ```javascript
    'user deleted'
    ```

* **Error Response:**

* **Code:** 500 INTERNAL SERVER ERROR <br />
  **Content:**

  ```javascript
  { "error": "Error reading user" }
  ```

* **Sample Call:**

  ```javascript
  var settings = {
    "async": true,
    "crossDomain": true,
    "url": "http://localhost:8000/users/deleteuser/57f7fb05d6cfe12ef4f55db2",
    "method": "GET",
    "headers": {
      "cache-control": "no-cache",
      "postman-token": "b0e9da5e-75e9-daa7-b98f-bd39909e1f4b"
    }
  }

  $.ajax(settings).done(function (response) {
    console.log(response);
  });
  ```

**Update user**
----
Update a user

* **URL**

  `/users/updateuser`

* **Method:**

  `POST`

*  **URL Params**

  None

* **Data Params**

  **Any of User's model's attribute, ie. :**
  ```javascript
  {
    gender: String,
    name: {
      title: String,
      first: String,
      last: String
    },
    location: {
      street: String,
      city: String,
      state: String,
      zip: Number
    },
    email: String,
    username: String,
    password: String,
    salt: String,
    md5: String,
    sha1: String,
    sha256: String,
    registered: Number,
    dob: Number,
    phone: String,
    cell: String,
    PPS: String,
    picture: {
      large: String,
      medium: String,
      thumbnail: String
    }
  }
  ```

* **Success Response:**

  * **Code:** 200 <br />
    **Content:**

    ```javascript
    { 
      ok: Number,
      nModified: Number, 
      n: Number 
    }
    ```

* **Error Response:**

* **Code:** 500 INTERNAL SERVER ERROR <br />
  **Content:**

  ```javascript
  { "error": "Error listing users" }
  ```

* **Sample Call:**

  ```javascript
  var settings = {
    "async": true,
    "crossDomain": true,
    "url": "http://localhost:8000/users/updateuser",
    "method": "POST",
    "headers": {
      "content-type": "application/json",
      "cache-control": "no-cache",
      "postman-token": "33ec8afe-166a-8e61-4135-ecdd55f27719"
    },
    "processData": false,
    "data": "{ \n\t\"userId\": \"57f7fd25d6cfe12ef4f55db3\", \n\t\"updateQuery\": {\n    \t\"name\": {\n      \t\t\"title\": \"mr\",\n      \t\t\"first\": \"abc\",\n    \t\t\"last\": \"def\"\n    \t},\n    \t\"cell\": \"54321\"\n\t}\n}\n"
  }

  $.ajax(settings).done(function (response) {
    console.log(response);
  });
  ```

**Delete all**
----
Delete all users

* **URL**

  `/deleteall`

* **Method:**

  `GET`

*  **URL Params**

  None
  
* **Data Params**

  None

* **Success Response:**

  * **Code:** 200 <br />
    **Content:**

    ```javascript
    []
    ```

* **Error Response:**

* **Code:** 500 INTERNAL SERVER ERROR <br />
  **Content:**

  ```javascript
  { "error": "Error gathering users" }
  ```

* **Sample Call:**

  ```javascript
  $.ajax({
    url: "/deleteall",
    dataType: "json",
    type : "GET",
    success : function(r) {
      console.log(r);
    }
  });
  ```

  
Inspired by https://gist.github.com/iros/3426278
