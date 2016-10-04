# MyTimeMaster
A time management and planner application

MyTimeMaster is a time management and planner application. With MyTimeMaster app, a user can create a personal account and use the app as a tool to plan and allocate their time daily/weekly/monthly. User will input information such as class schedules, what they plan to do for certain hours of a day/a week, who they will meet, etc. The app will read user input and display in a calendar interface (requirement 1) 

Furthermore, this app aims to promote the users with a habit of managing time wisely and living a fulfilled and balanced life. Specifically, users will use the app to plan their week/month in advance and specific what type of activities they do (e.i. Study, work, exercise, art work, entertain, socialize, sleep, etc.). Then the app will calculate the total hours the users use per week/per month and display the information of how users use their time with d3.js data visualization (requirement 3).The data will also be used to measure their work-life balance or their productivity. 

We will integrate Google Calendar api to build the planner, Facebook api so user can select the friend they meet, and Meetups api so the user can select the event to attend (requirement 2). And of course, the app will be driven by users’ input data, we will have logic that will execute both (1) client side in a browser and (2) on a server (requirement 4).

The 4 scenarios of the MyTimeMaster Apps

1.     Registration
A new users can create a personal account by using proving their first and last name, address and password. The application will check if the email address is valid. After registering, users can login can start using the application features to plan and allocate their time/daily/ weekly/monthly activities.
Users can also sign up with their Facebook Account

2.     Provide Calendar
The user will sync his/her Google Calendar to our MyTimeMaster app. Create event/daily task in this app, and the app will sync to his/her Google Calendar

3.     Set up the meeting
Users can set up the meeting time and specific person who they are going to meet by using the Facebook API.

4.     Time calculation (d3.js)
Users  provide the time frame for each of their activities (activities will be categorized in types such as work, study, socialization, entertainment), and the application can display the information of how users use their time in week/month/year with the d3.js data visualization.

Currently Implement: 
1. set up the meeting 
2. Calendar
3. create event
