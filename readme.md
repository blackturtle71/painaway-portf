Basic route for api apps is: http://localhost:8000/api/{app_name}/{the rest of the URL} (exception: websocket, I pasted the full route)

Gotta switch to Postgresql, and probably try putting all that inside a docker container.

# backend setup

- python -m venv .venv
- source .venv/bin/activate
- gti clone the repo
- pip intall -r requirements
- python manage.py makemigrations
- python manage.py migrate
- python manage.py createsuperuser
- python manage.py runserver

# Auth App

Using basic Django REST Framework tokens, no expiration, created on login, deleted on logout (if user somehow dropped without logging out, the token stays inside the db unchanged, so they can loggin and use the same token). THERE IS NO SESSION AUTH, only DRF tokens, you loose it and you don't get access to any page

API auto creates 2 groups: Patients and Doctors, a user will be auto assigned to patients on registration. I think admins will manually assign users as doctors

Routes:

- register/ - POST, obvs, password, username and email are required
- login/ - POST, obvs, username based
- logout/ - POST, obvs, just send a token
- profile/ - GET, returns user's username, email, etc.

# Chat

All convos are p2p, meaning, only two persons are allowed per chat. Don't forget to pass the token in headers (except websocket, here the token goes to the URL)

Routes:

- ws://localhost:8000/ws/chat/<str:username of a user to chat with>/?token=<current user's token> - that's the URL for a bloody fucking piece of flying turtle's shit (async websocket), ~~have no fucking clue how they work~~ have some fucking clue how they work. You connect at this fucked up endpoint and this crap sends you all the messages sent between the current user and their buddy (I call them peers), that's like history of the convo. All you need to do is use cancerous JS websocket fuckery to send JSON like this {"message": "FUCK YOU"}, the api will handle timestamps and users. We'll call this motherfucker - the technical route, the one that does all the messaging
- conversations/\<str:peer_username>/ - that's a normal GET URL, will send all the messages between the current user and the peer (it's here, cuz browsers normally can't connect thru websockets put in the URL field), use this URL to render the chatbox (sending and receiving is still done thru the route above). That's the beauty route, the one that presents all the underlying crap in a normal, human readable format
- conversations/ - GET will send all the usernames current user has at least one message with, note that it's exactly a username, not an instance of User object; POST with {"peer_username": \<str:username>} will return an URL to the required chat, use it if you need, or not. it will throw an error if user doesn't exist, so you can add some fancy stuff
- conversations/delete/\<str:peer_username>/ - DELETE will, well, delete any message exchanged between the user and the peer (doesn't matter who's a sender, everything is deleted)

# Diary

The db is auto populated with BodyPart objects (they are named after the names of the .svg from previous version's diary.html). To auto populate - python manage.py loaddata bodyparts.json

Routes:

- notes/ - GET will send a list of notes the user has; POST will allow creating a note, just send {"title": "some title", "body": "some text"} (title is required); PATCH will allow to alter title and body of the note (specified by pk, so you must send {"note_pk":\<int:pk>, \<title or body or both>}; DELETE will delete the note by pk {"note_pk": \<int:pk>}
- bodyparts/ - GET will send you all the BodyPart objects in the db (must be 44), you need it to extract pks
- stats/ - GET will send a list of BodyStats the user has; POST will allow creating a stat, just send{"body_part": 25, "pain_type": "stabbing", "intensity": 3, "description": "fell on my scissors"} (these are required, "description" is not), body_part is a pk from one of the BodyPart objects, pain_type must be one of these - ['burning', 'stabbing', 'cutting', 'throbbing'], intensity must be in range of 0 to 10 ; PATCH will allow to alter the stat (specified by pk, so you must send {"stat_pk":\<int:pk>, \<what to alter>}; DELETE will delete the stat by pk {"stat_pk": \<int:pk>}

# TODO:
- Add digest 
- Add relations (and restrictions) between Patient and Doctor groups