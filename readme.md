Basic route for api apps is: http://localhost:8000/api/{app_name}/{the rest of the URL} (exception: websocket, I pasted the full route).


# backend setup

- first of all install docker-compose
- cd into painway (same level as manage.py)
- `docker-compose up -d --build` this one will install and run everything you need and then detach from the terminal
- `chmod +x migrations.sh`
- `./migrations.sh` - run migrations and autopop BodyParts
The backend is ready for use.

- when you need to stop it run `docker-compose stop`
- when you need to start it again run `docker-compose start`

# setup after updates

- `docker-compose down -v` deletes the old container and it's data (including the db)
- `docker-compose up -d --build`
- `./migrations.sh`

We technicaly don't need to nuke the container to setup the updates for the backend, but I'd rather nuke it than deal with possible errors.

NOTE: you can nuke only the container, but not the db by running `docker-compose down`

# Glossary

- pk is primary key, a.k.a id in a database (I use pk and id interchangeably, but be sure to follow the naming, if say JSON must have "note_pk", then use pk, if I say tha JSON must have "peer_id", then use id. I'll try to follow one naming convention from now on)

# Auth App

Using basic Django REST Framework tokens, no expiration, created on login, deleted on logout (if user somehow dropped without logging out, the token stays inside the db unchanged, so they can loggin and use the same token). THERE IS NO SESSION AUTH, only DRF tokens, you loose it and you don't get access to any page

API auto creates 2 groups: Patients and Doctors, a user will be auto assigned to patients on registration. I think admins will manually assign users as doctors

Routes:

- register/ - POST, obvs, password, username and email are required
- login/ - POST, obvs, username based
- logout/ - POST, obvs, just send a token
- profile/ - GET, returns user's username, email, etc.; PATCH, allows profile editing

Example of the request to register/\
{\
    'username': 'newuser', #required, unique\
    'email': 'new@example.com', #required, unique\
    'password': 'newpass123', #required\
    "first_name": "Mike",\
    "last_name": "Wazowski",\
    "father_name": "Sarkesian",\
    "sex": "M", #either M or F, other will throw 400\
    "date_of_birth": "2000-7-1" # YYYY-MM-DD, set between 1900-1-1 and current date (will throw 400 on wrong date)\
    }

# Chat

All convos are p2p, meaning, only two persons are allowed per chat. Don't forget to pass the token in headers (except websocket, here the token goes to the URL)

Routes:

- ws://localhost:8000/ws/chat/<int:id of a user to chat with>/?token=<current user's token> - that's the URL for a bloody fucking piece of flying turtle's shit (async websocket), ~~have no fucking clue how they work~~ have some fucking clue how they work. You connect at this fucked up endpoint and this crap sends you all the messages sent between the current user and their buddy (I call them peers), that's like history of the convo. All you need to do is use cancerous JS websocket fuckery to send JSON like this {"message": "FUCK YOU"}, the api will handle timestamps and users. We'll call this motherfucker - the technical route, the one that does all the messaging
- conversations/\<int:peer_id>/ - that's a normal GET URL, will send all the messages between the current user and the peer (it's here, cuz browsers normally can't connect thru websockets put in the URL field), use this URL to render the chatbox (sending and receiving is still done thru the route above). That's the beauty route, the one that presents all the underlying crap in a normal, human readable format
- conversations/ - GET will send all the usernames current user has at least one message with, note that it's exactly a username, not an instance of User object; POST with {"peer_id": \<int:peer_id>} will return an URL to the required chat, use it if you need, or not. it will throw an error if user doesn't exist, so you can add some fancy stuff
- conversations/delete/\<int:peer_id>/ - DELETE will, well, delete any message exchanged between the user and the peer (doesn't matter who's a sender, everything is deleted)

# Diary

The db is auto populated with BodyPart objects (they are named after the names of the .svg from previous version's diary.html). To auto populate - python manage.py loaddata bodyparts.json

Routes:

- notes/ - ~~GET will send a list of notes the user has; POST will allow creating a note, just send {"title": "some title", "body": "some text"} (title is required); PATCH will allow to alter title and body of the note (specified by pk, so you must send {"note_pk":\<int:pk>, \<title or body or both>}; DELETE will delete the note by pk {"note_pk": \<int:pk>}~~ REMOVED
- link_doc/ - POST, available only for Patient group. You send {'doc_username': \<str:username>} and it will send a request for linking to the specified doctor. Status will be auto set to "pending"; DELETE, you send {'doc_username': \<str:username>} and the request for this doc gets deleted (handy if the link was rejected, user just deletes it)
- doc_respond/ - POST, available only for Doctor group. You send {'patient_id': \<int:user.id>, 'action':\<'accept' or 'reject'>}. Accept or reject the linking proccess (note that the link exists anyway, but based on its status the doc can see patient's data)
- list_links/ - GET, anyone can send requests here. returns the list of active links (here you can actually get ids of patients for doc_respond/), also returns the prescription and diagnosis linked to the link
- bodyparts/ - GET will send you all the BodyPart objects in the db (must be 44), you need it to extract pks
- stats/ - GET will send a list of BodyStats the user has; POST will allow creating a stat, just send{"body_part": 25, "pain_type": "stabbing", "intensity": 3, "tookPrescription":True, "description": "fell on my scissors} (first four fields are required, "description" is not; tookPrescription is False by default), body_part is a pk from one of the BodyPart objects, pain_type must be one of these - ['burning', 'stabbing', 'cutting', 'throbbing'], intensity must be in range of 0 to 10 ; PATCH will allow to alter the stat (specified by pk, so you must send {"stat_pk":\<int:pk>, \<what to alter>}; DELETE will delete the stat by pk {"stat_pk": \<int:pk>}. DOCTOR ONLY FEATURE: if you send GET to stats/?patient_id=\<int: user.id> the doc will see the stats of the specified patient\
NOTE: prescription and diagnosis are in OneToOne realtionship with the link, that is, there can only be one prescription and one diagnosis per link
- prescription/?link_id=\<int:link.id> - GET, Patient and Doctor can send. You just pass the id of the link into query parameters and voila, you get the list of available prescriptions; POST, only Doctor can send data, you send the data like so {"link": link_id, "prescription": 'Anti-stubby', 'details': 'some details'} and a new prescription will be created (works only if the link.status == 'accepted'), and yes, you send link_id in both query parameters and json
- prescription/?prescription_id=\<int:prescription.id> - PATCH, only Doctor can send data, you can alter 'prescription' and 'details' fields; DELETE, only Doctor can send data, just send the id in query parameters and the presription will be deleted
- diagnosis/?link_id=\<int:link.id> - same as prescription/?link_id=\<int:link.id>, just swap word 'prescription' with 'diagnosis'
- diagnosis/?diagnosis_id=\<int:diagnosis.id> - same as prescription/?prescription_id=\<int:prescription.id>, just swap word 'prescription' with 'diagnosis'
- notifications/ - GET will send all the notificaations of the current user (sorted by time of creation, descending); PATCH, send {"notification_id": \<int:notification.id>} to mark this notification as read; DELETE, send {"notification_id": \<int:notification.id>} to delete the notification

Example of notification:\
{\
    "id": 1,\
    "owner": {\
        "id": 2,\
        "username": "newuser",\
        "email": "AFstADA9@example.com",\
        "first_name": "Mike",\
        "father_name": "Sarkesian",\
        "last_name": "Wazowski",\
        "sex": "M",\
        "date_of_birth": "2022-01-01",\
        "groups": ["Doctor"]
    },\
    "message": "Новый запрос на прикрепление от Sarah Connor", #messages are hardcoded, you can't change them\
    "is_read": false,\
    "created_at": "2025-07-21T15:07:05.470890Z"\
}

- notifications/unread-count/ - that's a dangerous one. GET will send you the number of unread notifictions for the current user. Howeeeever, we'd better setup some caching or we might clog up the db. And here's the thing, I'm not deploying the site, so I don't know what they'd like me to do with the caching, so, I'll skip it for now.

# How to make a doctor
- `docker-compose exec web python manage.py shell` - opens python shell
- `from django.contrib.auth.models import Group`
- `g = Group.objects.get(name='Doctor')`
- `from authentication.models import CustomUser`
- `CustomUser.objects.get(username='<str: username>')`
- `CustomUser.objects.get(username='<str: username>').groups.add(g)`
# TODO Backend:
- ~~Add relations (and restrictions) between Patient and Doctor groups~~
- ~~Add timeout (with autodeletion) for rejected links? (celery + redis + docker)~~
- ~~Deal with notifications~~
    - ~~Create notification model~~
    - ~~Create notification view~~
    - ~~Add notification creation during:~~
        - ~~link request~~
        - ~~new body stat from patient~~
        - ~~new prescription from doc~~
        - ~~new diagnosis from doc~~
    - ~~Create autotests~~
    - ~~add caching for notifications/unread-count/~~
- ~~Set up Docker~~
- Switch to Postgresql?