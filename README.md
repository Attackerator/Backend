# Back Attackerator

Back Attackerator is the repository for the backend/server half of the Attackerator project. Attackerator tries to solve a problem with table top rpg's and having to keep track of all your character data, as well as preforming the correct rolls for various actions.

For info on the front end refer to the repository:

https://github.com/Attackerator/frontAttackerator

## Routes

### User Routes

#### POST /api/user
This route allows you to create a user by sending a request body with the following:
* Email | String | Required
* Username | String | Required
* Password | String | Required

#### GET /api/signin
This route allows you to log into your account by sending a request body with the following:
* Username | String | Required
* Password | String | Required

#### PUT /api/user/:id
This route allows you to update your account info with a new username and/or password by sending a request body with one or both of the following:
* Username | String
* Password | String

#### DELETE /api/user/:id
This route allows you to delete your account from our database if you've decided you hate our services by sending a request body with the following:

* User id | ObjectId | Required

### Character Routes
 Once you've created an account the next step is to create a character, these are all the routes involving the characters.

#### POST /api/character
Just pass this route a request body with the following to create a new character

* Character name | String |

#### GET /api/character/:id
This route allows you to retrieve a character you have created by sending a request body with the following:

* Character id | ObjectId | Required

#### PUT /api/character/:id
This route allows you update your character name by sending a request body with the following:

* Character name | String

#### DELETE /api/character/:id
This route allows you to delete a character by sending a request body with the following:

* Character id | ObjectId | Required

### Stat Routes
Once you have your character you're gonna need some stats

#### POST /api/stats/:characterId
This route allows you to create stats for your character by sending a request body with the following:

* Strength | Number
* Dexterity | Number
* Constitution | Number
* Intelligence | Number
* Charisma | Number
* Wisdom | Number

if nothing is provided the value with default to 3.

#### GET /api/stats/:id
This route returns a stat with the provided an id like the following:

* Stat id | ObjectId | Required

#### PUT /api/stats/:id
This route allows you to update your stats with provided the following:

* Strength | Number
* Dexterity | Number
* Constitution | Number
* Intelligence | Number
* Charisma | Number
* Wisdom | Number

#### DELETE /api/stats/:id
If for some reason you'd like to delete your stats you can by providing the following:

* Stat id | ObjectId | Required

### Attack Routes
It helps to be able to create and manage attacks for your character if you want to accomplish much.

#### POST /api/attack/:characterId
This route allows you to create an attack for a character my providing the following:

* Name | String | Required
* Stat | String | Required
* Damage Type | String | Required
* Dice Type | Number | Required
* Dice Count | Number | Required
* Description | String
* To Hit Bonus | Number
* Damage Bonus | Number

#### GET /api/attack/:id
This route allows you to access an attack by providing the following:

* Attack id | ObjectId | Required

#### PUT /api/attack/:id
This route allows you to update any of the info for an attack by providing the following:

* Name | String
* Stat | String
* Damage Type | String
* Dice Type | Number
* Dice Count | Number
* Description | String
* To Hit Bonus | Number
* Damage Bonus | Number

#### DELETE /api/attack/:id
This route allows you to delete a specified attack by providing an id like the following:

* Attack id | ObjectId | Required

### Spells routes
Attacks are fun but spells can also be really interesting, the routes are going to be really similar though.

#### POST /api/spell/:id

* Name | String | Required
* Stat | String | Required
* Damage Type | String | Required
* Dice Type | Number | Required
* Dice Count | Number | Required
* Description | String
* To Hit Bonus | Number
* Damage Bonus | Number

#### GET /api/spell/:id
This route allows you to access a spell by providing the following:

* Spell id | ObjectId | Required

#### PUT /api/spell/:id
This route allows you to update any of the info for a spell by providing the following:

* Name | String
* Stat | String
* Damage Type | String
* Dice Type | Number
* Dice Count | Number
* Description | String
* To Hit Bonus | Number
* Damage Bonus | Number

#### DELETE /api/attack/:id
This route allows you to delete a specified spell by providing an id like the following:

* Spell id | ObjectId | Required

### Skill Routes
These routes will allow you to interact with skills for your character

#### POST /api/skill/:characterId
This route with allow you to create a skill for a character by providing the following:

* Name | String | Required
* Bonus | Number | Required
* Stat | String

#### GET /api/skill/:id
This route allows you to retrieve a specified skill by providing the following:

* Skill id | ObjectId | Required

#### PUT /api/skill/:id
This route allows you to update a specified skill by providing one or all of the following:

* Name | String
* Bonus | Number
* Stat | String

#### DELETE /api/skill/:id
This route allows you to delete a specified skill by providing the following:

* Skill id | ObjectId | Required

### Saves Routes
These routes our for saving throws for your character, not to mistaken for saving something for later.

#### POST /api/save/:characterId
This route allows you to create a save for a character by providing the following:

* Type | String | Required
* Stat | String | Required
* Bonus | Number

#### GET /api/save/:id
This route allows you to retrieve a specified save by providing the following:

* Save id | ObjectId | Required

#### PUT /api/save/:id
This route allows you to update a specified save by providing one or more of the following:

* Type | String
* Stat | String
* Bonus | Number

#### DELETE /api/save/:id
This route allows you to delete a specified save by providing the following

* Save id | ObjectID | Required

============================================================================

That concludes the routes, for information on the front end see the repository for the front end:

https://github.com/Attackerator/frontAttackerator
