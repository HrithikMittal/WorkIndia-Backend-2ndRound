# Project:

This Project is submitted by 

Adhikansh Mittal

Registration Number: 17BCE2026

College: Vellore Institute of technology 

for the 2nd round of WorkIndia company

# Description:

I deploy the app on the heroku Platform and the MySQL is hosted on AWS server. If you want to change it please change it in environment file. 

# How to run:

To run the App please follow the steps mention below in your terminal :

1. Download the zip file.
2. npm install.
3. Setup your SQL Database in your local system and Create a DB ``workindia``. (*It will run at ``localhost`` and ``user:root `` and ``password:''``*) [As of now it is hosted on AWS RDS.]
4. ```node index.js ``` or ```nodemon.```

```javascript
DB setup succesfully
🚀Server is running on PORT:4040
```

Now your server will be running on the ```localhost:4040```.

##### CAUTION: 

Here I create env file with the name ``.env`` if you want to change the ``PORT`` ,`` JWT_SECRET``,`` Database Name``,``Database Username `` and``Database Password``  you can do it from there.



# APIs

*(I also create the postman docs of using API so you can check that too: [https://documenter.getpostman.com/view/5665978/T1DjkfEM?version=latest](https://documenter.getpostman.com/view/5665978/T1DjkfEM?version=latest)*

*base url: ``http://localhost:4040``*

##### NOTE: All the Request body will be JSON Object

Please also take note of your ``id`` at the signup(User) So It will be use in later on APIs. Otherwise you can take thoose APIs from backend also means Database Schema.

| Method | Route            | Requirements (Request <br />body and Header)                 | Response (response)           | Description/<br />Requirement |
| ------ | :--------------- | ------------------------------------------------------------ | ----------------------------- | ----------------------------- |
| POST   | /user/signup     | Email: string,<br />password: string<br />firstName:string<br />lastName:string | Details of user created       | To signup as User (<b>#1</b>) |
| POST   | /user/login      | Email: string,<br />password: string                         | Token(this is a Bearer token) | To login as User(<b>#2</b>)   |
| POST   | /signout/:userId | Authorized token [Login as User]<br />                       | message                       | To signout                    |
|        |                  |                                                              |                               |                               |
|        |                  |                                                              |                               |                               |
|        |                  |                                                              |                               |                               |

**In postman select Authorization type as Bearer token and enter your token getting after login*

***you will get userId at the time of signup or login or you can take it from Database*

*\*\*\*All the responses will be in the JSON object format and with the message as well as status Code*



## Guide how to provide Auth token in POSTMAN

1. How to provide Authorization Bearer token, for this you can take help from [this](https://learning.postman.com/docs/sending-requests/authorization/#bearer-token) blog.
2. How to pass body as JSON Object, for this you can take help from [this](https://learning.postman.com/docs/sending-requests/requests/#raw-data) blog.

